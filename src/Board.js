import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 * - litCells: stack of coordinates of lit cells
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.25 }) {
  const [board, setBoard] = useState(createBoard());
  const [litCells, setLitCells] = useState([]);

  useEffect(() => {
    // Initialize the stack of lit cells when the board is created
    const initialLitCells = [];
    for (let y = 0; y < nrows; y++) {
      for (let x = 0; x < ncols; x++) {
        if (board[y][x]) {
          initialLitCells.push(`${y}-${x}`);
        }
      }
    }
    setLitCells(initialLitCells);
  }, [board]);

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    return Array.from({ length: nrows }).map(
      row => Array.from({ length: ncols }).map(
        cell => Math.random() < chanceLightStartsOn // true or false
      )
    );
  }

  function hasWon() {
    return litCells.length === 0;
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy, litCellsCopy) => {
        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
          const cellCoord = `${y}-${x}`;
          if (boardCopy[y][x]) {
            litCellsCopy.push(cellCoord);
          } else {
            const index = litCellsCopy.indexOf(cellCoord);
            if (index > -1) {
              litCellsCopy.splice(index, 1);
            }
          }
        }
      };

      const boardCopy = oldBoard.map(row => [...row]);
      const litCellsCopy = [...litCells];

      flipCell(y, x, boardCopy, litCellsCopy);
      flipCell(y, x - 1, boardCopy, litCellsCopy);
      flipCell(y, x + 1, boardCopy, litCellsCopy);
      flipCell(y - 1, x, boardCopy, litCellsCopy);
      flipCell(y + 1, x, boardCopy, litCellsCopy);

      setLitCells(litCellsCopy);

      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return <div>You Win!</div>;
  }

  // make table board: rows of Cell components
  let tblBoard = [];

  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let coord = `${y}-${x}`;
      row.push(
        <Cell
          key={coord}
          isLit={board[y][x]}
          flipCellsAroundMe={evt => flipCellsAround(coord)}
        />,
      );
    }
    tblBoard.push(<tr key={y}>{row}</tr>);
  }

  // make table board
  return (
    <table className="Board">
      <tbody>{tblBoard}</tbody>
    </table>
  );
}

export default Board;
