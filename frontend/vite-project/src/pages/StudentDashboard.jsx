import { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/teacher.css'; // reuse same styles

const StudentDashboard = () => {
  const [assignedExams, setAssignedExams] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [following, setFollowing] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAssignedExams(),
        fetchMyResults(),
        fetchFollowing(),
        fetchAllTeachers(),
      ]);
      setLoading(false);
    };
    fetchAllData();
  }, []);

  const fetchAssignedExams = async () => {
    try {
      const res = await axios.get('/assignments/student/exams/');
      setAssignedExams(res.data);
    } catch (err) {
      console.error('Failed to fetch assigned exams', err);
      setError('Could not load your exams. Please try again later.');
    }
  };

  const fetchMyResults = async () => {
    try {
      const res = await axios.get('/results/my-results/');
      setMyResults(res.data);
    } catch (err) {
      console.error('Failed to fetch results', err);
    }
  };

  const fetchFollowing = async () => {
    try {
      const res = await axios.get('/assignments/my-following/');
      setFollowing(res.data);
    } catch (err) {
      console.error('Failed to fetch following', err);
    }
  };

  const fetchAllTeachers = async () => {
    try {
      const res = await axios.get('/assignments/teachers/');
      setAllTeachers(res.data);
    } catch (err) {
      console.error('Failed to fetch teachers', err);
    }
  };

  const handleFollow = async (teacherId) => {
    try {
      await axios.post('/assignments/follow/', { teacher_id: teacherId });
      await fetchFollowing(); // refresh following list
      setError('');
    } catch (err) {
      setError('Failed to follow teacher');
    }
  };

  const handleUnfollow = async (teacherId) => {
    try {
      await axios.post('/assignments/unfollow/', { teacher_id: teacherId });
      await fetchFollowing();
      setError('');
    } catch (err) {
      setError('Failed to unfollow');
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading dashboard...</div>;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>{assignedExams.length}</h3>
                <p>Available Exams</p>
              </div>
              <div className="stat-card">
                <h3>{myResults.length}</h3>
                <p>Completed Exams</p>
              </div>
              <div className="stat-card">
                <h3>{following.length}</h3>
                <p>Teachers Followed</p>
              </div>
            </div>
            <div className="stat-actions">
              <button className="btn-primary" onClick={() => setActiveTab('exams')}>
                View Available Exams
              </button>
              <button className="btn-secondary" onClick={() => setActiveTab('results')}>
                View Results
              </button>
            </div>
          </>
        );

      case 'exams':
        return (
          <div>
            <h2>Available Exams</h2>
            {assignedExams.length === 0 ? (
              <p>No exams assigned yet. Follow teachers to get exams.</p>
            ) : (
              assignedExams.map(exam => (
                <div key={exam.id} className="exam-item">
                  <div className="exam-info">
                    <div className="exam-title">{exam.title}</div>
                  </div>
                  <button className="btn-primary" onClick={() => navigate(`/exam/${exam.id}`)}>
                    Take Exam
                  </button>
                </div>
              ))
            )}
          </div>
        );

      case 'myExams':
        return (
          <div>
            <h2>My Completed Exams</h2>
            {myResults.length === 0 ? (
              <p>You haven't taken any exams yet.</p>
            ) : (
              <table className="results-table">
                <thead>
                  <tr><th>Exam Title</th><th>Score</th><th>Percentage</th><th>Submitted</th></tr>
                </thead>
                <tbody>
                  {myResults.map(r => (
                    <tr key={r.exam_title}>
                      <td>{r.exam_title}</td>
                      <td>{r.score}/{r.total}</td>
                      <td>{r.percentage}%</td>
                      <td>{new Date(r.submitted_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      case 'results':
        return (
          <div>
            <h2>Results & Analytics</h2>
            {myResults.length === 0 ? (
              <p>No results yet.</p>
            ) : (
              <>
                <h3>Performance Overview</h3>
                <table className="results-table">
                  <thead>
                    <tr><th>Exam Title</th><th>Score</th><th>Percentage</th><th>Submitted</th></tr>
                  </thead>
                  <tbody>
                    {myResults.map(r => (
                      <tr key={r.exam_title}>
                        <td>{r.exam_title}</td>
                        <td>{r.score}/{r.total}</td>
                        <td>{r.percentage}%</td>
                        <td>{new Date(r.submitted_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        );

      case 'following':
        return (
          <div>
            <h2>Teachers I Follow</h2>
            {following.length === 0 ? (
              <p>You are not following any teachers yet.</p>
            ) : (
              <table className="students-table">
                <thead><tr><th>Teacher Email</th><th>Action</th></tr></thead>
                <tbody>
                  {following.map(t => (
                    <tr key={t.id}>
                      <td>{t.email}</td>
                      <td><button className="btn-secondary" onClick={() => handleUnfollow(t.id)}>Unfollow</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h2>All Teachers</h2>
            <table className="students-table">
              <thead><tr><th>Teacher Email</th><th>Action</th></tr></thead>
              <tbody>
                {allTeachers.map(teacher => {
                  const isFollowing = following.some(f => f.id === teacher.id);
                  return (
                    <tr key={teacher.id}>
                      <td>{teacher.email}</td>
                      <td>
                        {isFollowing ? (
                          <button className="btn-secondary" onClick={() => handleUnfollow(teacher.id)}>Unfollow</button>
                        ) : (
                          <button className="btn-primary" onClick={() => handleFollow(teacher.id)}>Follow</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      case 'settings':
        return <div>Settings page (coming soon).</div>;

      default:
        return null;
    }
  };

  return (
    <div className="teacher-dashboard">
      <div className="sidebar">
        <div className="logo">Testify</div>
        <ul>
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</li>
          <li className={activeTab === 'exams' ? 'active' : ''} onClick={() => setActiveTab('exams')}>Exams</li>
          <li className={activeTab === 'myExams' ? 'active' : ''} onClick={() => setActiveTab('myExams')}>My Exams</li>
          <li className={activeTab === 'results' ? 'active' : ''} onClick={() => setActiveTab('results')}>Results & Analytics</li>
          <li className={activeTab === 'following' ? 'active' : ''} onClick={() => setActiveTab('following')}>Following</li>
          <li onClick={() => setActiveTab('settings')}>Settings</li>
          <li className="signout" onClick={logout}>Logout</li>
        </ul>
      </div>
      <div className="main-content">
        <div className="header">
          <h1>Welcome, {user?.name || 'Student'}</h1>
          <p>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;