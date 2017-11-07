const webdriver = require( 'selenium-webdriver' );

const accessibilityCheck = require( '../../../helpers/accessibility-check' );
const fetch = require( '../../../helpers/fetch' );
const driver = require( '../../../helpers/driver' );
const takeScreenshot = require( '../../../helpers/take-screenshot' );

const By = webdriver.By;

describe( 'The UK Nations and Regions overview page', function(){

	beforeAll( function( done ){

		fetch( '/uk-regions/' ).then( takeScreenshot( 'uk-regions-overview' ) ).then( done );
	} );

	accessibilityCheck( 'uk-regions-overview' );

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

				expect( text ).toEqual( 'UK Nations and Regions review' );
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

	describe( 'UK Regions table', function(){

		it( 'Should find the table', function( done ){

			driver.findElements( By.className( 'uk-regions-overview_region-group-list' ) ).then( ( lists ) => {

				expect( lists.length ).toEqual( 1 );
				done();
			} );
		} );
	} );
} );
