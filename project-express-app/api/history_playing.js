var expressFunction = require('express'); //object to call
const router = expressFunction.Router();
const mongoose = require('mongoose');
const authorization = require('../config/authorize')

var Schema = require("mongoose").Schema;

const History_Playing = Schema({
    owner: String,
    point: Number,
    datetime: String,
    quizName: String,
}, {
    collection: 'history_playing'
});

let Playing
try {
    Playing = mongoose.model('history_playing')
} catch (error) {
    Playing = mongoose.model('history_playing', History_Playing);
}


// Add New playing
const addPlaying = (PlayingData) => {
    return new Promise((resolve, reject) => {
        var new_playing = new Playing({
            owner: PlayingData.owner,
            point: PlayingData.point,
            datetime: PlayingData.datetime,
            quizName: PlayingData.quizName,
        });
        new_playing.save((err, data) => {
            if (err) {
                reject(new Error('Cannot add playing to DB!'));
            } else {
                resolve({ message: 'Add playing successfully' });
            }
        });
    });
}

router.route('/addplaying')
    .post(authorization, (req, res) => {
        const payload = {
            owner: req.body.owner,
            point: req.body.point,
            datetime: req.body.datetime,
            quizName: req.body.quizName,
        }
        console.log(payload);
        addPlaying(payload)
            .then(result => {
                console.log(result);
                res.status(200).json(result);
            })
            .catch(err => {
                console.log(err);
            })
    });


// Get Playing
router.route('/getplaying')
    .get(authorization, (req, res) => {
        Playing.find((err, val) => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).json(val);
            }
        })
    })

module.exports = router