/**
 * Super simple contact form handler
 */

var fs = require('fs'),
    http = require('http'),
    qs = require('querystring')

var host = '127.0.0.1', port = 1337

var startApp = function(settings) {

    var mailer = require('./mailer').createClient(settings.aws_access_key, settings.aws_secret_key)

    var sendJSON = function(res, json) {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(json)
    }

    var email = function(originator, msg) {
        mailer.email('info@farscry.com', 'matt.j.sullivan@gmail.com', 'Regina Kohl.com from ' + originator, msg)
    }

    http.createServer(function (req, res) {
    // Read the body
    if (req.method === 'POST') {
        var body = ''
        var postData = {}

        req.on('data', function (data) {
            body += data
        })

        req.on('end', function () {
            var postData = qs.parse(body)
            console.log(postData)
            if (!(postData.email && postData.msg))
                sendJSON(res, '{"error", "incorrect POST parameters"}')
            else {
                email(postData.email, postData.msg)
                sendJSON(res, '{"success", "Sending ' + postData.msg + ' originated from ' + postData.email + '"}')
            }
        })

    }
    else
        sendJSON(res, '{"error", "only POSTs allowed"}')
    }).listen(port, host)
}

/**
 * Load settings and start the web app
 */
var argv = require('optimist').argv
var settingsFile = argv.s || argv.settings || './settings.json'
// Load the file if it exists
fs.readFile(argv.s || argv.settings || './settings.json', function(err, loadedSettings) {
    if (err) {
        console.error('Error loading settings file: ' + err)
        process.exit(1)
    }
    var settings = JSON.parse(loadedSettings)
    if (!(settings.aws_access_key && settings.aws_secret_key)) {
        console.error('Settings file is malformed')
        process.exit(1)
    }
    startApp(settings)
    console.log('Contact form server running at http://' + host + ':' + port)
})