var crypto = require('crypto');
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

LinkSchema.statics.generateLink = function (email, cb) {
    var hash = crypto.createHash('md5').update(email + Date.now().toString()).digest("hex");

    Link.create({link: hash}, cb);
};

var Link = db.model('Link', LinkSchema);

module.exports = Link;