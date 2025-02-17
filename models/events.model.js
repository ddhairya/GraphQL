const mongoose = require('mongoose')

const Schema = mongoose.Schema

const eventSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    },
    created_by : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
    
})

module.exports = mongoose.model('Event',eventSchema)