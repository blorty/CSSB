// StrategyCard.js
import React, { useState, useContext } from 'react';
import { AppContext } from '../AppContext';

function StrategyCard({ strategy }) {
    const { updateStrategy, deleteStrategy } = useContext(AppContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(strategy.name);
    const [editedDescription, setEditedDescription] = useState(strategy.description);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        updateStrategy(strategy.id, editedName, editedDescription);
    };

    const handleDelete = () => {
        deleteStrategy(strategy.id);
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg overflow-hidden">
            {isEditing ? (
                <>
                    <input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="strategyName" type="text"/>
                    <input value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2" id="strategyDescription" type="text"/>
                    <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Save</button>
                </>
            ) : (
                <>
                    <h3 className="text-lg font-bold">{strategy.name}</h3>
                    <p className="text-sm">{strategy.description}</p>
                    <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Edit</button>
                </>
            )}
            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2">Delete</button>
        </div>
    );
}

export default StrategyCard;