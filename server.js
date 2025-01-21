const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const events = require('events');
const os = require('os');

const app = express();
const PORT = 3000;

// Function to get the private IP address of the machine
// function getLocalIPAddress() {
//   const interfaces = os.networkInterfaces();
//   for (const iface of Object.values(interfaces)) {
//     for (const info of iface) {
//       if (info.family === 'IPv4' && !info.internal) {
//         return info.address; // Return the first non-internal IPv4 address
//       }
//     }
//   }
//   return 'localhost'; // Fallback to localhost if no private IP is found
// }

// const localIP = getLocalIPAddress();

// Event emitters to handle SSE for each session
const sessions = new Map();

app.use(bodyParser.json());
app.use(express.static('public')); // Serve the front-end

// Endpoint to provide the host configuration
app.get('/config', (req, res) => {
  // res.json({ host: localIP });
    // For local development, you can check the environment
    const host = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    res.json({ host });
  
});

app.post('/session/:id', (req, res) => {
    const sessionId = req.params.id;
    const url = req.body.url;
  
    console.log('Received POST for session:', sessionId, 'URL:', url);
  
    if (sessions.has(sessionId)) {
      const emitter = sessions.get(sessionId);
      console.log('Emitting redirect event for session:', sessionId);
      emitter.emit('redirect', { url }); // Emit the URL to the desktop browser
      res.status(200).send('URL sent successfully.');
    } else {
      console.log('Session not found:', sessionId);
      res.status(404).send('Session not found.');
    }
  });
  

// Serve the form for entering the URL
app.get('/session/:id', (req, res) => {
    const sessionId = req.params.id;
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Enter URL</title>
      </head>
      <body>
        <h1>Enter URL to Redirect</h1>
        <form id="urlForm" onsubmit="handleSubmit(event)">
          <label for="url">URL:</label>
          <input type="url" id="url" name="url" required>
          <button type="submit">Submit</button>
        </form>
  
        <script>
          async function handleSubmit(event) {
            event.preventDefault();
            const url = document.getElementById('url').value;
            const sessionId = '${sessionId}';
            
            try {
              const response = await fetch('/session/' + sessionId, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
              });
              
              if (response.ok) {
                alert('URL sent successfully');
              } else {
                alert('Error sending URL');
              }
            } catch (error) {
              console.error('Error:', error);
              alert('Error sending URL');
            }
          }
        </script>
      </body>
      </html>
    `);
  });

// SSE endpoint to listen for updates
app.get('/events/:id', (req, res) => {
  const sessionId = req.params.id;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const emitter = new events.EventEmitter();
  sessions.set(sessionId, emitter);

  emitter.on('redirect', (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });

  req.on('close', () => {
    sessions.delete(sessionId);
    emitter.removeAllListeners();
  });
});

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running at http://${localIP}:${PORT}`);
// });


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});