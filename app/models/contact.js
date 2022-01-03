var mongoose = require('mongoose')

var contactSchema = new mongoose.Schema({
    name: {type: String, required: true},
    tel: Number,
    email: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    owner: {type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true }
})

contactSchema.index({'name': 'text'})

module.exports = mongoose.model('Contact', contactSchema)