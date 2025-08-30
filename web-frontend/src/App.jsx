import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './services/axios';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  try {
    // Step 1: Get CSRF token from Laravel Sanctum
    await axiosInstance.get('/sanctum/csrf-cookie');

    // Step 2: Send login request
    const response = await axiosInstance.post('/api/login', {
      username,
      password
    });

    const { token, dashboard } = response.data;

    // Step 3: Save token in localStorage (key matches axios.js)
    localStorage.setItem("authToken", token);

    // (Optional) also set it immediately for this session
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Step 4: Redirect to role-based dashboard
    navigate(dashboard);

  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    setError(error.response?.data?.message || 'Login failed');
  }
};

  return (
    <div className="login-container">
      <h1>moqoqo</h1>
      <form id="loginForm" onSubmit={handleLogin}>
        <input className='input-container'
          type="text"
          id="username"
          placeholder="Username"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input className='input-container'
          type="password"
          id="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className='submit-btn'>Login</button>
        <p id="error" className="error-msg">{error}</p>
      </form>

      <div className="forgot-password-container">
        <a href="/forgot-password">Forgotten Password?</a>
      </div>  
    </div>
  );
}

export default App;
