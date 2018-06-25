// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const Twit = require('twit');
const config = require('./config.js');
const REFRESH_AFTER = 60; // minutes til new alert pops up

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate (context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "tinycarecode" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let T = new Twit(config);
    let params = {
        screen_name: 'tinycarebot',
        exclude_replies: true,
        include_rts: false,
        count: 1
    }

    let tinyCare = {
        statusBarItem: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right),
        getTweet: function () {
            return new Promise(function (resolve, reject) {
                T.get('statuses/user_timeline', params, function (err, data) {
                    if (err) {
                        console.log(err);
                        reject('⚠️: error getting tweet!');
                    } else {
                        resolve(data[0].text);
                    }
                });
            });
        },
        sendAlert: function (status) {
            vscode.window.showInformationMessage(status);
        },
        updateStatusBar: function (status) {
            this.statusBarItem.text = status;
            this.statusBarItem.show();
        }
    }

    setInterval(function () {
        tinyCare.getTweet().then(function (status) {
            tinyCare.sendAlert(status);
            tinyCare.updateStatusBar(status);
        });
    }, REFRESH_AFTER * 60 * 1000);

    context.subscriptions.push(T);
    context.subscriptions.push(params);
    context.subscriptions.push(tinyCare);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate () {
}
exports.deactivate = deactivate;