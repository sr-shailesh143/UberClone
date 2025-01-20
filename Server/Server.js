const express = require('express');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');
require('./config/db');
const { initializeSocket } = require('./socket');

// Import routes
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/captains', captainRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/rides', rideRoutes);

// Basic route
app.get('/', (req, res) => res.send('Hello World!'));

// Create HTTP server
const server = http.createServer(app);

// Initialize socket
initializeSocket(server);

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} 👍`);
});
