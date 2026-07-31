import React, { useState } from "react";
import { updateUserPassword, AuthUserWithProfile } from "../../api/auth";

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
    <div className="flex flex-col h-screen p-5 bg-gray-50 items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Güvenlik Uyarısı</h1>
        <p className="text-gray-500 mt-2 font-medium">Lütfen ilk girişinize özel geçici şifrenizi değiştirin.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <input
          type="password"
          placeholder="Geçici Şifreniz (size iletilen)"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full p-4 border border-gray-200 rounded-lg text-[15px] bg-white text-gray-900 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all"
        />
        <input
          type="password"
          placeholder="Yeni Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          className="w-full p-4 border border-gray-200 rounded-lg text-[15px] bg-white text-gray-900 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all"
        />
        <input
          type="password"
          placeholder="Yeni Şifre (Tekrar)"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          className="w-full p-4 border border-gray-200 rounded-lg text-[15px] bg-white text-gray-900 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all"
        />

        {error && <p className="text-red-500 text-sm font-medium mt-1">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 mt-2 bg-[#141210] text-[#F5F0E8] rounded-lg text-[15px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
        >
          {loading ? "Güncelleniyor..." : "Şifreyi Güncelle ve Devam Et"}
        </button>
      </form>
    </div>
  );
}
