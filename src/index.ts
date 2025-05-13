import mongoose from 'mongoose';
import { config } from './config/config';
import app from './app';

// Database connection
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }); 