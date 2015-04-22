var menubar = require('menubar')
var shell = require('shell');
var app = require('app');
var fs = require('fs');
var ipc = require('ipc');
var linkfile = app.getPath('appData') +'/'+ app.getName() +'/links.txt';

var links = [];

function linkfile_create(linkfile, callback) {
  var new_linkfile = [];
  var str = JSON.stringify(new_linkfile);

  fs.writeFile(linkfile, str, function (err) {
    if (err) throw err;
  });
  links = new_linkfile;
}

var mb = menubar()

mb.on('ready', function ready () {
	fs.readFile(linkfile, function (err, data) {
    if (err) { // First Time
      linkfile_create(linkfile);
    } else {
      links = JSON.parse(data);
    }
  });
  // event.sender.send('open_linkfile', links); //remove
  console.log('app is ready')
})

// In main process.
ipc.on('goto_link', function(event, arg_recieve) {
  shell.openExternal(arg_recieve.url);
  console.log(arg_recieve.url);
  event.sender.send('asynchronous-reply', 'pong');
});

ipc.on('open_linkfile', function(event, arg_recieve) {
  console.log('file opened');
  event.sender.send('opened_linkfile', links);
});

ipc.on('save_linkfile', function(event, arg_recieve) {
	links = arg_recieve;
	fs.writeFile(linkfile, JSON.stringify(links), function(err) {
    if(!err) {
    	console.log('file saved');  
  	}
  });
  event.sender.send('saved_linkfile', links);
});