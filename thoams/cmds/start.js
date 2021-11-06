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

		// Make touchpad acceleration faster: Default: 2.5.
		// List devices: xinput --list --short
		execSync( 'xinput --set-prop "SYNA2393:00 06CB:7A13 Touchpad" "Device Accel Constant Deceleration" 2.0' );

		deleteFiles( `${ homedir() }/Downloads/*` );
		deleteFiles( `${ homedir() }/Pictures/Peek*.mp4` );
		deleteFiles( `${ homedir() }/Pictures/Peek*.gif` );
		deleteFiles( `${ homedir() }/Pictures/Screenshot_*.png` );
		deleteFiles( `${ homedir() }/Pictures/wallpaper-*.jpg` );

		getBackgroundImg( file => {
			console.log( `gsettings set org.gnome.desktop.background picture-uri file:///${ file }` );
			execSync( `gsettings set org.gnome.desktop.background picture-uri file:///${ file }` );
		} );

		notify( {
			summary: 'thoams start',
			body: 'System startup successful.',
		} );

	},
};