import { QuizQuestion } from '../types';

/**
 * Barista eğitiminin seviyeli müfredatı. "Reçeteler" (recipes) hep birinci
 * seviyedir ve reçete verisinden dinamik üretilir (bkz. TrainingQuiz.tsx).
 * Diğer dört seviye 1401 Coffee Barista Rehberi, Personel Eğitim Konuları ve
 * İşletme Standartları belgelerinden derlenmiş sabit soru bankalarına sahiptir.
 *
 * Bir barista bir seviyeyi geçmeden (passScore ve üzeri) bir sonrakine
 * geçemez — TrainingQuiz.tsx bu sırayı zorunlu kılar.
 */
export interface TrainingLevel {
  id: string;
  order: number;
  name: string;
  description: string;
  passScore: number;
}

export const TRAINING_LEVELS: TrainingLevel[] = [
  {
    id: 'recipes',
    order: 1,
    name: 'Reçeteler',
    description: 'İçecek reçetelerini ne kadar iyi biliyorsun? Malzemeleri ve ölçüleri tahmin et.',
    passScore: 80
  },
  {
    id: 'sales',
    order: 2,
    name: 'Satış ve Misafir Deneyimi',
    description: 'Önerili satış teknikleri, misafir karşılama ve sadakat oluşturma.',
    passScore: 80
  },
  {
    id: 'complaints',
    order: 3,
    name: 'Şikayet Yönetimi',
    description: '5 adımda misafir şikayeti çözümü ve kriz anında doğru iletişim.',
    passScore: 80
  },
  {
    id: 'logistics',
    order: 4,
    name: 'Kalite ve Lojistik',
    description: 'Ürün teslim alma, soğuk zincir, FIFO ve depo standartları.',
    passScore: 80
  },
  {
    id: 'operations',
    order: 5,
    name: 'Görsel Mağazacılık ve Operasyon',
    description: 'Teşhir düzeni, açılış/kapanış prosedürleri ve ekipman bakımı.',
    passScore: 80
  }
];

const SALES_QUESTIONS: QuizQuestion[] = [
  {
    id: 'sales-1',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: '"Önerili satış" ne anlama gelir?',
    correctAnswer: 'Ana ürünle uyumlu tamamlayıcı veya daha üst seviye ürünlerin önerilmesi',
    options: [
      'Ana ürünle uyumlu tamamlayıcı veya daha üst seviye ürünlerin önerilmesi',
      'Stoktaki bayat ürünleri öncelikli olarak satmak',
      'Her misafire otomatik olarak en pahalı ürünü önermek',
      'Kampanya dışı ürünlerde indirim uygulamak'
    ]
  },
  {
    id: 'sales-2',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: '"Lattenizin yanına ev yapımı cheesecake\'imiz harika gider." cümlesi hangi satış tekniğine örnektir?',
    correctAnswer: 'Tamamlayıcı satış (cross-sell)',
    options: ['Tamamlayıcı satış (cross-sell)', 'Yükseltme satışı (up-sell)', 'Yeni ürün tanıtımı', 'Kampanya/bonus gücü']
  },
  {
    id: 'sales-3',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: '"Kahvenizi double shot yapalım mı? Gövdesi ve aroması çok daha zengin olur." cümlesi hangi satış tekniğine örnektir?',
    correctAnswer: 'Yükseltme satışı (up-sell)',
    options: ['Yükseltme satışı (up-sell)', 'Tamamlayıcı satış (cross-sell)', 'Yeni ürün tanıtımı', 'Kampanya/bonus gücü']
  },
  {
    id: 'sales-4',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: 'Misafire satış önerisi sunarken hangi yaklaşım doğrudur?',
    correctAnswer: '"Şefin önerisi" ya da "popüler seçim" gibi güven veren, samimi ifadeler kullanmak',
    options: [
      '"Şefin önerisi" ya da "popüler seçim" gibi güven veren, samimi ifadeler kullanmak',
      'Israrla aynı ürünü birden fazla kez önermek',
      'Misafirin cevabını beklemeden siparişe eklemek',
      'Sadece en pahalı seçeneği önermek'
    ]
  },
  {
    id: 'sales-5',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: 'Misafirin ihtiyacını anlamak için önerilen soru sorma yöntemi nedir?',
    correctAnswer: 'Açık uçlu, doğru sorularla ihtiyacı hızlıca analiz etmek',
    options: [
      'Açık uçlu, doğru sorularla ihtiyacı hızlıca analiz etmek',
      'Misafire hiç soru sormadan ürün önermek',
      'Yalnızca evet/hayır ile cevaplanabilecek sorular sormak',
      'Misafirin siparişini tahmin edip onaylatmak'
    ]
  },
  {
    id: 'sales-6',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: 'Bir kahve zincirinde misafir sadakatinin en önemli etkisi nedir?',
    correctAnswer: 'Memnun bir misafirin yanında yeni müşteriler getirmesi',
    options: [
      'Memnun bir misafirin yanında yeni müşteriler getirmesi',
      'Şubenin kira maliyetini azaltması',
      'Personel sayısını azaltma imkânı sağlaması',
      'Tedarikçi fiyatlarını düşürmesi'
    ]
  },
  {
    id: 'sales-7',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: 'Kapıdan giren HER misafire nasıl davranılmalıdır?',
    correctAnswer: 'Pozitif bir "Hoş geldiniz!" ile sıcak karşılanmalıdır',
    options: [
      'Pozitif bir "Hoş geldiniz!" ile sıcak karşılanmalıdır',
      'Sadece sipariş verirken selamlanmalıdır',
      'Yoğunlukta karşılama atlanabilir',
      'Sadece tanıdık misafirler karşılanır'
    ]
  },
  {
    id: 'sales-8',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: 'Müdavim bir misafirin "şekersiz yulaf sütlü latte" tercihini hatırlamak hangi hizmet anlayışının parçasıdır?',
    correctAnswer: 'Kişiselleştirilmiş hizmet',
    options: ['Kişiselleştirilmiş hizmet', 'Yükseltme satışı', 'Kriz yönetimi', 'Depo düzeni']
  },
  {
    id: 'sales-9',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: 'Bar ve servis ekibi arasındaki iletişim hızı neyi doğrudan etkiler?',
    correctAnswer: 'Servis hızını',
    options: ['Servis hızını', 'Kahve çekirdeğinin raf ömrünü', 'Depo sıcaklığını', 'Vitrin aydınlatmasını']
  },
  {
    id: 'sales-10',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: 'Aşağıdakilerden hangisi "1401 İmzası" standartlarından biri DEĞİLDİR?',
    correctAnswer: 'En pahalı ürünü önermek',
    options: ['En pahalı ürünü önermek', 'Temiz fincan', 'Doğru servis sıcaklığı', 'Lekesiz camlar']
  },
  {
    id: 'sales-11',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: 'Kahve köpüğünün kıvamı misafir üzerinde öncelikle neyi etkiler?',
    correctAnswer: 'İlk görsel memnuniyeti',
    options: ['İlk görsel memnuniyeti', 'Yalnızca kafein miktarını', 'Yalnızca fiyatı', 'Yalnızca servis süresini']
  },
  {
    id: 'sales-12',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: 'Misafir memnuniyetini kontrol ederken doğru soru hangisidir?',
    correctAnswer: '"Her şey arzu ettiğiniz gibi mi efendim?"',
    options: [
      '"Her şey arzu ettiğiniz gibi mi efendim?"',
      '"Beğenmediniz mi?"',
      '"Bir sorun mu var?"',
      '"Neden şikayet ediyorsunuz?"'
    ]
  },
  {
    id: 'sales-13',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: 'Yoğun anlarda ekip içi destek nasıl olmalıdır?',
    correctAnswer: 'Sipariş kuyruğunda birbirinin açığını kapatan takım mantığıyla',
    options: [
      'Sipariş kuyruğunda birbirinin açığını kapatan takım mantığıyla',
      'Herkes yalnızca kendi görev alanına odaklanarak',
      'Yoğunlukta yeni ürün tanıtımı yaparak',
      'Yönetici gelene kadar bekleyerek'
    ]
  },
  {
    id: 'sales-14',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: 'Barista rehberinde tanımlanan satış stratejisi sayısı kaçtır?',
    correctAnswer: '4',
    options: ['4', '2', '6', '3']
  },
  {
    id: 'sales-15',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: 'Yeni bir ürünü tanıtırken önerilen cümle hangisidir?',
    correctAnswer: '"Bugün menüye yeni eklenen spesiyalimiz çok popüler!"',
    options: [
      '"Bugün menüye yeni eklenen spesiyalimiz çok popüler!"',
      '"Bu ürünü almazsanız pişman olursunuz."',
      '"Yeni ürünümüzü zorunlu olarak denemelisiniz."',
      '"Eski ürünler artık satılmıyor."'
    ]
  },
  {
    id: 'sales-16',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: 'Vücut dili konusunda en güçlü satış aracı olarak ne belirtilmiştir?',
    correctAnswer: 'Gülümseme, dik duruş ve göz teması',
    options: ['Gülümseme, dik duruş ve göz teması', 'Yüksek sesle konuşmak', 'Hızlı hareket etmek', 'Göz temasından kaçınmak']
  },
  {
    id: 'sales-17',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: 'Satış oranları takip edilirken önerilen yaklaşım nedir?',
    correctAnswer: 'Başarıyı ekip olarak birlikte kutlamak ve düzenli geri bildirim vermek',
    options: [
      'Başarıyı ekip olarak birlikte kutlamak ve düzenli geri bildirim vermek',
      'Sadece en çok satan baristayı ödüllendirmek',
      'Düşük satış yapanları herkesin önünde eleştirmek',
      'Satış hedeflerini personelle paylaşmamak'
    ]
  },
  {
    id: 'sales-18',
    recipeName: 'Satış ve Misafir Deneyimi',
    questionText: 'Bir misafirin ruh haline göre doğru yaklaşımı belirlemek hangi beceriyle ilgilidir?',
    correctAnswer: 'Empati kurma',
    options: ['Empati kurma', 'Depo takibi', 'FIFO uygulaması', 'Teşhir düzeni']
  }
];

const COMPLAINTS_QUESTIONS: QuizQuestion[] = [
  {
    id: 'complaints-1',
    recipeName: 'Şikayet Yönetimi',
    questionText: 'Misafir şikayeti yönetiminde doğru adım sıralaması hangisidir?',
    correctAnswer: 'Dinleme → Empati → Teşekkür → Özür Dileme → Çözüm Sunma',
    options: [
      'Dinleme → Empati → Teşekkür → Özür Dileme → Çözüm Sunma',
      'Özür Dileme → Dinleme → Çözüm Sunma → Empati → Teşekkür',
      'Çözüm Sunma → Dinleme → Empati → Özür Dileme → Teşekkür',
      'Teşekkür → Çözüm Sunma → Dinleme → Empati → Özür Dileme'
    ]
  },
  {
    id: 'complaints-2',
    recipeName: 'Şikayet Yönetimi',
    questionText: '"Sizi çok iyi anlıyorum." cümlesi 5 adımdan hangisine örnektir?',
    correctAnswer: 'Empati',
    options: ['Empati', 'Dinleme', 'Teşekkür', 'Çözüm Sunma']
  },
  {
    id: 'complaints-3',
    recipeName: 'Şikayet Yönetimi',
    questionText: 'Şikayet karşısında ASLA yapılmaması gereken davranış hangisidir?',
    correctAnswer: 'Misafiri suçlamak veya "Bizde hata olmaz" gibi savunmacı bir dil kullanmak',
    options: [
      'Misafiri suçlamak veya "Bizde hata olmaz" gibi savunmacı bir dil kullanmak',
      'Misafiri dikkatle dinlemek',
      'Özür dilemek',
      'Hızlı çözüm üretmek'
    ]
  },
  {
    id: 'complaints-4',
    recipeName: 'Şikayet Yönetimi',
    questionText: 'Bir misafir ürünün soğuk/tuzlu geldiğinden şikayet ederse doğru yaklaşım nedir?',
    correctAnswer: 'Ürünü sorgusuz sualsiz geri alıp hemen yenisini hazırlamak',
    options: [
      'Ürünü sorgusuz sualsiz geri alıp hemen yenisini hazırlamak',
      'Misafire "Bize göre bir sorun yok" demek',
      'Ürünü değiştirmeden önce yöneticinin onayını beklemek',
      'Misafire indirim önerip ürünü değiştirmemek'
    ]
  },
  {
    id: 'complaints-5',
    recipeName: 'Şikayet Yönetimi',
    questionText: 'Demleme gerektirmeyen bir içecek standart olarak en geç kaç dakikada hazırlanmalıdır?',
    correctAnswer: '2 dakika',
    options: ['2 dakika', '5 dakika', '10 dakika', '1 dakika']
  },
  {
    id: 'complaints-6',
    recipeName: 'Şikayet Yönetimi',
    questionText: 'Demleme gerektiren bir içecek standart olarak en geç kaç dakikada hazırlanmalıdır?',
    correctAnswer: '5 dakika',
    options: ['5 dakika', '2 dakika', '15 dakika', '8 dakika']
  },
  {
    id: 'complaints-7',
    recipeName: 'Şikayet Yönetimi',
    questionText: 'Küçük çaplı bir şikayetin ilk çözümünden kim sorumludur?',
    correctAnswer: 'Bar personeli (barista)',
    options: ['Bar personeli (barista)', 'Yalnızca Operasyon Müdürü', 'Yalnızca Genel Müdür', 'Kasiyer dışındaki tüm personel']
  },
  {
    id: 'complaints-8',
    recipeName: 'Şikayet Yönetimi',
    questionText: 'Bir şikayet büyümeye/uzamaya başladığında barista ne yapmalıdır?',
    correctAnswer: 'Durumu derhal vardiyadaki yöneticiye iletmek ve devretmek',
    options: [
      'Durumu derhal vardiyadaki yöneticiye iletmek ve devretmek',
      'Misafirle tartışarak durumu netleştirmek',
      'Şikayeti görmezden gelmek',
      'Misafire kendi başına indirim sözü vermek'
    ]
  },
  {
    id: 'complaints-9',
    recipeName: 'Şikayet Yönetimi',
    questionText: 'İndirim veya ikram yapma yetkisi kimdedir?',
    correctAnswer: 'Şube Yöneticileri (Şube Müdürü / Müdür Yardımcısı) ve Operasyon Müdürü',
    options: [
      'Şube Yöneticileri (Şube Müdürü / Müdür Yardımcısı) ve Operasyon Müdürü',
      'Her barista kendi takdirine göre karar verebilir',
      'Yalnızca kasiyer',
      'Hiç kimsede, tüm talepler reddedilir'
    ]
  },
  {
    id: 'complaints-10',
    recipeName: 'Şikayet Yönetimi',
    questionText: 'Öfkeyle yaklaşan bir misafire karşı doğru tutum nedir?',
    correctAnswer: 'Sakin kalmak, durumu tırmandırmadan sakinleştirmek',
    options: [
      'Sakin kalmak, durumu tırmandırmadan sakinleştirmek',
      'Aynı üslupla karşılık vermek',
      'Misafiri dinlemeden yöneticiyi çağırmak',
      'Misafirden uzaklaşıp görmezden gelmek'
    ]
  },
  {
    id: 'complaints-11',
    recipeName: 'Şikayet Yönetimi',
    questionText: 'Çözüm sunulduktan sonra masa takibi kaç dakika sonra yapılmalıdır?',
    correctAnswer: '5 dakika',
    options: ['5 dakika', 'Hemen, çözüm sunulur sunulmaz', '30 dakika', 'Masa takibi gerekmez']
  },
  {
    id: 'complaints-12',
    recipeName: 'Şikayet Yönetimi',
    questionText: 'Şirketi bağlayıcı veya belirsiz maliyet doğurabilecek taahhütler konusunda kural nedir?',
    correctAnswer: 'Yöneticiler bu tür taahhütlerde bulunmamalıdır (örn. "Biz karşılarız" dememelidir)',
    options: [
      'Yöneticiler bu tür taahhütlerde bulunmamalıdır (örn. "Biz karşılarız" dememelidir)',
      'Her yönetici istediği taahhüdü verebilir',
      'Barista bu taahhütleri verebilir',
      'Taahhüt sadece yazılı olursa geçerlidir'
    ]
  },
  {
    id: 'complaints-13',
    recipeName: 'Şikayet Yönetimi',
    questionText: 'Talep edilen bir ürün stokta yoksa doğru yaklaşım nedir?',
    correctAnswer: 'Özür dileyip alternatif bir ürün önermek',
    options: [
      'Özür dileyip alternatif bir ürün önermek',
      'Misafire "O ürün hiç yok" deyip konuyu kapatmak',
      'Misafiri başka bir şubeye yönlendirmek',
      'Ürünün ne zaman geleceğini garanti etmek'
    ]
  },
  {
    id: 'complaints-14',
    recipeName: 'Şikayet Yönetimi',
    questionText: 'Şikayetler nasıl kayıt altına alınmalıdır?',
    correctAnswer: 'Yazılı olarak kaydedilip ekibe raporlanmalıdır',
    options: [
      'Yazılı olarak kaydedilip ekibe raporlanmalıdır',
      'Sadece sözlü olarak yöneticiye iletilir',
      'Kayıt tutulmasına gerek yoktur',
      'Yalnızca misafir yazılı dilekçe verirse kayıt tutulur'
    ]
  },
  {
    id: 'complaints-15',
    recipeName: 'Şikayet Yönetimi',
    questionText: 'Çözülen bir şikayet sonrası misafire hangi jest önerilir?',
    correctAnswer: 'Minik bir ikram (kurabiye, çikolata vb.)',
    options: [
      'Minik bir ikram (kurabiye, çikolata vb.)',
      'Sonraki ziyaretinde giriş ücreti almak',
      'Hiçbir şey yapmamak, olay kapanmıştır',
      'Misafirden yazılı teşekkür istemek'
    ]
  },
  {
    id: 'complaints-16',
    recipeName: 'Şikayet Yönetimi',
    questionText: 'Ekip arasında kriz senaryoları (rol oyunları) üzerinde çalışmanın amacı nedir?',
    correctAnswer: 'Şikayet anındaki tepki hızını ve becerisini artırmak',
    options: [
      'Şikayet anındaki tepki hızını ve becerisini artırmak',
      'Yeni ürünleri tanıtmak',
      'Depo düzenini öğretmek',
      'Satış hedeflerini belirlemek'
    ]
  }
];

const LOGISTICS_QUESTIONS: QuizQuestion[] = [
  {
    id: 'logistics-1',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'FIFO kuralı ne anlama gelir?',
    correctAnswer: 'İlk giren ürün ilk çıkar',
    options: ['İlk giren ürün ilk çıkar', 'Son giren ürün ilk çıkar', 'En pahalı ürün önce kullanılır', 'En çok satan ürün önce kullanılır']
  },
  {
    id: 'logistics-2',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Süt ve süt ürünleri hangi sıcaklık aralığında saklanmalıdır?',
    correctAnswer: '0-4°C',
    options: ['0-4°C', '4-8°C', '-4-0°C', '8-12°C']
  },
  {
    id: 'logistics-3',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Teslim alınan bir ürünün ambalajı yırtık veya sızdırıyorsa ne yapılmalıdır?',
    correctAnswer: 'Ürün teslim alınmamalıdır',
    options: [
      'Ürün teslim alınmamalıdır',
      'Hasar tutanağı yazılıp yine de teslim alınır',
      'Sadece dış görünüşü düzeltilerek kullanılır',
      'İndirimli fiyatla teslim alınabilir'
    ]
  },
  {
    id: 'logistics-4',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Kahve çekirdekleri nasıl saklanmalıdır?',
    correctAnswer: 'Serin, kuru, doğrudan güneş almayan, hava almayan valfli kaplarda',
    options: [
      'Serin, kuru, doğrudan güneş almayan, hava almayan valfli kaplarda',
      'Buzdolabında, açık kapta',
      'Sıcak ve nemli bir ortamda',
      'Güneş gören bir rafta, açık pakette'
    ]
  },
  {
    id: 'logistics-5',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Gıda ürünleri ile temizlik kimyasalları aynı alanda saklanabilir mi?',
    correctAnswer: 'Hayır, kesinlikle ayrı alanlarda tutulmalıdır',
    options: [
      'Hayır, kesinlikle ayrı alanlarda tutulmalıdır',
      'Evet, ambalajları kapalıysa sorun olmaz',
      'Sadece küçük miktarlarda birlikte tutulabilir',
      'Yalnızca geceleri ayrı tutulması yeterlidir'
    ]
  },
  {
    id: 'logistics-6',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Açılan bir şurup veya süt paketinin üzerine ne yazılmalıdır?',
    correctAnswer: 'Açılış tarihi',
    options: ['Açılış tarihi', 'Yalnızca ürün adı', 'Tedarikçi firma adı', 'Hiçbir şey yazılmasına gerek yoktur']
  },
  {
    id: 'logistics-7',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Bitkisel sütler ve hayvansal sütler nasıl saklanmalıdır?',
    correctAnswer: 'Ayrı alanlarda',
    options: ['Ayrı alanlarda', 'Aynı kapta karıştırılarak', 'Bitkisel sütler oda sıcaklığında, hayvansal sütler soğutucuda', 'Fark etmez, birlikte saklanabilir']
  },
  {
    id: 'logistics-8',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Kuru gıdaların zeminle doğrudan teması hakkında kural nedir?',
    correctAnswer: 'Kesinlikle yasaktır, palet kullanılmalıdır',
    options: ['Kesinlikle yasaktır, palet kullanılmalıdır', 'Kısa süreliğine sorun olmaz', 'Sadece ambalajlı ürünler zeminde tutulabilir', 'Yalnızca kışın dikkat edilir']
  },
  {
    id: 'logistics-9',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Donuk ürünler için uygulanan "3 gün kuralı" neyi ifade eder?',
    correctAnswer: '+4°C dolapta tutulan donuk ürünlerin 3 gün içinde tüketilmesi gerektiğini',
    options: [
      '+4°C dolapta tutulan donuk ürünlerin 3 gün içinde tüketilmesi gerektiğini',
      'Donuk ürünlerin en fazla 3 saat oda sıcaklığında bekletilebileceğini',
      'Ürünlerin 3 gün içinde tekrar dondurulabileceğini',
      'Siparişlerin 3 günde bir verilmesi gerektiğini'
    ]
  },
  {
    id: 'logistics-10',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Bir gıda ürünü ikinci kez dondurulabilir mi?',
    correctAnswer: 'Hayır, hiçbir gıda ürünü ikinci kez dondurulamaz',
    options: [
      'Hayır, hiçbir gıda ürünü ikinci kez dondurulamaz',
      'Evet, 24 saat içinde ikinci kez dondurulabilir',
      'Sadece tatlılar ikinci kez dondurulabilir',
      'Sadece hamur işleri ikinci kez dondurulabilir'
    ]
  },
  {
    id: 'logistics-11',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Donuk ürünlerin çözülme (defrost) işlemi nerede yapılmalıdır?',
    correctAnswer: 'Yalnızca +5°C\'deki buzdolabında',
    options: ['Yalnızca +5°C\'deki buzdolabında', 'Oda sıcaklığında, tezgah üzerinde', 'Sıcak suda bekletilerek', 'Mikrodalgada tam güçte']
  },
  {
    id: 'logistics-12',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Depoda dökülen toz veya sıvı ürünler ne zaman temizlenmelidir?',
    correctAnswer: 'Anında',
    options: ['Anında', 'Vardiya sonunda toplu olarak', 'Ertesi gün açılışta', 'Yalnızca misafir fark ederse']
  },
  {
    id: 'logistics-13',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Kritik stok seviyesine düşen bir malzeme için ne yapılmalıdır?',
    correctAnswer: 'Anında sipariş edilmelidir',
    options: ['Anında sipariş edilmelidir', 'Ürün bitene kadar beklenir', 'Ay sonu toplu sipariş verilir', 'Şube müdürüne bilgi vermeye gerek yoktur']
  },
  {
    id: 'logistics-14',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Kullanılamaz hale gelen hammaddeler nasıl kayıt altına alınmalıdır?',
    correctAnswer: 'Fire sistemine işlenerek',
    options: ['Fire sistemine işlenerek', 'Kayıt tutulmadan çöpe atılarak', 'Yalnızca sözlü olarak bildirilerek', 'Ay sonunda tahmini olarak']
  },
  {
    id: 'logistics-15',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Depoda kategori ayrımı (kahve, süt, kuru gıda, temizlik vb.) neden önemlidir?',
    correctAnswer: 'Kolay erişim, düzen ve hijyen sağlamak için',
    options: ['Kolay erişim, düzen ve hijyen sağlamak için', 'Sadece görsellik için', 'Yalnızca denetimlerde iyi görünmek için', 'Önemli değildir, hızlıca yerleştirmek yeterlidir']
  },
  {
    id: 'logistics-16',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Haftalık/günlük stok kontrolleri neden yapılmalıdır?',
    correctAnswer: 'Eksik ürünleri belirleyip zamanında sipariş verebilmek için',
    options: ['Eksik ürünleri belirleyip zamanında sipariş verebilmek için', 'Yalnızca yıl sonu raporlaması için', 'Personel performansını ölçmek için', 'Tedarikçi faturalarını kontrol etmek için']
  },
  {
    id: 'logistics-17',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Soğuk zincirin kırılması ne gibi bir sonuca yol açar?',
    correctAnswer: 'Lezzet kaybına ve sağlık risklerine yol açar',
    options: ['Lezzet kaybına ve sağlık risklerine yol açar', 'Ürünün raf ömrünü uzatır', 'Herhangi bir etkisi yoktur', 'Yalnızca görsel bir soruna yol açar']
  },
  {
    id: 'logistics-18',
    recipeName: 'Kalite ve Lojistik',
    questionText: 'Tedarikçilerden saat kaçtan sonra mal teslim alınmaz?',
    correctAnswer: '17:30',
    options: ['17:30', '20:00', '15:00', '22:00']
  }
];

const OPERATIONS_QUESTIONS: QuizQuestion[] = [
  {
    id: 'operations-1',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: '"Göz seviyesi kuralı" neyi ifade eder?',
    correctAnswer: 'En çok satan ve öne çıkarılmak istenen ürünlerin göz hizasında yer alması',
    options: [
      'En çok satan ve öne çıkarılmak istenen ürünlerin göz hizasında yer alması',
      'Tüm ürünlerin aynı yükseklikte dizilmesi',
      'Ürünlerin sadece alt raflarda tutulması',
      'Vitrin camının göz hizasında temizlenmesi'
    ]
  },
  {
    id: 'operations-2',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: '"Facing tekniği" ne anlama gelir?',
    correctAnswer: 'Ürünlerin ön yüzlerinin etiketiyle dışa dönük ve raf dolu görünecek şekilde dizilmesi',
    options: [
      'Ürünlerin ön yüzlerinin etiketiyle dışa dönük ve raf dolu görünecek şekilde dizilmesi',
      'Ürünlerin rastgele istiflenmesi',
      'Sadece pahalı ürünlerin ön sıraya konması',
      'Etiketlerin arkaya çevrilmesi'
    ]
  },
  {
    id: 'operations-3',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Dağınık bir vitrin veya eksik etiketli ürünler satışı ne kadar düşürebilir?',
    correctAnswer: '%40\'a kadar',
    options: ['%40\'a kadar', 'Hiçbir etkisi olmaz', 'Sadece %5', 'Satışı artırır']
  },
  {
    id: 'operations-4',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Şube alarm şifresini kimler bilebilir?',
    correctAnswer: 'Yalnızca yöneticiler',
    options: ['Yalnızca yöneticiler', 'Tüm personel', 'Sadece kasiyer', 'Şifre kullanılmaz']
  },
  {
    id: 'operations-5',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Kruvasan çeşitleri fırında kaç derecede, kaç dakika pişirilir?',
    correctAnswer: '180°C\'de 20 dakika',
    options: ['180°C\'de 20 dakika', '220°C\'de 10 dakika', '150°C\'de 40 dakika', '100°C\'de 60 dakika']
  },
  {
    id: 'operations-6',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Fırından çıkan kruvasan teşhir dolabına konmadan önce kaç dakika dinlendirilir?',
    correctAnswer: '4 dakika',
    options: ['4 dakika', 'Hemen konur, dinlendirilmez', '15 dakika', '1 saat']
  },
  {
    id: 'operations-7',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Servis sırasında soğuyan bir kruvasan mikrodalgada kaç saniye, kaç derecede ısıtılır?',
    correctAnswer: '45 saniye, 200°C',
    options: ['45 saniye, 200°C', '5 dakika, 100°C', '10 saniye, 300°C', 'Isıtılmaz, soğuk servis edilir']
  },
  {
    id: 'operations-8',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Şube kapanışında hangi ekipmanlar ÇALIŞIR DURUMDA bırakılmalıdır?',
    correctAnswer: 'Buzdolapları, derin dondurucular, soğuk oda',
    options: ['Buzdolapları, derin dondurucular, soğuk oda', 'Klima ve havalandırma', 'Aydınlatma sistemi', 'Müzik sistemi']
  },
  {
    id: 'operations-9',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'SKT\'si dolmuş ürünler kapanışta nasıl işleme alınır?',
    correctAnswer: 'Sisteme zayi kaydı yapılarak çöpe atılır',
    options: ['Sisteme zayi kaydı yapılarak çöpe atılır', 'Ertesi gün indirimli satılır', 'Personel yemeği olarak kullanılır', 'Kayıt yapılmadan çöpe atılır']
  },
  {
    id: 'operations-10',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Personelin günlük içecek hakkı kaç adettir ve neleri kapsar?',
    correctAnswer: '3 adet — kahve, limonata ve çay',
    options: ['3 adet — kahve, limonata ve çay', 'Sınırsızdır', '1 adet, sadece kahve', '5 adet, tüm menü']
  },
  {
    id: 'operations-11',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'KerzzPOS sistemine personel nasıl giriş yapmalıdır?',
    correctAnswer: 'Yalnızca kendi şifresiyle',
    options: ['Yalnızca kendi şifresiyle', 'Ortak bir şifreyle', 'Şube müdürünün şifresiyle', 'Şifre gerekmez']
  },
  {
    id: 'operations-12',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Mesai saatleri içinde şahsi telefon görüşmesi kuralı nedir?',
    correctAnswer: 'Şube sınırları içinde yapılamaz; zorunlu durumda izinle dışarıda yapılabilir',
    options: [
      'Şube sınırları içinde yapılamaz; zorunlu durumda izinle dışarıda yapılabilir',
      'Serbestçe yapılabilir',
      'Sadece molalarda yapılabilir',
      'Yöneticiler için geçerli değildir'
    ]
  },
  {
    id: 'operations-13',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'İş kıyafetleriyle ilgili kural nedir?',
    correctAnswer: 'Bu kıyafetlerle şube dışına çıkılmaz ve işe bu kıyafetlerle gelinmez',
    options: [
      'Bu kıyafetlerle şube dışına çıkılmaz ve işe bu kıyafetlerle gelinmez',
      'Kıyafetler eve götürülüp orada yıkanabilir',
      'İstenirse şube dışında da giyilebilir',
      'Kıyafet zorunluluğu yoktur'
    ]
  },
  {
    id: 'operations-14',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Personel iş esnasında ne takmak zorundadır?',
    correctAnswer: 'İsimlik',
    options: ['İsimlik', 'Sadece saat', 'Herhangi bir aksesuar zorunlu değildir', 'Sadece yöneticiler isimlik takar']
  },
  {
    id: 'operations-15',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Buz makinesi ne sıklıkla temizlenmelidir?',
    correctAnswer: 'Her gece',
    options: ['Her gece', 'Haftada bir', 'Ayda bir', 'Sadece arıza olduğunda']
  },
  {
    id: 'operations-16',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Espresso makinesinin süt köpürtme çubukları hangi ürünle temizlenir?',
    correctAnswer: 'Pully Milk',
    options: ['Pully Milk', 'Pully Grind', 'Pullycaf', 'Sade su']
  },
  {
    id: 'operations-17',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Kahve öğütücüler (grinder) haftada bir hangi ürünle detaylı temizlenir?',
    correctAnswer: 'Pully Grind',
    options: ['Pully Grind', 'Pully Milk', 'Pullycaf', 'Kireç çözücü']
  },
  {
    id: 'operations-18',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Limonata makinesiyle ilgili kural nedir?',
    correctAnswer: 'İçindeki limonata azalınca başka kaba aktarılır, makine temizlenmeden yeni limonata eklenmez',
    options: [
      'İçindeki limonata azalınca başka kaba aktarılır, makine temizlenmeden yeni limonata eklenmez',
      'Limonata hiç azalmadan üzerine yenisi eklenir',
      'Günde bir kez doldurulup bir daha dokunulmaz',
      'Temizlik haftada bir yapılır'
    ]
  },
  {
    id: 'operations-19',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Şube açılış ve kapanış saatleri genel olarak nasıl belirlenmiştir?',
    correctAnswer: '08:30 - 23:30 (şube lokasyonuna göre değişebilir)',
    options: ['08:30 - 23:30 (şube lokasyonuna göre değişebilir)', '06:00 - 22:00, tüm şubelerde sabit', '10:00 - 20:00', '24 saat açık']
  },
  {
    id: 'operations-20',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Açılış işlemleri tamamlandığında şube fotoğrafları nereye gönderilir?',
    correctAnswer: '"1401 Standartlar" WhatsApp grubuna',
    options: ['"1401 Standartlar" WhatsApp grubuna', 'Yalnızca Operasyon Müdürü\'ne e-posta ile', 'Hiçbir yere gönderilmez', 'Sosyal medya hesaplarına']
  },
  {
    id: 'operations-21',
    recipeName: 'Görsel Mağazacılık ve Operasyon',
    questionText: 'Personel indirimi KerzzPOS satış fiyatı üzerinden yüzde kaçtır?',
    correctAnswer: '%20',
    options: ['%20', '%50', '%10', '%100 (ücretsiz)']
  }
];

export const QUESTION_BANKS: Record<string, QuizQuestion[]> = {
  sales: SALES_QUESTIONS,
  complaints: COMPLAINTS_QUESTIONS,
  logistics: LOGISTICS_QUESTIONS,
  operations: OPERATIONS_QUESTIONS
};

/** Bir sınav denemesinde havuzdan kaç soru rastgele çekileceği. */
export const QUESTIONS_PER_EXAM = 15;

/** Bir baristanın 7 günlük kayan pencerede alabileceği en fazla sınav hakkı. */
export const MAX_EXAMS_PER_WEEK = 2;
