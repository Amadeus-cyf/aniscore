const path = require("path");
const multer = require("multer");
const fs = require('fs');
const User = require('../models/userSchema');
const Comment = require('../models/commentSchema');
const express = require('express');
const router = express.Router();

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000}
})

//change avatar
router.put('/:id', upload.single('avatar'), (req, res) => {
    let imageData = fs.readFileSync(req.file.path);
    Comment.find({user_id: req.params.id})
    .then(comments => {
        if (comments.length > 0) {
            comments.forEach(comment => {
                comment.avatar.data = imageData;
                comment.avatar.contentType = 'image/png';
                comment.save();
            })
        }
    }).catch(err => {
        return res.status(500).json({message: err});
    })
    User.findById(req.params.id).exec()
    .then(user => {
        user.avatar.data = imageData;
        user.avatar.contentType = 'image/png';
        user.save()
        .then(() => {
            return res.status(200).json({message: 'Successfully upload the avatar', data: {user}});
        })
    }).catch(err => {
        return res.status(500).json({message: err});
    })
})

module.exports = router;