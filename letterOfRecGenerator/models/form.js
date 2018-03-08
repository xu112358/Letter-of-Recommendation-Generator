var db = require('../db');
var Link = require('./link')
var Template = require('./template');


var Schema = db.Schema;

var FormSchema = new Schema({
    email: String,
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
    meta: {
        sent: Date,
        submitted: Date,
        completed: Date
    }
});

FormSchema.statics.createForm = function (email, template, cb) {
    Link.generateLink(email, function (err, link) {
        if (err) {
            cb(err, null);
        } else {
            Form.create({
                email: email,
                status: 'Sent',
                template: template,
                link: link,
                'meta.sent': Date.now()
            }, cb);
        }
    });
};

FormSchema.statics.findForm = function (id, cb) {
    Form.findOne({_id: id}, cb);
};

FormSchema.statics.findFromLink = function (link, cb) {
    Form.findOne({'link.link': link}, cb);
};

FormSchema.methods.getLink = function () {
    return this.link.link;
};

FormSchema.methods.getSent = function () {
    return this.meta.sent.toLocaleString('en-US');
};

FormSchema.methods.isSubmitted = function () {
    return this.status == 'Submitted';
};

FormSchema.methods.getSubmitted = function () {
    return this.meta.submitted.toLocaleString('en-US');
};

FormSchema.methods.getTemplate = function () {
    return this.template;
};

FormSchema.statics.submitForm = function (id, responseData, cb) {
    FormSchema.statics.findForm(id, function (err, form) {
        if (err) {
            cb(err, null);
        } else {
            var responses = form['template']['questions'].map(function (question) {
                return {
                    tag: question.tag,
                    response: responseData[question.number - 1]
                };
            });

            form.status = 'Submitted';
            form['responses'] = responses;
            form['meta']['submitted'] = Date.now();

            form.save(function (err) {
                cb(err, form);
            });
        }
    });
};

var Form = db.model('Form', FormSchema);

module.exports = Form;