const 
	{ execSync } = require( 'child_process' ),
	{ homedir } = require( 'os' ),
	{ notify, getBackgroundImg, deleteFiles } = require( '../util' );

module.exports = {
	command: 'start',
	description: "Poor man's startup script.",
	action: () => {

		// Synclient config.
		execSync( 'synclient HorizScrollDelta=-30' );
		execSync( 'synclient VertScrollDelta=-30' );

		deleteFiles( `${ homedir() }/Downloads/*` );
		deleteFiles( `${ homedir() }/Pictures/Peek*.mp4` );
		deleteFiles( `${ homedir() }/Pictures/Peek*.gif` );
		deleteFiles( `${ homedir() }/Pictures/Screenshot_*.png` );
		deleteFiles( `${ homedir() }/Pictures/wallpaper-*.jpg` );

		getBackgroundImg( file => {
			execSync( `gsettings set org.gnome.desktop.background picture-uri file:///${ file }` );
		} );

		notify( {
			summary: 'thoams start',
			body: 'System startup successful.',
		} );

	},
};