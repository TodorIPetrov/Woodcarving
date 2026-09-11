"use server";

import { db } from "@/lib/firebase/admin";
import * as admin from "firebase-admin";

export async function submitInquiry(formData: FormData) {
  try {
    const name = (formData.get("name") as string || "").trim();
    const contact = (formData.get("contact") as string || "").trim();
    const message = (formData.get("message") as string || "").trim();

    if (!name || !contact) {
      return { 
        success: false, 
        error: "Моля, попълнете вашето име и телефон/имейл за обратна връзка." 
      };
    }

    await db.collection("inquiries").add({
      name,
      contact,
      message,
      status: "new",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting inquiry to Firestore:", error);
    return { 
      success: false, 
      error: "Възникна грешка при изпращането. Моля, свържете се с нас директно по телефон или Viber." 
    };
  }
}
