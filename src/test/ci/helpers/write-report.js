const fs = require( 'fs' );
const config = require( '../test-config' );

module.exports = function writeReport( name, report ){

	return new Promise( ( resolve, reject ) => {

		const file = ( config.accessibilityReportDir + '/' + name + '.json' );
		const violations = report.violations;

		if( violations.length ){

			const data = JSON.stringify( { violations }, null, 2 );

			fs.writeFile( file, data, function( err ){

				if( err ){

					reject( err );

				} else {

					//console.log( 'Screenshot written to: ' + file );
					resolve();
				}
			} );

		} else {

			resolve();
		}
	} );
};
