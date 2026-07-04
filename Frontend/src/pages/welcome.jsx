import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api/axios';

function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const email = location.state?.email || searchParams.get('email') || 'your account';
  const authType = location.state?.authType || (searchParams.get('google') === 'success' ? 'google' : 'manual');
  const title = authType === 'google' ? 'Welcome back!' : 'Welcome aboard!';
  const subtitle = authType === 'google'
    ? 'You signed in successfully with Google.'
    : 'You signed in successfully with your email and password.';

  const handleLogout = async () => {
    try {
      await API.post('/api/v1/auth/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
      navigate('/login');
    }
  };

  return (
    <div className='welcome-shell'>
      <div className='welcome-card'>
        <div className='welcome-icon'>✓</div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <p><strong>{email}</strong></p>
        <button className='primary-btn' onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Welcome;
