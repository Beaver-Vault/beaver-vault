import axios from 'axios';

export async function deleteUser(userId) {
  try {
    const response = await axios.delete(`http://localhost:8000/users/${userId}`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}