var db = require('../db');
var Form = require("./form");
var Template = require("./template");

var Schema = db.Schema;

var UserSchema = new Schema({
    id: String,
    displayName: String,
    accessToken: String,
    templates: [Template.schema],
    forms: [{
        type: db.Schema.Types.ObjectId,
        ref: 'Form'
    }]
});

UserSchema.statics.findUser = function (id, cb) {
    db.model('User').findOne({'id': id}, function (err, user) {
        cb(err, user);
    });
};

UserSchema.statics.createUser = function (id, cb) {
    User.create({id: id}, cb);
};

UserSchema.statics.findOrCreate = function (id, cb) {
    UserSchema.statics.findUser(id, function (err, user) {
        if (!user) {
            UserSchema.statics.createUser(id, cb);
        } else {
            cb(err, user);
        }
    });
};

UserSchema.methods.addTemplate = function (template, cb) {
    this.templates.push(template);
    var newTemplate = this.templates[this.templates.length - 1];

    this.save(function (err) {
        cb(err, newTemplate.getId());
    })
};

UserSchema.methods.updateTemplate = function (id, template, cb) {
    var user = this;
    var updatedTemplate = this.templates.id(id);

    updatedTemplate.name = template.name;
    updatedTemplate.text = template.text;
    updatedTemplate.questions = template.questions;
    updatedTemplate.letterheadImg = template.letterheadImg;
    updatedTemplate.footerImg = template.footerImg;

    User.findOneAndUpdate({
        "id": user.id,
        "templates._id": id
    }, {
        "$set": {
            "templates.$": updatedTemplate
        }
    }, function (err, user) {
        cb(err, template);
    });
};

UserSchema.methods.getTemplates = function () {
    return this.templates;
};

UserSchema.methods.getTemplate = function (id) {
    return this.templates.id(id);
};

UserSchema.methods.removeTemplate = function (id, cb) {
    this.getTemplate(id).remove();
    this.save(cb);
};

UserSchema.methods.addForm = function (form, cb) {
    this.forms.push(form._id);
    this.save(cb);
};

UserSchema.methods.getForms = function (cb) {
    User.findOne({id: this.id}).populate('forms').exec(function (err, user) {
        cb(err, user.forms);
    })
};

UserSchema.methods.getForm = function (id, cb) {
    User.findOne({id: this.id}).populate({
        path: 'forms',
        match: {_id: id}
    }).exec(function (err, user) {
        if (user.forms.length != 1) {
            console.log('error');
        } else {
            cb(err, user.forms[0]);
        }
    })
};

UserSchema.methods.removeForm = function (id, cb) {
    this.forms.pull(id);
    this.save(function (err) {
        if (err) {
            cb(err, null);
        } else {
            Form.removeForm(id, cb);
        }
    });
};

var User = db.model('User', UserSchema);

module.exports = User;