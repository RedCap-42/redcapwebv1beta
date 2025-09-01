import React from 'react';
import { useRouter } from 'next/router';
import Button from '../../ui/Button';

const SessionGeneratorButton: React.FC = () => {
    const router = useRouter();

    const handleClick = () => {
        // Navigate to the session generator page or trigger the roulette animation
        router.push('/session-generator'); // Adjust the path as necessary
    };

    return (
        <Button onClick={handleClick} label="Generate Session" />
    );
};

export default SessionGeneratorButton;