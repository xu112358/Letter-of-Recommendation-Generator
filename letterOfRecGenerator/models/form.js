var db = require('../db');
var Link = require('./link')
var Template = require('./template');


var Schema = db.Schema;

var FormSchema = new Schema({
    recommendee: String,
    status: {
        type: String,
        enum: ['Sent', 'Submitted', 'Complete']
    },
    template: Template.schema,
    link: Link.schema,
    responses: [{
        tag: String,
        response: Schema.Types.Mixed,
    }],
    metadata: {
        sentTimestamp: Date,
        submittedTimestamp: Date,
        completeTimestamp: Date
    }
});

var Form = db.model('Form', FormSchema);

module.exports = Form;