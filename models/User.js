// require mongoose ODM
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  Campaign: [{
    // tell mongoose that this is a reference
    type: mongoose.Schema.Types.ObjectId,
    // tell mongoose what is being reference
    ref: 'Campaign'

  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('User', UserSchema)