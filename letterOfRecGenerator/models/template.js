var db = require('../db');

var Schema = db.Schema;

var TemplateSchema = new Schema({
    name: String,
    text: String,
    questions: [{
        number: Number,
        type: {
            type: String,
            enum: ['Radio Button', 'Checkbox', 'Text'],
            required: true
        },
        question: String,
        tag: String,
        options: [{
            option: String,
            fill: String,
            tag: String
        }],
        optional: Boolean
    }],
    letterheadImg: String,
    footerImg: String
});

TemplateSchema.methods.getId = function () {
    return this._id;
};

TemplateSchema.methods.getName = function () {
    return this.name;
};

TemplateSchema.methods.getText = function () {
    return this.text;
};

TemplateSchema.methods.getQuestions = function () {
    return this.questions;
};

var Template = db.model('Template', TemplateSchema);

module.exports = Template;