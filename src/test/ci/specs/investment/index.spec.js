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

		it( 'Should have the correct tag and title', async function( done ){

			try {

				const heading = await driver.findElement( By.className( 'page-heading' ) );
				const text = await heading.getText();
				const tagName = await heading.getTagName();

				expect( text ).toEqual( 'Investment performance' );
				expect( tagName ).toEqual( 'h1' );
				done();

			} catch( e ){

				done.fail( e );
			}
		} );
	} );

	describe( 'Overview tabs', function(){

		it( 'Should have three links', async function( done ){

			try {

				const links = await driver.findElements( By.css( '#page-tabs .page-nav_link' ) );
				const text1 = await links[ 0 ].getText();
				const text2 = await links[ 1 ].getText();
				const text3 = await links[ 2 ].getText();

				expect( links.length ).toEqual( 3 );
				expect( text1 ).toEqual( 'Sectors' );
				expect( text2 ).toEqual( 'Overseas markets' );
				expect( text3 ).toEqual( 'UK regions' );
				done();

			} catch( e ){

				done.fail( e );
			}
		} );
	} );

	describe( 'Overview heading', function(){

		it( 'Should have the correct heading', async function( done ){

			try {

				const overviewHeading = await driver.findElement( By.id( 'progress-tab-heading' ) );
				const text = await overviewHeading.getText();

				expect( text ).toEqual( 'Sectors' );
				done();

			} catch( e ){

				done.fail( e );
			}
		} );
	} );

	describe( 'Clicking the Overseas markets link', function(){

		beforeEach( async function( done ){

			try {

				const linkElems = await driver.findElements( By.css( '#page-tabs .page-nav_link' ) );
				await linkElems[ 1 ].click();
				done();

			} catch( e ){

				done.fail( e );
			}
		} );

		it( 'Should have the overseas markets tab selected', async function( done ){

			try {

				const linkElem = await driver.findElement( By.css( '#page-tabs .page-nav_link--active' ) );
				const text = await linkElem.getText();

				expect( text ).toEqual( 'Overseas markets' );
				done();

			} catch( e ) {

				done.fail( e );
			}
		} );

		it( 'Should have the correct heading', async function( done ){

			try {

				const overviewHeading = await driver.findElement( By.id( 'progress-tab-heading' ) );
				const text = await overviewHeading.getText();

				expect( text ).toEqual( 'Overseas markets' );
				done();

			} catch( e ){

				done.fail( e );
			}
		} );
	} );

	describe( 'Clicking the UK regions link', function(){

		beforeEach( async function( done ){

			try {

				const linkElems = await driver.findElements( By.css( '#page-tabs .page-nav_link' ) );
				await linkElems[ 2 ].click();
				done();

			} catch( e ){

				done.fail( e );
			}
		} );

		it( 'Should have the UK regions tab selected', async function( done ){

			try {

				const linkElem = await driver.findElement( By.css( '#page-tabs .page-nav_link--active' ) );
				const text = await linkElem.getText();

				expect( text ).toEqual( 'UK regions' );
				done();

			} catch( e ) {

				done.fail( e );
			}
		} );

		it( 'Should have the correct heading', async function( done ){

			try {

				const overviewHeading = await driver.findElement( By.id( 'progress-tab-heading' ) );
				const text = await overviewHeading.getText();

				expect( text ).toEqual( 'UK regions' );
				done();

			} catch( e ){

				done.fail( e );
			}
		} );
	} );
} );
