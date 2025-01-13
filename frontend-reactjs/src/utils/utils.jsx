import axios from 'axios';

export const fetchUserData = async (token) => {
  const response = await axios.get('/api/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.user;
};