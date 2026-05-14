import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

export default function Login() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  if (user) { navigate("/"); return null; }

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="block font-display text-3xl font-light tracking-[0.3em] text-brand-400 uppercase text-center mb-12">
          VELOUR
        </Link>

        <div className="card p-8">
          <h1 className="font-display text-3xl font-light text-dark-50 text-center mb-2">Welcome</h1>
          <p className="font-body text-sm text-dark-400 text-center mb-8">Sign in to continue shopping</p>

          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-dark-700 hover:bg-dark-600 border border-dark-500 hover:border-brand-500/50 text-dark-100 font-body py-3 px-4 transition-all duration-200">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-dark-600" />
            <span className="font-body text-xs text-dark-500">Admin access</span>
            <div className="flex-1 h-px bg-dark-600" />
          </div>

          <p className="font-body text-xs text-dark-400 text-center leading-relaxed">
            Admin? Sign in with your registered Google account. If your email is the designated admin email, you'll be redirected to the admin panel.
          </p>
        </div>

        <p className="font-body text-xs text-dark-500 text-center mt-6">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
