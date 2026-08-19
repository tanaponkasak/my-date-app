import { useState, useEffect, useRef, type FormEvent } from 'react'

type Page = 'question' | 'form' | 'success'

interface DateData {
  time: string
  cinema: string
  branch: string
  movie: string
  soda: string
  popcorn: string
}

const CINEMA_LIST = [
  'Major Cineplex',
  'SF Cinema',
  'IMAX',
  '4DX',
  'ScreenX',
]

const BRANCH_LIST = [
  'Major Ratchayothin',
  'Major Pinklao',
  'SF CentralWorld',
  'SF Central Ladprao',
  'Major Cineplex The Mall Bangkapi',
  'Major Cineplex The Mall Ngamwongwan',
  'SF Cinema Central Rama 9',
  'SF Cinema The Mall Bangkae',
]

const SODA_FLAVORS = [
  'Coca-Cola',
  'Pepsi',
  'Sprite',
  'Fanta Orange',
  '7-Up',
  'Fanta Grape',
]

const POPCORN_FLAVORS = [
  'Butter',
  'Caramel',
  'Cheese',
  'Sweet & Salty',
  'Spicy Thai',
  'Chocolate',
]

function App() {
  const [page, setPage] = useState<Page>('question')
  const [data, setData] = useState<DateData>({
    time: '',
    cinema: '',
    branch: '',
    movie: '',
    soda: '',
    popcorn: '',
  })

  return (
    <>
      <FloatingHearts />
      {page === 'question' && (
        <QuestionPage onYes={() => setPage('form')} />
      )}
      {page === 'form' && (
        <FormPage
          data={data}
          setData={setData}
          onSubmit={() => setPage('success')}
        />
      )}
      {page === 'success' && <SuccessPage data={data} />}
    </>
  )
}

/* ==================== หัวใจลอยพื้นหลัง ==================== */
function FloatingHearts() {
  const hearts = ['💖', '💕', '💗', '💘', '💝', '🌸', '✨']
  const items = Array.from({ length: 20 }, (_, i) => {
    const emoji = hearts[i % hearts.length]
    const left = Math.random() * 100
    const duration = 6 + Math.random() * 8
    const delay = Math.random() * 10
    const size = 16 + Math.random() * 24
    return (
      <span
        key={i}
        className="heart"
        style={{
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          fontSize: `${size}px`,
        }}
      >
        {emoji}
      </span>
    )
  })
  return <div className="floating-hearts">{items}</div>
}

/* ==================== หน้าถาม ==================== */
function QuestionPage({ onYes }: { onYes: () => void }) {
  const [noPos, setNoPos] = useState<{ top: number; left: number } | null>(null)
  const [yesScale, setYesScale] = useState(1)
  const [noAttempts, setNoAttempts] = useState(0)
  const noBtnRef = useRef<HTMLButtonElement>(null)
  const growIntervalRef = useRef<number | null>(null)

  // ปุ่ม Yes ใหญ่ขึ้นเรื่อยๆ ทุกๆ 800ms
  useEffect(() => {
    growIntervalRef.current = window.setInterval(() => {
      setYesScale((s) => {
        if (s >= 3.5) return s
        return s + 0.08
      })
    }, 800)
    return () => {
      if (growIntervalRef.current) clearInterval(growIntervalRef.current)
    }
  }, [])

  // ปุ่ม No วิ่งหนีเมาส์
  const handleNoEscape = () => {
    const btn = noBtnRef.current
    if (!btn) return

    const btnRect = btn.getBoundingClientRect()
    const padding = 20
    const maxX = window.innerWidth - btnRect.width - padding
    const maxY = window.innerHeight - btnRect.height - padding

    let newLeft = Math.random() * maxX + padding
    let newTop = Math.random() * maxY + padding

    // หลีกเลี่ยงตำแหน่งเดิม
    if (noPos) {
      const dx = Math.abs(newLeft - noPos.left)
      const dy = Math.abs(newTop - noPos.top)
      if (dx < 100 || dy < 100) {
        newLeft = (newLeft + window.innerWidth / 2) % maxX
        newTop = (newTop + window.innerHeight / 2) % maxY
      }
    }

    setNoPos({ top: newTop, left: newLeft })
    setNoAttempts((a) => a + 1)
  }
/*
  const handleNoHover = () => {
    const btn = noBtnRef.current
    if (!btn) return

    const btnRect = btn.getBoundingClientRect()
    const padding = 20
    const maxX = window.innerWidth - btnRect.width - padding
    const maxY = window.innerHeight - btnRect.height - padding

    let newLeft = Math.random() * maxX + padding
    let newTop = Math.random() * maxY + padding

    // หลีกเลี่ยงตำแหน่งเดิม (ให้ขยับอย่างน้อย 150px)
    if (noPos) {
      const dx = Math.abs(newLeft - noPos.left)
      const dy = Math.abs(newTop - noPos.top)
      if (dx < 150 || dy < 150) {
        newLeft = (newLeft + window.innerWidth / 2) % maxX
        newTop = (newTop + window.innerHeight / 2) % maxY
      }
    }

    setNoPos({ top: newTop, left: newLeft })
    setNoAttempts((a) => a + 1)
  }*/

  const funnyMessages = [
    'แน่ใจนะ? 😢',
    'คิดดีๆ นะ 🥺',
    'อย่าใจร้ายสิ 💔',
    'ให้โอกาสหน่อยนะ 🙏',
    'อ้อนวอนละ 🥹',
    'กด Yes สิ 🌹',
  ]

  return (
    <div className="container">
      <div style={{ fontSize: '4rem', marginBottom: '10px' }}>💘</div>
      <h1 className="title">
        วันที่ 29 ที่จะถึงนี้
        <br />
        ไปเดตกันไหม?
      </h1>
      <p className="subtitle">
        {noAttempts === 0
          ? 'เลือกคำตอบของคุณได้เลย~'
          : funnyMessages[Math.min(noAttempts - 1, funnyMessages.length - 1)]}
      </p>

      <button
        className="yes-btn"
        style={{
          transform: `scale(${yesScale})`,
          transition: 'transform 0.4s ease',
        }}
        onClick={onYes}
      >
        Yes 💖
      </button>

      <button
        ref={noBtnRef}
        className="no-btn"
        style={
          noPos
            ? { top: `${noPos.top}px`, left: `${noPos.left}px` }
            : { position: 'relative', margin: '20px 10px' }
        }
        onPointerEnter={handleNoEscape}
      >
        No
      </button>
    </div>
  )
}

/* ==================== หน้าฟอร์ม ==================== */
function FormPage({
  data,
  setData,
  onSubmit,
}: {
  data: DateData
  setData: React.Dispatch<React.SetStateAction<DateData>>
  onSubmit: () => void
}) {
  const handleChange = (field: keyof DateData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // ตรวจสอบว่ากรอกครบ
    const allFilled = Object.values(data).every((v) => v.trim() !== '')
    if (!allFilled) {
      alert('กรอกให้ครบทุกข้อนะคะ~ 💕')
      return
    }
    onSubmit()
  }

  return (
    <div className="container form-container">
      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎬💕</div>
      <h1 className="title" style={{ fontSize: '1.8rem' }}>
        เยี่ยมไปเลย! มาวางแผนเดตกัน
      </h1>
      <p className="subtitle">กรอกข้อมูลด้านล่างนี้เลยนะ~</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>🕐 เวลาที่นัด</label>
          <input
            type="time"
            value={data.time}
            onChange={(e) => handleChange('time', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>🎬 โรงหนัง</label>
          <select
            value={data.cinema}
            onChange={(e) => handleChange('cinema', e.target.value)}
            required
          >
            <option value="">-- เลือกโรงหนัง --</option>
            {CINEMA_LIST.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>📍 สาขา</label>
          <select
            value={data.branch}
            onChange={(e) => handleChange('branch', e.target.value)}
            required
          >
            <option value="">-- เลือกสาขา --</option>
            {BRANCH_LIST.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>🍿 หนังที่อยากดู</label>
          <input
            type="text"
            placeholder="เช่น Deadpool & Wolverine"
            value={data.movie}
            onChange={(e) => handleChange('movie', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>🥤 น้ำอัดลมรสที่ชอบ</label>
          <select
            value={data.soda}
            onChange={(e) => handleChange('soda', e.target.value)}
            required
          >
            <option value="">-- เลือกรส --</option>
            {SODA_FLAVORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>🍿 ป็อปคอนรสที่ชอบ</label>
          <select
            value={data.popcorn}
            onChange={(e) => handleChange('popcorn', e.target.value)}
            required
          >
            <option value="">-- เลือกรส --</option>
            {POPCORN_FLAVORS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">
          ยืนยันการเดต 💌
        </button>
      </form>
    </div>
  )
}

/* ==================== หน้าสำเร็จ ==================== */
function SuccessPage({ data }: { data: DateData }) {
  useEffect(() => {
    // Confetti effect
    const emojis = ['💖', '💕', '🎉', '✨', '🌸', '💘', '🎊']
    const interval = setInterval(() => {
      const confetti = document.createElement('div')
      confetti.className = 'confetti'
      confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)]
      confetti.style.left = `${Math.random() * 100}vw`
      confetti.style.animationDuration = `${2 + Math.random() * 3}s`
      document.body.appendChild(confetti)
      setTimeout(() => confetti.remove(), 5000)
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container success-container">
      <div className="success-emoji">💖</div>
      <h1 className="success-title">ยินดีด้วยนะ!</h1>
      <p className="subtitle" style={{ fontSize: '1.2rem', color: '#d63384' }}>
        เจอกันวันที่ 29 นี้~
      </p>

      <div className="summary">
        <div className="summary-item">
          <strong>🕐 เวลา:</strong> {data.time} น.
        </div>
        <div className="summary-item">
          <strong>🎬 โรงหนัง:</strong> {data.cinema}
        </div>
        <div className="summary-item">
          <strong>📍 สาขา:</strong> {data.branch}
        </div>
        <div className="summary-item">
          <strong>🎥 หนัง:</strong> {data.movie}
        </div>
        <div className="summary-item">
          <strong>🥤 น้ำอัดลม:</strong> {data.soda}
        </div>
        <div className="summary-item">
          <strong>🍿 ป็อปคอน:</strong> {data.popcorn}
        </div>
      </div>

      <p style={{ marginTop: '20px', color: '#888', fontStyle: 'italic' }}>
        เตรียมตัวให้พร้อมนะ จะทำให้ดีที่สุด 💕
      </p>
    </div>
  )
}

export default App