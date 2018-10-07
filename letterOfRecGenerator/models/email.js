var db = require('../db');
var Schema = db.Schema;

var EmailSchema = new Schema({
    title: String,
    subject: String,
    body_text: String,
    active: Boolean
});

EmailSchema.methods.getId = function () {
    return this._id;
};

EmailSchema.methods.getTitle = function () {
    return this.title;
};

EmailSchema.methods.getSubject = function () {
    return this.subject;
};

EmailSchema.methods.getBodyText = function () {
    return this.body_text;
};

EmailSchema.methods.getActive = function () {
    return this.active;
};


var Email = db.model('Email', EmailSchema);

module.exports = Email;