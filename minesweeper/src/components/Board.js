import React from 'react';
import Cell from './Cell';

const Board = ({ board, handleCellClick }) => {
    return (
        <div className="board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, columnIndex) => (
                        <Cell
                            key={columnIndex}
                            value={cell.toString().replaceAll(' ','').replace('closed','').replace('flagged','').replace('minewrong','')}
                            position={`cell_${rowIndex}_${columnIndex}`}
                            closed={cell.toString().includes('closed') ? 'closed' : ''}
                            flagged={cell.toString().includes('flagged') ? 'flagged' : ''}
                            minewrong={cell.toString().includes('minewrong') ? 'minewrong' : ''}
                            onClick={(event) => { handleCellClick(event, rowIndex, columnIndex); }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Board;
