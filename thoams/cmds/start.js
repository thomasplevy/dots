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

		// Kill existing conky and fail silently (when one isn't running).
		try {
			execSync( 'pkill -f conky' );
		} catch ( e ) {}
		execSync( 'conky -c ~/.config/conky/panel -dq', { stdio: 'inherit' } );

		// Start Devilbox.
		execSync( 'devilbox restart -s', { stdio: 'inherit' } );

		notify( {
			summary: 'thoams start',
			body: 'System startup successful.',
		} );

	},
};