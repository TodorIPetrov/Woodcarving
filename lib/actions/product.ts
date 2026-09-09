"use server";

import { db } from "@/lib/firebase/admin";
import * as admin from "firebase-admin";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
  try {
    const nameBG = formData.get("name_bg") as string;
    const descBG = formData.get("description_bg") as string;
    const nameEN = formData.get("name_en") as string;
    const descEN = formData.get("description_en") as string;
    const priceStr = formData.get("price") as string;
    const category = formData.get("category") as string;
    const stockStatus = formData.get("stockStatus") as string;
    const material = formData.get("material") as string;
    const file = formData.get("image") as File;

    if (!nameBG || !priceStr || !file || file.size === 0) {
      return { success: false, error: "Моля, попълнете задължителните полета и добавете снимка." };
    }

    const price = parseFloat(priceStr);
    
    // Upload image to Firebase Storage
    const bucket = admin.storage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
    const fileName = `products/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    const fileRef = bucket.file(fileName);
    await fileRef.save(fileBuffer, {
      metadata: {
        contentType: file.type,
      },
    });
    
    await fileRef.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Add to Firestore
    const newDoc = db.collection("products").doc();
    const productData = {
      id: newDoc.id,
      name: nameBG, // fallback legacy
      name_bg: nameBG,
      description_bg: descBG,
      name_en: nameEN || nameBG,
      description_en: descEN || descBG,
      price: price,
      category: category,
      stockStatus: stockStatus,
      material: material,
      image: publicUrl,
      isMadeToOrder: stockStatus === "Изработва се по поръчка",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await newDoc.set(productData);

    // Revalidate catalogue pages
    revalidatePath("/[lang]/catalogue", "page");
    revalidatePath("/[lang]/admin", "page");

    return { success: true, message: "Продуктът е добавен успешно!" };
  } catch (error: any) {
    console.error("Failed to add product:", error);
    return { success: false, error: "Грешка при добавяне: " + error.message };
  }
}

export async function getProducts() {
  try {
    const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString() || null
    }));
    return { success: true, products };
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(productId: string, imageUrl: string) {
  try {
    // 1. Delete from Firestore
    await db.collection("products").doc(productId).delete();
    
    // 2. Try to delete from Storage if it's a Firebase URL
    if (imageUrl && imageUrl.includes("storage.googleapis.com")) {
      const bucket = admin.storage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
      // Extract file path from URL
      const urlParts = imageUrl.split(`${bucket.name}/`);
      if (urlParts.length > 1) {
        const filePath = urlParts[1].split('?')[0]; // Handle potential query params
        try {
          await bucket.file(decodeURIComponent(filePath)).delete();
        } catch (e) {
          console.warn("Could not delete file from storage, perhaps already deleted:", e);
        }
      }
    }

    revalidatePath("/[lang]/catalogue", "page");
    revalidatePath("/[lang]/admin", "page");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(productId: string, data: any) {
  try {
    const docRef = db.collection("products").doc(productId);
    await docRef.update({
      ...data,
      isMadeToOrder: data.stockStatus === "Изработва се по поръчка"
    });
    
    revalidatePath("/[lang]/catalogue", "page");
    revalidatePath("/[lang]/admin", "page");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return { success: false, error: error.message };
  }
}


