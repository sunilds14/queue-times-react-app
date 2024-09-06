import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  // Declare state variables to store the ride data and loading status
  const [rideData, setRideData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the queue times data using the useEffect hook
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/parks/4/queue_times.json');
        const data = await response.json();
        // Set the ride data from the API response
        setRideData(data.lands); // 'lands' contains the rides
        setLoading(false); // Stop loading after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Stop loading even if there is an error
      }
    };
    fetchData();
  }, []); // Empty array ensures the effect runs only once after the component mounts

  return (
    <div className="App">
      <h1>Ride Queue Times</h1>
      {/* Show loading spinner if data is being fetched */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* Iterate over the rideData array and display the rides */}
          {rideData.map((land, index) => (
            <div key={index}>
              <h2>{land.name}</h2>
              <ul>
                {land.rides.map((ride, i) => (
                  <li key={i}>
                    {ride.name}: {ride.wait_time ? `${ride.wait_time} minutes` : 'No wait time available'}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
