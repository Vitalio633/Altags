import express from 'express';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();

// CORS headers to allow cross-origin requests from your domain
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // Replace with your client-side port
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

// Serve the HTML page on the root URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html')); // Use 'join' to create the file path
  });


// Proxy route
app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is missing.' });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const htmlContent = await response.text();

    // Extract images from HTML content (You can modify this part as needed)
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = doc.getElementsByTagName("img");
    const imageList = [];

    for (let i = 0; i < images.length; i++) {
      const imageElement = images[i];
      const src = imageElement.src;
      const alt = imageElement.alt;
      imageList.push({ src, alt });
    }

    res.json(imageList);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from the remote server.' });
  }
});

// Start the server
const port = 3000; // Replace with your desired port
app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
