import React from 'react';

interface RouletteSegmentProps {
    value: string;
    color: string;
}

const RouletteSegment = ({ value, color }: RouletteSegmentProps) => {
    return (
        <div className={`roulette-segment ${color}`}>
            <span>{value}</span>
        </div>
    );
};

export default RouletteSegment;