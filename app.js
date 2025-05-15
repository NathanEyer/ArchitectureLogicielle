const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// Middleware to parse urlencoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Function to check if a player has won
function checkWin(board, player) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    return lines.some(line =>
        line.every(index => board[index] === player)
    );
}

// Function to check if the board is full (draw)
function checkDraw(board) {
    return board.every(cell => cell !== '');
}

// GET route - initial load or refreshed page
app.get('/', (req, res) => {
    // Initial empty board is 9 empty strings
    const board = ['', '', '', '', '', '', '', '', ''];
    const currentPlayer = 'X';
    const message = "Game start: Player X begins.";
    res.render('index', { board, currentPlayer, message, gameOver: false });
});

// POST route - to handle moves
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

    // If chosen cell is empty and game not over, apply the move
    if (board[moveIndex] === '') {
        board[moveIndex] = currentPlayer;

        // Check if the current player has won
        if (checkWin(board, currentPlayer)) {
            message = `Player ${currentPlayer} wins!`;
            gameOver = true;
        } else if (checkDraw(board)) {
            message = `Game is a draw!`;
            gameOver = true;
        } else {
            // Switch player
            message = `Player ${currentPlayer} played. Next player is ${currentPlayer === 'X' ? 'O' : 'X'}.`;
        }
    } else {
        message = "Invalid move, cell already taken.";
    }

    // Next player unless game over
    const nextPlayer = gameOver ? null : (currentPlayer === 'X' ? 'O' : 'X');

    res.render('index', { board, currentPlayer: nextPlayer, message, gameOver });
});

app.listen(port, () => {
    console.log(`Tic Tac Toe app listening at http://localhost:${port}`);
});
