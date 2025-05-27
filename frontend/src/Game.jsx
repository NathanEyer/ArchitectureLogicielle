import useCreateGame from './hooks/useCreateGame';
import useGameUpdate from './hooks/useGameUpdate';

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
  const updateGame = useGameUpdate(setGame);

  function handleClick(index) {
    if (game.board[index] !== '' || game.gameOver) return;
    updateGame(game.id, index, game.currentPlayer);
  }

  const status = game.gameOver
    ? game.winner
      ? `Gagnant : ${game.winner}`
      : 'Match nul !'
    : `Tour de : ${game.currentPlayer}`;

  return (
    <>
      <div className="status">{status}</div>
      {[0, 3, 6].map(row => (
        <div className="board-row" key={row}>
          {Array(3).fill(null).map((_, col) => {
            const index = row + col;
            return (
              <Square key={index} value={game.board[index]} onSquareClick={() => handleClick(index)} />
            );
          })}
        </div>
      ))}
    </>
  );
}

// Composant principal du jeu

export default function Game() {
  const { game, setGame } = useCreateGame();

  if (!game) return <div>En cours de chargement...</div>;

  return (
    <div className="game">
      <div className="game-board">
        <Board game={game} setGame={setGame} />
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
