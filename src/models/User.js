const bcrypt = require('bcryptjs');
const { Schema, model } = require('mongoose')
const uidGenerator = require('node-unique-id-generator');

const UserSchema = new Schema({
    id: String,
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    email: String
})

UserSchema.pre(['save', 'insertMany'], function(next){
    if (!this.id) {
        this.id = uidGenerator.generateUniqueId();
    }
    if (this.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                this.password = hash;
                next();
            });
        });
    }
});

UserSchema.methods.comparePassword = function (inputPassword, cb) {
    bcrypt.compare(inputPassword, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = model('User', UserSchema)
