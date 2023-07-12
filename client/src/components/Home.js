import React from 'react';

const Home = () => {
    return (
        <div className="container mx-auto px-4 mt-16">
            <h1 className="text-center text-4xl">Welcome to CSSB</h1>
            <div className="bg-white text-black rounded-lg shadow-md p-6 my-8">
                <p>
                    CSSB (Counter-Strike: Strategy Board) is an application designed to help CS:GO players
                    enhance their game strategy. Here, you can join teams, create and share your own strategies,
                    learn from others, and much more.
                </p>
                <p>
                    To get started, sign up for a new account or log in if you already have one. Once logged in,
                    you can visit your profile to manage your information, join a team or even create your own.
                    The 'Strategies' page will allow you to dive into the world of CS:GO strategies.
                </p>
                <p>
                    Happy strategizing!
                </p>
            </div>
        </div>
    );
}

export default Home;
