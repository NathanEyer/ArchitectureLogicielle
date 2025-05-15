const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
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

app.get('/', (req, res) => {
    res.redirect('/start');
});

app.get('/start', (req, res) => {
    res.render('start'); // page EJS avec formulaire
});

// Chargement initial de la page 
app.post('/start', (req, res) => {
    const playerX = req.body.playerX;
    const playerO = req.body.playerO;
    const board = ['', '', '', '', '', '', '', '', ''];
    const currentPlayer = 'X';
    const message = `La partie commence : ${playerX} commence.`;

    res.render('index', { board, currentPlayer, message, gameOver: false, playerX, playerO });
});

// POST route - enregistre les actions en direct
app.post('/move', (req, res) => {
    // The board state is passed as hidden inputs, plus the clicked cell index
    let board = [];
    for (let i = 0; i < 9; i++) {
        board[i] = req.body['cell' + i] || '';
    }

    const playerX = req.body.playerX;
    const playerO = req.body.playerO;
    const currentPlayer = req.body.currentPlayer;
    const moveIndex = parseInt(req.body.move);

    let message = '';
    let gameOver = false;

    // Si le jeu n'est pas fini
    if (board[moveIndex] === '') {
        board[moveIndex] = currentPlayer;

        if (checkWin(board, currentPlayer)) {
            const winnerName = currentPlayer === 'X' ? playerX : playerO;
            message = `${winnerName} (${currentPlayer}) a gagné !`;
            gameOver = true;
        } else if (checkDraw(board)) {
            message = `Égalité !`;
            gameOver = true;
        } else {
            message = `${currentPlayer} posé.`;
            const nextPlayerName = currentPlayer === 'X' ? playerO : playerX;
            message += ` Le prochain à jouer sera ${nextPlayerName}.`;
        }
    } else {
        message = "Opération non permise.";
    }

    // Next player unless game over
    const nextPlayer = gameOver ? null : (currentPlayer === 'X' ? 'O' : 'X');

    res.render('index', { board, currentPlayer: nextPlayer, message, gameOver, playerX, playerO });
});

app.listen(port, () => {
    console.log(`Allez sur http://localhost:${port} pour jouer.`);
});
