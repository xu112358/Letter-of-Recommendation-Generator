var db = require('../db');

var Schema = db.Schema;

var TemplateSchema = new Schema({
    name: String,
    text: String,
    questions: [{
        number: Number,
        type: {
            type: String,
            enum: ['Radio', 'Checkbox', 'Text'],
            required: true
        },
        question: String,
        tag: String,
        options: [String]
    }],
    letterheadImg: {
        data: Buffer,
        contentType: String
    },
    archived: {
        type: Boolean,
        default: false
    }
});

TemplateSchema.methods.getId = function () {
    return this._id;
};

TemplateSchema.methods.archive = function () {
    this.archived = true;
};

var Template = db.model('Template', TemplateSchema);

module.exports = Template;