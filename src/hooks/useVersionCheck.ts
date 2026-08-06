import { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../api/firebase';
import { APP_VERSION, isNewerVersion } from '../constants/version';

const DISMISSED_KEY = '1401aos_dismissed_version';

interface UpdateInfo {
  latestVersion: string;
  note?: string;
}

/**
 * appConfig/latestVersion, yeni bir APK dağıtıldığında elle güncellenir
 * (bkz. Bölüm: sürüm yayınlama süreci). Uygulama mağaza üzerinden dağıtılmadığı
 * (yan yükleme) için otomatik güncelleme yok — bu sadece "yeni sürüm var, iste"
 * bilgisini gösterir.
 */
export const useVersionCheck = (enabled: boolean) => {
  const [update, setUpdate] = useState<UpdateInfo | null>(null);
  const [dismissed, setDismissed] = useState<string | null>(() => localStorage.getItem(DISMISSED_KEY));

  useEffect(() => {
    if (!enabled || !db) return;
    const configRef = ref(db, 'appConfig');
    const listener = onValue(configRef, (snapshot) => {
      const val = snapshot.val();
      if (!val?.latestVersion) return;
      if (isNewerVersion(APP_VERSION, val.latestVersion)) {
        setUpdate({ latestVersion: val.latestVersion, note: val.updateNote });
      } else {
        setUpdate(null);
      }
    });
    return () => off(configRef, 'value', listener);
  }, [enabled]);

  const dismiss = () => {
    if (!update) return;
    localStorage.setItem(DISMISSED_KEY, update.latestVersion);
    setDismissed(update.latestVersion);
  };

  const visible = update !== null && update.latestVersion !== dismissed;

  return { updateInfo: visible ? update : null, dismiss };
};
