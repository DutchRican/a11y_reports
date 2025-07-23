
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const scanResultsRouter = require('./routes/scanResults');
const projectsRouter = require('./routes/projects');

dotenv.config();

const app = express();

app.use(compression());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));

const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/a11y_reports';

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/scan-results', scanResultsRouter);
app.use('/api/projects', projectsRouter);

// Serve static files from frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('/{*any}', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { app, server };
