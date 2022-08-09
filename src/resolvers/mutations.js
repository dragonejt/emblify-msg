const formData = require('form-data');
const Mailgun = require('mailgun.js');
const { ActivationSession, ForgotPasswordSession } = require("../models/sessions")

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = "mx.emblify.me";

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: 'api', key: API_KEY });

async function sendEmail_activation(parent, { userID, username, email }, context, info) {
    const activationCode = Math.random().toString().substring(2, 8);
    const session = await ActivationSession.findOneAndUpdate({ userID }, { username, email, code: activationCode }, { upsert: true });

    return await client.messages.create(DOMAIN, {
        from: "emblify <hello@emblify.me>",
        to: email,
        subject: "emblify activation code",
        template: "activate",
        "t:variables": JSON.stringify({
            user: username,
            code: activationCode
        })
    })
}

async function sendEmail_forgotPassword(parent, { userID, username, email }, context, info) {
    const resetPasswordCode = Math.random().toString().substring(2, 8);
    const session = await ForgotPasswordSession.findOneAndUpdate({ userID }, { username, email, code: resetPasswordCode }, { upsert: true });

    return await client.messages.create(DOMAIN, {
        from: "emblify <hello@emblify.me>",
        to: email,
        subject: "emblify forgot password",
        template: "forgotpassword",
        "t:variables": JSON.stringify({
            user: username,
            code: resetPasswordCode
        })
    })
}

module.exports = { sendEmail_activation, sendEmail_forgotPassword };