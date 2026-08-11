import { db } from "@/lib/firebase/admin";

export default async function AdminDashboard() {
  let orders: any[] = [];
  try {
    const snapshot = await db.collection("orders").orderBy("createdAt", "desc").limit(20).get();
    orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl text-custom-forest font-bold mb-2">Order Management</h1>
          <p className="text-custom-charcoal/80">View and manage recent customer orders.</p>
        </div>
        <div className="hidden md:block">
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Secure Area</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-custom-muted">No orders found. The database is empty or could not be reached.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-custom-parchment/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-custom-forest uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-custom-forest uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-custom-forest uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-custom-forest uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const total = order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;
                
                // Format the Firestore Timestamp safely
                let dateStr = "Unknown Date";
                if (order.createdAt && typeof order.createdAt.toDate === 'function') {
                  dateStr = order.createdAt.toDate().toLocaleDateString();
                } else if (order.createdAt) {
                  dateStr = new Date(order.createdAt).toLocaleDateString();
                }

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className="font-mono text-xs text-gray-500">{order.id.substring(0, 8)}...</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dateStr}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        {order.items?.map((item: any, idx: number) => (
                          <li key={idx} className="truncate max-w-xs">
                            {item.quantity}x {item.name} 
                            {item.isMadeToOrder && <span className="text-amber-600 text-[10px] ml-1 uppercase font-bold">(MTO)</span>}
                            {item.personalization && <span className="text-gray-400 block text-xs ml-4">Engraving: "{item.personalization}"</span>}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-custom-gold text-right">
                      {total.toFixed(2)} BGN
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
