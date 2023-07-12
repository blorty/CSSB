import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';

function TeamPage() {
    const { user, isLoggedIn } = useContext(AppContext);
    const [teamName, setTeamName] = useState('');

    const createTeam = () => {
        if (isLoggedIn) {
            fetch('/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teamName }),
                credentials: 'include',  // Send cookies
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => Promise.reject(data.message));
                }
                return response.json();
            })
            .then(data => {
                // Handle success
                console.log('Team created:', data);
            })
            .catch(error => {
                console.error('Failed to create team:', error);
            });
        }
    };

    return (
        <div>
            <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Team name" />
            <button onClick={createTeam}>Create Team</button>
        </div>
    );
}

export default TeamPage;
