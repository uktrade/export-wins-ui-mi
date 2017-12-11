const webdriver = require( 'selenium-webdriver' );

const accessibilityCheck = require( '../../../helpers/accessibility-check' );
const fetch = require( '../../../helpers/fetch' );
const driver = require( '../../../helpers/driver' );
const takeScreenshot = require( '../../../helpers/take-screenshot' );

const By = webdriver.By;

describe( 'Investment Sector Team Non HVC project Page', function(){

	beforeAll( function( done ){

		fetch( '/investment/sector-teams/1/non-hvc-projects/' ).then( takeScreenshot( 'investment_sector_team_non_hvc_projects' ) ).then( done );
	} );

	accessibilityCheck( 'investment_sector_team_non_hvc_projects' );

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

				expect( text ).toEqual( 'Investment performance' );
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

	describe( 'Page sub heading', function(){

		let heading;

		beforeAll( function( done ){

			driver.findElement( By.className( 'page-sub-heading' ) ).then( ( headingElem ) => {

				heading = headingElem;
				done();
			} );
		} );

		it( 'Should have the correct title', function( done ){

			heading.getText().then( ( text ) => {

				expect( text ).toEqual( 'Aerospace FDI Sector Team' );
				done();
			} );
		} );

		it( 'Should have the correct tag', function( done ){

			heading.getTagName().then( ( tagName ) => {

				expect( tagName ).toEqual( 'h2' );
				done();
			} );
		} );
	} );

	describe( 'Psge tabs', function(){

		let tab;

		beforeAll( function( done ){

			driver.findElements( By.className( 'page-tabs_tab--active' ) ).then( ( tabElems ) => {

				tab = tabElems;
				done();
			} );
		} );

		it( 'Should have the correct tab active on the page', function( done ){

			expect( tab.length ).toEqual( 1 );

			tab[ 0 ].getText().then( ( text ) => {

				expect( text ).toEqual( 'Non HVC projects' );
				done();
			} );
		} );
	} );
} );
