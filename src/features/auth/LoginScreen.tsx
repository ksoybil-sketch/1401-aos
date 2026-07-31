import React, { useState } from "react";
import { signIn } from "../../api/auth";

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      // App.tsx içindeki watchAuthState yönlendirmeyi yapacak.
    } catch (err: any) {
      setError(mapAuthError(err.code));
    } finally {
      setLoading(false);
    }
  }

  function mapAuthError(code: string) {
    switch (code) {
      case "auth/invalid-email":
        return "Geçersiz e-posta adresi.";
      case "auth/user-disabled":
        return "Bu hesap devre dışı bırakılmış.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "E-posta veya şifre hatalı.";
      case "auth/too-many-requests":
        return "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar dene.";
      default:
        return "Giriş yapılamadı. Lütfen tekrar dene.";
    }
  }

  return (
    <div className="flex flex-col h-screen p-5 bg-gray-50 items-center justify-center">
      <div className="text-center mb-10">
        <img src="/icons/logo_goat.svg" alt="1401 Coffee" className="w-20 h-20 mx-auto drop-shadow-md" />
        <h1 className="text-[#F5F0E8] mt-5 text-2xl font-bold bg-[#141210] px-4 py-2 rounded-lg shadow-sm inline-block">
          1401 Coffee
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Yönetici Girişi</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          className="w-full p-4 border border-gray-200 rounded-lg text-[15px] bg-white text-gray-900 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full p-4 border border-gray-200 rounded-lg text-[15px] bg-white text-gray-900 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all"
        />

        {error && <p className="text-red-500 text-sm font-medium mt-1">{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full p-4 mt-2 bg-[#141210] text-[#F5F0E8] rounded-lg text-[15px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}
