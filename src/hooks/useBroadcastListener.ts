import { useEffect, useRef, useState } from 'react';
import { ref, onChildAdded, off, query, orderByChild, startAt } from 'firebase/database';
import { db } from '../api/firebase';
import { BroadcastMessage } from '../types';
import { showLocalNotification } from '../native/broadcastBridge';

/**
 * Bölge Müdürü'nün gönderdiği duyuruları dinler. Mount anından SONRA gelen
 * kayıtları gösterir — uygulama her açıldığında geçmiş duyuruları tekrar
 * banner olarak patlatmamak için `startAt(mount anı)` kullanılıyor. Geçmiş
 * duyurular BroadcastView'daki listede zaten görülebiliyor.
 */
export const useBroadcastListener = (enabled: boolean) => {
  const [banner, setBanner] = useState<BroadcastMessage | null>(null);
  const mountedAtRef = useRef(Date.now());

  useEffect(() => {
    if (!enabled || !db) return;
    const startedAt = mountedAtRef.current;
    const broadcastsQuery = query(ref(db, 'broadcasts'), orderByChild('sentAt'), startAt(startedAt));

    const listener = onChildAdded(broadcastsQuery, (snapshot) => {
      const val = snapshot.val();
      if (!val || !snapshot.key) return;
      const msg: BroadcastMessage = { id: snapshot.key, ...val };
      setBanner(msg);
      showLocalNotification('1401 Coffee — Duyuru', msg.message);
    });

    return () => off(broadcastsQuery, 'child_added', listener);
  }, [enabled]);

  return { banner, dismissBanner: () => setBanner(null) };
};
