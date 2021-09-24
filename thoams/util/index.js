const { execSync } = require( 'child_process' );

function notify( { summary, body = '', expires = 2000, icon = '' } ) {

	icon = icon ? ` -i ${ icon }` : icon;

	execSync( `notify-send "${ summary }" "${ body }" -t ${ expires }${ icon }`)
}

function moveWindow( id, { desktop = 0, display = [], pos = [], size = [] } ) {

	const dimensions = getScreenDimensions(),
		currentDisplay = getActiveWindowDisplay(),
		availableDisplays = getNumberDisplays(),
		targetDisplay = display[ availableDisplays - 1 ] - 1;

	let [ x, y ] = pos[ targetDisplay ],
		[ w, h ] = size[ targetDisplay ];

	// Remove maximization (if set).
	execSync( `wmctrl -ir ${ id } -b remove,maximized_vert,maximized_horz` );
	
	// Move to the window to the desired desktop (and follow it).
	if ( desktop !== getActiveDesktop() ) {
		execSync( `wmctrl -ir ${ id } -t ${ desktop }` );
		execSync( `wmctrl -s ${ desktop }` );
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

	return parseInt( execSync( `xdotool getwindowfocus get_desktop_for_window` ).toString().trim() );

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

module.exports = {
	moveWindow,
	getActiveDesktop,
	getActiveWindowInfo,
	getActiveWindowId,
	getActiveWindowApp,
	getScreenDimensions,
	notify,
};