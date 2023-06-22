// TeamPage.js
import React from 'react';
import { useParams } from 'react-router-dom';

function TeamPage() {
  const { id } = useParams(); // Get the id from the URL

  // TODO: Fetch team data based on the id

    return (
        <div>
        <h1>Team</h1>
        <p>This page will show information about the team with id: {id}</p>
        </div>
    );
}

export default TeamPage;
