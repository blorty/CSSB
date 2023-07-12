import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';

function StrategyPage() {
    const { strategies, filteredMap, handleMapFilterChange } = useContext(AppContext);
    const [displayCount, setDisplayCount] = useState(10); // Initialize to 10

    const handleLike = (id) => {
        // You need to implement the code to handle like on your backend
        // After you implement the backend, you can make a request to update the like count
    }

    const mapNames = Array.isArray(strategies) ? ['All', ...new Set(strategies.map((item, index) => item.map ? item.map.name : `emptyMap${index}`))] : [];
    
    const filteredStrategies = Array.isArray(strategies) && filteredMap === 'All'
    ? strategies.slice(0, displayCount) // Only include the first displayCount strategies
    : strategies.filter(item => item.map && item.map.name === filteredMap).slice(0, displayCount); 

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold my-5">Strategy</h1>
            <div className="mb-5">
                <label htmlFor="mapFilter" className="mr-2">Filter by map:</label>
                <select id="mapFilter" value={filteredMap} onChange={(e) => handleMapFilterChange(e.target.value)} style={{color: 'black'}}>
                    {mapNames.map((map, index) => (
                        <option key={index} value={map}>{map}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-wrap justify-center">
            {filteredStrategies.map((item, index) => (
                item.strategy ? (
                    <div key={item.strategy.id} className="border m-2 p-2 rounded w-64">
                        <h2 className="font-bold mb-2 ">{item.strategy.title}</h2>
                        <p className="text-sm mb-2 text-orange-500">{item.map ? item.map.name : ""}</p>
                        <p className="text-sm mb-2">{item.strategy.content}</p>
                        <button className="text-blue-500" onClick={() => handleLike(item.strategy.id)}>
                            Like
                            {/* Assume you'll add a likes field to your strategy */}
                            {/* {strategy.likes} */}
                        </button>
                    </div>
                ) : <div key={`emptyStrategy${index}`}>No strategy data</div>
            ))}
            </div>
            <button onClick={() => setDisplayCount(displayCount + 10)}>Load more</button>
        </div>
    );
}

export default StrategyPage;
