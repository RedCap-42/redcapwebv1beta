import React from 'react';

type Props = { value: string | number; color: string };

const RouletteSegment: React.FC<Props> = ({ value, color }) => {
    return (
        <div className={`roulette-segment ${color}`}>
            <span>{value}</span>
        </div>
    );
};

export default RouletteSegment;