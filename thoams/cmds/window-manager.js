const { getActiveWindowInfo, getScreenDimensions, moveWindow, notify } = require( '../util' );

// Default config for fullscreen apps that are always on the primary display.
const defaultConfig = () => {
	return {
		display: [ 1, 1 ],
		pos: [
			[ 0, 0 ],
			[ 0, 0 ],
		],
		size: [ 
			[ 'fullscreen', 'fullscreen' ],
			[ 'fullscreen', 'fullscreen' ],
		],
	};
};

const config = {
	'brave-browser': {
		desktop: 1,
		...defaultConfig(),
	},
	kitty: {
		desktop: 3,
		display: [ 1, 2 ],
		pos: [ 
			[ 40, -40 ],
			[ 40, -40 ],
		],
		size: [ 
			[ 2800, 1600 ],
			[ 2200, 1100 ],
		],
	},
	slack: {
		desktop: 0,
		...defaultConfig(),
	},
	spotify: {
		desktop: 3,
		display: [ 1, 2 ],
		pos: [
			[ -690, 140 ],
			[ -40, -60 ],
		],
		size: [
			[ 2400, 1600 ],
			[ 1800, 1400 ],
		],
	},
	sublime_text: {
		desktop: 2,
		display: [ 1, 2 ],
		pos: [
			[ 0, 0 ],
			[ -1595, -790 ],
		],
		size: [
			[ 'fullscreen', 'fullscreen' ],
			[ 2400, 1400 ],
		] 
	},
	zoom: {
		desktop: 0,
		...defaultConfig(),
	}
};

function getConfig( app ) {
	return config[ app ];
}

module.exports = {
	command: 'wmv',
	arguments: [],
	options: [],
	description: 'Moves a window to its configured location.',
	action: () => {

		const { id, app } = getActiveWindowInfo(),
			activeConfig = getConfig( app );

		if ( activeConfig ) {
			moveWindow( id, activeConfig );
		}
		
		notify( {
			summary: 'thoams wmv',
			body: JSON.stringify( getActiveWindowInfo() ),
		} )

	},
};
