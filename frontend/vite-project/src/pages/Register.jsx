import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axiosConfig';
import '../styles/global.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/auth/register/', {
        email,
        password,
        role,
        first_name: firstName,
        last_name: lastName
      });
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || JSON.stringify(err.response.data));
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="logo-large">Testify</div>
        <div className="tagline">Join the smarter way to learn</div>
      </div>

      <div className="register-right">
        <div className="form-header">
          <h2>Create an account</h2>
          <p>Start your journey with Testify</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>FIRST NAME</label>
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>LAST NAME</label>
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>PASSWORD</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>ROLE</label>
            <div className="role-select">
              <label>
                <input
                  type="radio"
                  value="teacher"
                  checked={role === 'teacher'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Teacher
              </label>
              <label>
                <input
                  type="radio"
                  value="student"
                  checked={role === 'student'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Student
              </label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        <div className="login-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;