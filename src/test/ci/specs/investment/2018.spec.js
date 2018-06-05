const webdriver = require( 'selenium-webdriver' );

const accessibilityCheck = require( '../../helpers/accessibility-check' );
const fetch = require( '../../helpers/fetch' );
const driver = require( '../../helpers/driver' );
const takeScreenshot = require( '../../helpers/take-screenshot' );

const By = webdriver.By;

describe( 'The UK Nations and Regions HVC Wins page', function() {

	beforeAll(function (done) {
		fetch('/2018/investment/').then(takeScreenshot('investment_index_2018')).then(done);
	});

	describe( 'Overview subheading', function(){

		it( 'Should have a subheading for aspirations', async function( done ){

			try {

				const subheadings = await driver.findElements( By.css( '.key-fdi-win-progress .key-fdi-win-progress_item' ) );
				const target_header = await subheadings[ 3 ].getText();

				expect( target_header ).toEqual( 'Aspirations' );
				done();

			} catch( e ){

				done.fail( e );
			}
		} );
	} );

});
