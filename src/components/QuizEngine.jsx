import React, { useState, useEffect } from 'react'

function renderMarkdown(text) {
  if (!text) return text;
  const parts = text.split(/(`[^`]+`|\*[^*]+\*|_[^_]+_)/);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith('*') && part.endsWith('*'))
      return <strong key={i}>{part.slice(1, -1)}</strong>;
    if (part.startsWith('_') && part.endsWith('_'))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

const QuizEngine = ({ csvUrl, penaltyPoints = -0.5, quizColor = '#2563eb' }) => {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [userAnswer, setUserAnswer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    fetch(csvUrl)
      .then(res => {
        if (!res.ok) throw new Error('Errore nel caricamento del CSV')
        return res.text()
      })
      .then(csv => {
        const lines = csv.trim().split('\n')
        
        if (lines.length < 2) {
          throw new Error('Il CSV è vuoto o non valido')
        }

        const parsed = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            // Parsing CSV più robusto per gestire virgole nelle domande
            const regex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/
            const values = line.split(regex).map(v => v.replace(/^"|"$/g, '').trim())
            
            if (values.length < 4) {
              console.warn(`Riga ${index + 2} ignorata: formato non valido`)
              return null
            }

            return {
              id: values[0] || index + 1,
              domanda: values[1],
              rispostaCorretta: values[2].toUpperCase() === 'TRUE',
              spiegazione: values[3],
              argomento: values[4] || ''
            }
          })
          .filter(q => q !== null)

        if (parsed.length === 0) {
          throw new Error('Nessuna domanda valida trovata nel CSV')
        }

        const shuffled = parsed.sort(() => Math.random() - 0.5)
        setQuestions(shuffled)
        setLoading(false)
      })
      .catch(err => {
        console.error('Errore caricamento quiz:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [csvUrl])

  const handleAnswer = (answer) => {
    if (answered) return
    
    setUserAnswer(answer)
    setAnswered(true)
    
    const isCorrect = answer === questions[currentIndex].rispostaCorretta
    
    if (isCorrect) {
      setScore(score + 1)
    } else {
      setScore(score + penaltyPoints)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setAnswered(false)
      setUserAnswer(null)
    } else {
      setQuizCompleted(true)
    }
  }

  const resetQuiz = () => {
    setCurrentIndex(0)
    setScore(0)
    setAnswered(false)
    setUserAnswer(null)
    setQuizCompleted(false)
    setQuestions(questions.sort(() => Math.random() - 0.5))
  }

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Caricamento domande...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="error">
          <h2>⚠️ Errore</h2>
          <p>{error}</p>
          <p className="error-hint">Verifica che il CSV sia pubblicato correttamente e accessibile.</p>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    const percentage = ((score / questions.length) * 100).toFixed(1)
    const maxScore = questions.length
    const isPositive = score >= 0
    
    let feedback = ''
    if (percentage >= 90) feedback = '🎉 Eccellente!'
    else if (percentage >= 70) feedback = '👍 Molto bene!'
    else if (percentage >= 60) feedback = '✓ Sufficiente'
    else feedback = '📚 Ripassa ancora'

    return (
      <div className="quiz-container">
        <div className="results">
          <h2>{feedback}</h2>
          <div className="score-circle" style={{ borderColor: quizColor }}>
            <div className="score-value" style={{ color: quizColor }}>
              {score.toFixed(1)}
            </div>
            <div className="score-max">/ {maxScore}</div>
          </div>
          <div className="percentage" style={{ color: isPositive ? '#10b981' : '#ef4444' }}>
            {percentage}%
          </div>
          <div className="results-stats">
            <div className="stat">
              <span className="stat-label">Domande totali</span>
              <span className="stat-value">{questions.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Risposte corrette</span>
              <span className="stat-value">{Math.round(score >= 0 ? score : 0)}</span>
            </div>
          </div>
          <button 
            onClick={resetQuiz} 
            className="btn-primary"
            style={{ backgroundColor: quizColor }}
          >
            Ricomincia Quiz
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const isCorrect = userAnswer === currentQuestion.rispostaCorretta
  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="quiz-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%`, backgroundColor: quizColor }}
        />
      </div>

      <div className="quiz-status">
        <span className="question-counter">
          Domanda {currentIndex + 1} di {questions.length}
        </span>
        <span className="score-display" style={{ color: quizColor }}>
          Punteggio: {score.toFixed(1)}
        </span>
      </div>

      {currentQuestion.argomento && (
        <div className="topic-badge" style={{ backgroundColor: `${quizColor}20`, color: quizColor }}>
          {currentQuestion.argomento}
        </div>
      )}

      <h2 className="question">{renderMarkdown(currentQuestion.domanda)}</h2>

      <div className="answers">
        <button
          onClick={() => handleAnswer(true)}
          disabled={answered}
          className={`btn-answer ${
            answered && userAnswer === true
              ? isCorrect ? 'correct' : 'incorrect'
              : ''
          }`}
        >
          <span className="answer-label">VERO</span>
          {answered && userAnswer === true && (
            <span className="answer-icon">{isCorrect ? '✓' : '✗'}</span>
          )}
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={answered}
          className={`btn-answer ${
            answered && userAnswer === false
              ? isCorrect ? 'correct' : 'incorrect'
              : ''
          }`}
        >
          <span className="answer-label">FALSO</span>
          {answered && userAnswer === false && (
            <span className="answer-icon">{isCorrect ? '✓' : '✗'}</span>
          )}
        </button>
      </div>

      {answered && (
        <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-header">
            <span className="feedback-icon">{isCorrect ? '✓' : '✗'}</span>
            <h3>{isCorrect ? 'Risposta corretta!' : 'Risposta sbagliata'}</h3>
          </div>
          <p className="explanation">{renderMarkdown(currentQuestion.spiegazione)}</p>
          <button 
            onClick={handleNext} 
            className="btn-next"
            style={{ backgroundColor: quizColor }}
          >
            {currentIndex < questions.length - 1 ? 'Prossima domanda →' : 'Vedi risultati'}
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizEngine