import './App.css';
import coinUrl from './assets/wooden-nickle.png';
import { useScoreStore } from './store/useScoreStore';
import { useState, useRef, useEffect } from 'react';

/* Small badge that appears above a stack and fades away */
function RollingSubtotal({ value, visible, side }) {
  if (!visible)
    return <div className={`subtotal ${side}`} aria-hidden='true' />;
  const text = value > 0 ? `+${value}` : `${value}`;
  const signClass = value >= 0 ? 'plus' : 'minus';
  return (
    <div className={`subtotal ${side} show ${signClass}`} aria-live='polite'>
      {text}
    </div>
  );
}

function CoinToken({ used, onUse, onReset }) {
  const [flipping, setFlipping] = useState(false);
  const vibrate = (p) => {
    try {
      navigator.vibrate?.(p);
    } catch {}
  };

  const handleClick = () => {
    if (flipping) return;
    if (used) {
      vibrate([10, 30, 10]);
      onReset();
      return;
    }
    vibrate(30);
    setFlipping(true);
    setTimeout(() => {
      onUse();
      setFlipping(false);
    }, 550);
  };

  return (
    <button
      className={`coin ${used ? 'used' : ''} ${flipping ? 'flip' : ''}`}
      onClick={handleClick}
      aria-label={used ? 'Coin used — tap to reset' : 'Flip coin'}
    >
      <img src={coinUrl} alt='' draggable='false' />
    </button>
  );
}

function ButtonStack({ onClicks = [], labels = [] }) {
  return (
    <div className='btn-stack' role='group' aria-label='Score controls'>
      {labels.map((label, i) => (
        <button key={label} className='score-btn' onClick={onClicks[i]}>
          {label}
        </button>
      ))}
    </div>
  );
}

function PlayerHalf({
  side,
  bg,
  score,
  onPlus,
  onMinus,
  coinUsed,
  onUseCoin,
  onResetCoin
}) {
  const rotated = side === 'top' ? 'rotated' : '';

  // Rolling subtotal state (left:+, right:-)
  const [subPlus, setSubPlus] = useState(0);
  const [subMinus, setSubMinus] = useState(0);
  const [showPlus, setShowPlus] = useState(false);
  const [showMinus, setShowMinus] = useState(false);
  const plusTimer = useRef(null);
  const minusTimer = useRef(null);
  const lastPlus = useRef(0);
  const lastMinus = useRef(0);

  const bumpPlus = (delta) => {
    const now = Date.now();
    setSubPlus((prev) =>
      now - lastPlus.current > 1500 ? delta : prev + delta
    );
    lastPlus.current = now;
    setShowPlus(true);
    clearTimeout(plusTimer.current);
    plusTimer.current = setTimeout(() => setShowPlus(false), 2000);
  };

  const bumpMinus = (delta) => {
    const now = Date.now();
    setSubMinus((prev) =>
      now - lastMinus.current > 1500 ? delta : prev + delta
    );
    lastMinus.current = now;
    setShowMinus(true);
    clearTimeout(minusTimer.current);
    minusTimer.current = setTimeout(() => setShowMinus(false), 2000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(plusTimer.current);
      clearTimeout(minusTimer.current);
    };
  }, []);

  return (
    <section className={`half ${rotated}`} style={{ backgroundColor: bg }}>
      <div className='half-inner'>
        <CoinToken used={coinUsed} onUse={onUseCoin} onReset={onResetCoin} />

        <div className='score-row'>
          {/* LEFT: + stack with rolling subtotal */}
          <div className='stack-wrap'>
            <RollingSubtotal value={subPlus} visible={showPlus} side='left' />
            <ButtonStack
              labels={['+1', '+5', '+10']}
              onClicks={[
                () => {
                  onPlus(1);
                  bumpPlus(+1);
                },
                () => {
                  onPlus(5);
                  bumpPlus(+5);
                },
                () => {
                  onPlus(10);
                  bumpPlus(+10);
                }
              ]}
            />
          </div>

          <div className='score' aria-live='polite'>
            {score}
          </div>

          {/* RIGHT: - stack with rolling subtotal */}
          <div className='stack-wrap'>
            <RollingSubtotal
              value={subMinus}
              visible={showMinus}
              side='right'
            />
            <ButtonStack
              labels={['-1', '-2', '-3']}
              onClicks={[
                () => {
                  onMinus(1);
                  bumpMinus(-1);
                },
                () => {
                  onMinus(2);
                  bumpMinus(-2);
                },
                () => {
                  onMinus(3);
                  bumpMinus(-3);
                }
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const s = useScoreStore();
  return (
    <main className='app'>
      <PlayerHalf
        side='top'
        bg='#001f3f'
        score={s.topScore}
        onPlus={s.incTop}
        onMinus={s.decTop}
        coinUsed={s.topCoinUsed}
        onUseCoin={s.useTopCoin}
        onResetCoin={() => s.setTopCoinUsed(false)}
      />

      <div className='divider' />

      <PlayerHalf
        side='bottom'
        bg='#ff6a00'
        score={s.bottomScore}
        onPlus={s.incBottom}
        onMinus={s.decBottom}
        coinUsed={s.bottomCoinUsed}
        onUseCoin={s.useBottomCoin}
        onResetCoin={() => s.setBottomCoinUsed(false)}
      />

      <button className='reset' onClick={s.reset} aria-label='Reset scores'>
        🔄
      </button>
    </main>
  );
}
