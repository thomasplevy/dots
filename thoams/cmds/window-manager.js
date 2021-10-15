const
	{ readFileSync } = require( 'fs' ), 
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
