import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import '../styles/exam.css'; 

const ExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); 
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`/exams/${examId}/questions/`);
        setQuestions(res.data);
       
        setAnswers({});
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch exam', err);
        navigate('/student');
      }
    };
    fetchQuestions();
  }, [examId, navigate]);


  useEffect(() => {
    if (submitted || loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, loading]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswer = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);

    const payload = {
      exam_id: examId,
      answers: Object.entries(answers).map(([qid, optId]) => ({
        question_id: parseInt(qid),
        option_id: optId,
      })),
    };

    try {
      const res = await axios.post('/results/submit/', payload);
      const score = res.data.score;
      const total = questions.length;
      const percentage = ((score / total) * 100).toFixed(2);
      setResult({ score, total, percentage });
    } catch (err) {
      console.error('Submission failed', err);
      alert('Error submitting exam. Please try again.');
      setSubmitted(false);
    }
  };

  if (loading) return <div className="exam-container">Loading questions...</div>;
  if (submitted && result) {
    return (
      <div className="exam-container result-container">
        <h1>Result</h1>
        <div className="score">{result.score} / {result.total}</div>
        <div className="correct-wrong">
          <p>Correct: {result.score}</p>
          <p>Wrong: {result.total - result.score}</p>
        </div>
        <div className="percentage">Percentage: {result.percentage}%</div>
        <button className="btn-primary" onClick={() => navigate('/student')}>Back to Dashboard</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return <div>Error loading question</div>;

  return (
    <div className="exam-container">
      <div className="exam-header">
        <div className="timer">Time: {formatTime(timeLeft)}</div>
        <div className="question-counter">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="question-text">
        {currentIndex + 1}. {currentQuestion.text}
      </div>

      <div className="options">
        {currentQuestion.options.map(opt => (
          <label key={opt.id} className="option">
            <input
              type="radio"
              name={`q${currentQuestion.id}`}
              value={opt.id}
              checked={answers[currentQuestion.id] === opt.id}
              onChange={() => handleAnswer(currentQuestion.id, opt.id)}
            />
            {opt.text}
          </label>
        ))}
      </div>

      <div className="navigation">
        <button onClick={goPrev} disabled={currentIndex === 0} className="btn-secondary">
          Previous
        </button>
        <button onClick={goNext} disabled={currentIndex === questions.length - 1} className="btn-secondary">
          Next
        </button>
        <button onClick={handleSubmit} className="btn-primary">
          Submit Exam
        </button>
      </div>
    </div>
  );
};

export default ExamPage;