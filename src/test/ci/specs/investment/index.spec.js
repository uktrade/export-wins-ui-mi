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
/*
	describe( 'Homepage lists', function(){

		let lists;

		beforeAll( function( done ){

			driver.findElements( By.className( 'i-homepage-list' ) ).then( ( listElems ) => {

				lists = listElems;
				done();

			} ).catch( done.fail );
		} );

		it( 'Should not have any lists on the page', function(){

			expect( lists.length ).toEqual( 0 );
		} );
	} );
*/
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
} );
