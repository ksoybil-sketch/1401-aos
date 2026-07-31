const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getDatabase } = require('firebase-admin/database');

const serviceAccount = require("./serviceAccountKey.json");

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://aos-f954d-default-rtdb.firebaseio.com",
});

const db = getDatabase(app);
const auth = getAuth(app);

// Aşağıdaki listeyi kendi 18 şubenle ve bölge yapınla güncelle.
// Her şube bir regionId'ye bağlı; her bölge için bir bölge müdürü var.
const branches = [
  { branchId: "sube_01", name: "Kadıköy", regionId: "bolge_1" },
  { branchId: "sube_02", name: "Beşiktaş", regionId: "bolge_1" },
  { branchId: "sube_03", name: "Şişli", regionId: "bolge_1" },
  // ... kalan 15 şubeyi buraya ekle
];

const regionManagers = [
  { email: "bolge1.muduru@1401coffee.com", regionId: "bolge_1" },
  // ... diğer bölge müdürleri
];

async function upsertUser(email, profile) {
  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(email);
  } catch {
    // Şifre vermeden kullanıcıyı oluşturuyoruz
    userRecord = await auth.createUser({ email, emailVerified: true });
  }
  
  // Profil bilgilerini DB'ye kaydet
  await db.ref(`users/${userRecord.uid}`).set(profile);
  
  // Kullanıcı için şifre belirleme (reset) linki oluştur
  const resetLink = await auth.generatePasswordResetLink(email);
  
  console.log(`\nHesap: ${email}`);
  console.log(`Rol: ${profile.role}`);
  console.log(`Şifre Belirleme Linki: ${resetLink}`);
}

async function main() {
  // Şube müdürleri
  for (const b of branches) {
    const email = `${b.branchId}.muduru@1401coffee.com`;
    await upsertUser(email, {
      role: "sube_muduru",
      branchId: b.branchId,
      regionId: b.regionId
    });
    // Şube meta verisini de yaz
    await db.ref(`branches/${b.branchId}`).update({
      name: b.name,
      regionId: b.regionId,
    });
  }

  // Bölge müdürleri
  for (const r of regionManagers) {
    await upsertUser(r.email, {
      role: "bolge_muduru",
      regionId: r.regionId
    });
  }

  console.log("\nTamamlandı. Yukarıdaki linkleri ilgili yöneticilere ileterek kendi şifrelerini belirlemelerini sağlayın.");
}

main().catch((err) => {
  console.error("Seed işlemi başarısız:", err);
  process.exit(1);
});
