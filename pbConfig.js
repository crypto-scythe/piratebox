// piratebox.js directory + incoming subdirectory
//exports.UPLOADDIRECTORY = '/var/piratebox/incoming/';
exports.UPLOADDIRECTORY = process.cwd() + '/incoming/';

// exports.UPLOADDIRECTORY = process.cwd() + '/incoming/'; // only works when run inside the piratebox directory

// piratebox.js directory + web subdirectory
exports.WEBROOT = process.cwd() + '/web'; 

// exports.pbWEBROOT = process.cwd() + '/piratebox/web'; // same as above

// chat text file
exports.CHATFILE = process.cwd() + '/chat.txt';

// port on which the http server runs
exports.SERVERPORT = 80;

// advertise FTP support (FTP Server needs to be configured manually on your OS)
exports.FTP = false;

// activates chat
exports.CHAT = true;

// activates Debugging info
exports.DEBUG = false;
