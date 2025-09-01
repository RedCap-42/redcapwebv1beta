import React from 'react';

const RouletteWheel: React.FC = () => {
    const [rotation, setRotation] = React.useState(0);
    const [spinning, setSpinning] = React.useState(false);

    const spinWheel = () => {
        if (spinning) return;

        setSpinning(true);
        const randomRotation = Math.floor(Math.random() * 360) + 720; // Spin at least 2 full rotations
        setRotation(randomRotation);

        setTimeout(() => {
            setSpinning(false);
        }, 4000); // Duration of the spin animation
    };

    return (
        <div className="roulette-container">
            <div
                className="roulette-wheel"
                style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: spinning ? 'transform 4s ease-out' : 'none',
                }}
            >
                {/* Render roulette segments here */}
            </div>
            <button onClick={spinWheel} disabled={spinning}>
                Spin the Wheel
            </button>
        </div>
    );
};

export default RouletteWheel;