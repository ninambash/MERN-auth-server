require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rowdy = require('rowdy-logger');
const Stripe = require('stripe')(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// config express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 8000;
// for debug logging 
const rowdyResults = rowdy.begin(app);
// cross origin resource sharing 
app.use(cors());
// request body parsing
app.use(express.json());

// GET / -- test index route
app.get('/', (req, res) => {
  res.json({ msg: 'hello backend 🤖' });
});

////to post the payment request
app.post('/payment', async (req, res) => {
  let status;
  try {
    const { token, amount } = req.body;
    await Stripe.charges.create({
      source: token.id,
      amount,
      currency: 'usd',
    });
    status = 'success';
    res.json({ status });
  } catch (error) {
    console.log(error);
    status = 'Failure';
    res.json({ error, status });
  }
});

// controllers
app.use('/api-v1/users', require('./controllers/api-v1/users.js'));
app.use('/campaign', require('./controllers/campaign.js'));
app.use('/donation', require('./controllers/donation.js'));

// hey listen
app.listen(PORT, () => {
  rowdyResults.print();
  console.log(`is that port ${PORT} I hear? 🙉`);
});
