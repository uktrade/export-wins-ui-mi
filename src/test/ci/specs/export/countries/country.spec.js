const webdriver = require( 'selenium-webdriver' );

const accessibilityCheck = require( '../../../helpers/accessibility-check' );
const fetch = require( '../../../helpers/fetch' );
const driver = require( '../../../helpers/driver' );
const takeScreenshot = require( '../../../helpers/take-screenshot' );

const By = webdriver.By;

describe( 'The Country detail page', function(){

	beforeAll( function( done ){

		fetch( '/countries/US/' ).then( takeScreenshot( 'countries_country' ) ).then( done );
	} );

	accessibilityCheck( 'countries_country' );

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

				expect( text ).toEqual( 'United States of America Country' );
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

	describe( 'Page Tab', function(){

		it( 'Should have the correct tab active', function( done ){

			driver.findElement( By.className( 'page-tabs_tab--active' ) ).then( ( tab ) => {

				tab.getText().then( ( text ) => {

					expect( text ).toEqual( 'Performance' );
					done();

				} ).catch( done.fail );
			} ).catch( done.fail );
		} );
	} );

	describe( 'Monthly performance graph', function(){

		it( 'Should find the graph', function( done ){

			driver.findElements( By.className( 'monthly-performance' ) ).then( ( graph ) => {

				expect( graph.length ).toEqual( 1 );
				done();

			} ).catch( done.fail );
		} );
	} );

	describe( 'Monthly performance key', function(){

		it( 'Should find the key', function( done ){

			driver.findElements( By.className( 'key' ) ).then( ( key ) => {

				expect( key.length ).toEqual( 1 );
				done();

			} ).catch( done.fail );
		} );
	} );
} );
