const mongoose = require('mongoose');
const userschema = new mongoose.Schema({
    userid: { type: String },
    username: { type: String },
    useravatar: { type: String },
    storage: {
        carrable: {
            0: { type: Number, default: 0 },
            1: { type: Number, default: 0 },
            2: { type: Number, default: 0 },
            3: { type: Number, default: 0 },
            4: { type: Number, default: 0 },
        },
        treasure: {
            capacity: { type: Number, default: 0 },
            unlocked: { type: Boolean, default: false },
            0: { type: Number, default: 0 },
            1: { type: Number, default: 0 },
            2: { type: Number, default: 0 },
            3: { type: Number, default: 0 },
            4: { type: Number, default: 0 },
        },
    },
    monsters: {type: Array, default: []},
    weapons: {type: Array, default: []},
    house: Boolean,
    lastAttackedFromAt: { type: Number, default: 0 },
    lastKnockedFromAt: { type: Number, default: 0 },
    lastAttackedAt: { type: Number},
    lastKnockedAt: { type: Number},
    lastWorkedAt: { type: Number},
    lastDailyAt: { type: Number},
  },{ collection: 'halloweenuser' });
  
  const usermodel = mongoose.model('halloweenuser', userschema);
  module.exports = usermodel;
