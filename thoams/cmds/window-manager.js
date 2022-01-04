const
	{ readFileSync, writeFileSync } = require( 'fs' ), 
	pathJoin = require( 'path' ).join,
	{ getActiveWindowInfo, getScreenDimensions, moveWindow, notify } = require( '../util' ),
	parseYaml = require( 'yaml' ).parse;

function getConfig( app ) {

	const config = parseYaml( 
			readFileSync( 
				pathJoin( __dirname, '../wm-config.yml' ),
				'utf8'
			),
			{ merge: true }
		);

	return config[ app ] || config['__'];
}

module.exports = {
	command: 'wmv',
	arguments: [],
	options: [],
	description: 'Moves a window to its configured location.',
	action: () => {

		const activeInfo = getActiveWindowInfo(),
			{ id, app } = activeInfo,
			activeConfig = getConfig( app );

		let debug = null;

		if ( activeConfig ) {
			debug = moveWindow( id, activeConfig );
		}
		
		writeFileSync( pathJoin( __dirname, '../debug.log' ), JSON.stringify( { debug, activeConfig, activeInfo }, null, 2 ) );
		
		notify( {
			summary: 'thoams wmv',
			body: JSON.stringify( activeInfo ),
		} )

	},
};
