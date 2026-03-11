import React from 'react'
import { Link } from 'react-router-dom'
import config from '../config/quizzes.json'

const Home = () => {
  const { appTitle, quizzes } = config

  // Raggruppa per categoria
  const quizzesByCategory = quizzes.reduce((acc, quiz) => {
    if (!acc[quiz.categoria]) {
      acc[quiz.categoria] = []
    }
    acc[quiz.categoria].push(quiz)
    return acc
  }, {})

  return (
    <div className="container">
      <header className="header">
        <h1>{appTitle}</h1>
        <p className="subtitle">Scegli un quiz per iniziare l'esercitazione</p>
      </header>

      {config.esercitazioni?.length > 0 && (
        <section className="category-section">
          <h2 className="category-title">Esercitazioni pratiche</h2>
          <div className="quiz-grid">
            <Link to="/esercitazioni" className="quiz-card" style={{ borderLeftColor: '#10b981' }}>
              <div className="quiz-icon">🛠️</div>
              <div className="quiz-content">
                <h3 className="quiz-title">Esercitazioni HTML</h3>
{/*                 <p className="quiz-description">{config.esercitazioni.length} esercitazioni disponibili</p> */}
              </div>
              <div className="quiz-arrow">→</div>
            </Link>
          </div>
        </section>
      )}

      {Object.entries(quizzesByCategory).map(([categoria, quizList]) => (
        <section key={categoria} className="category-section">
          <h2 className="category-title">{categoria}</h2>
          <div className="quiz-grid">
            {quizList.map(quiz => (
              <Link
                key={quiz.id}
                to={`/quiz/${quiz.id}`}
                className="quiz-card"
                style={{ borderLeftColor: quiz.colore }}
              >
                <div className="quiz-icon">{quiz.icona}</div>
                <div className="quiz-content">
                  <h3 className="quiz-title">{quiz.titolo}</h3>
                  <p className="quiz-description">{quiz.descrizione}</p>
                </div>
                <div className="quiz-arrow">→</div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <footer className="footer">
        <p>Liceo Villoresi - Informatica</p>
        <p>© {new Date().getFullYear()} by FNZ</p>
      </footer>
    </div>
  )
}

export default Home