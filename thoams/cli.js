#!/usr/bin/env node

const { argv } = process, 
	{ readdirSync } = require( 'fs' ),
	{ execSync } = require( 'child_process' ),
	{ Command } = require( 'commander' ),
	program = new Command();

program.version( '2021-09-23' );

readdirSync( `${ __dirname }/cmds` ).forEach( file => {
	
	const { command, description, arguments = [], options = [], action } = require( `${ __dirname }/cmds/${ file }` ),
		cmd = program
			.command( command )
			.description( description )
			.action( action );

	arguments.forEach( args => {
		cmd.argument( ...args );
	} );

	options.forEach( opts => {
		cmd.option( ...opts );
	} );

} );

program.parse( argv );