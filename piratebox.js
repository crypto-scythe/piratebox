// PirateBox Node.js server - original idea by David Darts - ( http://wiki.daviddarts.com/PirateBox )
 
// configuration - check this file for configuraiton options
var pbConfig = require( './pbConfig.js' );

// HTML templates
var pbTemplates = require( './pbTemplates.js' );

// Chat System
var pbChat = require( './pbChat.js' );

// FTP advertising
if( pbConfig.FTP != true ) {
    pbTemplates.PAGEFTP = '';
}

// Container for files in uploading progress
var filesInProgress = { };

// including used libraries
var http = require( 'http' ),
    fs = require( 'fs' ),
    util = require( 'util' ),
    url = require( 'url' ),
    path = require( 'path' ),
    formidable = require( 'formidable' ),
    mime = require( 'mime' );

// function declarations
function showError404( res ) {
    res.writeHead( 404, { 'content-type': 'text/html' } );
    res.end( pbTemplates.PAGEHTMLOPEN + pbTemplates.PAGELOGOTEXT + pbTemplates.PAGEUPLOADFORM + pbTemplates.PAGEERROR404 + pbTemplates.PAGEHTMLCLOSE );
}

function getFileList( directory, ignoreFilesInProgress ) {
    
    var temp = fs.readdirSync( directory );
    var fileList = new Array();
    for( var key in temp ) {
        if( temp[key] in filesInProgress ) {
            if( ignoreFilesInProgress == 'true' ) {
               fileList.push( temp[key] ); 
            } else {
            
            }
        } else {
            fileList.push( temp[key] );
        }
    }
    return fileList;
}

function getFileSize( filename ) {
    return fs.statSync( pbConfig.UPLOADDIRECTORY + filename ).size;
}

function checkWebDirectory( requestedFile ) {
    var files = getFileList( pbConfig.WEBROOT );
    for( var key in files ) {
        if( files[key] == requestedFile.substr( 1 ) ) {
            return true;
        } else {
        
        }
    }
}

function sendHTML( res, content ) {
    res.writeHead( 200, { 'content-type': 'text/html' } );
    if( content == null ) {
       content = '';
    }
    res.end( pbTemplates.PAGEHTMLOPEN + pbTemplates.PAGELOGOTEXT + content + pbTemplates.PAGEHTMLCLOSE );
}

function debug( data ) {
    if( pbConfig.DEBUG == true ) {
        util.log( data );
    }
    return;
} 

// initializing server process
http.createServer(function(request, res){
    debug( url.parse(request.url).pathname ); // for debugging
    if ( request.url == '/upload' &&
        request.method.toLowerCase() == 'post' ) {
        // Parse file upload into temporary file
        var form = new formidable.IncomingForm();
        var temporaryFile;
        var destinatonFile;
        form.parse(request, function(err, fields, files) {
            if(err) {
                util.log(err + ' (during file upload)');
            } else if (files.upload.name == "") { // to start page if no´file uploaded
                sendHTML(res, pbTemplates.PAGEUPLOADFORM + pbTemplates.PAGEFTP + pbTemplates.PAGEUPLOADSUCCESS);
            } else {
            // Move file to upload folder by copying and deleting the temporary file
                console.log(files.upload.name);
                temporaryFile = files.upload.path;
                destinationFile = pbConfig.UPLOADDIRECTORY + files.upload.name;
                filesInProgress[files.upload.name] = true;
                util.pump(fs.createReadStream(temporaryFile), fs.createWriteStream(destinationFile), function() {
                    fs.unlink(temporaryFile); // Delete temporary file
                    delete filesInProgress[files.upload.name];
                });
                sendHTML(res, pbTemplates.PAGEUPLOADFORM + pbTemplates.PAGEFTP + pbTemplates.PAGEUPLOADSUCCESS);
                debug('File uploaded: ' + files.upload.name); // for debugging
            }
        });
    return;
    } else if( pbConfig.CHAT == true &&
               request.url == '/chat' &&
               request.method.toLowerCase() == 'post' ){
        var form = new formidable.IncomingForm();
form.parse(request, function(err, fields, files) {
            if(err) {
                util.log(err + ' (during chat save)');
            } else {
                pbChat.post( fields.name, fields.entry, fields.color );
                res.writeHead(200, {'content-type': 'text/html'});
                res.end( pbChat.display() );
            }
        });
        return;
    } else if( pbConfig.CHAT == true &&
               request.url == '/chat' &&
               request.method.toLowerCase() == 'get'){
        res.writeHead(200, {'content-type': 'text/html'});
        res.end( pbChat.display() );
        return;
    } else if(request.url == '/incoming' ||
              request.url == '/incoming/'){
            var sharedFiles = getFileList( pbConfig.UPLOADDIRECTORY, false );
            sharedFiles.sort();
            var outputFileList = '';
            if(sharedFiles.length > 0) {
                for(var i in sharedFiles){
                    var fileName = sharedFiles[i];
                    var fileSize = getFileSize(fileName);
                    if( fileSize > 1024 ) {
                        fileSize = parseInt(fileSize / 1024) + ' kb';
                    } else {
                        fileSize += ' bytes';
                    }
                    outputFileList += '<p>' + fileSize + ' / <a href="/incoming/' + escape(fileName) + '">' + fileName + '</a> / <a href="/delete/' + escape(fileName) + '"><b>X</b></a></p>';
                }
            } else {
                outputFileList = pbTemplates.PAGENOFILES;
            }
        sendHTML(res, pbTemplates.PAGESHAREDFILES + outputFileList + pbTemplates.PAGEHTMLCLOSE);
        return;
    } else if(request.url.substr(0 ,10) == '/incoming/' &&
              request.url.length > 10){
            var sharedFiles = getFileList( pbConfig.UPLOADDIRECTORY, false );
            if(sharedFiles.length >0) {
                downloadFile = unescape(request.url.substr(-1 * (request.url.length - 10)));
                var downloadOk = false;                
                for(var i in sharedFiles) {
                    if(sharedFiles[i] == downloadFile) {
                        downloadOk = true;
                        var requestedFile = pbConfig.UPLOADDIRECTORY + downloadFile;
                        fs.readFile(requestedFile, function(err, data){
                            if(err) {
                                util.log(err + ' (during file download)');
                            } else {
                                contentDisposition = 'attachment';
                                debug( 'MIME-Type: ' + mime.lookup( requestedFile ) );
                                // MIME Types from https://github.com/bentomas/node-mime/blob/master/mime.types
                                if( mime.lookup( requestedFile ) == 'text/plain' ||
                                    mime.lookup( requestedFile ) == 'image/png' ||
                                    mime.lookup( requestedFile ) == 'image/gif' ||
                                    mime.lookup( requestedFile ) == 'image/jpeg' ) {
                                    contentDisposition = 'inline';
                                }
                                res.writeHead(200, {'Content-Type': mime.lookup(requestedFile), 'Content-Disposition': contentDisposition + '; filename=' + downloadFile, 'Content-Length': getFileSize(downloadFile) });
                                res.end(data);
                                return;
                            }
                        });
                    } else {
                    
                    }
                }
                if( downloadOk == false ) {
                    showError404(res);
                    return;
                } else {
                
                }
            } else {
            sendHTML(res, pbTemplates.PAGESHAREDFILES + pbTemplates.PAGENOFILES + pbTemplates.PAGEHTMLCLOSE);
                return;
            }
/*    } else if( request.url == '/favicon.ico' ||
               request.url == '/piratebox-logo-small.png' ||
               request.url == '/piratebox-logo.png' || 
               request.url == '/style.css' || 
               request.url == '/scripts.js' ) {
        fs.readFile( pbConfig.WEBROOT + request.url, function( err, data ) {
        res.writeHead(200, { 'Content-Type': mime.lookup( pbConfig.WEBROOT + request.url ) } );
        res.end(data);
        });
        return;
    } 
*/
    } else if( request.url.substr(0, 8) == '/delete/' && request.url.length > 8) {
        deleteFile = unescape(request.url.substr(-1 * (request.url.length - 8)));
        fs.unlinkSync(pbConfig.UPLOADDIRECTORY + deleteFile);
        debug('deleted file ' + pbConfig.UPLOADDIRECTORY + deleteFile);
        res.writeHead(302, { 'Location': '/incoming/'});
        res.end('File deleted');

    }Â else if( checkWebDirectory( request.url ) == true ) {
        fs.readFile( pbConfig.WEBROOT + request.url, function( err, data ) {
        res.writeHead(200, { 'Content-Type': mime.lookup( pbConfig.WEBROOT + request.url ) } );
        res.end(data);
        });
        return;        
    }
//
    else{
        // Show the file upload form
        sendHTML(res, pbTemplates.PAGEUPLOADFORM + pbTemplates.PAGEFTP);
        return;
    }
}).listen(pbConfig.SERVERPORT);

// Server information to console
debug( 'PirateBox server running at Port: ' + pbConfig.SERVERPORT );
