import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Token Profile: ", token);
        const response = await axios.get("http://localhost:8000/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("res: ", response);
        setUserData(response.data);
      } catch (error) {
        console.error(error);
        alert('Error fetching profile data. Please try again later.');
        // Consider redirecting to login page or handling error gracefully
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      {userData ? (
        <div>
          <h2>Welcome, {userData.email}!</h2>
          {/* Display other user details as needed */}
        </div>
      ) : (
        <p>Loading profile data...</p>
      )}
    </div>
  );
};

export default Profile;