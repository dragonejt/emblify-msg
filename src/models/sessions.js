const { Schema, model } = require("mongoose")

const Session = new Schema({
    userID: {
        type: Number,
        unique: true,
        required: true
    },
    username: String,
    email: String,
    code: String,
}, {timestamps: true})

module.exports = {
    ActivationSession: model("ActivationSession", Session),
    ForgotPasswordSession: model("ForgotPasswordSession", Session)
}