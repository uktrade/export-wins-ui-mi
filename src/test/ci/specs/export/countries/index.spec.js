const webdriver = require( 'selenium-webdriver' );

const accessibilityCheck = require( '../../../helpers/accessibility-check' );
const fetch = require( '../../../helpers/fetch' );
const driver = require( '../../../helpers/driver' );
const takeScreenshot = require( '../../../helpers/take-screenshot' );

const By = webdriver.By;

describe( 'The Country list page', function(){

	beforeAll( function( done ){

		fetch( '/countries/' ).then( takeScreenshot( 'countries' ) ).then( done );
	} );

	accessibilityCheck( 'countries' );

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

				expect( text ).toEqual( 'All countries' );
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

	describe( 'Alpha list', function(){

		it( 'Should find the list', function( done ){

			driver.findElements( By.className( 'alpha-list_letters-list' ) ).then( ( list ) => {

				expect( list.length ).toEqual( 1 );
				done();
			} );
		} );
	} );
} );
