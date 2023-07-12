import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';

function UserProfile() {
    const { user, isLoggedIn } = useContext(AppContext);
    const [name, setName] = useState(user ? user.name : '');
    const [email, setEmail] = useState(user ? user.email : '');
    

    const updateProfile = () => {
        if (isLoggedIn) {
            fetch('/profile/<id>', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
                credentials: 'include',
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => Promise.reject(data.message));
                }
                return response.json();
            })
            .then(data => {
                // Handle success
                console.log('Profile updated:', data);
            })
            .catch(error => {
                console.error('Failed to update profile:', error);
            });
        }
    };

    return (
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
            <div className="flex-shrink-0">
                <img className="h-12 w-12" src={user ? user.avatar : '/default-avatar.jpg'} alt="avatar" />
            </div>
            <div>
                <div className="text-xl font-medium text-black">Profile</div>
                <input className="shadow appearance-none border rounded py-2 px-3 text-grey-darker" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
                <input className="shadow appearance-none border rounded py-2 px-3 text-grey-darker" type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={updateProfile}>Update Profile</button>
            </div>
        </div>
    );
}

export default UserProfile;
