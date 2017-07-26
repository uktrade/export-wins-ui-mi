const webdriver = require( 'selenium-webdriver' );

const accessibilityCheck = require( '../helpers/accessibility-check' );
const fetch = require( '../helpers/fetch' );
const driver = require( '../helpers/driver' );
const takeScreenshot = require( '../helpers/take-screenshot' );

const By = webdriver.By;

describe( 'The Overseas Regions overview page', function(){

	beforeAll( function( done ){

		fetch( '/overseas-regions/overview/' ).then( takeScreenshot( 'os-regions-overview' ) ).then( done );
	} );

	accessibilityCheck( 'os-regions-overview' );

	describe( 'Page heading', function(){

		let heading;

		beforeAll( function( done ){

			driver.findElement( By.className( 'page-heading' ) ).then( ( headingElem ) => {

				heading = headingElem;
				done();
			} );
		} );

		it( 'Should have the correct title', function( done ){

			heading.getText().then( ( text ) => {

				expect( text ).toEqual( 'All overseas regions review' );
				done();
			} );
		} );

		it( 'Should have the correct tag', function( done ){

			heading.getTagName().then( ( tagName ) => {

				expect( tagName ).toEqual( 'h1' );
				done();
			} );
		} );
	} );

	describe( 'Oversea  Regions key', function(){

		it( 'Should find the key', function( done ){

			driver.findElements( By.className( 'key' ) ).then( ( key ) => {

				expect( key.length ).toEqual( 1 );
				done();
			} );
		} );
	} );

	describe( 'Oversea  Regions table', function(){

		it( 'Should find the table', function( done ){

			driver.findElements( By.className( 'overseas-region-overview-data' ) ).then( ( table ) => {

				expect( table.length ).toEqual( 1 );
				done();
			} );
		} );
	} );
} );
