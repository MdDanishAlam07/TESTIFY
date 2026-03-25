import { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import '../styles/teacher.css';

const TeacherDashboard = () => {
  const [exams, setExams] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [students, setStudents] = useState([]); // followers
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedExamForStudents, setSelectedExamForStudents] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedExamForAssign, setSelectedExamForAssign] = useState(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchExams();
    fetchTemplates();
    fetchStudents();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get('/exams/');
      setExams(res.data);
    } catch (err) {
      console.error('Failed to fetch exams', err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await axios.get('/exams/templates/');
      setTemplates(res.data);
    } catch (err) {
      console.error('Failed to fetch templates', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/assignments/teacher/students/');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students', err);
    }
  };

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate) return;
    try {
      await axios.post('/exams/create-from-template/', { template_id: selectedTemplate });
      setShowCreateModal(false);
      setSelectedTemplate('');
      fetchExams();
    } catch (err) {
      console.error('Failed to create exam', err);
    }
  };

  const handleRemoveStudent = async (examId, studentId) => {
    if (window.confirm('Remove this student from the exam?')) {
      await axios.post('/assignments/remove-student/', { exam_id: examId, student_id: studentId });
      if (selectedExamForStudents === examId) {
        fetchAssignedStudents(examId);
      }
    }
  };

  const fetchAssignedStudents = async (examId) => {
    const res = await axios.get(`/assignments/exam/${examId}/students/`);
    setAssignedStudents(res.data);
  };

  const fetchResultsForExam = async (examId) => {
    const res = await axios.get(`/assignments/teacher/results/${examId}/`);
    setResults(res.data);
    setActiveTab('results');
  };

  const openAssignModal = (exam) => {
    setSelectedExamForAssign(exam);
    setSelectedStudentIds([]);
    setShowAssignModal(true);
  };

  const handleStudentToggle = (studentId) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssignExam = async () => {
    if (!selectedExamForAssign || selectedStudentIds.length === 0) return;
    try {
      await axios.post('/assignments/assign-exam/', {
        exam_id: selectedExamForAssign.id,
        student_ids: selectedStudentIds,
      });
      alert('Exam assigned successfully');
      setShowAssignModal(false);
    } catch (err) {
      console.error('Failed to assign exam', err);
      alert('Error assigning exam');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>{exams.length}</h3>
                <p>Total Exams</p>
              </div>
              <div className="stat-card">
                <h3>{students.length}</h3>
                <p>Students</p>
              </div>
              <div className="stat-card">
                <h3>0</h3>
                <p>Live Exams</p>
              </div>
            </div>
            <div className="stat-actions">
              <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                Create New Exam
              </button>
              <button className="btn-secondary" onClick={() => setActiveTab('results')}>
                View Analytics
              </button>
            </div>
            <div className="recent-exams">
              <h3>Recent Exams</h3>
              {exams.length === 0 ? (
                <p>No exams created yet.</p>
              ) : (
                exams.slice(0, 5).map((exam) => (
                  <div key={exam.id} className="exam-item">
                    <div className="exam-info">
                      <div className="exam-title">{exam.title}</div>
                      <div className="exam-meta">Created {new Date().toLocaleDateString()}</div>
                    </div>
                    <div className="exam-status status-draft">Draft</div>
                  </div>
                ))
              )}
            </div>
          </>
        );

      case 'myExams':
        return (
          <div>
            <h2>My Exams</h2>
            {exams.length === 0 ? (
              <p>You haven't created any exams yet.</p>
            ) : (
              exams.map((exam) => (
                <div key={exam.id} className="exam-item">
                  <div className="exam-info">
                    <div className="exam-title">{exam.title}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        setSelectedExamForStudents(exam.id);
                        fetchAssignedStudents(exam.id);
                        setActiveTab('students');
                      }}
                    >
                      View Students
                    </button>
                    <button className="btn-secondary" onClick={() => fetchResultsForExam(exam.id)}>
                      View Results
                    </button>
                    <button className="btn-primary" onClick={() => openAssignModal(exam)}>
                      Assign
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 'students':
        return (
          <div>
            <h2>Students assigned to exam</h2>
            {assignedStudents.length === 0 ? (
              <p>No students assigned to this exam.</p>
            ) : (
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Action</th>
                   </tr>
                </thead>
                <tbody>
                  {assignedStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.email}</td>
                      <td>
                        <button
                          className="btn-secondary"
                          onClick={() => handleRemoveStudent(selectedExamForStudents, student.id)}
                        >
                          Remove
                        </button>
                      </td>
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
            <h2>Results</h2>
            {results && results.length > 0 ? (
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Submitted At</th>
                   </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.student_email}>
                      <td>{r.student_email}</td>
                      <td>{r.score}/{r.total}</td>
                      <td>{r.percentage}%</td>
                      <td>{new Date(r.submitted_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No results available.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="teacher-dashboard">
      <div className="sidebar">
        <div className="logo">Testify</div>
        <ul>
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </li>
          <li className={activeTab === 'myExams' ? 'active' : ''} onClick={() => setActiveTab('myExams')}>
            My Exams
          </li>
          <li className={activeTab === 'createExam' ? 'active' : ''} onClick={() => setShowCreateModal(true)}>
            Create Exam
          </li>
          <li className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>
            Students
          </li>
          <li className={activeTab === 'results' ? 'active' : ''} onClick={() => setActiveTab('results')}>
            Results & Analytics
          </li>
          <li onClick={() => setActiveTab('settings')}>Settings</li>
          <li className="signout" onClick={logout}>Sign out</li>
        </ul>
      </div>
      <div className="main-content">
        <div className="header">
          <h1>Welcome, {user?.name || 'Teacher'}</h1>
          <p>
            {new Date().toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        {renderContent()}
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Select Exam </h3>
            <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
              <option value="">Choose an exam</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleCreateFromTemplate}>
                Create
              </button>
              <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Assign Exam: {selectedExamForAssign?.title}</h3>
            <p>Select students to assign:</p>
            {students.length === 0 ? (
              <p>No students are following you yet.</p>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {students.map(student => (
                  <label key={student.id} style={{ display: 'block', margin: '8px 0' }}>
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student.id)}
                      onChange={() => handleStudentToggle(student.id)}
                    />
                    {' '}{student.email}
                  </label>
                ))}
              </div>
            )}
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleAssignExam} disabled={selectedStudentIds.length === 0}>
                Assign
              </button>
              <button className="btn-secondary" onClick={() => setShowAssignModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;