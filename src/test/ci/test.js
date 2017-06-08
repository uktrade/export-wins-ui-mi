const webdriver = require( 'selenium-webdriver' );
const writeImage = require( './helpers/write-image' );
const driver = require( './helpers/driver' );
const fetch = require( './helpers/fetch' );

const By = webdriver.By;
const until = webdriver.until;

function runTest( name ){

	return function(){

		driver.getTitle().then( ( title ) => {

			console.log( `Title for ${ name }: ${ title }` );
		} );

		driver.takeScreenshot().then( writeImage( name ) );
	};
}

fetch( '/abc123/' ).then( runTest( '404' ) );
fetch( '/' ).then( runTest( 'index' ) );
fetch( '/' ).then( function(){
	driver.findElement( By.className( 'page-heading' ) ).then( ( heading ) => {
		heading.getText().then( ( text ) => {
			console.log( text );
		} );
		heading.getTagName().then( ( tagName ) => {
			console.log( tagName );
		} );
	} );
} );
driver.quit();

