const crypto = require( 'crypto' ),
	{ writeSync } = require( 'clipboardy' ),
	{ notify } = require( '../util' );

const defaultStrength = 'strong';
	strengthsEnum = {
		stronger: 'All possible characters with a greater occurrence of symbols.',
		strong: 'Alphanumeric characters and a full set of symbols.',
		normal: 'Alphanumeric characters and limited set of symbols.',
		weak: 'Alphanumeric characters',
	},
	dictionaries = {
		lowercase: 'abcdefghijklmnopqrstuvwxyz',
		uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		numbers: '0123456789',
		symbols: '!@#$%^&*()?[]}{',
		extra: '+_-=|:;"/.><,`~',
	};

let randIndex,
	randBytes;

function getRandVal() {

	if ( undefined === randIndex || randIndex >= randBytes.length ) {
		randIndex = 0;
		randBytes = crypto.randomBytes( 256 );
	}

	const res = randBytes[ randIndex ]
	++randIndex;
	return res;

}

function getRandNum( max ) {
	let num = getRandVal();
	while ( num >= 256 - ( 256 % max ) ) {
		num = getRandVal();
	}
	return num % max;
}

function getDictionary( strength ) {

	let chars = '';

	Object.keys( dictionaries ).forEach( charset => {

		if ( [ 'symbols', 'extra' ].includes( charset ) ) {
			
			// Exclude symbols from weak passwords.
			if ( 'weak' === strength ) {
				return;

			// Include more symbols in a stronger password.
			} else if ( 'stronger' === strength ) {
				chars = dictionaries[ charset ] + chars;
			}

		}

		// Exclude extras normal passwords.
		if ( 'extra' === charset && 'normal' === strength ) {
			return;
		}

		chars += dictionaries[ charset ];

	} );

	return chars;
}

function validateLength( length ) {
	return parseInt( length );
}

function validateStrength( strength ) {

	if ( Object.keys( strengthsEnum ).includes( strength ) ) {
		return strength;
	}

	return defaultStrength;

};

function getPassword( length, strength ) {

	const chars = getDictionary( strength ),
		charsLength = chars.length;

	let password = '';

	for ( let i = 0; i < length; i++ ) {
		password += chars[ getRandNum( charsLength ) ];
	}

	return password;

}

module.exports = {
	command: 'password',
	arguments: [
		[ '[length]', 'Number of characters', validateLength, 32 ],
		[ '[strength]', 'Password strength.', validateStrength, defaultStrength  ],
	],
	options: [
		[ '-s --silent', 'Do not output the generated password.' ],
		[ '-c --count [number]', 'Number of passwords to generate', 1 ]
	],
	description: 'Generates a password with the specified length and strength.',
	action: ( length, strength, { silent, count } ) => {

		const generated = [];

		for ( let i = 0; i < count; i++ ) {
			generated.push( getPassword( length, strength ) );
		}

		writeSync( generated.join( "\r\n" ) );
		if ( ! silent ) {
			console.log( generated.join( "\r\n" ) );
		}

		notify( {
			summary: 'thoams password',
			body: `Generated ${ count } ${ length } character password(s)`,
		} );

	},
};
