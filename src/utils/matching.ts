/**
 * Akıllı Ürün İsmi Eşleştirme & Normalleştirme Motoru (Fuzzy Matching Engine)
 * "HB Mag", "Trible Chocolate Cookie", "Mermer Kek", "NY Lotus" vb.
 * yazım farklılıklarını ve kısaltmaları otomatik olarak doğru isimle eşleştirir.
 */

export const ALIAS_MAP: Record<string, string> = {
  "hb mag": "honey berry magnolia",
  "hb pasta": "honey berry pasta",
  "hb rulo": "hp rulo",
  "lotus mag": "lotus magnolya",
  "ny lotus cheesecake": "newyork lotus cheesecake",
  "opera kahveli pasata": "opera kahveli pasta",
  "paris brest -çilekli": "çilekli paris brest",
  "çilekli paris breast": "çilekli paris brest",
  "trible chocolate cookie": "triple chocolate cookie",
  "mermer kek": "kek marble",
  "limonlu kek": "kek limonlu",
  "spoonfull": "spoonful",
  "glutensiz acıbadem": "d. glutensiz acıbadem kurabiye"
};

export function normalizeProductName(name: string): string {
  if (!name) return "";
  let clean = name.toLowerCase().trim();

  // Bilinen kısaltma ve typo haritasından kontrol et
  if (ALIAS_MAP[clean]) {
    clean = ALIAS_MAP[clean];
  }

  // Gereksiz ön ve son ekleri kaldır
  clean = clean
    .replace(/^d\.\s*/, '')
    .replace(/^d\s+/, '')
    .replace(/%\s*100\s*pişmiş\s*/, '')
    .replace(/\s*80g\s*-\s*dilim$/, '')
    .replace(/\s*120\s*gr$/, '')
    .replace(/pasata$/, 'pasta')
    .replace(/breast$/, 'brest')
    .trim();

  return clean;
}

export function areProductsMatching(name1: string, name2: string): boolean {
  if (!name1 || !name2) return false;
  
  const norm1 = normalizeProductName(name1);
  const norm2 = normalizeProductName(name2);

  if (norm1 === norm2) return true;

  // Biri diğerini içeriyor mu? (Örn: "Newyork Lotus Cheesecake" ile "NY Lotus Cheesecake")
  if (norm1.length > 3 && norm2.length > 3) {
    if (norm1.includes(norm2) || norm2.includes(norm1)) {
      return true;
    }
  }

  // Kelime kümesi eşleşmesi
  const words1 = norm1.split(/\s+/).filter(w => w.length > 2);
  const words2 = norm2.split(/\s+/).filter(w => w.length > 2);
  const commonWords = words1.filter(w => words2.includes(w));

  if (words1.length > 0 && words2.length > 0) {
    const matchRatio = (commonWords.length * 2) / (words1.length + words2.length);
    return matchRatio >= 0.6;
  }

  return false;
}
