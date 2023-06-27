import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

const Home = () => {
    return (
        <Container style={{ marginTop: '7em' }}>
            <Header as='h1' textAlign='center'>Welcome to CSSB</Header>
            <Segment piled>
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
            </Segment>
        </Container>
    );
}

export default Home;
