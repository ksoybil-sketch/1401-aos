const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const serviceAccount = require('./serviceAccountKey.json');

const app = initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth(app);
const TEST_PASSWORD = '123456';

async function main() {
  const list = await auth.listUsers();
  console.log(`${list.users.length} kullanıcı bulundu.`);

  for (const user of list.users) {
    await auth.updateUser(user.uid, { password: TEST_PASSWORD });
    console.log(`Şifre ayarlandı: ${user.email}`);
  }

  console.log('Tamamlandı.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Şifre ayarlama başarısız:', err);
  process.exit(1);
});
