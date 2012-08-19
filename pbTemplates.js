exports.PAGEHTMLOPEN = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>PirateBox Project - share freely</title><link href="/style.css" rel="stylesheet" type="text/css"><script type="text/javascript" src="/chat.js"></script></head><body><div id="container">';

exports.PAGELOGOTEXT = '<div id="chat"><div id="chatform"></div><div id="chattext"></div></div><div id="text"><img src="/piratebox-logo.png" id="imgsmall" alt="PirateBox Logo">';
    
exports.PAGEHTMLCLOSE = '</div></body></html>';

exports.PAGEUPLOADFORM = '<p>1. <a href="/project.html">Read more</a> about the project</p><p>2. Click button below to begin sharing</p><p>3. <a href="/incoming">Browse</a> and download files</p><form action="/upload" enctype="multipart/form-data" method="post"><input type="file" name="upload" multiple="multiple"><br><input type="submit" value="Upload"></form>';

exports.PAGEUPLOADSUCCESS = '<p><strong>File uploaded.<br>Share another one!</strong></p>';

exports.PAGEERROR404 = '<h1>Error 404</h1><p>File not found</p></div>';

exports.PAGESHAREDFILES = '<p>back to <a href="/">PirateBox</a></p><p>This PirateBox is currently sharing the following files:<p>';

exports.PAGENOFILES = '<p><strong>Currently there are no files being shared, but you can change that by uploading some!</strong></p>'

exports.PAGEFTP = '<p>Additionally this PirateBox is accessible by <a href="ftp://piratebox/">FTP</a></p>';

exports.CHATENTRY = "<span style='color: #COLOR#;'><b>#NAME#:</b> #ENTRY#<br>\n";

