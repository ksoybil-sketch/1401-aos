import React, { useState } from "react";
import { updateUserPassword, AuthUserWithProfile } from "../../api/auth";
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
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-warning/12 border border-warning/25 flex items-center justify-center text-3xl mb-5">
            🔒
          </div>
          <h1 className="text-xl font-extrabold text-content tracking-tight">Güvenlik Uyarısı</h1>
          <p className="text-content-muted mt-2 text-sm leading-relaxed">
            Lütfen ilk girişinize özel geçici şifrenizi değiştirin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={`${card} p-6 flex flex-col gap-4`}>
          <div className={field}>
            <span className={label}>Geçici Şifreniz</span>
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
            <span className={label}>Yeni Şifre</span>
            <input
              type="password"
              placeholder="Yeni Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className={input}
            />
          </div>

          <div className={field}>
            <span className={label}>Yeni Şifre (Tekrar)</span>
            <input
              type="password"
              placeholder="Yeni Şifre (Tekrar)"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className={input}
            />
          </div>

          {error && <p className="text-danger text-[13px] font-medium">{error}</p>}

          <button type="submit" disabled={loading} className={`${btn} ${btnPrimary} ${btnLg} w-full mt-2`}>
            {loading ? "Güncelleniyor..." : "Şifreyi Güncelle ve Devam Et"}
          </button>
        </form>
      </div>
    </div>
  );
}
