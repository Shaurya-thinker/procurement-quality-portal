import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

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
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <h1 className="logo-text">SMG</h1>
        </div>

        <h2 className="login-heading">Login</h2>
        <p className="login-subtitle">Sign in to your account</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              className="form-input"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-credentials">
          <strong>Demo Credentials:</strong>
          <div>Email: procurement@demo.com (role: procurement)</div>
          <div>Email: quality@demo.com (role: quality)</div>
          <div>Email: store@demo.com (role: store)</div>
          <div>Password: any password</div>
        </div>

        <div className="login-helper-text">
          This is a demo login. Use any password with the demo emails above.
        </div>
      </div>
    </div>
  );
}
