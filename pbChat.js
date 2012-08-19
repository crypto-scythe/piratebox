var fs = require( 'fs' );
var path = require( 'path' );
var pbConfig = require( './pbConfig.js' );
var pbTemplates = require( './pbTemplates.js' );

exports.tainted = false;

exports.chatlog = '';

exports.post = function( name, entry, color ) {
    this.chatlog = exports.createChatEntry( name, entry, color ) + this.chatlog;
    this.tainted = true;
};

exports.display = function() {
    return this.chatlog;
};

exports.save = function( init ) {
    if( init == true ) {
        if( path.existsSync( pbConfig.CHATFILE ) == true ) {
            this.chatlog = fs.readFileSync( pbConfig.CHATFILE, 'utf8' );
        } else {
            this.chatlog = exports.createChatEntry( 'Pirate<span style="color: maroon;">Box</span>', 'Chat and share files anonymously!', 'black' );
            fs.writeFileSync( pbConfig.CHATFILE, this.chatlog , 'utf8' );
        }
        return false;
	} else {
        if( this.tainted == true ) {
            fs.writeFileSync( pbConfig.CHATFILE, this.chatlog , 'utf8' );
            this.tainted = false;
        }
    }
};

exports.createChatEntry = function( name, entry, color ) {
    temp = pbTemplates.CHATENTRY;
    return temp.replace( '#ENTRY#', entry ).replace( '#NAME#', name ).replace( '#COLOR#', color );
}

exports.init = exports.save( true );

exports.interval = setInterval( function() {
    exports.save();
}, 1000 );