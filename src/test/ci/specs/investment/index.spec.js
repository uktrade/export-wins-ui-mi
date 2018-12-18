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

				expect( text ).toEqual( 'FDI performance' );
				expect( tagName ).toEqual( 'h1' );
				done();

			} catch( e ){

				done.fail( e );
			}
		} );
	} );
} );
