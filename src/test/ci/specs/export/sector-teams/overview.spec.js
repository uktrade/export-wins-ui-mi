const webdriver = require( 'selenium-webdriver' );

const accessibilityCheck = require( '../../../helpers/accessibility-check' );
const fetch = require( '../../../helpers/fetch' );
const driver = require( '../../../helpers/driver' );
const takeScreenshot = require( '../../../helpers/take-screenshot' );

const By = webdriver.By;

describe( 'The sector teams overview page', function(){

	beforeAll( function( done ){

		fetch( '/sector-teams/overview/' ).then( takeScreenshot( 'sector-teams-overview' ) ).then( done );
	} );

	accessibilityCheck( 'sector-teams-overview' );

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

				expect( text ).toEqual( 'All sector teams review' );
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

	describe( 'Sector team key', function(){

		it( 'Should find the key', function( done ){

			driver.findElements( By.className( 'key' ) ).then( ( key ) => {

				expect( key.length ).toEqual( 1 );
				done();
			} );
		} );
	} );

	describe( 'Sector team table', function(){

		it( 'Should find the table', function( done ){

			driver.findElements( By.className( 'sector-teams-ov-table' ) ).then( ( table ) => {

				expect( table.length ).toEqual( 1 );
				done();
			} );
		} );
	} );
} );
