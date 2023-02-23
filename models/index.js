const mongoose = require('mongoose');
require('dotenv').config();

const dbName = 'mernAuth';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/' + dbName;

if (!MONGODB_URI) {
  console.error('MongoDB URI is missing. Check your environment variables.');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, // add this line
});

const db = mongoose.connection;

// Connection methods
db.once('open', () => {
  console.log(`🔗 Connected to MongoDB at ${db.host}:${db.port}`);
});

db.on('error', (err) => {
  console.error(`🔥 Datacenter burned down:\n${err}`);
});

module.exports = {
  User: require('./User'),
  Campaign: require('./Campaign')

};
