const webdriver = require( 'selenium-webdriver' );
const fetch = require( '../helpers/fetch' );
const driver = require( '../helpers/driver' );
const takeScreenshot = require( '../helpers/take-screenshot' );

const By = webdriver.By;

describe( 'The homepage', function(){

	beforeAll( function( done ){

		fetch( '/' ).then( done );
	} );

	afterAll( function( done ){

		takeScreenshot( 'index', done );
	} );

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

				expect( text ).toEqual( 'Export Wins performance' );
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

	describe( 'Lists', function(){

		it( 'There should only be one list', function( done ){

			driver.findElements( By.className( 'sector-list' ) ).then( ( lists ) => {

				expect( lists.length ).toEqual( 1 );
				done();
			} );
		} );
	} );
} );
