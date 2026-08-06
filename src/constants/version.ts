/** android/app/build.gradle içindeki versionName ile senkron tutulmalı. */
export const APP_VERSION = '22.0';

/** "22.0" gibi basit x.y sürüm dizgilerini karşılaştırır. b, a'dan büyükse true döner. */
export const isNewerVersion = (a: string, b: string): boolean => {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (nb > na) return true;
    if (nb < na) return false;
  }
  return false;
};
