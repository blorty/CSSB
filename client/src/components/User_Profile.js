// UserProfile.js
import React from 'react';
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { id } = useParams(); // Get the id from the URL

  // TODO: Fetch user data based on the id

    return (
        <div>
        <h1>User Profile</h1>
        <p>This is the profile of user with id: {id}</p>
        </div>
    );
}

export default UserProfile;
