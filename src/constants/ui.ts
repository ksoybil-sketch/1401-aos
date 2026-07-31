/**
 * 1401 AOS — Ortak tasarım sistemi.
 *
 * Buradaki her sabit, saf Tailwind utility class dizesidir. Amaç, aynı
 * görsel dilin (koyu tema + cam yüzey + altın vurgu) her ekranda birebir
 * aynı şekilde uygulanmasıdır: bir butonun yüksekliği/kavisi/gölgesi tek
 * yerden değişir, ekranlar kendi ad-hoc stillerini üretmez.
 */

/* ---------------------------------------------------------------
   YÜZEYLER
   --------------------------------------------------------------- */

/** Temel cam yüzey: yarı saydam dolgu + ince kenarlık + arkaplan bulanıklığı. */
export const glass = 'bg-glass backdrop-blur-xl border border-hairline';

/** Standart içerik kartı. */
export const card =
  'bg-glass backdrop-blur-xl border border-hairline rounded-3xl shadow-[0_10px_40px_-12px_rgba(0,0,0,0.7)]';

/** Tıklanabilir kart (liste satırı, şube kartı vb.). */
export const cardInteractive = `${card} cursor-pointer transition-all duration-200 hover:border-hairline-strong hover:bg-glass-2 active:scale-[0.99]`;

/** Kart iç boşluğu — tüm kartlarda aynı olsun diye. */
export const cardPad = 'p-5';

/* ---------------------------------------------------------------
   BUTONLAR
   Kullanım: `${btn} ${btnPrimary} ${btnLg}`
   --------------------------------------------------------------- */

export const btn =
  'inline-flex items-center justify-center gap-2.5 font-semibold rounded-2xl cursor-pointer select-none transition-all duration-200 active:scale-[0.97] disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap';

/** Ana eylem: altın gradyan, koyu metin, sıcak parıltı. */
export const btnPrimary =
  'bg-gradient-to-b from-gold-soft to-gold text-night border border-gold-soft/40 shadow-[0_8px_24px_-8px_rgba(217,182,95,0.65)] hover:brightness-[1.08]';

/** İkincil eylem: cam yüzey. */
export const btnSecondary =
  'bg-glass-2 text-content border border-hairline hover:bg-glass-3 hover:border-hairline-strong';

/** Yıkıcı eylem: kırmızı tonlu cam. */
export const btnDanger =
  'bg-danger-bg text-danger border border-danger-border hover:bg-danger/20';

/** Çerçevesiz eylem (metin butonu). */
export const btnGhost =
  'bg-transparent text-content-secondary border border-transparent hover:bg-glass-2 hover:text-content';

export const btnLg = 'h-14 px-6 text-[15px]';
export const btnMd = 'h-11 px-4 text-sm';
export const btnSm = 'h-9 px-3.5 text-xs rounded-xl';

/** Dairesel ikon butonu (modal kapatma, header aksiyonları). */
export const iconBtn =
  'inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-glass-2 border border-hairline text-content-secondary cursor-pointer transition-all duration-200 hover:bg-glass-3 hover:text-content active:scale-90 disabled:opacity-45';

/* ---------------------------------------------------------------
   FORM ELEMANLARI
   --------------------------------------------------------------- */

export const input =
  'w-full h-13 px-4 rounded-2xl bg-surface-0/70 border border-hairline text-content text-[15px] transition-all duration-200 placeholder:text-content-placeholder focus:outline-none focus:border-gold/55 focus:ring-2 focus:ring-gold/15 disabled:opacity-60';

/** Çok satırlı alan. */
export const textarea = `${input} h-28 py-3.5 resize-y leading-relaxed`;

export const label =
  'text-[11px] font-bold uppercase tracking-[0.09em] text-content-muted';

/** Etiket + alan sarmalayıcı. */
export const field = 'flex flex-col gap-2';

/* ---------------------------------------------------------------
   MODAL
   Mobilde alttan yükselen sayfa, geniş ekranda ortalanmış diyalog.
   --------------------------------------------------------------- */

export const modalOverlay =
  'fixed inset-0 z-[200] bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center animate-[fadeIn_0.2s_ease]';

export const modalPanel =
  'w-full max-w-[480px] max-h-[92vh] overflow-y-auto bg-surface-deep/95 backdrop-blur-2xl border border-hairline rounded-t-[28px] sm:rounded-[28px] shadow-[0_-10px_60px_rgba(0,0,0,0.8)] animate-[slideUp_0.35s_cubic-bezier(0.16,1,0.3,1)]';

/** Mobilde üstteki sürükleme çubuğu göstergesi. */
export const modalGrabber = 'w-10 h-1 rounded-full bg-hairline-strong mx-auto mt-3 mb-1 sm:hidden';

export const modalHeader =
  'flex items-center justify-between gap-3 px-6 pt-5 pb-4 border-b border-hairline';

export const modalTitle = 'text-lg font-bold text-content tracking-tight';

export const modalBody = 'px-6 py-6';

/* ---------------------------------------------------------------
   TİPOGRAFİ / BÖLÜM BAŞLIKLARI
   --------------------------------------------------------------- */

/** Bölüm üstü küçük etiket ("GENEL DURUM" gibi). */
export const eyebrow =
  'text-[11px] font-bold uppercase tracking-[0.14em] text-content-muted';

/** Ekran başlığı. */
export const screenTitle = 'text-[22px] font-extrabold text-content tracking-tight';

/* ---------------------------------------------------------------
   ROZETLER / ÇİPLER
   --------------------------------------------------------------- */

export const badge =
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border';

/** Filtre sekmesi (seçili / seçili değil). */
export const chip =
  'px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 border';
export const chipActive = 'bg-gold text-night border-gold shadow-[0_4px_16px_-6px_rgba(217,182,95,0.7)]';
export const chipIdle = 'bg-glass text-content-secondary border-hairline hover:bg-glass-2 hover:text-content';

/* ---------------------------------------------------------------
   VURGU RENKLERİ
   Aksiyon kutucukları ve ikon rozetleri için tek kaynak. Böylece
   "mavi kutucuk" her ekranda aynı maviyi kullanır.
   --------------------------------------------------------------- */

export type Accent = 'gold' | 'info' | 'success' | 'warning' | 'danger' | 'violet';

interface AccentStyle {
  /** İkon rozetinin dolgusu + metin rengi. */
  badge: string;
  /** Vurgulu metin rengi. */
  text: string;
  /** Kutucuk kenarlığı (hover'da belirginleşir). */
  ring: string;
}

export const ACCENT: Record<Accent, AccentStyle> = {
  gold:    { badge: 'bg-gold/15 text-gold',       text: 'text-gold',    ring: 'hover:border-gold/40' },
  info:    { badge: 'bg-info/15 text-info',       text: 'text-info',    ring: 'hover:border-info/40' },
  success: { badge: 'bg-success/15 text-success', text: 'text-success', ring: 'hover:border-success/40' },
  warning: { badge: 'bg-warning/15 text-warning', text: 'text-warning', ring: 'hover:border-warning/40' },
  danger:  { badge: 'bg-danger/15 text-danger',   text: 'text-danger',  ring: 'hover:border-danger/40' },
  violet:  { badge: 'bg-violet/15 text-violet',   text: 'text-violet',  ring: 'hover:border-violet/40' },
};

/** Dashboard aksiyon kutucuğu — ikon rozeti + başlık içerir. */
export const actionTile = (accent: Accent) =>
  `${cardInteractive} ${ACCENT[accent].ring} ${cardPad} flex items-center gap-4 text-left w-full`;

/** İkon rozeti (aksiyon kutucuklarının solundaki kare ikon alanı). */
export const tileBadge = (accent: Accent) =>
  `flex items-center justify-center w-11 h-11 shrink-0 rounded-2xl text-xl ${ACCENT[accent].badge}`;

/* ---------------------------------------------------------------
   BOŞ DURUM
   --------------------------------------------------------------- */

export const emptyState =
  'flex flex-col items-center gap-3 text-center py-14 px-6 rounded-3xl border border-dashed border-hairline bg-glass/50';
export const emptyText = 'text-[13px] text-content-muted max-w-[260px] leading-relaxed';

/* ---------------------------------------------------------------
   YÜKLENİYOR
   --------------------------------------------------------------- */

export const spinner =
  'inline-block rounded-full border-2 border-hairline border-t-gold [animation:rotation_0.8s_linear_infinite]';

export const fullscreenLoader =
  'fixed inset-0 z-[10000] flex items-center justify-center bg-void/80 backdrop-blur-md';
