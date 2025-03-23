const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const API = 'http://localhost:5000/api/files';

const ideaId = 1;
const userId = '2625c67a-06c1-462c-8f92-6703f38e092e';
const testFilePath = path.join(__dirname, 'test_upload.txt');
const parentId = null; // set a folder ID here if needed

(async () => {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));
    form.append('name', 'test_upload.txt');
    form.append('type', 'upload');
    form.append('idea_id', ideaId.toString());
    form.append('user_id', userId);
    form.append('parent_id', parentId || '');

    const response = await axios.post(`${API}/upload`, form, {
      headers: form.getHeaders(),
    });

    console.log('✅ Uploaded file successfully:');
    console.log(response.data);
  } catch (err) {
    console.error('❌ Upload test failed:');
    console.error(err.response?.data || err.message);
  }
})();
