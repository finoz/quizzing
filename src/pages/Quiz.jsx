import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import QuizEngine from '../components/QuizEngine'
import config from '../config/quizzes.json'

const Quiz = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const quiz = config.quizzes.find(q => q.id === id)

  if (!quiz) {
    return (
      <div className="container">
        <div className="error-page">
          <h1>Quiz non trovato</h1>
          <Link to="/" className="btn-primary">Torna alla Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="quiz-header-bar">
        <button onClick={() => navigate('/')} className="back-button">
          ← Torna ai quiz
        </button>
        <div className="quiz-header-info">
          <span className="quiz-category">{quiz.categoria}</span>
          <h1 className="quiz-page-title">{quiz.titolo}</h1>
        </div>
      </div>

      <QuizEngine 
        csvUrl={quiz.csvUrl}
        penaltyPoints={config.penaltyPoints}
        quizColor={quiz.colore}
      />
    </div>
  )
}

export default Quiz