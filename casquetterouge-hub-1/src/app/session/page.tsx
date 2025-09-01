import React from 'react';
import SessionGeneratorButton from '../../components/features/session-generator/SessionGeneratorButton';

const SessionPage = () => {
    return (
        <div>
            <h1>Session Generator</h1>
            <p>Click the button below to generate a session!</p>
            <SessionGeneratorButton />
        </div>
    );
};

export default SessionPage;