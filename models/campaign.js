const mongoose = require("mongoose")

// define 'mongoose schema' where key/value pairs are what we want our models to be
// type definitions, validations mongoose options all go in the schema
// mongoose.Schema({ key/val pairs for the model}, options object(mongoose config)})

const CampaignSchema = new mongoose.Schema({
    name: {type: String, require:true},
    price: {type: Number, require:true},
    content: {type: String, require:true},
    image: {type: String, require:true},
    userId: { 
        // tell mongoose that this is a reference
        type: mongoose.Schema.Types.ObjectId,
        // tell mongoose what is being reference
        ref: 'User'
    }
}, {
    timestamps: true // mongoose will manage create at and updated fields for us
})

// turn the schema into a model so we can use it in our js
// exports
module.exports = mongoose.model('Campaign', CampaignSchema)