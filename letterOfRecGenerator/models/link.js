var db = require('../db');

var Schema = db.Schema;

var LinkSchema = new Schema({
    link: String,
    createdAt: {
        type: Date,
        expires: 259200,
        default: Date.now
    }
});

var Link = db.model('Link', LinkSchema);

module.exports = Link;