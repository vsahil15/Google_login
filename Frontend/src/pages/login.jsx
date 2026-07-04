import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api/axios';

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userEmail, setUserEmail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const googleStatus = searchParams.get('google');
    const email = searchParams.get('email');

    if (googleStatus === 'success') {
      const welcomeEmail = email || 'your account';
      setSuccessMessage(`Google login successful. Welcome ${welcomeEmail}!`);
      setAuthError('');
      navigate('/welcome', { state: { email: welcomeEmail, authType: 'google' } });
    }
  }, [navigate, searchParams]);

  const verifyEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handlelogin = async (e) => {
    e.preventDefault();
    const email = userEmail.trim().toLowerCase();
    const password = userPass;

    if (email === '' || !verifyEmail(email)) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (password.length < 5) {
      setAuthError('Password must be at least 5 characters.');
      return;
    }

    try {
      const response = await API.post('/api/v1/auth/login', { email, password });
      setSuccessMessage(response.data?.message || 'Login successful');
      setAuthError('');
      navigate('/welcome', { state: { email: response.data?.user?.email || email } });
    } catch (err) {
      setAuthError(err.response?.data?.message || err.message || 'Server connection failed. Try again later.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:4000/api/v1/auth/google';
  };

  return (
    <div className='auth-shell'>
      <div className='auth-card'>
        <div className='auth-card__content'>
          <p className='eyebrow'>Welcome back</p>
          <h2>Sign in to your account</h2>
          <p className='helper-text'>Use your email/password or continue with Google.</p>

          <form onSubmit={handlelogin} className='auth-form'>
            <input
              type='email'
              placeholder='Email address'
              id='user_email'
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <input
              type='password'
              placeholder='Password'
              id='user_pass'
              value={userPass}
              onChange={(e) => setUserPass(e.target.value)}
            />
            <button type='submit' className='primary-btn'>Login</button>
            <button type='button' className='secondary-btn' onClick={handleGoogleLogin}>Continue with Google</button>
          </form>

          {authError ? <p className='message error'>{authError}</p> : null}
          {successMessage ? <p className='message success'>{successMessage}</p> : null}

          <p className='switch-text'>Don’t have an account? <button type='button' className='link-btn' onClick={() => navigate('/register')}>Create one</button></p>
        </div>
      </div>
    </div>
  );
}

export default Login;