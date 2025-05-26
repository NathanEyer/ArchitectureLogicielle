import { useEffect, useState } from 'react';

// Composant d'une case du plateau
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Composant du plateau de jeu
function Board({ game, setGame }) {
  function handleClick(index) {
  if (game.board[index] !== '' || game.gameOver) {
    return;
  }

    fetch(`http://localhost:3000/api/games/${game.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        position: index,
        player: game.currentPlayer
      })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => {
            throw new Error(err.error);
          });
        }
        return res.json();
      })
      .catch(err => {
        alert(err.message);
      })
      .then(() => {

    fetch(`http://localhost:3000/api/games/${game.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => {
            throw new Error(err.error);
          });
        }
        return res.json();
      })
      .then(data => {
        setGame(data);
      })
      .catch(err => {
        alert(err.message);
      });
    });

  }
  
  

  const status = game.gameOver
    ? game.winner
      ? `Gagnant : ${game.winner}`
      : 'Match nul !'
    : `Tour de : ${game.currentPlayer}`;

    return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={game.board[0]} onSquareClick={() => handleClick(0)} />
        <Square value={game.board[1]} onSquareClick={() => handleClick(1)} />
        <Square value={game.board[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={game.board[3]} onSquareClick={() => handleClick(3)} />
        <Square value={game.board[4]} onSquareClick={() => handleClick(4)} />
        <Square value={game.board[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={game.board[6]} onSquareClick={() => handleClick(6)} />
        <Square value={game.board[7]} onSquareClick={() => handleClick(7)} />
        <Square value={game.board[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// Composant principal du jeu
export default function Game() {
  const [game, setGame] = useState(null); 

  useEffect(() => {
    fetch('http://localhost:3000/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        playerX: 'Alice',
        playerO: 'Bob'
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors de la création de la partie');
        return res.json();
      })
      .then(data => {
        setGame(data);
      })
      .catch(err => {
        alert(err.message);
      });
  }, []); 

  if (!game) return <div>En cours de chargement...</div>;

  return (
    <div className="game">
      <div className="game-board">
        <Board game={game} setGame={setGame}/>
      </div>
      <div className="game-info">
        <p>ID de la partie : {game.id}</p>
        {game.gameOver && (
          <button onClick={() => window.location.reload()}>
            Rejouer
          </button>
        )}
      </div>
    </div>
  );
}
