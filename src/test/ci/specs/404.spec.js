const AxeBuilder = require( 'axe-webdriverjs' );

const fetch = require( '../helpers/fetch' );
const driver = require( '../helpers/driver' );
const takeScreenshot = require( '../helpers/take-screenshot' );
const writeReport = require( '../helpers/write-report' );

describe( '404 Page', function(){

	beforeAll( function( done ){

		fetch( '/abc123' ).then( done );
	} );

	afterAll( function ( done ){

		takeScreenshot( '404', done );
	} );

	describe( 'Page title', function(){

		it( 'Should have the correct title', function( done ){

			driver.getTitle().then( ( text ) => {

				expect( text ).toEqual( 'MI - Not found' );
				done();
			} );
		} );
	} );

	describe( 'Accessibility checks', function(){

		it( 'Should not have any violations', function( done ){

			AxeBuilder( driver ).analyze( ( results ) => {

				expect( results.violations.length ).toEqual( 0 );
				writeReport( '404', results ).then( done );
			} );
		} );
	} );
} );
