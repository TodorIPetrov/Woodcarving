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
    const widthStr = formData.get("width") as string;
    const heightStr = formData.get("height") as string;
    const files = formData.getAll("images") as File[];

    if (!nameBG || !priceStr || files.length === 0) {
      return { success: false, error: "Моля, попълнете задължителните полета и добавете поне една снимка." };
    }

    const price = parseFloat(priceStr);
    const width = widthStr ? parseFloat(widthStr) : null;
    const height = heightStr ? parseFloat(heightStr) : null;
    const dimensions = width && height ? `${width} × ${height} см` : (width ? `${width} см` : (height ? `${height} см` : ""));
    
    // Upload images to Firebase Storage
    const bucket = admin.storage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
    const imageUrls = [];

    for (const file of files) {
      if (file.size === 0) continue;
      const fileName = `products/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileRef = bucket.file(fileName);
      await fileRef.save(fileBuffer, { metadata: { contentType: file.type } });
      await fileRef.makePublic();
      imageUrls.push(`https://storage.googleapis.com/${bucket.name}/${fileName}`);
    }

    // Add to Firestore
    const newDoc = db.collection("products").doc();
    const productData = {
      id: newDoc.id,
      name: nameBG,
      name_bg: nameBG,
      description_bg: descBG,
      name_en: nameEN || nameBG,
      description_en: descEN || descBG,
      price: price,
      category: category,
      stockStatus: stockStatus,
      material: material,
      width: width,
      height: height,
      dimensions: dimensions,
      images: imageUrls,
      image: imageUrls[0] || "", // fallback legacy
      isMadeToOrder: stockStatus === "Изработва се по поръчка",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await newDoc.set(productData);

    revalidatePath("/[lang]/catalogue", "page");
    revalidatePath("/[lang]/products/[id]", "page");
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

export async function deleteProduct(productId: string, imageUrl?: string) {
  try {
    const docRef = db.collection("products").doc(productId);
    const doc = await docRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      const imagesToDelete = data?.images || (imageUrl ? [imageUrl] : []);
      
      for (const img of imagesToDelete) {
        try {
          if (img && img.includes("storage.googleapis.com")) {
            const bucket = admin.storage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
            const pathParts = img.split(`${bucket.name}/`);
            if (pathParts.length > 1) {
              const fileName = pathParts[1];
              await bucket.file(fileName).delete();
            }
          }
        } catch (e) {
          console.error("Failed to delete image from storage:", img, e);
        }
      }
    }

    await docRef.delete();
    
    revalidatePath("/[lang]/catalogue", "page");
    revalidatePath("/[lang]/admin", "page");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const nameBG = formData.get("name_bg") as string;
    const descBG = formData.get("description_bg") as string;
    const nameEN = formData.get("name_en") as string;
    const descEN = formData.get("description_en") as string;
    const priceStr = formData.get("price") as string;
    const category = formData.get("category") as string;
    const stockStatus = formData.get("stockStatus") as string;
    const material = formData.get("material") as string;
    const widthStr = formData.get("width") as string;
    const heightStr = formData.get("height") as string;
    const files = formData.getAll("images") as File[];
    const existingImagesStr = formData.get("existingImages") as string;
    const existingImages = existingImagesStr ? JSON.parse(existingImagesStr) : [];

    const width = widthStr ? parseFloat(widthStr) : null;
    const height = heightStr ? parseFloat(heightStr) : null;
    const dimensions = width && height ? `${width} × ${height} см` : (width ? `${width} см` : (height ? `${height} см` : ""));

    const updateData: any = {
      name: nameBG,
      name_bg: nameBG,
      description_bg: descBG,
      name_en: nameEN,
      description_en: descEN,
      price: parseFloat(priceStr),
      category,
      stockStatus,
      material,
      width,
      height,
      dimensions,
      isMadeToOrder: stockStatus === "Изработва се по поръчка"
    };

    const bucket = admin.storage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
    const newImageUrls = [];

    // Upload new images if provided
    for (const file of files) {
      if (file.size === 0) continue;
      const fileName = `products/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileRef = bucket.file(fileName);
      await fileRef.save(fileBuffer, { metadata: { contentType: file.type } });
      await fileRef.makePublic();
      newImageUrls.push(`https://storage.googleapis.com/${bucket.name}/${fileName}`);
    }

    const finalImages = [...existingImages, ...newImageUrls];
    updateData.images = finalImages;
    updateData.image = finalImages[0] || ""; // fallback legacy

    await db.collection("products").doc(id).update(updateData);
    
    revalidatePath("/[lang]/catalogue", "page");
    revalidatePath("/[lang]/products/[id]", "page");
    revalidatePath("/[lang]/admin", "page");
    return { success: true, message: "Продуктът е обновен успешно!" };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Грешка при редакция: " + error.message };
  }
}


