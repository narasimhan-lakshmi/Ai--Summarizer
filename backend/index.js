require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 5000;
//console.log('Hugging Face API Token:', process.env.HUGGINGFACE_API_TOKEN); 

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (!process.env.HUGGINGFACE_API_TOKEN) {
    return res.status(500).send('Hugging Face API token not set in environment variables');
  }
  next();
});

app.post('/api/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send('Text is required in the request body');
  }

  try {
    const apiUrl = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
    const response = await axios.post(apiUrl, { inputs: text }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
      },
    });
 // Handle specific status codes
 if (response.status === 401) {
  return res.status(401).send('Unauthorized: Hugging Face API token is incorrect or expired');
}

// Handle other errors
if (response.status !== 200) {
  throw new Error(`Hugging Face API Error: ${response.statusText}`);
}
    res.json({ summary: response.data[0].summary_text });
  } catch (error) {
    console.error('Error summarizing text:', error.response ? error.response.data : error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
