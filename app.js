const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());


const port = 3000;

const games = {};  // JSON servant de mini-DB
var games_number = 0; // counter pour faire les ID des parties

// Vérifie si la partie est gagné
function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of winPatterns) {
        if (board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    return board.includes('') ? null : 'draw';
}


// API ---------------------------------------------------------------------------------


// Créer une partie
app.post('/api/games', (req, res) => {
    const { playerX, playerO } = req.body;

    console.log(req.body);

    let id = games_number++ ;

    // remplit DB
    games[id] = {
        id,
        board: Array(9).fill(''),
        currentPlayer: 'X',
        playerX,
        playerO,
        winner: null,
        gameOver: false,
    };

    // return
    res.status(201).json(games[id]);
});


// Jouer un coup
app.put('/api/games/:id', (req, res) => {
    const game = games[req.params.id];

    if (!game) return res.status(404).json({ error: "Partie introuvable." });

    if (game.gameOver) return res.status(400).json({ error: "Partie terminée." });

    const { position, player } = req.body;
    if (player !== game.currentPlayer) {
        return res.status(400).json({ error: `Ce n'est pas au tour de ${player}.` });
    }
    if (position < 0 || position > 8 || game.board[position] !== '') {
        return res.status(400).json({ error: "Coup invalide." });
    }

    game.board[position] = player;
    const winner = checkWinner(game.board);

    if (winner) {
        game.winner = winner === 'draw' ? null : winner;
        game.gameOver = true;
    } else {
        game.currentPlayer = player === 'X' ? 'O' : 'X';
    }

    res.json(game);
});


// Récupérer une partie
app.get('/api/games/:id', (req, res) => {
    const game = games[req.params.id];
    if (!game) return res.status(404).json({ error: "Partie introuvable." });
    res.json(game);
});


// ----------------------------------------------------------------------------------------------------------


// Lance le serveur
app.listen(port, () => {
  console.log(`API en écoute sur http://localhost:${port}`);
});