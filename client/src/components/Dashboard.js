import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import StrategyCard from './StrategyCard';
import CreateTeamModal from './CreateTeamModal';

function Dashboard() {
    const { user, strategies } = useContext(AppContext);
    const [showModal, setShowModal] = useState(false); // New state variable

    if (!user) {
        return <h1>Please login to view this page</h1>;
    }

    const userStrategies = user.strategies || [];

    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <div className="p-5 space-y-6 border-double border-4 border-x-blue-600 border-y-blue-700 -tw-ring-offset-width: 8px rounded-lg">
            <h2 className="text-2xl font-bold text-center capitalize hover:text-orange-600 ">
            DASHBOARD
            </h2>
            <p>Welcome, {user.username}!</p> {/* Display the username */}


            <h3 className="text-xl font-semibold">User Profile</h3>
            <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="sm:flex sm:items-center px-6 py-4">
                <div className="text-center sm:text-left sm:flex-grow">
                <div className="mb-4">
                    <p className="text-xl leading-tight">{user.name}</p>
                    <p className="text-sm leading-tight text-gray-600">{user.email}</p>
                </div>
                </div>
            </div>
            </div>

            {/* User Strategies */}
            {/* {userStrategies.length > 0 ? (
            userStrategies.map((strategy, index) => (
                <StrategyCard key={index} strategy={strategy} />
            ))
            ) : (
            <p>No strategies available.</p>
            )} */}

            {/* All Strategies */}
            {/* <h3 className="text-xl font-semibold">Strategy Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {strategies && strategies.length > 0 ? (
                strategies.map((strategy, index) => (
                <div key={index} className="p-4 bg-white shadow rounded-lg overflow-hidden">
                    <div className="sm:flex sm:items-center px-2 py-4">
                    <div className="text-center sm:text-left sm:flex-grow">
                        <div className="mb-2">
                        <p className="text-lg leading-tight">{strategy.name}</p>
                        <p className="text-sm leading-tight text-gray-600">{strategy.description}</p>
                        </div>
                    </div>
                    </div>
                </div>
                ))
            ) : (
                <p>No strategies available.</p>
            )}
            </div> */}

            <h3 className="text-xl font-semibold">Activity Feed</h3>
            <div className="divide-y divide-gray-200">
            {user.activities && user.activities.length > 0 ? (
                user.activities.map((activity, index) => (
                <div key={index} className="py-4">
                    <p className="text-sm leading-tight">{activity}</p>
                </div>
                ))
            ) : (
                <p>No activities available.</p>
            )}
            </div>

            {showModal && <CreateTeamModal onClose={() => setShowModal(false)} />}

            <h3 className="text-xl font-semibold">Quick Actions</h3>
            <div className="flex space-x-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Update Profile
            </button>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowModal(true)}
            >
                Create Team
            </button>
            </div>
        </div>
        </div>
    );
}

export default Dashboard;
