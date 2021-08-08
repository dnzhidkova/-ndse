const { Schema, model } = require('mongoose')
const uidGenerator = require('node-unique-id-generator');

const BookSchema = new Schema({
    id: String,
    title: {
        type: String,
        required: true
    },
    description: String,
    authors: String,
    favorite: Boolean,
    fileCover: String,
    fileName: String
})

BookSchema.pre(['save', 'insertMany'], function(next){
    this.id = uidGenerator.generateUniqueId();
    next();
});

module.exports = model('Book', BookSchema)
