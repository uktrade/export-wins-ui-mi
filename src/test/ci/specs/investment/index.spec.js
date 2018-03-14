const webdriver = require( 'selenium-webdriver' );

const accessibilityCheck = require( '../../helpers/accessibility-check' );
const fetch = require( '../../helpers/fetch' );
const driver = require( '../../helpers/driver' );
const takeScreenshot = require( '../../helpers/take-screenshot' );

const By = webdriver.By;


describe( 'Investment Index Page', function(){

	beforeAll( function( done ){

		fetch( '/investment/' ).then( takeScreenshot( 'investment_index' ) ).then( done ).catch( done.fail );
	} );

	accessibilityCheck( 'investment_index' );

	describe( 'Page heading', function(){

		let heading;

		beforeAll( function( done ){

			driver.findElement( By.className( 'page-heading' ) ).then( ( headingElem ) => {

				heading = headingElem;
				done();

			} ).catch( done.fail );
		} );

		it( 'Should have the correct title', function( done ){

			heading.getText().then( ( text ) => {

				expect( text ).toEqual( 'Investment performance' );
				done();

			} ).catch( done.fail );
		} );

		it( 'Should have the correct tag', function( done ){

			heading.getTagName().then( ( tagName ) => {

				expect( tagName ).toEqual( 'h1' );
				done();

			} ).catch( done.fail );
		} );
	} );

	describe( 'Overview heading', function(){

		let overviewHeading;

		beforeEach( function( done ){

			driver.findElement( By.className( 'fdi-overview-heading' ) ).then( ( overviewHeadingElem ) => {

				overviewHeading = overviewHeadingElem;
				done();

			} ).catch( done.fail );
		} );

		it( 'Should have the correct heading', function( done ){

			overviewHeading.getText().then( ( text ) => {

				expect( text ).toEqual( 'Sectors' );
				done();
			} );
		} );
	} );
} );
