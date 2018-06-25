// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const Twit = require('twit');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate (context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "tinycarecode" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const config = vscode.workspace.getConfiguration('tcc');
    let statusBar =  vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    
    let T;
    if (config.consumer_key && config.consumer_secret && config.access_token && config.access_token_secret) {
        T = new Twit({
            consumer_key: config.consumer_key,
            consumer_secret: config.consumer_secret,
            access_token: config.access_token,
            access_token_secret: config.access_token_secret,
        });
        statusBar.text = '🤗💖: please take care';
        statusBar.show();
    } else {
        vscode.window.showErrorMessage('tinycarecode: set up the Twitter API keys in your settings and refresh!');
    }

    let params = {
        screen_name: 'tinycarebot',
        exclude_replies: true,
        include_rts: false,
        count: 1
    }

    let tinyCare = {
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
            statusBar.text = status;
            statusBar.show();
        }
    }

    setInterval(function () {
        tinyCare.getTweet().then(function (status) {
            tinyCare.sendAlert(status);
            tinyCare.updateStatusBar(status);
        });
    }, config.refresh_after * 60 * 1000);

    context.subscriptions.push(config);
    context.subscriptions.push(statusBar);
    context.subscriptions.push(T);
    context.subscriptions.push(params);
    context.subscriptions.push(tinyCare);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate () {
}
exports.deactivate = deactivate;