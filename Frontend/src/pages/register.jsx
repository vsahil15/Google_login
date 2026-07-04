import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function Register() {
  const navigate = useNavigate();
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [authError, setAuthError] = useState('');

  const verifyEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleregister = async (e) => {
    e.preventDefault();
    const email = newUserEmail.trim().toLowerCase();
    const password = newUserPass;

    if (email === '' || !verifyEmail(email)) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (newUserPass.length < 5) {
      setAuthError('Password must be at least 5 characters.');
      return;
    }

    try {
      await API.post('/api/v1/auth/register', { email, password });
      setAuthError('');
      navigate('/login');
    } catch (err) {
      setAuthError(err.response?.data?.message || err.message || 'Server connection failed. Try again later.');
    }
  };

  return (
    <div className='auth-shell'>
      <div className='auth-card'>
        <div className='auth-card__content'>
          <p className='eyebrow'>Create account</p>
          <h2>Join us today</h2>
          <p className='helper-text'>Sign up with your email and password to get started.</p>

          <form onSubmit={handleregister} className='auth-form'>
            <input
              type='email'
              placeholder='Email address'
              id='user_email'
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
            <input
              type='password'
              placeholder='Password'
              id='user_pass'
              value={newUserPass}
              onChange={(e) => setNewUserPass(e.target.value)}
            />
            <button type='submit' className='primary-btn'>Register</button>
          </form>

          {authError ? <p className='message error'>{authError}</p> : null}

          <p className='switch-text'>Already have an account? <button type='button' className='link-btn' onClick={() => navigate('/login')}>Sign in</button></p>
        </div>
      </div>
    </div>
  );
}

export default Register;