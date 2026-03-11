import React from 'react'
import { useNavigate } from 'react-router-dom'
import config from '../config/quizzes.json'

const Esercitazioni = () => {
  const { esercitazioni } = config
  const navigate = useNavigate()

  return (
    <div className="container">
      <div className="quiz-header-bar">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Home
        </button>
        <div className="quiz-header-info">
          <h1 className="quiz-page-title">Esercitazioni pratiche</h1>
        </div>
      </div>

      <div className="quiz-grid">
        {esercitazioni.map(es => (
          <a
            key={es.id}
            href={es.url}
            className="quiz-card"
            style={{ borderLeftColor: es.colore }}
          >
            <div className="quiz-icon">{es.icona}</div>
            <div className="quiz-content">
              <h3 className="quiz-title">{es.titolo}</h3>
              <p className="quiz-description">{es.descrizione}</p>
            </div>
            <div className="quiz-arrow">→</div>
          </a>
        ))}
      </div>

      <footer className="footer">
        <p>Liceo Villoresi - Informatica</p>
        <p>© {new Date().getFullYear()} by FNZ</p>
      </footer>
    </div>
  )
}

export default Esercitazioni
