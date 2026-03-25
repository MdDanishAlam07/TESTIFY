import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css'; 

const LandingPage = () => {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <span className="logo-icon">✓</span>
            <span className="logo-text">Testify</span>
          </div>
          <div className="nav-menu">
            <a href="#features" className="nav-link">Features</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#footer" className="nav-link">Contact</a>
          </div>
          <div className="nav-buttons">
            <Link to="/login" className="btn btn-outline">SIGN IN</Link>
            <Link to="/register" className="btn btn-primary">SIGN UP</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>AI-Powered Online Exam Proctoring</h1>
            <p>Take exams online with confidence. Advanced AI monitoring ensures integrity while protecting student privacy.</p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-large">Get Started Free</Link>
              <a href="#features" className="btn btn-outline btn-large">Learn More</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="geometric shape1"></div>
            <div className="geometric shape2"></div>
            <div className="geometric shape3"></div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <h2>Why Choose Testify?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Facial Recognition</h3>
            <p>Verify student identity with advanced facial recognition technology.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👁️</div>
            <h3>Presence Detection</h3>
            <p>Real-time monitoring to ensure student presence throughout the exam.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚨</div>
            <h3>Multiple Face Detection</h3>
            <p>Automatically detect when multiple faces appear in frame.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Head Pose Estimation</h3>
            <p>Monitor suspicious head movements and gaze direction.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Smart Timer</h3>
            <p>Automatic exam submission when time expires.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Comprehensive insights into student performance and exam metrics.</p>
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <div className="about-content">
          <h2>Secure Online Testing</h2>
          <p>Testify combines advanced AI technology with privacy-first design to provide secure, fair, and accessible online exams.</p>
          <ul className="about-list">
            <li>✓ Military-grade encryption for all data</li>
            <li>✓ GDPR and FERPA compliant</li>
            <li>✓ Real-time proctoring alerts</li>
            <li>✓ Detailed activity logs</li>
            <li>✓ Support for multiple question types</li>
            <li>✓ Instant result calculation</li>
          </ul>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Transform Your Exams?</h2>
        <p>Join hundreds of institutions using Testify for secure online testing.</p>
        <Link to="/register" className="btn btn-primary btn-large">Start Free Trial</Link>
      </section>

      <footer id='footer' className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Testify</h4>
            <p>AI-Powered Exam Proctoring System</p>
          </div>
          <div className="footer-section">
            <h4>Links</h4>
            <a href="#about">About</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>

          
          <div className="footer-section">
            <h4>Developer</h4>
            <a href="https://www.linkedin.com/in/mohammad-danish-alam-8b062a328/">Md Danish Alam </a>
            <a href="#privacy">Faizan </a>
            <a href="#terms">Arqame</a>
            <a href="#privacy">Sahil  </a>
            <a href="#terms">Sajid</a>

          </div>


          <div className="footer-section">
            <h4>Contact</h4>
            <p>info@testify.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Testify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};






export default LandingPage;