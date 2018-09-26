var db = require('../db');
var Link = require('./link');
var User = require('./user');
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
    },
    letter: String,
    duplicated: Boolean,
    organization: String,
    owner: {type: db.Schema.Types.ObjectId, ref: 'User'}
});


FormSchema.methods.getResponses = function () {
    // console.log("this form's responses: ");
    // console.log(this.responses);

    // if there are multiple schools, create copies
    return this.responses;
};

/**
 * Creates a new form and initializes values
 * @param email Students email address
 * @param template
 * @param cb
 */
FormSchema.statics.createForm = function (email, template, userId, cb) {
    console.log("inside createForm, id: " + userId);
    Link.generateLink(email, function (err, link) {
        if (err) {
            cb(err, null);
        } else {
            Form.create({
                email: email,
                status: 'Sent',
                template: template,
                link: link,
                'meta.sent': Date.now(),
                duplicated: false,
                organization: "unspecified",
                owner: userId
            }, cb);
        }
    });
};

/**
 * Duplicated a form and adds organization value
 * @param form - form to be duplicated
 * @param organization - organization that unique to the duplicated form
 * @param cb
 */
FormSchema.statics.duplicateForm = function (form, organization, cb) {
    console.log("IN FORMSCHEMA DUPLICATEFORM");
    Form.create({
        email: form.email,
        status: form.status,
        template: form.template,
        link: form.link,
        responses: form.responses,
        meta: form.meta,
        letter: form.letter,
        duplicated: true,
        organization: organization
    }, cb);
};


FormSchema.statics.findForm = function (id, cb) {
    Form.findOne({_id: id}, cb);
};

FormSchema.statics.findFromLink = function (link, cb) {
    Form.findOne({'link.link': link}, cb);
};

FormSchema.statics.removeForm = function (id, cb) {
    FormSchema.statics.findForm(id, function (err, form) {
        if (err) {
            cb(err, null);
        } else {
            Link.removeLink(form.link.getId(), function (err) {
                if (err) {
                    cb(err, null);
                } else {
                    Form.remove({_id: id}, cb);
                }
            });
        }
    });
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

/**
 * Setter for organization
 * @param organization
 */
FormSchema.methods.setOrganization = function (organization) {
    this.organization = organization;
    this.save();
};

FormSchema.methods.setDuplicatedTrueAndSave = function() {
    this.duplicated = true;
    this.save();
};

FormSchema.statics.submitForm = function (id, responseData, duplicatedFormArr, cb) {
    var organizationArr = [];
    FormSchema.statics.findForm(id, function (err, form) {
        if (err) {
            cb("error in FormSchema.statics.submitForm / .findForm " + err, null);
        } else {
            var responses = [];
            form['template']['questions'].forEach(function (question) {
                var response = responseData[question.number - 1];
                /* If the question has a organizationFlag that is true, 
                attempt to extract the organizations (seperated with , )
                and make additional Forms with the different organization names */
                if(question.organizationFlag){
                    console.log("found organization Question")
                    let organizationList = response.trim();
                    organizationArr = organizationList.split(", ");
                    console.log("Length of Orgs: " + organizationArr.length);
                    
                }
                //If response is empty
                if (!response.length) {
                    responses.push({
                        tag: question.tag,
                        response: ''
                    });
                } else if (!(response instanceof Array)) {
                    //other response types are from here
                    responses.push({
                        tag: question.tag,
                        response: response
                    });
                } else {
                    response.forEach(function (optionText) {
                        var option = question.options.find(function (option) {
                            return option.fill === optionText;
                        });

                        responses.push({
                            tag: option.tag,
                            response: option.fill
                        });
                    });
                }
            });
            //Update organization to be the first one
            form.organization = organizationArr[0];
            form.duplicated = true;
            form.status = 'Submitted';
            form['responses'] = responses;
            form['meta']['submitted'] = Date.now();
              
            form.save().then(function(savedForm){
                // console.log("promise success: " + savedForm);
                if(organizationArr.length > 1){
                    console.log("started making duplicates")
                    for (let orgIndex = 1; orgIndex < organizationArr.length; orgIndex++) {
                        console.log("============= in for loop ==============");
    
                        // form.duplicateFormTest(savedForm, organizationArr[orgIndex]).then(
                        //     function(duplicatedForm){
                        //     console.log("duplicatedForm created, what is id?: " + duplicatedForm);
                        //     console.log("duplicatedForm created, what is id?: " + duplicatedForm._id);
                        //     duplicateFormArr.push(duplicatedForm);
                        // }, function(err){
                        //     console.log("duplicateFormTest promise err: " + err);
                        // });
                        var promise = Form.create({
                            email: savedForm.email,
                            status: savedForm.status,
                            template: savedForm.template,
                            link: savedForm.link,
                            responses: savedForm.responses,
                            meta: savedForm.meta,
                            letter: savedForm.letter,
                            duplicated: true,
                            organization: organizationArr[orgIndex]
                        });
                    
                        promise.then(function(savedForm){
                            //console.log("so...what is this?: " + savedForm);
                            //duplicateFormIdArr.push(savedForm._id);
                            console.log("savedFormID?: " + savedForm._id);
                            //cb(savedForm);
                            duplicatedFormArr.push(savedForm);
                            arrPromise.then(function(array){
                                console.log("arrPromise: duplicatedFormArr.length: " + duplicatedFormArr.length);
                            }, function(welp) {
                                console.log("welp");
                            });
                        }, function(rejected) {
                            console.log("rejected promise: " + rejected);
                        });

                        // var promise = form.duplicateFormTest(savedForm, organizationArr[orgIndex]);
                        // promise.then(function(duplicatedForm){
                        //     console.log("duplicatedForm created, what is id?: " + duplicatedForm);
                        //     console.log("duplicatedForm created, what is id?: " + duplicatedForm._id);
                        //     duplicateFormArr.push(duplicatedForm);
                        // }, function(err) {
                        //     console.log("duplicateFormTest promise err: " + err);
                        // });
                    }
                    console.log("duplicateFormIdArr.length: " + duplicatedFormArr.length);
                }           
            }, function(err) {
                console.log("promise error: " + err);
            });
            
            // console.log("owner?? " + this.owner);
            // UserModel.findUser(this.owner, function(err, user){
            //     if(err) {
            //         console.log( "error!!!!");
            //     } else {
            //         console.log("id???found?: " + user._id);
            //     }
            // });
        }
        cb(err);
    });
};

FormSchema.methods.duplicateFormTest = function (form, org) {

    var promise = Form.create({
        email: form.email,
        status: form.status,
        template: form.template,
        link: form.link,
        responses: form.responses,
        meta: form.meta,
        letter: form.letter,
        duplicated: true,
        organization: org
    });

    console.log("what is promise?: " + promise);
    promise.then(function(savedForm){
        //console.log("so...what is this?: " + savedForm);
        //duplicateFormIdArr.push(savedForm._id);
        console.log("savedFormID?: " + savedForm._id);
        //cb(savedForm);
        return savedForm;
    }, function(rejected) {
        console.log("rejected promise: " + rejected);
    });
};

FormSchema.statics.completeForm = function (id, letter, cb) {
    FormSchema.statics.findForm(id, function (err, form) {
        if (err) {
            cb(err, null);
        } else {
            form.letter = letter;
            form.status = 'Complete';

            if (!form['meta']['completed']) {
                form['meta']['completed'] = Date.now();
            }

            form.save(function (err) {
                cb(err, form);
            });
        }
    });
};


var Form = db.model('Form', FormSchema);

module.exports = Form;