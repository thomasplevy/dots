const { execSync } = require( 'child_process' ),
	{ appendFileSync } = require( 'fs' ), 
	https = require( 'https' ),
	{ homedir } = require( 'os' ),
	{ statSync, createWriteStream } = require( 'fs' ),
	UnsplashSourceES6 = require( 'unsplash-source-es6' ),
	unsplash = new UnsplashSourceES6(),
	glob = require( 'glob' ),
	pathJoin = require( 'path' ).join;

function debug( data ) {	
	appendFileSync( pathJoin( __dirname, '../debug.log' ), JSON.stringify( data, null, 2 ) );
}

function getBackgroundImg( cb ) {

	const cats = [ 'textures', 'abstract', 'patterns', 'colors', 'shapes', 'lines' ],
		cat = cats[ Math.floor( Math.random() * cats.length ) ],
		img = unsplash.size( ...getScreenDimensions()[0] ).search( [ cat ] ).fetch(),
		date = new Date(),
		filePath = `${ homedir }/Pictures/wallpaper-${ cat }-${ date.toISOString().split( 'T' )[0] }.jpg`;

	const saveImg = ( res ) => {

		if ( [ 301, 302 ].includes( res.statusCode ) ) {
			https.get( res.headers.location, saveImg );
		} else {
			res.pipe( createWriteStream( filePath ) );
			cb( filePath );
		}
	};

	https.get( img, saveImg );

}

function deleteFiles( fileGlob, maxDays = 7 ) {

	const now = Math.round( Date.now() / 1000 ),
		daysInSeconds = maxDays * 86400;

	glob( fileGlob, ( err, files ) => {
		files.forEach( file => {
			const stat = statSync( file );
			if ( now - Math.round( stat.ctime.getTime() / 1000 ) >= daysInSeconds ) {
				execSync( `gio trash "${ file }"` );
			}
		} );
	} );

}

function notify( { summary, body = '', expires = 2000, icon = '' } ) {

	icon = icon ? ` -i ${ icon }` : icon;

	execSync( `notify-send "${ summary }" "${ body }" -t ${ expires }${ icon }`)
}

function moveWindow( id, { desktop = 0, display = [], pos = [], size = [] } ) {

	const dimensions = getScreenDimensions(),
		currentDisplay = getActiveWindowDisplay(),
		availableDisplays = getNumberDisplays(),
		targetDisplay = display[ availableDisplays - 1 ] - 1,
		debug = {};

	let [ x, y ] = pos[ targetDisplay ],
		[ w, h ] = size[ targetDisplay ];

	// Remove maximization (if set).
	execSync( `wmctrl -ir ${ id } -b remove,maximized_vert,maximized_horz` );
	
	// Move to the window to the desired desktop (and follow it).
	if ( desktop !== getActiveDesktop() ) {
		execSync( `wmctrl -ir ${ id } -t ${ desktop }` );

		// Only follow the window when we're on a single display or the app is on the main monitor.
		if ( 1 === availableDisplays || 0 === targetDisplay ) {
			execSync( `wmctrl -s ${ desktop }` );
		}
	}

	// Handle negative positioning (spacing from the right / bottom).
	if ( x < 0 ) {
		x = dimensions[ targetDisplay ][0] - w + x;
	} 
	if ( y < 0 ) {
		y = dimensions[ targetDisplay ][1] - h + y;
	}

	// If the second monitor is the target display, add the primary display dimensions to desired x pos.
	if ( 1 === targetDisplay ) {
		x = x + dimensions[0][0];
	}

	// Handle moving from the second monitor to the first.
	if ( currentDisplay === 2 && 0 === targetDisplay ) {
		// subtract the width of the second display from X to move it as far to the left as possible and fullscreen takes care of the rest.
		x -= dimensions[ targetDisplay ][1]; 
	}
		debug.dimensions = dimensions;

	// Handle request for fullscreen.
	if ( 'fullscreen' === w ) {
		execSync( `wmctrl -ir ${ id } -b add,maximized_horz` );
		w = -1;
	}
	if ( 'fullscreen' === h ) {
		execSync( `wmctrl -ir ${ id } -b add,maximized_vert` );
		h = -1;
	}

	execSync( `wmctrl -i -r ${ id } -e '0,${x},${y},${w},${h}'` );

	return debug;

}

function getActiveWindowDisplay() {

	if ( 1 === getNumberDisplays() ) {
		return 1;
	} 

	const [ x ] = getActiveWindowPosition();
	return x > 2048 ? 2 : 1;

}

function getNumberDisplays() {
	return getScreenDimensions().length;
}

// returns [w,h]
function getScreenDimensions() {

	return execSync( "xrandr --listactivemonitors" )
		.toString()
		.split( "\n" )
		.filter( ( val, index ) => val && index !== 0 )
		.map( 
			val => val.trim().split( ' ' )[2].split( 'x' ).map(
				val => parseInt( val.split( '/' )[0] )
			)
		);

	// return execSync( 'xdotool getdisplaygeometry' ).toString().trim().split( ' ' ).map( i => parseInt( i ) );
}

function getActiveDesktop() {
	return parseInt( execSync( 'xdotool get_desktop' ).toString() );
}

function getActiveWindowId() {
	return execSync( 'xdotool getwindowfocus' ).toString().trim();
}

function getActiveWindowApp( id ) {

	id = id || getActiveWindowId();

	let app = execSync( `xprop -id ${ id } | grep WM_CLASS` )
		.toString()
		.trim()
		.replace( 'WM_CLASS(STRING) = ', '' )
		.replace( /\"/g, '' )
		.split( ',' );

	return app[0];

}

function getActiveWindowPosition() {
	return execSync( 'xdotool getwindowfocus getwindowgeometry | grep Position:' )
		.toString()
		.replace( 'Position: ', '' )
		.trim()
		.split( ' ' )[0]
		.split( ',' )
		.map( val => parseInt( val ) );
}

function getActiveWindowDimensions() {
	return execSync( 'xdotool getwindowfocus getwindowgeometry' ).toString().trim();
}

function getActiveWindowDesktop() {
	try {
		return parseInt( execSync( `xdotool getwindowfocus get_desktop_for_window` ).toString().trim() );
	} catch ( e ) {
		return 0;
	}

}

function getActiveWindowInfo() {

	const id = getActiveWindowId(),
		app = getActiveWindowApp( id ),
		desktop = getActiveWindowDesktop();
		// dimensions = getActiveWindowDimensions();

	return { 
		id, 
		app, 
		desktop, 
		// dimensions,
	};

}


function setBrightness( value = 1 ) {

	// Accept brightness value as either a perc (0-100) or as a decimal (0.0 - 1).
	value = value > 1 ? value / 100 : value;

	const displays = execSync( 'xrandr | grep " connected " | awk \'{ print$1 }\'' ).toString().trim().split( "\n" );

	displays.forEach( id => {
		execSync( `xrandr --output ${ id } --brightness ${ value }` );
	} );

}

module.exports = {
	deleteFiles,
	debug,

	getBackgroundImg,

	moveWindow,
	getActiveDesktop,
	getActiveWindowInfo,
	getActiveWindowId,
	getActiveWindowApp,
	getScreenDimensions,
	notify,

	setBrightness,
};