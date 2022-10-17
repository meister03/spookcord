const mongoose = require('mongoose');
const schema = new mongoose.Schema({
   channelid: { type: String},
   guildid: { type: String},
},{ collection: 'halloweenconfig' });

const configmodel = mongoose.model('halloweenconfig', schema);
module.exports = configmodel;