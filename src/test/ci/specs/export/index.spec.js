const webdriver = require( 'selenium-webdriver' );
const AxeBuilder = require( '@axe-core/webdriverjs' );

const fetch = require( '../../helpers/fetch' );
const driver = require( '../../helpers/driver' );
const takeScreenshot = require( '../../helpers/take-screenshot' );
const writeReport = require( '../../helpers/write-report' );

const By = webdriver.By;

describe( 'The homepage', function(){

	describe( 'With no feature/query params', function(){

		beforeAll( function( done ){

			fetch( '/' ).then( takeScreenshot( 'index' ) ).then( done );
		} );

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

					expect( text ).toEqual( 'Export Wins performance' );
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

		describe( 'Headings', function(){

			let headings;

			beforeAll( function( done ){

				driver.findElements( By.className( 'sector-list-heading' ) ).then( ( headingElems ) => {

					headings = headingElems;
					done();

				} ).catch( done.fail );
			} );

			it( 'Should have a heading for each list', function(){

				expect( headings.length ).toEqual( 3 );
			} );

			it( 'Should have the correct text for the first heading', function( done ){

				headings[ 0 ].getText().then( ( text ) => {

					expect( text ).toEqual( 'Sector Teams' );
					done();

				} ).catch( done.fail );
			} );

			it( 'Should have the correct text for the second heading', function( done ){

				headings[ 1 ].getText().then( ( text ) => {

					expect( text ).toEqual( 'Overseas Regions' );
					done();

				} ).catch( done.fail );
			} );

			it( 'Should have the correct text for the third heading', function( done ){

				headings[ 2 ].getText().then( ( text ) => {

					expect( text ).toEqual( 'UK Nations & Regions' );
					done();

				} ).catch( done.fail );
			} );

			describe( 'Links', function(){

				it( 'Should have a link for each heading', function( done ){

					driver.findElements( By.css( '.sector-list-heading a' ) ).then( ( linkElems ) => {

						expect( linkElems.length ).toEqual( headings.length );
						done();

					} ).catch( done.fail );
				} );
			} );
		} );

		describe( 'Sector team list', function(){

			it( 'Should find the list', function( done ){

				driver.findElements( By.id( 'sector-teams-list' ) ).then( ( list ) => {

					expect( list.length ).toEqual( 1 );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'OS regions list', function(){

			it( 'Should find the list', function( done ){

				driver.findElements( By.id( 'os-regions-list' ) ).then( ( list ) => {

					expect( list.length ).toEqual( 1 );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Accessibility checks', function(){

			it( 'Should not have any violations', function( done ){

				AxeBuilder( driver ).analyze( ( results ) => {

					const violations = results.violations;
					const violationCount = violations.length;

					expect( violationCount ).toEqual( 0 );

					writeReport( 'index', results ).then( done );
				} );
			} );
		} );
	} );
} );
