const fetch = require( '../helpers/fetch' );
const driver = require( '../helpers/driver' );
const takeScreenshot = require( '../helpers/take-screenshot' );

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
} );
