function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create a 2D array of cells
    const initialiseBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
    };

    const resetBoard = () => {
        board.length = 0;
        initialiseBoard();
    };

    // Return the current state of the board
    const getBoard = () => board;

    // Print the current state of the board
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.table(boardWithCellValues);
    };

    // Accept a player's token to change the value of the cell
    const addMarker = (marker, row, column) => {
        board[row][column].placeMarker(marker);
        domUpdater.updateCell(row, column, marker);
    };

    initialiseBoard();

    return { resetBoard, getBoard, printBoard, addMarker };
}

// Create a cell object with a value of ""
function Cell() {
    let value = "";

    // Accept a player's token to change the value of the cell
    const placeMarker = (marker) => {
        value = marker;
    };

    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;

    return {
        placeMarker,
        getValue
    };
}

function Gamecontroller(playerOneName = "Player 1", playerTwoName = "Player 2") {
    //Call and create the board
    const board = Gameboard();

    //Initialize players and set token value
    const players = [
        {
            name: playerOneName,
            marker: "X"
        },
        {
            name: playerTwoName,
            marker: "O"
        }];

    let currentPlayer = players[0];

    const getCurrentPlayer = () => currentPlayer;

    const switchPlayer = () => {
        if (currentPlayer === players[0]) {
            currentPlayer = players[1];
        } else {
            currentPlayer = players[0];
        }
        domUpdater.updateTurn();
        this.playTurn();
    };


    const checkForWin = () => {
        const currentBoard = board.getBoard();
        let isBoardFull = true;

        // Check rows
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i][0].getValue() === currentBoard[i][1].getValue() && currentBoard[i][1].getValue() === currentBoard[i][2].getValue() && currentBoard[i][0].getValue() !== "") {
                console.log(`Player ${currentBoard[i][0].getValue()} wins!`);
                domUpdater.updateWin();
                board.printBoard();
                return true;
            }
        }

        // Check columns
        for (let i = 0; i < currentBoard[0].length; i++) {
            if (currentBoard[0][i].getValue() === currentBoard[1][i].getValue() && currentBoard[1][i].getValue() === currentBoard[2][i].getValue() && currentBoard[0][i].getValue() !== "") {
                console.log(`Player ${currentBoard[0][i].getValue()} wins!`);
                domUpdater.updateWin();
                board.printBoard();
                return true;
            }
        }

        // Check diagonals
        if (currentBoard[0][0].getValue() === currentBoard[1][1].getValue() && currentBoard[1][1].getValue() === currentBoard[2][2].getValue() && currentBoard[0][0].getValue() !== "") {
            console.log(`Player ${currentBoard[0][0].getValue()} wins!`);
            domUpdater.updateWin();
            board.printBoard();
            return true;
        }
        if (currentBoard[0][2].getValue() === currentBoard[1][1].getValue() && currentBoard[1][1].getValue() === currentBoard[2][0].getValue() && currentBoard[0][2].getValue() !== "") {
            console.log(`Player ${currentBoard[0][2].getValue()} wins!`);
            domUpdater.updateWin();
            board.printBoard();
            return true;
        }

        // Check if board is full
        for (let i = 0; i < currentBoard.length; i++) {
            for (let j = 0; j < currentBoard[i].length; j++) {
                if (currentBoard[i][j].getValue() === "") {
                    isBoardFull = false;
                    break;
                }
            }
            if (!isBoardFull) break;
        }

        if (isBoardFull) {
            console.log("It's a draw! The board is full.");
            domUpdater.updateDraw();
            board.printBoard();
            return true;
        }

        return false;
    };

    this.playTurn = function () {
        console.clear();
        board.printBoard();

        console.log(`It's ${currentPlayer.name}'s turn!`);

        const buttons = document.querySelectorAll(".cell");

        buttons.forEach(button => {
            button.addEventListener('click', function handleClick() {
                const row = parseInt(button.getAttribute('data-row'));
                const column = parseInt(button.getAttribute('data-column'));

                // Check if the cell is already filled
                if (board.getBoard()[row][column].getValue() === "") {
                    board.addMarker(currentPlayer.marker, row, column);
                    button.removeEventListener('click', handleClick); // Remove the event listener after placing the marker

                    if (!checkForWin()) {
                        switchPlayer();
                    } else {
                        buttons.forEach(button => button.removeEventListener('click', handleClick));
                        buttons.forEach(button => button.disabled = true);

                        console.log(`${currentPlayer.name} wins!`);
                    }
                }
            });
        });
    }

    const resetButton = document.querySelector(".reset-button");
    resetButton.addEventListener("click", () => {
        this.resetController();
        
    });

    resetController = function () {
        currentPlayer = players[0];
        board.resetBoard();
        const buttons = document.querySelectorAll(".cell");
        buttons.forEach(button => {
            button.disabled = false; // Remove the disabled attribute
            button.classList.remove("disabled"); // If using a class to disable
            button.textContent = ""; // Clear the button content if necessary
        });
        domUpdater.resetDom();
        this.playTurn();
    };


    return { getCurrentPlayer, playTurn: this.playTurn };
}

function updateDOM(game) {
    const gameStatus = document.querySelector(".game-status");

    const updateTurn = () => {
        const currentPlayer = game.getCurrentPlayer();
        gameStatus.textContent = `It's ${currentPlayer.name}'s turn! (${currentPlayer.marker})`;
    }

    const updateDraw = () => {
        gameStatus.textContent = "It's a draw! The board is full.";
    }

    const updateWin = () => {
        const currentPlayer = game.getCurrentPlayer();
        gameStatus.textContent = `${currentPlayer.name} wins!`;
    }

    const updateCell = (row, column, value) => {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-column="${column}"]`);
        cell.textContent = value;
    }

    const resetDom = () => {
        gameStatus.textContent = "It's Player 1's turn! (X)";

        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.textContent = "";
        });
    }

    return { updateTurn, updateDraw, updateWin, updateCell, resetDom };
}

const game = Gamecontroller();
const domUpdater = updateDOM(game);
game.playTurn();
