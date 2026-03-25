import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axiosConfig';
import '../styles/global.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('teacher');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('Submitting with:', { email, password });

    try {
      const res = await axios.post('/auth/login/', { email, password });
      console.log('Response:', res.data);

      const { token, role, first_name, last_name } = res.data;
      login(token, role, first_name, last_name);

      if (role === 'teacher') navigate('/teacher');
      else navigate('/student');

    } catch (err) {
      console.log('Login error:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Login failed');
      } else {
        setError('Network error. Is the backend running?');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo-large">Testify</div>
        <div className="tagline">Smarter exams for smarter classrooms</div>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Create MCQ Exams</h3>
            <p>Build and schedule tests in minutes</p>
          </div>
          <div className="feature-card">
            <h3>Real-time Analytics</h3>
            <p>Track student performance live</p>
          </div>
          <div className="feature-card">
            <h3>Secure & Fair</h3>
            <p>Anti-cheating and time controls</p>
          </div>
          <div className="feature-card">
            <h3>Exam administration</h3>
            <p>Remote and proctored exam</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="form-header">
          <h2>Welcome back</h2>
          <p>Sign in to your Testify account</p>
        </div>

        <div className="role-toggle">
          <button
            className={role === 'teacher' ? 'active' : ''}
            onClick={() => setRole('teacher')}
          >
            Teacher
          </button>
          <button
            className={role === 'student' ? 'active' : ''}
            onClick={() => setRole('student')}
          >
            Student
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder={role === 'teacher' ? 'teacher@college.edu' : 'student@college.edu'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>PASSWORD</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="signin-btn">
            Sign in as {role === 'teacher' ? 'Teacher' : 'Student'}
          </button>
        </form>

        <div className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;