var db = require('../db');
var Form = require("./form");
var Template = require("./template");

var Schema = db.Schema;

var UserSchema = new Schema({
    templates: [Template.schema],
    forms: [Form.schema]
});

var User = db.model('User', UserSchema);

module.exports = User;