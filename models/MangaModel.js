const mongoose  = require('mongoose');

const Manga = mongoose.model('Manga',{
    mediaName: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    }
})