function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create a 2D array of cells
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

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
    };

    return { getBoard, printBoard, addMarker };
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

   
    const switchPlayer = () => {
        if (currentPlayer === players[0]) {
            currentPlayer = players[1];
        } else {
            currentPlayer = players[0];
        }
        this.playTurn();
    };

    const getCurrentPlayer = () => currentPlayer;

    const printNewRound = () => {
        console.log(`It's ${currentPlayer.name}'s turn!`);
        board.printBoard();
    }

    const checkForWin = () => {
        const currentBoard = board.getBoard();
        let isBoardFull = true;

        // Check rows
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i][0].getValue() === currentBoard[i][1].getValue() && currentBoard[i][1].getValue() === currentBoard[i][2].getValue() && currentBoard[i][0].getValue() !== "") {
                console.log(`Player ${currentBoard[i][0].getValue()} wins!`);
                board.printBoard();
                return true;
            }
        }

        // Check columns
        for (let i = 0; i < currentBoard[0].length; i++) {
            if (currentBoard[0][i].getValue() === currentBoard[1][i].getValue() && currentBoard[1][i].getValue() === currentBoard[2][i].getValue() && currentBoard[0][i].getValue() !== "") {
                console.log(`Player ${currentBoard[0][i].getValue()} wins!`);
                board.printBoard();
                return true;
            }
        }

        // Check diagonals
        if (currentBoard[0][0].getValue() === currentBoard[1][1].getValue() && currentBoard[1][1].getValue() === currentBoard[2][2].getValue() && currentBoard[0][0].getValue() !== "") {
            console.log(`Player ${currentBoard[0][0].getValue()} wins!`);
            board.printBoard();
            return true;
        }
        if (currentBoard[0][2].getValue() === currentBoard[1][1].getValue() && currentBoard[1][1].getValue() === currentBoard[2][0].getValue() && currentBoard[0][2].getValue() !== "") {
            console.log(`Player ${currentBoard[0][2].getValue()} wins!`);
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
            board.printBoard();
            return true;
        }

        return false;
    };

    this.playTurn = function () {
        board.printBoard();

        console.log(`It's ${currentPlayer.name}'s turn!`);
        let row = parseInt(prompt("Enter row (0-2):"));
        let column = parseInt(prompt("Enter column (0-2):"));

        board.addMarker(currentPlayer.marker, row, column);
        if (!checkForWin()) {
            switchPlayer();
        }
    }

    printNewRound();

    return { getCurrentPlayer, playTurn: this.playTurn };
}

 

const game = Gamecontroller();
game.playTurn();