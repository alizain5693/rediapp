# rediapp

A simple web application that generates a QR code which, when scanned, allows users to enter a URL that will redirect the original browser window. Perfect for easily sharing URLs from your mobile device to your desktop browser (or TV, its what i used it for)

## Features

- Generates unique session IDs for each connection
- Creates QR codes for easy mobile access
- Real-time redirect using Server-Sent Events (SSE)
- Works across local network

## Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
cd qr-redirect
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node server.js
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

1. Open the app in your desktop browser
2. Scan the displayed QR code with your mobile device
3. Enter any URL in the form on your mobile device
4. Your desktop browser will automatically redirect to the entered URL

## Deployment

This app is configured for easy deployment on Render.com:

1. Push code to GitHub
2. Sign up on Render.com
3. Create a new Web Service pointing to your repository
4. Deploy! (Configuration is handled by render.yaml)

## Dependencies

- express
- uuid
- body-parser
- QRCode.js (via CDN)

## Environment Variables

- `PORT`: Server port (defaults to 3000 locally, 10000 on Render)

## License

MIT
