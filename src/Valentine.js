import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import './Valentine.css';

const CONFETTI_COLORS = ['#e8b4b8', '#ffb6c1', '#ff69b4', '#ff1493', '#ff85a1', '#fff0f5', '#ffd700', '#ffa07a'];
const CONFETTI_COUNT = 1000;

// 4-digit PIN (DOB as MMDD or DDMM – e.g. 0315 for March 15)
const CORRECT_PIN = '2122';

// Replace with your own image URLs or add images to public folder
const HARRY_IMAGES = [
  'https://image2url.com/r2/default/images/1770604709053-c4ebd0a9-01af-40ca-b1ff-3664dacfe88a.jpg',
  'https://image2url.com/r2/default/images/1770605030186-0b379cbd-3c79-4513-9449-790e1cb4d925.png',
  'https://image2url.com/r2/default/images/1770605887579-f8eb9a9f-5c4c-49c7-b084-d9b638981913.png',
  'https://image2url.com/r2/default/images/1770605914243-3cb5b547-1e8e-4242-84df-df56bb74d4c0.png',
  'https://image2url.com/r2/default/images/1770605935942-29fd0750-2397-42eb-9520-1531dfb78695.png',
  'https://image2url.com/r2/default/images/1770606272567-b0b4f0ea-31e6-48bd-8222-72b0481699eb.png',
  'https://image2url.com/r2/default/images/1770606291821-39a7f064-1d6d-4c49-b504-e8dd4fad11c2.png',
];

// const HARRY_IMAGES = [
//   'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400&h=400&fit=crop',
//   'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
//   'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
//   'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
//   'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=400&fit=crop',
// ];
const HAPPY_IMAGE = `${process.env.PUBLIC_URL}/photo_nice.jpeg`;
// const HAPPY_IMAGE = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop';

function Valentine() {
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [saidYes, setSaidYes] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [yesClickCount, setYesClickCount] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [heartTrail, setHeartTrail] = useState([]);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const questionText = 'Hi Saarini, will you be my Valentine?';
  const containerRef = useRef(null);

  const handlePinSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setPinError('');
      if (pinInput.length !== 4) {
        setPinError('Please enter 4 digits');
        return;
      }
      if (pinInput === CORRECT_PIN) {
        setPinUnlocked(true);
        setPinInput('');
      } else {
        setPinError('Wrong PIN. Try again!');
      }
    },
    [pinInput]
  );

  const handlePinChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPinInput(value);
    setPinError('');
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (!pinUnlocked || saidYes) return;
    setTypedText('');
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < questionText.length) {
        setTypedText(questionText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, [pinUnlocked, saidYes]);

  // Heart trail cursor effect
  useEffect(() => {
    if (!pinUnlocked || saidYes) return;
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      if (Math.random() > 0.7) {
        setHeartTrail((prev) => [
          ...prev.slice(-10),
          {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
          },
        ]);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [pinUnlocked, saidYes]);

  // Clean up heart trail
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartTrail((prev) => prev.filter((h) => Date.now() - h.id < 1000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Floating emojis
  useEffect(() => {
    if (!pinUnlocked || saidYes) return;
    const emojis = ['❤️', '💕', '💖', '💗', '💝'];
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setFloatingEmojis((prev) => [
          ...prev.slice(-5),
          {
            id: Date.now(),
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            left: Math.random() * 100,
            delay: Math.random() * 2,
          },
        ]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [pinUnlocked, saidYes]);

  const handleYes = useCallback(() => {
    setYesClickCount((prev) => prev + 1);
    if (yesClickCount >= 1) {
      setSaidYes(true);
      setYesClickCount(0);
    }
  }, [yesClickCount]);

  const handleNo = useCallback(() => {
    const padding = 80;
    const x = Math.random() * (window.innerWidth - padding * 2) + padding;
    const y = Math.random() * (window.innerHeight - padding * 2) + padding;
    setNoButtonPosition({ x, y });
    setImageIndex((prev) => (prev + 1) % HARRY_IMAGES.length);
  }, []);

  const heartPath =
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

  const hearts = (
    <div className="valentine__hearts" aria-hidden>
      {Array.from({ length: 30 }, (_, i) => (
        <span key={i} className="heart">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d={heartPath} fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );

  const confettiPieces = useMemo(() => {
    if (!saidYes) return [];
    return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 1.2,
      duration: 3 + Math.random() * 2,
      size: 6 + Math.random() * 8,
      isRect: Math.random() > 0.4,
    }));
  }, [saidYes]);

  // Balloons for celebration
  const balloons = useMemo(() => {
    if (!saidYes) return [];
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 2,
    }));
  }, [saidYes]);

  // Heart rain for celebration
  const heartRain = useMemo(() => {
    if (!saidYes) return [];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
    }));
  }, [saidYes]);

  /* PIN screen – before question */
  if (!pinUnlocked) {
    return (
      <div className="valentine valentine--pin">
        {hearts}
        <div className="valentine__pin-wrap">
          <p className="valentine__pin-label">Enter the 4-digit PIN</p>
          <p className="valentine__pin-hint">💕 Hint: It's a special date 💕</p>
          <form className="valentine__pin-form" onSubmit={handlePinSubmit}>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              className="valentine__pin-input"
              placeholder="••••"
              value={pinInput}
              onChange={handlePinChange}
              autoComplete="off"
              aria-label="4-digit PIN"
            />
            <button type="submit" className="valentine__btn valentine__btn--yes valentine__pin-submit">
              Submit
            </button>
          </form>
          {pinError && <p className="valentine__pin-error">{pinError}</p>}
        </div>
      </div>
    );
  }

  if (saidYes) {
    return (
      <div className="valentine valentine--result">
        {hearts}
        <div className="valentine__confetti" aria-hidden>
          {confettiPieces.map((p) => (
            <span
              key={p.id}
              className={`valentine__confetti-piece ${p.isRect ? 'valentine__confetti-piece--rect' : 'valentine__confetti-piece--circle'}`}
              style={{
                left: `${p.left}%`,
                backgroundColor: p.color,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                width: p.size,
                height: p.isRect ? p.size * 1.4 : p.size,
              }}
            />
          ))}
        </div>
        <div className="valentine__balloons" aria-hidden>
          {balloons.map((b) => (
            <span
              key={b.id}
              className="valentine__balloon"
              style={{
                left: `${b.left}%`,
                backgroundColor: b.color,
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.duration}s`,
              }}
            />
          ))}
        </div>
        <div className="valentine__heart-rain" aria-hidden>
          {heartRain.map((h) => (
            <span
              key={h.id}
              className="valentine__heart-rain-item"
              style={{
                left: `${h.left}%`,
                animationDelay: `${h.delay}s`,
                animationDuration: `${h.duration}s`,
              }}
            >
              ❤️
            </span>
          ))}
        </div>
        <img
          src={HAPPY_IMAGE}
          className="valentine__image valentine__image--happy"
          alt="Happy Valentine"
        />
        <p className="valentine__thanks">Yaay! Thanks for being my Valentine</p>
        <p className="valentine__thanks">💖💖💖 Happy Valentine's Day 💖💖💖</p>
      </div>
    );
  }

  /* Main question screen */
  return (
    <div className="valentine" ref={containerRef}>
      {hearts}
      <div className="valentine__heart-trail" aria-hidden>
        {heartTrail.map((h) => (
          <span
            key={h.id}
            className="valentine__heart-trail-item"
            style={{
              left: h.x,
              top: h.y,
            }}
          >
            ❤️
          </span>
        ))}
      </div>
      <div className="valentine__floating-emojis" aria-hidden>
        {floatingEmojis.map((e) => (
          <span
            key={e.id}
            className="valentine__floating-emoji"
            style={{
              left: `${e.left}%`,
              animationDelay: `${e.delay}s`,
            }}
          >
            {e.emoji}
          </span>
        ))}
      </div>
      <div className="valentine__personal-message">
        <p className="valentine__message-text">💕 You mean the world to me 💕</p>
      </div>
      <img
        src={HARRY_IMAGES[imageIndex]}
        className="valentine__image"
        alt="Cute Harry Potter"
      />
      <p className="valentine__question">
        {typedText}
        <span className="valentine__cursor">|</span>
      </p>
      <div className="valentine__buttons">
        <button
          type="button"
          className="valentine__btn valentine__btn--yes"
          onClick={handleYes}
        >
          {yesClickCount === 0 ? 'Yes' : 'Click again to confirm! 💕'}
        </button>
        <button
          type="button"
          className="valentine__btn valentine__btn--no"
          onClick={handleNo}
          style={
            noButtonPosition
              ? {
                  position: 'fixed',
                  left: noButtonPosition.x,
                  top: noButtonPosition.y,
                  transform: 'translate(-50%, -50%)',
                }
              : undefined
          }
        >
          No
        </button>
      </div>
    </div>
  );
}

export default Valentine;
