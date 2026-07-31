const { initializeApp, cert } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const recipes = require('./parsed_recipes.json');

const serviceAccount = require('./serviceAccountKey.json');

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://aos-f954d-default-rtdb.firebaseio.com',
});

const db = getDatabase(app);

async function main() {
  // recipes/{id} şeklinde anahtarlı kayıtlar — training/quizResults'ta zaten
  // kullanılan güvenli desenle aynı. Tek bir dizi yerine böyle saklanmasının
  // nedeni: bir cihaz henüz senkronize olmadan bir reçete ekleyip/silip tüm
  // diziyi Firebase'e geri yazdığında, henüz senkronize olmamış eski/eksik
  // yerel listenin gerçek listenin üzerine yazmasını engellemek.
  const keyedRecipes = {};
  for (const r of recipes) {
    keyedRecipes[r.id] = r;
  }
  await db.ref('recipes').set(keyedRecipes);
  console.log(`${recipes.length} reçete 'recipes/{id}' formatında yazıldı.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Reçete yükleme başarısız:', err);
  process.exit(1);
});
