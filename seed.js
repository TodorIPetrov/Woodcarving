const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=="#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Handle newline characters in the private key from .env file
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

const seedProducts = [
  {
    id: "1",
    name: "Orthodox Icon Relief - St. George",
    price: 250.00,
    description: "A meticulously hand-carved wooden relief depicting St. George. Crafted from premium walnut wood, finished with natural oils for lasting durability and a rich aesthetic.",
    image: "/images/st-george.jpg",
    isMadeToOrder: true,
    leadTime: "2-3 weeks",
    stock: 0
  },
  {
    id: "2",
    name: "Last Supper Relief",
    price: 550.00,
    description: "A breathtaking, large-scale carving of the Last Supper. Perfect for a dining room or church. Carved from solid oak.",
    image: "/images/last-supper.jpg",
    isMadeToOrder: true,
    leadTime: "3-4 weeks",
    stock: 0
  },
  {
    id: "3",
    name: "Vintage Floral Plaque (Limited Edition)",
    price: 180.00,
    description: "A one-of-a-kind vintage floral pattern reclaimed from traditional Bulgarian ceiling ornaments. Ready to ship.",
    image: "/images/floral-plaque.jpg",
    isMadeToOrder: false,
    stock: 1
  }
];

async function seed() {
  console.log("Seeding products...");
  
  const batch = db.batch();
  
  for (const product of seedProducts) {
    const docRef = db.collection('products').doc(product.id);
    batch.set(docRef, product);
    console.log(`Prepared: ${product.name}`);
  }
  
  try {
    await batch.commit();
    console.log("✅ Seeding complete!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  }
}

seed();
