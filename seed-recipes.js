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
  await db.ref('recipes').set(recipes);
  console.log(`${recipes.length} reçete 'recipes' düğümüne yazıldı.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Reçete yükleme başarısız:', err);
  process.exit(1);
});
