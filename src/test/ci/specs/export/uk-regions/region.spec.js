const webdriver = require( 'selenium-webdriver' );

const accessibilityCheck = require( '../../../helpers/accessibility-check' );
const fetch = require( '../../../helpers/fetch' );
const driver = require( '../../../helpers/driver' );
const takeScreenshot = require( '../../../helpers/take-screenshot' );

const By = webdriver.By;

describe( 'The UK Region page', function(){

	beforeAll( function( done ){

		fetch( '/uk-regions/north-west/' ).then( takeScreenshot( 'uk-region' ) ).then( done );
	} );

	accessibilityCheck( 'uk-region' );

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

				expect( text ).toEqual( 'North West UK Region' );
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

	describe( 'Page Tab', function(){

		it( 'Should have the correct tab active', function( done ){

			driver.findElement( By.className( 'page-tabs_tab--active' ) ).then( ( tab ) => {

				tab.getText().then( ( text ) => {

					expect( text ).toEqual( 'Performance' );
					done();
				} );
			} );
		} );
	} );

	describe( 'UK Region monthly Performance graph', function(){

		it( 'Should find the graph', function( done ){

			driver.findElements( By.className( 'monthly-performance' ) ).then( ( graph ) => {

				expect( graph.length ).toEqual( 1 );
				done();
			} );
		} );
	} );

	describe( 'UK Region monthly Performance key', function(){

		it( 'Should find the key', function( done ){

			driver.findElements( By.className( 'mp-key' ) ).then( ( key ) => {

				expect( key.length ).toEqual( 1 );
				done();
			} );
		} );
	} );
} );
