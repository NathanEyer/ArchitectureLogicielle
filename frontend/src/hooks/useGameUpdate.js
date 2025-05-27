import { useCallback } from 'react';

export default function useGameUpdate(setGame) {
  const updateGame = useCallback(async (gameId, index, player) => {
    try {
      const res = await fetch(`http://localhost:3000/api/games/${gameId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: index, player }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      const getRes = await fetch(`http://localhost:3000/api/games/${gameId}`);
      if (!getRes.ok) {
        const err = await getRes.json();
        throw new Error(err.error);
      }

      const updatedGame = await getRes.json();
      setGame(updatedGame);

    } catch (err) {
      alert(err.message);
    }
  }, [setGame]);

  return updateGame;
}
