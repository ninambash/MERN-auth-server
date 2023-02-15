const express = require('express')
const { isValidObjectId } = require('mongoose')
const {Donation} = require('../models')
const router = express.Router()
const db = require('../models')
const authLockedRoute = require('./api-v1/authLockedRoute')

// mount our routes on the router

// GET /:id -- get one donation
router.get('/:id', async (req,res) =>{
    try{
       
        const donation = await db.Donation.findOne({
            _id: req.params.id
        })
        res.json(donation)
    } catch(err){
        console.log(err)
        res.status(500).json({
            msg: 'internal server error, contact the system administrator'
        })
    }
})


// GET / -- display all items
router.get('/', async (req,res) =>{
    try{
        const Donations = await db.Donation.find()
        res.json(Donations)
    } catch(err){
        console.log(err)
        res.status(500).json({
            msg: 'internal server error, contact the system administrator'
        })
    }
})


// POST /item/new -- create one item 
router.post('/new', authLockedRoute, async (req,res) =>{
    try{
  // find user
  const existingUser = res.locals.user
    // creates a new item
    const newDonation = await db.Donation.create({
        name: req.body.name,
        price: req.body.price,
        content: req.body.content, 
        userId: existingUser._id
    })

    //associates user with donation
    if (existingUser.donation) {
        existingUser.donations.push(newDonation._id);
    } else {
        existingUser.donation = [newDonation._id];
    }
    await existingUser.save();
    

    res.json({msg: 'user created a donation'})

    } catch(err){
        console.log(err)
        res.status(500).json({
            msg: 'internal server error, contact the system administrator'
        })
    }
})
// PUT /item/:id -- update one item
router.put('/:id', authLockedRoute, async (req,res) =>{
    try{

    // update an existing item
    const updateDonation = await db.Donation.findOneAndUpdate( 
        {_id: req.params.id} , 
        { 
            $set: {
            name: req.body.name,
            price: req.body.price , 
            content: req.body.content , 
            
            }
        } ,
        {new: true}
    )

    res.json({msg: `user updated donation`})

    } catch(err){
        console.log(err)
        res.status(500).json({
            msg: 'internal server error, contact the system administrator'
        })
    }
})

//DELETE /:id - deletes an item from items table and the reference in the users table
    // router.delete('/:id', async (req,res) =>{
    //     try{
    //         //get item to delete from items table, need to get info before we delete the table to use in the user table
    //         const campaignToDelete = await db.Campaign.findOne({
    //             _id: req.params.id
    //         })
            
    //         //find user that created the item in the user table
    //         const getUser = res.locals.user
    //         // await db.User.findOne({
    //         //     _id: itemToDelete.userId  
    //         // })
           
    //         //update user table to remove one item from user table
    //         const deleteFromUser = await db.User.updateOne(
    //             {_id: campaignToDelete.userId},
    //             // {_id: itemToDelete.userId},
    //             {$pull: {campaigns: {$in: [req.params.id]}}}
    //         )

    //         //delete entire item from item table
    //         const deletedCampaign = await db.Item.findByIdAndDelete(req.params.id)

    //         res.json('item deleted from items table and from user who created it')
            
    //     } catch(err){``
    //         console.log(err)
    //         res.status(500).json({
    //             msg: 'internal server error, contact the system administrator'
    //         })
    //     }
    // })



//export the router
module.exports = router