const webdriver = require( 'selenium-webdriver' );

const accessibilityCheck = require( '../../../helpers/accessibility-check' );
const fetch = require( '../../../helpers/fetch' );
const driver = require( '../../../helpers/driver' );
const takeScreenshot = require( '../../../helpers/take-screenshot' );

const By = webdriver.By;

describe( 'The Sector Team page', function(){

	beforeAll( function( done ){

		fetch( '/sector-teams/1/wins/' ).then( takeScreenshot( 'sector-team-wins' ) ).then( done );
	} );

	accessibilityCheck( 'sector-team-wins' );

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

				expect( text ).toEqual( 'Financial & Professional Services Sector Team' );
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

					expect( text ).toEqual( 'HVC wins' );
					done();
				} );
			} );
		} );
	} );
} );
