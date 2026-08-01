/**
 * 1401 AOS — Ortak tasarım sistemi.
 *
 * Yön: mat, kompakt, keskin. Degrade yok, parıltı yok, emoji yok.
 * Vurgu tek bir krema tonu; renk sadece anlam taşıdığında (durum,
 * uyarı) devreye girer. Yerleşim dili iOS'un "gruplu liste"
 * desenine dayanır — dünyanın en çok kullanılan mobil arayüz
 * kalıbı olduğu için tanıdık gelir ve yoğun veriyi sakin gösterir.
 *
 * Her sabit saf Tailwind utility dizesidir; ekranlar kendi ad-hoc
 * stillerini üretmez, buradan besleniyor.
 */

/* ---------------------------------------------------------------
   YÜZEYLER
   --------------------------------------------------------------- */

/** Temel panel: yarı saydam dolgu + saç teli kenarlık. */
export const panel = 'bg-panel border border-line rounded-xl';

/** Standart kart — panel + ölçülü gölge. */
export const card = `${panel} shadow-[0_1px_2px_rgba(0,0,0,0.5)]`;

/** Tıklanabilir kart. */
export const cardInteractive = `${card} cursor-pointer transition-colors duration-150 hover:bg-panel-2 hover:border-line-2 active:bg-panel-3`;

/** Kart iç boşluğu (kompakt). */
export const cardPad = 'p-4';

/* ---------------------------------------------------------------
   GRUPLU LİSTE (iOS "grouped table view" kalıbı)
   Kullanım:
     <div className={listGroup}>
       <button className={listRow}>…</button>
       <button className={listRow}>…</button>
     </div>
   Satır ayraçları container tarafından çizilir; her satır kendi
   kenarlığını taşımaz — bu sayede liste tek bir blok gibi okunur.
   --------------------------------------------------------------- */

export const listGroup =
  'bg-panel border border-line rounded-xl overflow-hidden divide-y divide-line shadow-[0_1px_2px_rgba(0,0,0,0.5)]';

/** Grup içindeki tek satır (dokunma hedefi 52px). */
export const listRow =
  'w-full flex items-center gap-3 px-4 min-h-13 py-3 text-left transition-colors duration-150 hover:bg-panel-2 active:bg-panel-3 cursor-pointer';

/** Tıklanamayan bilgi satırı. */
export const listRowStatic = 'w-full flex items-center gap-3 px-4 min-h-13 py-3 text-left';

/** Satırın sağındaki chevron rengi. */
export const rowChevron = 'text-fg-3 shrink-0';

/** Grup üstündeki küçük bölüm etiketi (iOS Ayarlar dili). */
export const sectionLabel =
  'text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-3 px-1';

/* ---------------------------------------------------------------
   BUTONLAR
   Kullanım: `${btn} ${btnPrimary} ${btnLg}`
   --------------------------------------------------------------- */

export const btn =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg cursor-pointer select-none transition-colors duration-150 active:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap';

/** Ana eylem: krema dolgu, koyu metin. Düz, degradesiz. */
export const btnPrimary = 'bg-crema text-espresso hover:bg-crema-dim';

/** İkincil eylem. */
export const btnSecondary = 'bg-panel-2 text-crema border border-line hover:bg-panel-3 hover:border-line-2';

/** Yıkıcı eylem. */
export const btnDanger = 'bg-negative-bg text-negative border border-negative-line hover:bg-negative/20';

/** Çerçevesiz eylem. */
export const btnGhost = 'bg-transparent text-fg-2 hover:text-crema hover:bg-panel-2';

export const btnLg = 'h-11 px-5 text-[15px]';
export const btnMd = 'h-9 px-3.5 text-[13px]';
export const btnSm = 'h-8 px-3 text-[12px]';

/** Kare ikon butonu. */
export const iconBtn =
  'inline-flex items-center justify-center w-8 h-8 shrink-0 rounded-lg bg-panel-2 border border-line text-fg-2 cursor-pointer transition-colors duration-150 hover:bg-panel-3 hover:text-crema active:opacity-80 disabled:opacity-40';

/* ---------------------------------------------------------------
   FORM ELEMANLARI
   --------------------------------------------------------------- */

export const input =
  'w-full h-11 px-3.5 rounded-lg bg-roast border border-line text-crema text-[15px] transition-colors duration-150 placeholder:text-fg-4 focus:outline-none focus:border-line-2 focus:bg-panel-2 disabled:opacity-55';

export const textarea = `${input} h-24 py-3 resize-y leading-relaxed`;

export const label = 'text-[12px] font-medium text-fg-2';

export const field = 'flex flex-col gap-1.5';

/* ---------------------------------------------------------------
   SEGMENTED CONTROL (iOS) — filtre satırları için
   --------------------------------------------------------------- */

export const segment = 'inline-flex items-center gap-1 p-1 rounded-lg bg-panel border border-line';
export const segmentItem =
  'px-3 h-7 inline-flex items-center rounded-md text-[12px] font-medium cursor-pointer transition-colors duration-150 whitespace-nowrap';
export const segmentItemOn = 'bg-panel-3 text-crema';
export const segmentItemOff = 'text-fg-3 hover:text-fg-2';

/** Yatay kaydırılabilir filtre şeridi (çip). */
export const chip =
  'px-3 h-8 inline-flex items-center rounded-md text-[12px] font-medium whitespace-nowrap cursor-pointer transition-colors duration-150 border';
export const chipOn = 'bg-crema text-espresso border-crema';
export const chipOff = 'bg-panel text-fg-2 border-line hover:bg-panel-2 hover:text-crema';

/** Kaydırma çubuğunu gizleyen yardımcı (filtre şeritleri). */
export const scrollX =
  'flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

/* ---------------------------------------------------------------
   MODAL / SHEET
   Mobilde alttan yükselen sayfa, geniş ekranda ortalanmış diyalog.
   --------------------------------------------------------------- */

export const modalOverlay =
  'fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-[fadeIn_0.15s_ease-out]';

export const modalPanel =
  'w-full max-w-[460px] max-h-[90vh] overflow-y-auto bg-bean border border-line rounded-t-2xl sm:rounded-2xl shadow-[0_-16px_48px_rgba(0,0,0,0.7)] animate-[sheetUp_0.28s_cubic-bezier(0.32,0.72,0,1)]';

export const modalGrabber = 'w-9 h-1 rounded-full bg-line-2 mx-auto mt-2.5 sm:hidden';

export const modalHeader =
  'flex items-center justify-between gap-3 px-5 pt-4 pb-3.5 border-b border-line';

export const modalTitle = 'text-[17px] font-semibold text-crema';

export const modalBody = 'px-5 py-5';

/* ---------------------------------------------------------------
   TİPOGRAFİ
   --------------------------------------------------------------- */

/** Ekran başlığı (iOS large title'ın kompakt hâli). */
export const screenTitle = 'text-[22px] font-bold text-crema';

/** Kart/bölüm başlığı. */
export const cardTitle = 'text-[15px] font-semibold text-crema';

/* ---------------------------------------------------------------
   ROZETLER
   --------------------------------------------------------------- */

export const badge =
  'inline-flex items-center gap-1 px-2 h-6 rounded-md text-[11px] font-semibold whitespace-nowrap border tnum';

export const badgeNeutral = 'bg-panel-2 text-fg-2 border-line';
export const badgePositive = 'bg-positive-bg text-positive border-positive-line';
export const badgeCaution = 'bg-caution-bg text-caution border-caution-line';
export const badgeNegative = 'bg-negative-bg text-negative border-negative-line';

/* ---------------------------------------------------------------
   VURGU RENKLERİ
   İkon rozetleri için tek kaynak — "aynı mavi her yerde aynı mavi".
   --------------------------------------------------------------- */

export type Tone = 'neutral' | 'accent' | 'positive' | 'caution' | 'negative';

export const TONE: Record<Tone, { fg: string; chipBg: string; line: string; edge: string }> = {
  neutral:  { fg: 'text-fg-2',     chipBg: 'bg-panel-2',      line: 'border-line',           edge: 'border-l-line-2' },
  accent:   { fg: 'text-accent',   chipBg: 'bg-accent-bg',    line: 'border-accent-line',    edge: 'border-l-accent' },
  positive: { fg: 'text-positive', chipBg: 'bg-positive-bg',  line: 'border-positive-line',  edge: 'border-l-positive' },
  caution:  { fg: 'text-caution',  chipBg: 'bg-caution-bg',   line: 'border-caution-line',   edge: 'border-l-caution' },
  negative: { fg: 'text-negative', chipBg: 'bg-negative-bg',  line: 'border-negative-line',  edge: 'border-l-negative' },
};

/**
 * Renk vurgulu ikincil buton.
 * Aynı bloktaki eylemlerin birbirinden ayırt edilmesi için çok ince,
 * düşük opaklıkta renkli çerçeve kullanır — dolgu hâlâ nötr kalır,
 * böylece sayfa renk cümbüşüne dönmez.
 * btnSecondary ile birlikte KULLANILMAZ (ikisi de border-color yazar).
 */
export const btnToned = (tone: Tone) =>
  `bg-panel-2 text-crema border ${TONE[tone].line} hover:bg-panel-3`;

/** Satır/kart başındaki kare ikon alanı. */
export const iconChip = (tone: Tone = 'neutral') =>
  `flex items-center justify-center w-8 h-8 shrink-0 rounded-lg ${TONE[tone].chipBg} ${TONE[tone].fg}`;

/* ---------------------------------------------------------------
   BOŞ DURUM
   --------------------------------------------------------------- */

export const emptyState =
  'flex flex-col items-center gap-2.5 text-center py-12 px-6 rounded-xl border border-dashed border-line';
export const emptyText = 'text-[13px] text-fg-3 max-w-[260px] leading-relaxed';

/* ---------------------------------------------------------------
   YÜKLENİYOR
   --------------------------------------------------------------- */

export const spinner =
  'inline-block rounded-full border-2 border-line border-t-crema [animation:rotation_0.7s_linear_infinite]';

export const fullscreenLoader =
  'fixed inset-0 z-[300] flex items-center justify-center bg-espresso/85 backdrop-blur-sm';
