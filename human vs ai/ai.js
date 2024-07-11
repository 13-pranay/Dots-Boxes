class DotsAndBoxes {
    constructor(size, withAI = false) {
        this.size = size;
        this.withAI = withAI;
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
        this.updateCurrentPlayerDisplay();
    }

    addResetListener() {
        document.getElementById('reset-button').addEventListener('click', () => this.resetGame());
    }

    resetGame() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
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
            this.switchPlayer();
        }

        this.updateScores();

        if (this.isGameOver()) {
            this.endGame();
        } else if (this.withAI && this.currentPlayer === 2) {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    switchPlayer() {
        this.currentPlayer = 3 - this.currentPlayer;
        this.updateCurrentPlayerDisplay();
    }

    updateCurrentPlayerDisplay() {
        document.getElementById('current-player').textContent = `Current Player: ${this.currentPlayer === 1 ? 'Human' : 'AI'}`;
    }

    makeAIMove() {
        let move = this.findBestMove();
        if (!move) {
            move = this.getRandomMove();
        }
        if (move) {
            this.makeMove(move.row, move.col);
        }
    }

    findBestMove() {
        for (let i = 0; i < 2 * this.size + 1; i++) {
            for (let j = 0; j < 2 * this.size + 1; j++) {
                if (this.board[i][j] === '' && (i % 2 === 0 || j % 2 === 0)) {
                    if (this.willCompleteBox(i, j)) {
                        return { row: i, col: j };
                    }
                }
            }
        }
        return null;
    }

    willCompleteBox(row, col) {
        if (row % 2 === 0) {
            if (row > 0 && this.isBoxAlmostComplete(row - 1, col)) return true;
            if (row < 2 * this.size && this.isBoxAlmostComplete(row + 1, col)) return true;
        } else {
            if (col > 0 && this.isBoxAlmostComplete(row, col - 1)) return true;
            if (col < 2 * this.size && this.isBoxAlmostComplete(row, col + 1)) return true;
        }
        return false;
    }

    isBoxAlmostComplete(row, col) {
        let count = 0;
        if (this.board[row - 1][col] !== '') count++;
        if (this.board[row + 1][col] !== '') count++;
        if (this.board[row][col - 1] !== '') count++;
        if (this.board[row][col + 1] !== '') count++;
        return count === 3;
    }

    getRandomMove() {
        let availableMoves = [];
        for (let i = 0; i < 2 * this.size + 1; i++) {
            for (let j = 0; j < 2 * this.size + 1; j++) {
                if (this.board[i][j] === '' && (i % 2 === 0 || j % 2 === 0)) {
                    availableMoves.push({ row: i, col: j });
                }
            }
        }
        if (availableMoves.length > 0) {
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
        return null;
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
        let winner = this.scores[1] > this.scores[2] ? 'Human' : this.scores[2] > this.scores[1] ? 'AI' : 'Tie';
        setTimeout(() => {
            alert(winner === 'Tie' ? "It's a tie!" : `${winner} wins!`);
        }, 100);
    }
}


const game = new DotsAndBoxes(6, true);  