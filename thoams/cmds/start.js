const 
	{ execSync } = require( 'child_process' ),
	{ notify } = require( '../util' );

module.exports = {
	command: 'start',
	description: "Poor man's startup script.",
	action: () => {


		// Synclient config.
		execSync( 'synclient HorizScrollDelta=-30' );
		execSync( 'synclient VertScrollDelta=-30' );

		execSync( 'pkill -f conky' );
		execSync( 'conky -c ~/.config/conky/panel -dq', { stdio: 'inherit' } );

		notify( {
			summary: 'thoams start',
			body: 'System startup successful.',
		} );

	},
};