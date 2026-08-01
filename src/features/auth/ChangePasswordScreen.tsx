import React, { useState } from "react";
import { updateUserPassword, AuthUserWithProfile } from "../../api/auth";
import { Icon } from "../../components/Icon";
import { btn, btnLg, btnPrimary, card, field, input, label } from "../../constants/ui";

interface Props {
  user: AuthUserWithProfile;
  onPasswordChanged: () => void;
}

export const ChangePasswordScreen: React.FC<Props> = ({ user, onPasswordChanged }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Şifreniz en az 6 karakter olmalıdır.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    try {
      await updateUserPassword(currentPassword, password);
      onPasswordChanged();
    } catch (err: any) {
      setError(err.message || "Şifre güncellenemedi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-5">
      <div className="w-full max-w-[400px]">
        <div className="mb-7">
          <div className="w-12 h-12 rounded-xl bg-panel-2 border border-line flex items-center justify-center mb-4">
            <Icon name="lock" size={22} className="text-fg-2" />
          </div>
          <h1 className="text-[20px] font-semibold text-crema tracking-tight">Şifreni güncelle</h1>
          <p className="text-fg-3 mt-1.5 text-[14px] leading-relaxed">
            İlk girişine özel geçici şifreni değiştirmen gerekiyor.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={`${card} p-5 flex flex-col gap-3.5`}>
          <div className={field}>
            <span className={label}>Geçici şifren</span>
            <input
              type="password"
              placeholder="Size iletilen şifre"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={input}
            />
          </div>

          <div className={field}>
            <span className={label}>Yeni şifre</span>
            <input
              type="password"
              placeholder="En az 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className={input}
            />
          </div>

          <div className={field}>
            <span className={label}>Yeni şifre (tekrar)</span>
            <input
              type="password"
              placeholder="Tekrar gir"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className={input}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-negative-line bg-negative-bg px-3 py-2.5">
              <Icon name="alert" size={15} className="text-negative mt-px" />
              <span className="text-[13px] text-negative">{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading} className={`${btn} ${btnPrimary} ${btnLg} w-full mt-1.5`}>
            {loading ? "Güncelleniyor…" : "Güncelle ve devam et"}
          </button>
        </form>
      </div>
    </div>
  );
}
