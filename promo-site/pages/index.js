import { useState } from 'react';

export default function Home() {
  const [promo, setPromo] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const lastClaimed = localStorage.getItem('lastClaim');
    const now = Date.now();

    if (lastClaimed && now - parseInt(lastClaimed) < 120 * 60 * 1000) {
      setMessage('Вы уже получили скидку');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/get-promo');
    const data = await res.json();

    if (data.success) {
      setPromo(data.promo);
      localStorage.setItem('lastClaim', now);
    } else {
      setMessage(data.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        {!promo && !message && (
          <button onClick={handleClick} style={{ fontSize: '24px', padding: '20px' }} disabled={loading}>
            {loading ? 'Загрузка...' : 'Получить скидку'}
          </button>
        )}
        {promo && (
          <div style={{ fontSize: '24px' }}>
            Ваш промокод: <strong>{promo.code}</strong><br />Скидка: {promo.discount}
          </div>
        )}
        {message && <div style={{ fontSize: '24px' }}>{message}</div>}
      </div>
    </div>
  );
}
