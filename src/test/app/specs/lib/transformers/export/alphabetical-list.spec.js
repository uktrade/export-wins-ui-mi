const transform = require( '../../../../../../app/lib/transformers/export/alphabetical-list' );
const getBackendStub = require( '../../../../helpers/get-backend-stub' );

const countryList = getBackendStub( '/countries/' );
const postList = getBackendStub( '/posts/' );

describe( 'Alphabetical list transformer', function(){

	describe( 'With countries', function(){

		describe( 'When the list contains only ASCII characters', function(){

			it( 'Should return an A-Z list of countries', function(){

				const list = transform( countryList.results );

				for( let i = 65; i <= 90; i++ ){

					expect( Array.isArray( list[ String.fromCharCode( i ) ] ) ).toEqual( true );
				}
			} );
		} );

		describe( 'When the list contains non ASCII characters', function(){

			it( 'Should return an A-Z list or countries', function(){

				const nonAsciiList = [
					{
						"id": 30,
						"code": "ZW",
						"name": "Zimbabwe"
					},
					{
						"id": 222,
						"code": "AX",
						"name": "Åland Islands"
					}
				];
				const list = transform( nonAsciiList );

				expect( list.A.length ).toEqual( 1 );
				expect( list.Z.length ).toEqual( 1 );

				expect( list.A[ 0 ] ).toEqual( nonAsciiList[ 1 ] );
			} );
		} );
	} );

	describe( 'With posts', function(){

		describe( 'When the list contains only ASCII characters', function(){

			it( 'Should return an A-Z list of posts', function(){

				const list = transform( postList.results );

				for( let i = 65; i <= 90; i++ ){

					expect( Array.isArray( list[ String.fromCharCode( i ) ] ) ).toEqual( true );
				}
			} );
		} );
	} );
} );
