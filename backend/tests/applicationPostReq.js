const axios = require('axios');

const url = 'https://apply-to-avantos.dev-sandbox.workload.avantos-ai.net';
const payload = { email: 'youremail@example.com' };

axios.post(url, payload, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Response:', response.data);
})
.catch(error => {
  console.error('Error:', error.response ? error.response.data : error.message);
});
