const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API = 'http://localhost:5000/api/files';
const IDEA_ID = 1; // 🔁 Replace with a valid idea ID from your database
const USER_ID = '2625c67a-06c1-462c-8f92-6703f38e092e'; // 🔁 Replace with a valid user ID

async function testCreateFolder() {
  const res = await axios.post(API, {
    name: 'Test Folder',
    type: 'folder',
    idea_id: IDEA_ID,
    user_id: USER_ID,
    parent_id: null
  });
  console.log('✅ Created folder:', res.data);
  return res.data;
}

async function testCreateTextFile(parentId = null) {
  const res = await axios.post(API, {
    name: 'test.txt',
    type: 'text',
    idea_id: IDEA_ID,
    user_id: USER_ID,
    parent_id: parentId,
    content: 'This is a test file.'
  });
  console.log('✅ Created text file:', res.data);
  return res.data;
}

async function testUploadFile(parentId = null) {
  const form = new FormData();
  form.append('file', fs.createReadStream('./test_upload.txt')); // 🔁 Make sure this file exists
  form.append('name', 'test_upload.txt');
  form.append('type', 'upload');
  form.append('idea_id', IDEA_ID.toString());
  form.append('user_id', USER_ID);
  form.append('parent_id', parentId || '');

  const res = await axios.post(`${API}/upload`, form, {
    headers: form.getHeaders()
  });

  console.log('✅ Uploaded file:', res.data);
  return res.data;
}

async function testGetFiles() {
  const res = await axios.get(`${API}?idea_id=${IDEA_ID}`);
  console.log('📁 All files:', res.data);
  return res.data;
}

async function testUpdateFile(fileId) {
  const res = await axios.put(`${API}/${fileId}`, {
    name: 'updated.txt',
    content: 'Updated content'
  });
  console.log('✏️ Updated file:', res.data);
  return res.data;
}

async function testDeleteFile(fileId) {
  const res = await axios.delete(`${API}/${fileId}`);
  console.log('🗑️ Deleted file:', res.data);
  return res.data;
}

async function runTests() {
  try {
    const folder = await testCreateFolder();
    const textFile = await testCreateTextFile(folder.id);
    const upload = await testUploadFile(folder.id);
    await testGetFiles();
    await testUpdateFile(textFile.id);
    await testDeleteFile(upload.id);
    await testDeleteFile(textFile.id);
    await testDeleteFile(folder.id);
  } catch (err) {
    console.error('❌ Test failed:', err.response?.data || err.message);
  }
}

runTests();
