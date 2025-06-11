import { useState } from 'react';
import { useGame } from './hooks/useGame';

import './App.css'; // style tailwind

export default function App() {
  
  const [player, setPlayer] = useState('X');
  const {
    board, gameId, winner, isMyTurn,
    createNewGame, loadGame, playMove, deleteGame
  } = useGame(player);

  const [inGame, setInGame] = useState(false);

  const handleCreate = async () => {
    await createNewGame();
    setInGame(true);
  };

  const handleJoin = async () => {
    const id = prompt("Entrer l'ID de la partie");
    if (id) {
      await loadGame(id);
      setInGame(true);
    }
  };

const handleLeave = async () => {
  await deleteGame();
  setInGame(false);
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Tic-Tac-Toe Online</h1>
      {!inGame ? (
        <div className="mb-4 space-y-3">
          <div className="space-x-2">
            <button onClick={handleCreate} className="px-4 py-2 bg-green-500 text-white rounded">
              Créer une partie
            </button>
            <button onClick={handleJoin} className="px-4 py-2 bg-blue-500 text-white rounded">
              Rejoindre
            </button>
          </div>
          <div className="mt-2">
            <label className="mr-2">Vous jouez :</label>
            <select value={player} onChange={(e) => setPlayer(e.target.value)}>
              <option value="X">X</option>
              <option value="O">O</option>
            </select>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-2">ID: {gameId}</p>
          <p className="mb-4 text-lg">
            {winner ? `Gagnant : ${winner}` :
             isMyTurn ? "À vous de jouer" :
             "Tour de l'adversaire"}
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {board.map((val, idx) => (
              <button key={idx}
                onClick={() => playMove(idx)}
                className="w-16 h-16 text-2xl font-bold bg-white border rounded shadow"
              >
                {val}
              </button>
            ))}
          </div>
          <button
            onClick={handleLeave}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Quitter la partie
          </button>
        </>
      )}
    </div>
  );
}
