const { ActivationSession, ForgotPasswordSession } = require("../models/sessions");
const TEN_MINUTES = 10 * 60 * 1000;

async function activationSession(parent, { userID }, context, info) {
    let session = await ActivationSession.findOne({ userID });
    console.log(session)
    if (session != null) {
        const diff = Math.abs(Date.now() - session["updatedAt"]);
        if (diff > TEN_MINUTES) {
            await ActivationSession.deleteMany({ userID })
            session = null
        }
    }
    return session;
}

async function forgotPasswordSession(parent, { userID }, context, info) {
    let session = await ForgotPasswordSession.findOne({ userID });
    console.log(session)
    if (session != null) {
        const diff = Math.abs(Date.now() - session["updatedAt"]);
        if (diff > TEN_MINUTES) {
            await ForgotPasswordSession.deleteOne({ userID })
            session = null
        }
    }
    return session;
}

module.exports = { activationSession, forgotPasswordSession }