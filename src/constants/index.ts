import { Recipe, BranchInfo, BaristaProfile, QuizResult } from '../types';


export const DEMO_BARISTAS: BaristaProfile[] = [
  { id: 'b1', name: 'Ahmet Yılmaz', pin: '1111', branchId: 'moda_cadde' },
  { id: 'b2', name: 'Elif Kaya', pin: '2222', branchId: 'moda_cadde' },
  { id: 'b3', name: 'Mehmet Demir', pin: '3333', branchId: 'moda_cadde' }
];

export const DEMO_QUIZ_RESULTS: QuizResult[] = [
  { id: 'qr-1', baristaName: 'Ahmet Yılmaz', score: 95, date: new Date().toISOString(), totalQuestions: 20, correctAnswers: 19 },
  { id: 'qr-2', baristaName: 'Elif Kaya', score: 85, date: new Date(Date.now() - 86400000).toISOString(), totalQuestions: 20, correctAnswers: 17 },
  { id: 'qr-3', baristaName: 'Mehmet Demir', score: 70, date: new Date(Date.now() - 172800000).toISOString(), totalQuestions: 20, correctAnswers: 14 }
];

export const CATEGORIES = [
  "Kahve",
  "Süt & Süt Ürünleri",
  "Şurup & Sos",
  "Teşhir Dolabı",
  "Diğer"
];

export const TESHIR_URUNLERI = [
  // Tatlılar
  "Muzlu Rulo Pasta", "Newyork Lotus Cheesecake", "Lotus Magnolya", "Çilek Magnolya", "Tiramisu", 
  "Çilekli Paris Brest", "Frambuazlı Cheesecake", "Mango Flan Tart", "Yerfıstıklı Flan Tart", 
  "Honey Berry Raw Cake", "Pavlova Çilekli", "Opera Kahveli Pasta", "Nutella Pasta", "Limonlu Cheesecake", 
  "San Sebastian", "Beyaz Çikolatalı Brownie", "Honey Berry Pasta", "Honey Berry Magnolia", 
  "Spoonful", "Kremalı Havuçlu Kek", "Honey Berry Granola", "Hp Rulo", "Kitkat Mozaik",
  // Unlu Mamüller
  "Zeytinli Tereyağlı Poğaça", "Kruvasan Çikolatalı", "Kruvasan Sade", "Triple Chocolate Cookie", 
  "Vişneli Muffin", "Çikolatalı Muffin", "Kek Marble", "Kek Limonlu", "Sade Açma", "Çikolatalı Açma", 
  "Sade Poğaça", "Peynirli Poğaça", "Dereotlu Peynirli Tereyağlı Poğaça",
  // Sandviç ve Tostlar
  "Kore Tostu Hindi Fümeli", "Kore Tostu Tavuklu", "Üç Peynirli Sandviç", "Tartar Soslu Dana Jambonlu", 
  "Hindi Füme Cheddar Peynirli", "Tavuklu Avokado Soslu", "Avokado Soslu Mozarella"
];

export const KUTU_ICI_ADETLER: Record<string, number> = {
  "Honey Berry Magnolia": 16,
  "Honey Berry Pasta": 12,
  "Beyaz Çikolatalı Brownie": 27,
  "Kremalı Havuçlu Kek": 12,
  "Triple Chocolate Cookie": 15,
  "Spoonful": 16,
  "Limonlu Cheesecake": 10,
  "Frambuazlı Cheesecake": 10,
  "Hp Rulo": 6,
  "Kitkat Mozaik": 12,
  "Lotus Magnolya": 16,
  "Tiramisu": 16,
  "Mango Flan Tart": 9,
  "Yerfıstıklı Flan Tart": 9,
  "Honey Berry Raw Cake": 8,
  "Pavlova Çilekli": 10,
  "Opera Kahveli Pasta": 10,
  "Nutella Pasta": 12,
  "Çilekli Paris Brest": 6,
  "San Sebastian": 12,
  "Newyork Lotus Cheesecake": 12,
  "% 100 Pişmiş Tereyağlı Kruvasan": 12,
  "% 100 Pişmiş Tereyağlı Pain au Chocolate": 12,
  "Burgu Kruvasan Dökme kg": 1,
  "Ballı Yemiş Sosu/ Honey Berry Sos": 1,
  "Dereotlu Peynirli Tereyağlı Poğaça": 20,
  "Zeytinli Tereyağlı Poğaça": 20,
  "Sade Açma": 30,
  "Çikolatalı Açma": 30,
  "D. Glutensiz Acıbadem Kurabiye": 12,
  "D. Glutensiz Cevizli Tuzlu Kurabiye": 12,
  "D. Glutensiz Haşhaşlı Tuzlu Kurabiye": 12,
  "D. Bademli Mini Kek": 12,
  "D. Üç Peynirli Sandviç": 10,
  "D. Tartar Soslu Dana Jambonlu Sandviç": 10,
  "D. Hindi Füme Cheddar Peynirli Sandviç": 10,
  "D. Tavuklu Avokado Soslu Sandviç": 10,
  "D. Avokado Soslu Mozarellalı Sandviç": 10,
  "Fındıklı Hurmalı Atıştırmalık Kurabiye": 20,
  "Susamlı Çörekotlu Atıştırmalık Kurabiye": 20,
  "Haşhaşlı Çekirdekli Atıştırmalık Kurabiye": 20,
  "Bademli Biscotti Atıştırmalık Kurabiye": 20,
  "D. Muffin Kek 120 Gr - Vişneli": 15,
  "D. Muffin Kek 120 Gr - Çikolatalı": 15,
  "Kek Marble": 25,
  "Kek Limonlu": 25,
  "Muzlu Rulo Pasta": 5
};

export const DEMO_RECIPES: Recipe[] = [
  {
    "id": "r1",
    "name": "FRAPPE LATTE",
    "category": "Soğuk Kahveler",
    "ingredients": [
      { "name": "Espresso", "amount": "40 ml" },
      { "name": "Süt", "amount": "170 ml" },
      { "name": "Frappe Tozu", "amount": "50 gr" },
      { "name": "Buz", "amount": "Silme" },
      { "name": "Krema", "amount": "Bombe Dekor" }
    ],
    "instructions": "16 OZ BARDAK Kahveyi öğütün ve espresso shot'ı hazırlayın. Kahve, süt, frappe tozu ve buzu blenderde çekin. Hazırladığınız içeceği bardağa ekleyip servis edin.",
    "image": null
  },
  {
    "id": "r2",
    "name": "ICED LATTE",
    "category": "Soğuk Kahveler",
    "ingredients": [
      { "name": "Espresso", "amount": "40 ml" },
      { "name": "Süt", "amount": "220 ml" },
      { "name": "Buz", "amount": "Silme" }
    ],
    "instructions": "16 OZ BARDAK Kahveyi öğütün ve espresso shot'ı hazırlayın. Sırasıyla silme buz, süt ve espressoyu ekleyip servis edin.",
    "image": null
  },
  {
    "id": "r3",
    "name": "ICED AMERICANO",
    "category": "Soğuk Kahveler",
    "ingredients": [
      { "name": "Espresso", "amount": "60 ml" },
      { "name": "Su", "amount": "220 ml" },
      { "name": "Buz", "amount": "Silme" }
    ],
    "instructions": "16 OZ BARDAK Kahveyi öğütün ve espresso shot'ı hazırlayın. Sırasıyla silme buz, su ve espressoyu ekleyip servis edin.",
    "image": null
  }
];
