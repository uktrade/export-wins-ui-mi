const webdriver = require( 'selenium-webdriver' );
const AxeBuilder = require( 'axe-webdriverjs' );

const fetch = require( '../helpers/fetch' );
const driver = require( '../helpers/driver' );
const takeScreenshot = require( '../helpers/take-screenshot' );
const writeReport = require( '../helpers/write-report' );

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

	describe( 'Accessibility checks', function(){

		it( 'Should not have any violations', function( done ){

			AxeBuilder( driver ).analyze( ( results ) => {

				expect( results.violations.length ).toEqual( 0 );
				writeReport( 'index', results ).then( done );
			} );
		} );
	} );
} );

describe( 'The homepage with osRegions feature flag', function(){

	beforeAll( function( done ){

		fetch( '/?osRegions=true' ).then( done );
	} );

	afterAll( function( done ){

		takeScreenshot( 'index-osRegions', done );
	} );

	describe( 'Group List', function(){

		it( 'There should only be one group list', function( done ){

			driver.findElements( By.className( 'sector-group-list' ) ).then( ( lists ) => {

				expect( lists.length ).toEqual( 1 );
				done();
			} );
		} );
	} );
} );
