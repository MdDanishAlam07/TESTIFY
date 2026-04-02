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
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (role === 'student' && !profilePhoto) {
      setError('Please upload a photo.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    if (profilePhoto) formData.append('profile_photo', profilePhoto);

    try {
      await axios.post('/auth/register/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
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

          {role === 'student' && (
            <div className="input-group">
              <label>PROFILE PHOTO</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
          )}

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