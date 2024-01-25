import React from 'react';
import '../styles/cell.css';

const renderSwitch = (value) => {
    switch (value) {
        case 'bomb':
            return '💣';
        default:
            return value;
    }
};


const Cell = ({ value, position, closed, onClick }) => {
    return (
        <div>
            
            <div
                className={`cell type${value} ${closed}`}
                id={position}
                onClick={onClick}
            />
        </div>
            
    );
};

export default Cell;
