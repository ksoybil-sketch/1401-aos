export interface BarcodeLookupResult {
  name: string;
  source: 'openfoodfacts' | 'upcitemdb';
}

async function fetchWithTimeout(url: string, ms = 6000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function lookupProductByBarcode(barcode: string): Promise<BarcodeLookupResult | null> {
  try {
    const res = await fetchWithTimeout(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await res.json();
    if (data.status === 1 && data.product) {
      const pName: string = data.product.product_name_tr || data.product.product_name || '';
      const pBrand: string = data.product.brands ? data.product.brands.split(',')[0] : '';
      let fullName = pName.trim();
      if (pBrand && !fullName.toLowerCase().includes(pBrand.toLowerCase())) {
        fullName = `${pBrand} ${fullName}`.trim();
      }
      if (fullName) return { name: fullName, source: 'openfoodfacts' };
    }
  } catch {
    // openfoodfacts başarısız oldu, upcitemdb'ye düş
  }

  try {
    const res = await fetchWithTimeout(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`);
    const data = await res.json();
    if (data.code === 'OK' && data.items?.length > 0 && data.items[0].title) {
      return { name: data.items[0].title, source: 'upcitemdb' };
    }
  } catch {
    // iki kaynak da başarısız oldu
  }

  return null;
}
