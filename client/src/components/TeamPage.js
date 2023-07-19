import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../AppContext';

const TeamPage = () => {
    console.log("Rendering TeamPage")
    const { user } = useContext(AppContext);
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState('');

  // Fetch teams on component mount
    useEffect(() => {
        console.log("Fetching teams")
        fetch('/team', {
        credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
            throw new Error("Failed to fetch teams");
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the data to the console
            setTeams(data.teams);
        })
        .catch(error => {
            console.error('Error:', error);
            console.log("Error fetching teams:", error);  // Add this line
        })
    }, []);


    const handleNewTeamNameChange = (event) => {
        setNewTeamName(event.target.value);
    };

    const handleNewTeamSubmit = (event) => {
        event.preventDefault();

        fetch('/team', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTeamName }),
        credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
            throw new Error("Failed to create team");
            }
            return response.json();
        })
        .then(data => {
            setTeams(prevTeams => [...prevTeams, data.team]);
            setNewTeamName('');
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div>
        <h1> Teams </h1>
        {teams.map((team) => (
            <div key={team.id} className="m-4 p-4 bg-gray-200 rounded shadow">
            <h2 className="text-xl font-bold">{team.name}</h2>
            {/* Add more team properties here */}
            </div>
        ))}
        <form onSubmit={handleNewTeamSubmit}>
            <input
            type="text"
            value={newTeamName}
            onChange={handleNewTeamNameChange}
            placeholder="New team name"
            />
            <button type="submit">Create Team</button>
        </form>
        </div>
    );
};

export default TeamPage;
