function xmlhttpGet() {
    var xmlHttpReq = false;
    var self = this;
    // Mozilla/Safari
    if ( window.XMLHttpRequest ) {
        self.xmlHttpReq = new XMLHttpRequest();
    }
    // IE
    else if ( window.ActiveXObject ) {
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    self.xmlHttpReq.open('GET', '/chat', true);
//    self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    self.xmlHttpReq.onreadystatechange = function() {
        if (self.xmlHttpReq.readyState == 4) {
            document.getElementById("chattext").innerHTML = '<p><strong>Messages:</strong></p>' + self.xmlHttpReq.responseText;
        }
    }
    self.xmlHttpReq.send();
}

function xmlhttpPost(strURL) {
    var xmlHttpReq = false;
    var self = this;
    // Mozilla/Safari
    if (window.XMLHttpRequest) {
        self.xmlHttpReq = new XMLHttpRequest();
    }
    // IE
    else if (window.ActiveXObject) {
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    self.xmlHttpReq.open('POST', strURL, true);
    self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    self.xmlHttpReq.onreadystatechange = function() {
        if (self.xmlHttpReq.readyState == 4) {
            document.getElementById("chattext").innerHTML = '<p><strong>Messages:</strong></p>' + self.xmlHttpReq.responseText;

        }
    }
    var form = document.forms['chat'];
    var color = '';
    for( var i = 0; i < form.color.length; i++ ) {
        if( form.color[i].checked == true ) {
            color = form.color[i].value;
        }
    }
    self.xmlHttpReq.send( 'name=' + escape( form.name.value ) + '&entry=' + escape( form.entry.value ) + '&color=' + escape( color ) );
    form.entry.value = "";
}

function chatInit() {
    document.getElementById("chatform").innerHTML = '<strong>Pirate<span style="color: maroon;">ShoutBox</span></strong><br>' + 
'<form action="/chat" method="post" enctype="application/x-www-form-urlencoded" name="chat"><br>' +
'<strong>Name</strong><br><input name="name" type="text" value="anonymous" size="20"><br>' +
'<input type="radio" value="black" name="color" checked>B<input type="radio" value="blue" name="color"><font color="blue">B</font><input type="radio" value="green" name="color"><font color="green">G</font><input type="radio" value="orange" name="color"><font color="orange">O</font><input type="radio" value="red" name="color"><font color="red">R</font></strong><br>' +
'<strong>Message</strong><br>' +
'<textarea name="entry" cols="30" rows="3" wrap="virtual"></textarea><br>' +
'<input value="Chat" type="button" onclick=\'JavaScript:xmlhttpPost("/chat")\'>' +
'</form>';
    xmlhttpGet();
}

window.onload = function() {  
    chatInit();
    chatReload = window.setInterval( xmlhttpGet, 5000 );
};