/*
 * Mailer using Amazon's SES service
 */

var nodemailer = require('nodemailer')

var mailer = function(accessKey, secretKey) {

    // SES mail transport
    this.ses = nodemailer.createTransport('SES', {
        AWSAccessKeyID: accessKey,
        AWSSecretKey: secretKey
    })
}

/**
 * SES mail sending
 */
mailer.prototype.email = function(from, recipient, subject, message, options, cb) {

    // Options are optional
    if ('function' === typeof options)
        cb = options, options = {}

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: from,
        to: recipient,
        subject: subject
    }
    if (options && options.messageType === 'html')
        mailOptions.html = message, mailOptions.text = null
    else
        mailOptions.text = message, mailOptions.html = null

    this.ses.sendMail(mailOptions, cb || null)
}

/**
 * Create a new AWS instance
 */
exports.createClient = function(accessKey, secretKey) {
    return new mailer(accessKey, secretKey)
}