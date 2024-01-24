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
                            value={cell}
                            position={`cell_${rowIndex}_${columnIndex}`}
                            onClick={function() { handleCellClick.call(this, rowIndex, columnIndex); }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Board;
