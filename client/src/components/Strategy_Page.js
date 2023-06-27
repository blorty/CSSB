import React, { useState, useEffect } from 'react';
import { Card, Icon, Select } from 'semantic-ui-react';

function StrategyPage() {
  // State to hold strategies
    const [strategies, setStrategies] = useState([]);
    
    // NEW: state to hold the filter for the map
    const [filteredMap, setFilteredMap] = useState('All');

    useEffect(() => {
        // Function to fetch strategies data
        let cancel = false;

        const fetchStrategies = async () => {
        try {
            const response = await fetch('/strategies');
            const data = await response.json();
            if (!cancel) {
            setStrategies(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            if (!cancel) {
            console.error('Failed to fetch strategies:', error);
            }
        }
        };
        
        fetchStrategies();

        // Cleanup function
        return () => {
        cancel = true;
        };
    }, []);


    const handleLike = (id) => {
        // You need to implement the code to handle like on your backend
        // After you implement the backend, you can make a request to update the like count
    }

    const handleMapFilterChange = (e, { value }) => {
        setFilteredMap(value);
    }

    const mapOptions = Array.isArray(strategies) ? [...new Set(strategies.map(strategy => strategy.map_name))].map(map => ({
        key: map,
        text: map,
        value: map
    })) : [];
    
    const filteredStrategies = Array.isArray(strategies) && filteredMap === 'All'
    ? strategies
    : strategies.filter(strategy => strategy.map_name === filteredMap);    

    return (
        <div>
            <h1>Strategy</h1>
            <Select placeholder='Select Map' options={mapOptions} onChange={handleMapFilterChange} />
            <div>
                {filteredStrategies.map(strategy => (
                    <Card key={strategy.id}>
                        <Card.Content>
                            <Card.Header>{strategy.title}</Card.Header>
                            <Card.Meta>{strategy.map.name}</Card.Meta>
                            <Card.Description>{strategy.content}</Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Icon name='like' onClick={() => handleLike(strategy.id)} />
                            {/* Assume you'll add a likes field to your strategy */}
                            {/* {strategy.likes} */}
                        </Card.Content>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default StrategyPage;
