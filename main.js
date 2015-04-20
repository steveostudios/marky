var menubar = require('menubar')
var shell = require('shell');
var app = require('app');
var fs = require('fs');
var ipc = require('ipc');
var linkfile = app.getPath('appData') +'/'+ app.getName() +'/links.txt';

function linkfile_create(linkfile, callback) {
  var new_linkfile = [];
  var str = JSON.stringify(new_linkfile);

  fs.writeFile(linkfile, str, function (err) {
    if (err) throw err;
  });
  app.regData = new_linkfile;
}

var mb = menubar()

mb.on('ready', function ready () {
	fs.readFile(linkfile, function (err, data) {
    if (err) { // First Time
      linkfile_create(linkfile);
    } else {
      app.regData = JSON.parse(data);
    }
  });
  // event.sender.send('open_linkfile', app.regData); //remove
  console.log('app is ready')
})

// In main process.

ipc.on('goto_link', function(event, arg_recieve) {
  shell.openExternal('vnc://'+ arg_recieve.url);
  console.log('vnc://'+ arg_recieve.url);
  event.sender.send('asynchronous-reply', 'pong');
});

ipc.on('open_linkfile', function(event, arg_recieve) {
  console.log('que send');
  event.sender.send('open_linkfile', app.regData);
});

ipc.on('save_linkfile', function(event, arg_recieve) {
	app.regData = arg_recieve;
	fs.writeFile(linkfile, JSON.stringify(app.regData), function(err) {
    if(!err) {
    	console.log('saved');  
  	}
  });
  event.sender.send('asynchronous-reply', 'saved');
});