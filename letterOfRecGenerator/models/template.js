var db = require('../db');

var Schema = db.Schema;

var TemplateSchema = new Schema({
    name: String,
    text: {
        type: String,
        required: true
    },
    questions: [{
        number: Number,
        type: {
            type: String,
            enum: ['Button', 'Checkbox', 'Text'],
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

TemplateSchema.methods.archive = function () {
    this.archived = true;
};

var Template = db.model('Template', TemplateSchema);

module.exports = Template;