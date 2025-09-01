import React from 'react';

const Header: React.FC = () => {
    return (
        <header>
            <h1>Casque Tête Rouge</h1>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/session">Sessions</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;