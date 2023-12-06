import axios from 'axios';

export function dbPasswordTransaction() {
    axios.get('http://127.0.0.1:8000/password')
    .then(response => {
      console.log(response.data);
    })
}