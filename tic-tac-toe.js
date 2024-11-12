let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
const progressBar = document.getElementById('progress-bar');

// Obter dificuldade da URL
const urlParams = new URLSearchParams(window.location.search);
const difficulty = urlParams.get('difficulty') || 'easy'; // Padrão para 'easy' se não especificado

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !gameActive || currentPlayer !== 'X') {
        return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWin()) {
        showNotification(`Jogador ${currentPlayer} venceu!`);
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== '')) {
        showNotification('Empate!');
        gameActive = false;
        return;
    }

    currentPlayer = 'O';
    setTimeout(aiMove, 500); // IA faz a jogada após 500ms
}

function aiMove() {
    if (!gameActive) return;

    let moveIndex;

    if (difficulty === 'easy') {
        moveIndex = getRandomMove();
    } else if (difficulty === 'medium') {
        moveIndex = getBlockingMove() || getRandomMove();
    } else if (difficulty === 'hard') {
        moveIndex = getWinningMove() || getBlockingMove() || getRandomMove();
    }

    board[moveIndex] = currentPlayer;
    cells[moveIndex].textContent = currentPlayer;

    if (checkWin()) {
        showNotification(`Jogador ${currentPlayer} venceu!`);
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== '')) {
        showNotification('Empate!');
        gameActive = false;
        return;
    }

    currentPlayer = 'X';
}

function getRandomMove() {
    const emptyCells = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getBlockingMove() {
    return getStrategicMove('X');
}

function getWinningMove() {
    return getStrategicMove('O');
}

function getStrategicMove(player) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === player && board[b] === player && board[c] === '') return c;
        if (board[a] === player && board[c] === player && board[b] === '') return b;
        if (board[b] === player && board[c] === player && board[a] === '') return a;
    }
    return null;
}

function checkWin() {
    return winningConditions.some(condition => {
        return condition.every(index => board[index] === currentPlayer);
    });
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
    });
    hideNotification();
}

function showNotification(message) {
    notificationMessage.textContent = message;
    notification.style.display = 'block';
    progressBar.style.width = '100%';
    setTimeout(() => {
        progressBar.style.width = '0%';
    }, 10); // Inicia a animação da barra de progresso
    setTimeout(hideNotification, 3000); // Esconde a notificação após 3 segundos
}

function hideNotification() {
    notification.style.display = 'none';
    restartGame(); // Reinicia o jogo após esconder a notificação
} 