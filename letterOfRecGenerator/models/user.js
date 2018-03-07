var db = require('../db');
var Form = require("./form");
var Template = require("./template");

var Schema = db.Schema;

var UserSchema = new Schema({
    id: String,
    displayName: String,
    accessToken: String,
    templates: [Template.schema],
    forms: [Form.schema]
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

UserSchema.methods.removeTemplate = function (template) {
    var template = getTemplate(template._id);
    template.archive();
    template.save();
};

UserSchema.methods.getTemplates = function () {
    return this.templates;
};

UserSchema.methods.getActiveTemplates = function () {
    return this.templates.filter(template => !template.archived);
};

UserSchema.methods.findTemplates = function (name) {
    return this.templates.filter(template => template.name == name);
};

UserSchema.methods.findActiveTemplates = function (name) {
    return this.templates.filter(template => template.name == name && !template.archived);
};

UserSchema.methods.getTemplate = function (id) {
    return this.templates.id(id);
};

UserSchema.methods.addForm = function (form) {
    this.forms.push(form);
}

UserSchema.methods.getForms = function () {
    return this.forms;
};

var User = db.model('User', UserSchema);

module.exports = User;