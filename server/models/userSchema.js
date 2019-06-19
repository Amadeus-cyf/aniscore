const mongoose = require('mongoose');
const crypto = require('crypto');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    //use salt and hash to store password
    salt:{
        type: String,
    },
    hash: {
        type: String,
    },
    //commentAnime is an array of object, each object contains comment and anime;
    commentAnime: {
        type: Array,
        default: [],
    },
    //score anime is an array of object, each object contains anime and score;
    scoreAnime: {
        type: Array,
        default: [],
    },
    avatar: {
        data: Buffer,
        contentType: String,
    },
    background: {
        data: Buffer,
        contentType: String,
    }
})

//set password for user
UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}

//check whether the password for login is correct
UserSchema.methods.validPassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return hash === this.hash;
}

module.exports = mongoose.model('User', UserSchema);
