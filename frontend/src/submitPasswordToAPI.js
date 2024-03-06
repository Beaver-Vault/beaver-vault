import axios from 'axios';

export function dbPasswordTransaction() {
    axios.get(`${process.env.REACT_APP_API_URL}/password`)
    .then(response => {
      console.log(response.data);
    })
}