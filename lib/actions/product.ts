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
