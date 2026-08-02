import React, { useEffect, useState } from 'react';
import { ref, push, query, orderByChild, limitToLast, onValue, off } from 'firebase/database';
import { db } from '../../api/firebase';
import { auth } from '../../api/auth';
import { BroadcastMessage } from '../../types';
import { Icon } from '../../components/Icon';
import {
  btn, btnLg, btnPrimary, card, screenTitle, sectionLabel, spinner, textarea
} from '../../constants/ui';

const MAX_LENGTH = 300;

export const BroadcastView: React.FC = () => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentJustNow, setSentJustNow] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [history, setHistory] = useState<BroadcastMessage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoadingHistory(false);
      return;
    }
    const historyQuery = query(ref(db, 'broadcasts'), orderByChild('sentAt'), limitToLast(30));
    const listener = onValue(historyQuery, (snapshot) => {
      const val = snapshot.val() || {};
      const list: BroadcastMessage[] = Object.entries(val).map(([id, v]: [string, any]) => ({ id, ...v }));
      list.sort((a, b) => b.sentAt - a.sentAt);
      setHistory(list);
      setLoadingHistory(false);
    });
    return () => off(historyQuery, 'value', listener);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || !db) return;

    setSending(true);
    setSendError(null);
    try {
      await push(ref(db, 'broadcasts'), {
        message: trimmed,
        sentByEmail: auth.currentUser?.email || 'bilinmiyor',
        sentAt: Date.now()
      });
      setMessage('');
      setSentJustNow(true);
      setTimeout(() => setSentJustNow(false), 3000);
    } catch (err) {
      // Sessizce yutmak, gönderilmediğini fark etmeden ekrandan
      // ayrılmaya yol açar — özellikle çevrimdışıyken kritik bir uyarı.
      setSendError('Gönderilemedi. Bağlantınızı kontrol edip tekrar deneyin.');
      console.error('Duyuru gönderilemedi:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3.5">
      <h2 className={`${screenTitle} mt-0.5`}>Duyuru Gönder</h2>

      <form onSubmit={handleSend} className={`${card} p-4 flex flex-col gap-3`}>
        <textarea
          className={`${textarea} h-28`}
          placeholder="Örn: Bugün Newyork Lotus Cheesecake stoktan düştü, satışa sokmayın."
          value={message}
          maxLength={MAX_LENGTH}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        {sendError && <p className="text-[12px] text-negative">{sendError}</p>}
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-fg-3 tnum">{message.length}/{MAX_LENGTH}</span>
          <button type="submit" disabled={sending || !message.trim()} className={`${btn} ${btnPrimary} ${btnLg}`}>
            {sending ? <span className={`${spinner} w-4 h-4`} /> : <Icon name="send" size={16} />}
            {sentJustNow ? 'Gönderildi' : 'Gönder'}
          </button>
        </div>
      </form>

      {/* Kapsam açıklaması: banner'da tekrarlamak yerine burada tek seferde
          anlatıyoruz — kullanıcı gönder ekranına her geldiğinde görsün. */}
      <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl border border-line bg-panel">
        <Icon name="alert" size={14} className="text-fg-3 mt-0.5 shrink-0" />
        <p className="text-[12px] text-fg-3 leading-relaxed">
          Duyuru, uygulaması açık olan veya yakın zamanda kullanılmış cihazlara anında bildirim
          olarak düşer. Tamamen kapatılmış bir telefona ulaşmak için ayrı bir altyapı (Firebase
          Cloud Messaging) gerekir. Gönderilen her duyuru aşağıdaki listede kalıcı olarak durur;
          uygulamayı geç açan biri de buradan görür.
        </p>
      </div>

      <div className={sectionLabel}>Geçmiş duyurular</div>
      <div className={card}>
        {loadingHistory ? (
          <div className="flex justify-center py-6">
            <span className={`${spinner} w-6 h-6`} />
          </div>
        ) : history.length === 0 ? (
          <p className="px-4 py-3.5 text-[13px] text-fg-3">Henüz duyuru gönderilmedi.</p>
        ) : (
          <ul className="p-0 m-0 list-none divide-y divide-line">
            {history.map((b) => (
              <li key={b.id} className="px-4 py-3 flex flex-col gap-1">
                <span className="text-[14px] text-crema leading-relaxed">{b.message}</span>
                <span className="text-[11px] text-fg-3 tnum">
                  {new Date(b.sentAt).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}
                  {' · '}{b.sentByEmail}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
