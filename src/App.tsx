import { useState } from 'react'
import './App.css'
import DrawingCanvas from './components/DrawingCanvas'

const fortunes = [
  'Сегодня тебе случайно придёт хорошая идея. Не игнорируй её.',
  'Кто-то скоро скажет тебе «да», хотя ты уже приготовился услышать «нет».',
  'Твой следующий странный импульс окажется surprisingly разумным.',
  'В ближайшие дни тебя ждёт маленькое приключение. Начнётся оно совершенно буднично.',
  'Вселенная намекает: пора попробовать то, что ты откладывал.',
  'Ты встретишь человека, который знает что-то очень полезное. Спроси его.',
  'Твой хаос скоро сложится в систему. Возможно, случайно.',
  'Неожиданное сообщение изменит твой план на день. И это неплохо.',
  'У тебя есть идея лучше, чем ты думаешь. Дай ей шанс.',
  'Сегодня удача будет выглядеть как случайность.',
  'Твоя следующая ошибка приведёт тебя куда-то интереснее правильного решения.',
  'В ближайшее время тебе понадобится сказать: «А почему бы и нет?»',
]

function App() {
 const [, setHasDrawing] = useState(false)
  const [fortune, setFortune] = useState<string | null>(null)

  const revealFortune = () => {
    const randomIndex = Math.floor(Math.random() * fortunes.length)
    setFortune(fortunes[randomIndex])
  }

  const drawAgain = () => {
    window.location.reload()
  }

  return (
    <main className="page">

      <header className="header">
        <a href="#" className="logo">
          DOODLE<span>✳</span>ORACLE
        </a>

        <div className="header-note">
          YOUR PERSONAL CHAOS GENERATOR
        </div>

        <div className="status">
          <span className="status-dot"></span>
          ONLINE / 24:7
        </div>
      </header>

      <section className="hero">

        <div className="hero-copy">
          <div className="eyebrow">
            ✳ THE UNIVERSE IS WAITING
          </div>

          <h1>
            DRAW
            <br />
            YOUR
            <br />
            <span>FUTURE</span>
            <span className="title-star">✳</span>
          </h1>

          <p className="description">
            No logic. No rules.
            Just a little doodle
            and a message from the universe.
          </p>

          <div className="instruction">
            <span className="instruction-number">01</span>
            <span>GRAB YOUR IMAGINARY PEN</span>
          </div>
        </div>

        <div className="canvas-column">

          <div className="canvas-label">
            <span>YOUR DESTINY CANVAS</span>
            <span>3000 × ∞</span>
          </div>

          <div className="drawing-area">

            <div className="canvas-cross cross-one">
              ✳
            </div>

            <div className="canvas-cross cross-two">
              ✳
            </div>

            <DrawingCanvas
              onDrawingStart={() => {
                setHasDrawing(true)
                setFortune(null)
              }}
            />

            <div className="canvas-bottom">
              <span>MAKE IT WEIRD</span>
              <span>↗</span>
            </div>

          </div>

          <button
            className="reveal-button"
            type="button"
            onClick={revealFortune}
          >
            <span>
              {fortune ? 'REVEAL ANOTHER FATE' : 'REVEAL MY FATE'}
            </span>
            <span>↗</span>
          </button>

          {fortune !== null && (
            <div className="fortune-card">

              <div className="fortune-label">
                YOUR MESSAGE FROM THE UNIVERSE
              </div>

              <div className="fortune-text">
                {fortune}
              </div>

              <button
                className="draw-again-button"
                type="button"
                onClick={drawAgain}
              >
                DRAW AGAIN ↻
              </button>

            </div>
          )}

          <div className="canvas-footnote">
            * THE MESSIER, THE BETTER
          </div>

        </div>

        <aside className="side-note">

          <div className="side-sticker">
            NO
            <br />
            CLUE
            <br />
            CLUB
          </div>

          <div className="side-vertical">
            TRUST YOUR INNER CHAOS
          </div>

          <div className="side-symbol">
            ✳
          </div>

        </aside>

      </section>

      <footer className="footer">
        <span>EST. IN THE MULTIVERSE</span>
        <span>MADE OF CHAOS & CURIOSITY</span>
        <span>© 2026 DOODLE ORACLE</span>
      </footer>

    </main>
  )
}

export default App
