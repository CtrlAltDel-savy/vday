import React, { useState, useCallback } from 'react';
import './Valentine.css';

// Replace with your own image URLs or add images to public folder
const HARRY_IMAGES = [
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=400&fit=crop',
];
const HAPPY_IMAGE = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop';

function Valentine() {
  const [saidYes, setSaidYes] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  const handleYes = useCallback(() => {
    setSaidYes(true);
  }, []);

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

  if (saidYes) {
    return (
      <div className="valentine valentine--result">
        {hearts}
        <img
          src={HAPPY_IMAGE}
          className="valentine__image valentine__image--happy"
          alt="Happy Valentine"
        />
        <p className="valentine__thanks">Yaay! Thanks for being my Valentine</p>
      </div>
    );
  }

  return (
    <div className="valentine">
      {hearts}
      <img
        src={HARRY_IMAGES[imageIndex]}
        className="valentine__image"
        alt="Cute Harry Potter"
      />
      <p className="valentine__question">Hi Saarini, will you be my Valentine?</p>
      <div className="valentine__buttons">
        <button
          type="button"
          className="valentine__btn valentine__btn--yes"
          onClick={handleYes}
        >
          Yes
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
