import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Logo from "../assets/logo.png";


export const getRole = () => {
  return localStorage.getItem("role");
};

export const setRoleInStorage = (role) => {
  localStorage.setItem("role", role);
};

export const setUserEmail = (email) => {
  localStorage.setItem("userEmail", email);
};

export const setDemoToken = (email) => {
  // Generate a demo token for API authentication
  const token = `demo-token-${email}-${Date.now()}`;
  localStorage.setItem("token", token);
};

export const logout = () => {
  localStorage.clear();
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }

      let role = 'procurement';
      if (email.includes('quality')) {
        role = 'quality';
      } else if (email.includes('store')) {
        role = 'store';
      }

      setRoleInStorage(role);
      setUserEmail(email);
      setDemoToken(email);

      const redirectMap = {
        procurement: '/procurement',
        quality: '/quality',
        store: '/store',
      };

      navigate(redirectMap[role] || '/procurement');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="login-page">

    {/* LEFT PANEL */}
<div className="login-left">
  <div className="login-left-content">

    <div className="login-brand">
      <img src={Logo} alt="SMG Logo" className="login-logo" />
      <h2 className="login-portal">Intern Portal</h2>
      <p className="login-welcome">Welcome</p>
      <p className="login-subtitle">Sign in to your account</p>
    </div>

    {error && <div className="login-error">{error}</div>}

    <form onSubmit={handleLogin} className="login-form">
      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          disabled={loading}
        />
      </div>

      <button type="submit" className="login-button" disabled={loading}>
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>

  </div>
</div>


    {/* RIGHT PANEL */}
    <div className="login-right">
      <div className="login-glass">
  <p className="glass-text">
    Welcome to SMG Intern Portal
  </p>
</div>
    </div>

  </div>
  
);
}
