const webdriver = require( 'selenium-webdriver' );

const accessibilityCheck = require( '../../../helpers/accessibility-check' );
const fetch = require( '../../../helpers/fetch' );
const driver = require( '../../../helpers/driver' );
const takeScreenshot = require( '../../../helpers/take-screenshot' );

const By = webdriver.By;

describe( 'Investment Sector Team performance Page', function(){

	beforeAll( function( done ){

		fetch( '/investment/sector-teams/1/' ).then( takeScreenshot( 'investment_sector_team_performance' ) ).then( done );
	} );

	accessibilityCheck( 'investment_sector_team_performance' );

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
	describe( 'Performance overview', function(){

		let section;

		beforeAll( function( done ){

			driver.findElements( By.className( 'fdi-overview-section' ) ).then( ( sectionElems ) => {

				section = sectionElems;
				done();
			} );
		} );

		it( 'Should have the overview on the page', function(){

			expect( section.length ).toEqual( 1 );
		} );
	} );

	describe( 'Markets list', function(){

		let list;

		beforeAll( function( done ){

			driver.findElements( By.className( 'fdi-sector-team-markets-list' ) ).then( ( listElems ) => {

				list = listElems;
				done();
			} );
		} );

		it( 'Should have the overview on the page', function(){

			expect( list.length ).toEqual( 1 );
		} );
	} );
} );
