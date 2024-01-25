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


const Cell = ({ value, position, closed, flagged, onClick }) => {
    return (
        <div
            className={`cell type${value} ${closed} ${flagged}`}
            id={position}
            onClick={onClick}
            onContextMenu={onClick}
        />
    );
};

export default Cell;
