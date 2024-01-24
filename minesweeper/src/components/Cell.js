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


const Cell = ({ value, position, onClick }) => {
    return (
        <div>
            
            <div
                className={`closed under${value}`}
                id={`closed-${position}`}
                onClick={onClick}
            />
            
            <div
                className={`cell type${value}`}
                id={position}
            />
        </div>
            
    );
};

export default Cell;
