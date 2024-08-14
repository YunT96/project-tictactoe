function Gameboard(){
    const rows = 3;
    const columns = 3;
    const board = [];
    // for (let i = 0; i < rows; i++) {
    //     board[i] = [];
    //     for (let j = 0; j < columns; j++) {
    //       board[i].push(1);
    //     }
    //   }
      
    const printBoard = () => console.table(board);

    return { printBoard };
}

const gameboard = Gameboard();
gameboard.printBoard();
console.log("Hello world");