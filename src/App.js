import React, { useEffect, useState } from 'react';
import './App.css';
import './QueueTimes.css';

const App = () => {
  // Declare state variables to store the ride data and loading status
  const [rideData, setRideData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the queue times data using the useEffect hook
  useEffect(() => {
    const fetchData = async () => {
      const url =
        process.env.NODE_ENV === "development"
          ? "/queue-times-react-app/data/queue_times.json" // Local development URL
          : "https://cors-anywhere.herokuapp.com/https://queue-times.com/parks/4/queue_times.json"; // Production URL

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
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

  // Helper function to determine CSS class based on wait time
  const getClassName = (waitTime) => {
    if (!waitTime) return 'no-data';
    if (waitTime < 10) return 'short-wait';
    if (waitTime < 30) return 'medium-wait';
    return 'long-wait';
  };

  return (
    <div className="App">
      <h1>DLP Ride Queue Times 🎡</h1>
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
                  <li key={i} className={getClassName(ride.wait_time)}>
                    {/* Show ride name with a closed icon if the ride is closed */}
                    {ride.name}: {ride.is_open ? (
                      ride.wait_time ? `${ride.wait_time} minutes` : 'No wait time available'
                    ) : (
                      <span className="closed">
                        🚫 Closed
                      </span>
                    )}
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
