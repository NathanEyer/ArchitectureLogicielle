import { useEffect, useState } from 'react';

export default function useCreateGame() {
  const [game, setGame] = useState(null);

  useEffect(() => {
    const createGame = async () => {
        const res = await fetch('http://localhost:3000/api/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(),
        });

        if (!res.ok) throw new Error('Erreur lors de la création de la partie');
        const data = await res.json();
        setGame(data);
    };

    createGame();
  }, []);

  return { game, setGame };
}
