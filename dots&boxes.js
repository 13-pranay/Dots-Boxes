class DotsAndBoxes {
    constructor(size) {
        this.size = size;
        this.initGame();
        this.addResetListener();
    }

    initGame() {
        this.board = [];
        this.currentPlayer = 1;
        this.scores = { 1: 0, 2: 0 };
        this.initializeBoard();
        this.createBoardUI();
        this.updateScores();
        document.getElementById('current-player').textContent = `Current Player: ${this.currentPlayer}`;
    }

    addResetListener() {
        document.getElementById('reset-button').addEventListener('click', () => this.resetGame());
    }

    resetGame() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = ''; // Clear the board
        this.initGame();
    }

    initializeBoard() {
        for (let i = 0; i < 2 * this.size + 1; i++) {
            this.board[i] = [];
            for (let j = 0; j < 2 * this.size + 1; j++) {
                if (i % 2 === 0 && j % 2 === 0) {
                    this.board[i][j] = 'dot';
                } else if (i % 2 === 0 || j % 2 === 0) {
                    this.board[i][j] = '';
                } else {
                    this.board[i][j] = 'empty';
                }
            }
        }
    }

    createBoardUI() {
        const boardElement = document.getElementById('board');
        boardElement.style.gridTemplateColumns = `repeat(${this.size * 2 + 1}, auto)`;
        boardElement.style.gridTemplateRows = `repeat(${this.size * 2 + 1}, auto)`;

        for (let i = 0; i < 2 * this.size + 1; i++) {
            for (let j = 0; j < 2 * this.size + 1; j++) {
                const cell = document.createElement('div');
                cell.dataset.row = i;
                cell.dataset.col = j;

                if (i % 2 === 0 && j % 2 === 0) {
                    cell.className = 'dot';
                } else if (i % 2 === 0 && j % 2 !== 0) {
                    cell.className = 'line horizontal';
                    cell.addEventListener('click', () => this.makeMove(i, j));
                } else if (i % 2 !== 0 && j % 2 === 0) {
                    cell.className = 'line vertical';
                    cell.addEventListener('click', () => this.makeMove(i, j));
                } else {
                    cell.className = 'box';
                }

                boardElement.appendChild(cell);
            }
        }
    }

    makeMove(row, col) {
        if (this.board[row][col] !== '') return;

        this.board[row][col] = this.currentPlayer;
        const lineElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        lineElement.style.backgroundColor = this.currentPlayer === 1 ? 'blue' : 'red';

        let boxCompleted = this.checkBox(row, col);

        if (!boxCompleted) {
            this.currentPlayer = 3 - this.currentPlayer;
            document.getElementById('current-player').textContent = `Current Player: ${this.currentPlayer}`;
        }

        this.updateScores();

        if (this.isGameOver()) {
            this.endGame();
        }
    }

    checkBox(row, col) {
        let boxCompleted = false;

        if (row % 2 === 0) {
            if (row > 0) boxCompleted |= this.checkSingleBox(row - 1, col);
            if (row < 2 * this.size) boxCompleted |= this.checkSingleBox(row + 1, col);
        } else {
            if (col > 0) boxCompleted |= this.checkSingleBox(row, col - 1);
            if (col < 2 * this.size) boxCompleted |= this.checkSingleBox(row, col + 1);
        }

        return boxCompleted;
    }

    checkSingleBox(row, col) {
        if (this.board[row - 1][col] && this.board[row + 1][col] &&
            this.board[row][col - 1] && this.board[row][col + 1]) {
            this.board[row][col] = this.currentPlayer;
            const boxElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            boxElement.style.backgroundColor = this.currentPlayer === 1 ? 'lightblue' : 'lightcoral';
            this.scores[this.currentPlayer]++;
            return true;
        }
        return false;
    }

    updateScores() {
        document.getElementById('score1').textContent = this.scores[1];
        document.getElementById('score2').textContent = this.scores[2];
    }

    isGameOver() {
        return this.board.every(row => row.every(cell => cell !== ''));
    }

    endGame() {
        let winner = this.scores[1] > this.scores[2] ? 1 : this.scores[2] > this.scores[1] ? 2 : 'Tie';
        setTimeout(() => {
            alert(winner === 'Tie' ? "It's a tie!" : `Player ${winner} wins!`);
            // Optionally, you can automatically reset the game after it ends
            // this.resetGame();
        }, 100);
    }
}

// Create the game instance
const game = new DotsAndBoxes(6);  // Creates a 6x6 grid of dots