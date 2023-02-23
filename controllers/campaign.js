
//const { isValidObjectId } = require('mongoose');
//const  Campaign  = require('../models');
const router = express.Router();
//const db = require('../models');
// const db = require("../models");
// const db = require("./..models");
const db = require("/models")

const authLockedRoute = require('./api-v1/authLockedRoute');

// mount our routes on the router

// GET /:id -- get one item
// GET /:id -- get one item
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
    });
    res.json(campaign);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: 'internal server error, contact the system administrator',
    });
  }
});


// GET / -- display all items
router.get('/', async (req, res) => {
  try {
    const campaigns = await db.Campaign.find();
    res.json(campaigns);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: 'internal server error, contact the system administrator',
    });
  }
});

// POST /item/new -- create one item
router.post('/new', authLockedRoute, async (req, res) => {
  try {
    // find user
    const existingUser = res.locals.user;
    // creates a new item
    const newCampaign = await db.Campaign.create({
      name: req.body.name,
      price: req.body.price,
      content: req.body.content,
      image: req.body.image,
      userId: existingUser._id,
    });
    console.log(newCampaign);

    //associates user with campaign
    if (existingUser.campaigns) {
      existingUser.campaigns.push(newCampaign._id);
    } else {
      existingUser.campaigns = [newCampaign._id];
    }
    await existingUser.save();

    res.json({ msg: 'user created item' });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: 'internal server error, contact the system administrator',
    });
  }
});
// PUT /item/:id -- update one item
router.put('/:id', authLockedRoute, async (req, res) => {
  try {
    // update an existing item
    const updateCampaign = await db.Campaign.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          price: req.body.price,
          content: req.body.content,
          image: req.body.image,
        },
      },
      //upsert is an update or create command
      { upsert: true, new: true }
    );

    res.json({ msg: `user updated campaign` });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: 'internal server error, contact the system administrator',
    });
  }
});

//DELETE /:id - deletes an item from items table and the reference in the users table
router.delete('/:id', async (req, res) => {
  try {
    //get item to delete from items table, need to get info before we delete the table to use in the user table
    const campaignToDelete = await db.Campaign.findOne({
      _id: req.params.id,
    });
    console.log(campaignToDelete, 'campaign to delete');

    //find user that created the item in the user table

    //update user table to remove one item from user table
    const deleteFromUser = await db.User.updateOne(
      { _id: campaignToDelete.userId },
      // {_id: itemToDelete.userId},
      { $pull: { campaigns: { $in: [req.params.id] } } }
    );
    //delete entire item from item table
    const deletedCampaign = await db.Campaign.findByIdAndDelete(req.params.id);
    console.log(deletedCampaign, 'deletedCampaign');

    res.json('item deleted from items table and from user who created it');
  } catch (err) {
    ``;
    console.log(err);
    res.status(500).json({
      msg: 'internal server error, contact the system administrator',
    });
  }
});

//export the router
module.exports = router;
