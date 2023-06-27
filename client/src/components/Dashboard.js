import React from 'react';
import { Card, Feed, Icon, Button } from 'semantic-ui-react';
import { AppContext } from '../AppContext';
import { useContext } from 'react';

// User Profile Component
function UserProfile() {
    // Replace with actual user data
    const { isLoggedIn } = useContext(AppContext);

    if (!isLoggedIn) {
        return (
            <div>
                <h1>Please login to view this page</h1>
            </div>
        );
    }
    
    const user = { name: 'John Doe', email: 'john.doe@example.com' };

    return (
        <Card>
            <Card.Content>
                <Card.Header>{user.name}</Card.Header>
                <Card.Meta>
                    <span>{user.email}</span>
                </Card.Meta>
            </Card.Content>
        </Card>
    );
}

// Team Overview Component
function TeamOverview() {
    // Replace with actual team data
    const teams = ['Team 1', 'Team 2', 'Team 3'];

    return (
        <Card.Group>
            {teams.map((team, index) => (
                <Card key={index}>
                    <Card.Content>
                        <Card.Header>{team}</Card.Header>
                    </Card.Content>
                </Card>
            ))}
        </Card.Group>
    );
}

// Strategy Overview Component
function StrategyOverview() {
    // Replace with actual strategy data
    const strategies = ['Strategy 1', 'Strategy 2', 'Strategy 3'];

    return (
        <Card.Group>
            {strategies.map((strategy, index) => (
                <Card key={index}>
                    <Card.Content>
                        <Card.Header>{strategy}</Card.Header>
                    </Card.Content>
                </Card>
            ))}
        </Card.Group>
    );
}

// Activity Feed Component
function ActivityFeed() {
    // Replace with actual activity data
    const activities = ['Activity 1', 'Activity 2', 'Activity 3'];

    return (
        <Feed>
            {activities.map((activity, index) => (
                <Feed.Event key={index}>
                    <Feed.Content>
                        <Feed.Summary>
                            {activity}
                        </Feed.Summary>
                    </Feed.Content>
                </Feed.Event>
            ))}
        </Feed>
    );
}

// Quick Actions Component
function QuickActions() {
    // Define your quick actions here
    const actions = ['Action 1', 'Action 2', 'Action 3'];

    return actions.map((action, index) => (
        <Button icon labelPosition='left' key={index}>
            <Icon name='edit' />
            {action}
        </Button>
    ));
}

// Dashboard Component
function Dashboard() {
    return (
        <div>
            <h2>Dashboard</h2>

            <h3>User Profile</h3>
            <UserProfile />

            <h3>Team Overview</h3>
            <TeamOverview />

            <h3>Strategy Overview</h3>
            <StrategyOverview />

            <h3>Activity Feed</h3>
            <ActivityFeed />

            <h3>Quick Actions</h3>
            <QuickActions />
        </div>
    );
}

export default Dashboard;
