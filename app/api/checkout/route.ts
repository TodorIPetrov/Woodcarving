import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 1. Check Weekly Capacity for Made-to-Order items
    const madeToOrderItemsInCart = items.filter(i => i.isMadeToOrder); // We need the client to pass this flag or we check it below
    
    // Process all items in a single Firestore transaction for strict stock locking
    await db.runTransaction(async (transaction) => {
      // Step A: Calculate current weekly load for made-to-order items
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentOrdersSnapshot = await transaction.get(
        db.collection('orders')
          .where('createdAt', '>=', oneWeekAgo)
          // Ideally we'd filter for successful statuses, but we'll count all pending/paid for safety
      );

      let recentMadeToOrderCount = 0;
      recentOrdersSnapshot.forEach(doc => {
        const orderData = doc.data();
        if (orderData.items && Array.isArray(orderData.items)) {
          orderData.items.forEach((orderItem: any) => {
            if (orderItem.isMadeToOrder) {
              recentMadeToOrderCount += (orderItem.quantity || 1);
            }
          });
        }
      });

      // We will also count the made to order items being requested right now
      let newlyRequestedMadeToOrderCount = 0;

      // Step B: READ all the product documents to ensure we have stock & verify isMadeToOrder status
      const productDocs: { docRef: FirebaseFirestore.DocumentReference, data: FirebaseFirestore.DocumentData, requestedQty: number }[] = [];

      for (const item of items) {
        const productRef = db.collection('products').doc(item.productId);
        const productSnapshot = await transaction.get(productRef);

        if (!productSnapshot.exists) {
          throw new Error(`Product not found: ${item.name}`);
        }

        const productData = productSnapshot.data()!;
        
        // Inherit isMadeToOrder strictly from the DB, not the client cart
        if (productData.isMadeToOrder) {
          newlyRequestedMadeToOrderCount += item.quantity;
          item.isMadeToOrder = true; // Attach for the order record
          continue; // Bypass strict stock limits
        }

        if (productData.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}. Only ${productData.stock} left!`);
        }

        productDocs.push({
          docRef: productRef,
          data: productData,
          requestedQty: item.quantity
        });
      }

      // Step C: Validate Capacity Limit
      const MAX_WEEKLY_CAPACITY = 4;
      if (recentMadeToOrderCount + newlyRequestedMadeToOrderCount > MAX_WEEKLY_CAPACITY) {
         throw new Error(`Due to high demand and the artisanal nature of our crafts, we can only accept ${MAX_WEEKLY_CAPACITY} made-to-order requests per week. We currently have ${recentMadeToOrderCount} active orders. Please reduce your quantity or check back later!`);
      }

      // Step D: If all reads succeeded and stock/capacity is sufficient, perform the WRITES
      for (const p of productDocs) {
        const newStock = p.data.stock - p.requestedQty;
        transaction.update(p.docRef, { stock: newStock });
      }

      // Step E: Create the pending order record
      const orderRef = db.collection('orders').doc();
      transaction.set(orderRef, {
        items,
        status: 'pending_payment',
        createdAt: new Date(),
        totalAmount: items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
      });
    });

    // In a real scenario, you would create a Stripe Checkout Session here
    // and return the stripe session URL to redirect the user.
    // For now, we simulate success since we locked the stock successfully.

    return NextResponse.json({ 
      success: true, 
      message: 'Stock successfully reserved. Proceed to payment.' 
      // url: stripeSession.url
    }, { status: 200 });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during checkout' }, 
      { status: 500 }
    );
  }
}
