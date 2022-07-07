const 
	{ execSync } = require( 'child_process' ),
	{ homedir } = require( 'os' ),
	{ setBrightness, debug } = require( '../util' );

module.exports = {
	command: 'brightness',
	description: 'Set all connected displays to the same brightness',
	arguments: [
		[ '[brightness]', 'Brightness value', 1 ],
	],
	action: ( brightness ) => {
		setBrightness( brightness );
	},
};