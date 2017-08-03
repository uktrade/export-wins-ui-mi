const webdriver = require( 'selenium-webdriver' );

const accessibilityCheck = require( '../helpers/accessibility-check' );
const fetch = require( '../helpers/fetch' );
const driver = require( '../helpers/driver' );
const takeScreenshot = require( '../helpers/take-screenshot' );

const By = webdriver.By;

describe( 'The HVC Group page', function(){

	beforeAll( function( done ){

		fetch( '/hvc-groups/1/' ).then( takeScreenshot( 'hvc-group' ) ).then( done );
	} );

	accessibilityCheck( 'hvc-group' );

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

				expect( text ).toEqual( 'Advanced Manufacturing HVC Group' );
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

	describe( 'HVC Group key', function(){

		it( 'Should find the key', function( done ){

			driver.findElements( By.className( 'key' ) ).then( ( key ) => {

				expect( key.length ).toEqual( 1 );
				done();
			} );
		} );
	} );
} );
