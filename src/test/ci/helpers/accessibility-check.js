const AxeBuilder = require( 'axe-webdriverjs' );

const driver = require( './driver' );
const writeReport = require( './write-report' );

module.exports = function( reportName ){

	describe( 'Accessibility checks', function(){

		it( 'Should not have any violations', function( done ){

			AxeBuilder( driver )
				.options( {
					rules: {
						"color-contrast": { enabled: false }
					}
				} )
				.analyze( ( results ) => {

					const violations = results.violations;
					const violationCount = violations.length;

					expect( violationCount ).toEqual( 0 );

					if( violationCount > 0 ){

						console.log( JSON.stringify( violations, null, 3 ) );
					}

					writeReport( reportName, results ).then( done );
				} );
		} );
	} );
};
