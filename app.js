const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// Gestion des paquets en Json
app.use(bodyParser.urlencoded({ extended: true }));

// Vérifie si un joueur a gagné
function checkWin(board, player) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes
        [0, 4, 8], [2, 4, 6]             // diagonales
    ];
    return lines.some(line =>
        line.every(index => board[index] === player)
    );
    // Boucle vérifier qu'une des combinaisons est remplie dans board
}

// Vérifie qu'il reste des cases à remplir
function checkDraw(board) {
    return board.every(cell => cell !== '');
}

// GET route - chargement de la page initiale
app.get('/', (req, res) => {
    // Plateau initialement vidé
    const board = ['', '', '', '', '', '', '', '', ''];
    const currentPlayer = 'X';
    const message = "La partie commence: X commence.";
    res.render('index', { board, currentPlayer, message, gameOver: false });
});

// POST route - enregistre les actions en direct
app.post('/move', (req, res) => {
    // The board state is passed as hidden inputs, plus the clicked cell index
    let board = [];
    for (let i = 0; i < 9; i++) {
        board[i] = req.body['cell' + i] || '';
    }

    const currentPlayer = req.body.currentPlayer;
    const moveIndex = parseInt(req.body.move);
    let message = '';
    let gameOver = false;

    // Si le jeu n'est pas fini
    if (board[moveIndex] === '') {
        board[moveIndex] = currentPlayer;

        // Check if the current player has won
        if (checkWin(board, currentPlayer)) {
            message = `${currentPlayer} a gagné !`;
            gameOver = true;
        } else if (checkDraw(board)) {
            message = `Égalité !`;
            gameOver = true;
        } else {
            // Switch player
            message = `${currentPlayer} a joué. Le prochain à jouer sera ${currentPlayer === 'X' ? 'O' : 'X'}.`;
        }
    } else {
        message = "Opération non permise.";
    }

    // Next player unless game over
    const nextPlayer = gameOver ? null : (currentPlayer === 'X' ? 'O' : 'X');

    res.render('index', { board, currentPlayer: nextPlayer, message, gameOver });
});

app.listen(port, () => {
    console.log(`Allez sur http://localhost:${port} pour jouer.`);
});
