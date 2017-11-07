const webdriver = require( 'selenium-webdriver' );

const accessibilityCheck = require( '../../helpers/accessibility-check' );
const fetch = require( '../../helpers/fetch' );
const driver = require( '../../helpers/driver' );
const takeScreenshot = require( '../../helpers/take-screenshot' );

const By = webdriver.By;

describe( 'Investment Index Page', function(){

	describe( 'Without any feature flags', function(){

		beforeAll( function( done ){

			fetch( '/investment/' ).then( takeScreenshot( 'investment_index' ) ).then( done );
		} );

		accessibilityCheck( 'investment_index' );

		describe( 'Homepage lists', function(){

			let lists;

			beforeAll( function( done ){

				driver.findElements( By.className( 'i-homepage-list' ) ).then( ( listElems ) => {

					lists = listElems;
					done();
				} );
			} );

			it( 'Should not have any lists on the page', function(){

				expect( lists.length ).toEqual( 0 );
			} );
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
	} );

	describe( 'With the ?sectorteams feature flag', function(){

		beforeAll( function( done ){

			fetch( '/investment/?sectorteams=1' ).then( takeScreenshot( 'investment_index-sector-teams' ) ).then( done );
		} );

		describe( 'Homepage lists', function(){

			let lists;

			beforeAll( function( done ){

				driver.findElements( By.className( 'i-homepage-list' ) ).then( ( listElems ) => {

					lists = listElems;
					done();
				} );
			} );

			it( 'Should have a list of sector teams on the page', function(){

				expect( lists.length ).toEqual( 1 );
			} );
		} );
	} );
} );
