const transform = require( '../../../../../app/lib/transformers/csv-files' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );


function getOutput( input ){
	return transform( { response: {}, data: input } ).data;
}

describe( 'CSV files Transformer', function(){

	describe( 'Without any properties', function(){

		it( 'Returns the input', function(){

			expect( getOutput( {} ) ).toEqual( {} );
		} );
	} );

	describe( 'With contacts in the response', function(){

		describe( 'When there are only regions', function(){

			it( 'Should add an updated property to the regions', function(){

				const output = getOutput( getBackendStub( '/csv/all_files.contacts.regions' ) );

				expect( output.contacts.regions[ 0 ].updated ).toEqual( true );
				expect( output.contacts.regions[ 1 ].updated ).toEqual( false );
			} );
		} );

		describe( 'When there are only sectors', function(){

			it( 'Should add an updated property to the sectors', function(){

				const output = getOutput( getBackendStub( '/csv/all_files.contacts.sectors' ) );

				expect( output.contacts.sectors[ 0 ].updated ).toEqual( true );
				expect( output.contacts.sectors[ 1 ].updated ).toEqual( false );
				expect( output.contacts.sectors[ 2 ].updated ).toEqual( false );
			} );
		} );

		describe( 'When there are both sectors and regions', function(){

			it( 'Should add an updated property', function(){

				const output = getOutput( getBackendStub( '/csv/all_files.contacts' ) );

				expect( output.contacts.regions[ 0 ].updated ).toEqual( true );
				expect( output.contacts.regions[ 1 ].updated ).toEqual( false );

				expect( output.contacts.sectors[ 0 ].updated ).toEqual( true );
				expect( output.contacts.sectors[ 1 ].updated ).toEqual( false );
				expect( output.contacts.sectors[ 2 ].updated ).toEqual( false );
			} );
		} );

	} );

	describe( 'With companies in the response', function(){

		describe( 'With both sectors and regions', function(){

			it( 'Should add an updated property', function(){

				const output = getOutput( getBackendStub( '/csv/all_files.companies' ) );

				expect( output.companies.regions[ 0 ].updated ).toEqual( true );
				expect( output.companies.regions[ 1 ].updated ).toEqual( false );
				expect( output.companies.regions[ 2 ].updated ).toEqual( false );

				expect( output.companies.sectors[ 0 ].updated ).toEqual( true );
				expect( output.companies.sectors[ 1 ].updated ).toEqual( false );
				expect( output.companies.sectors[ 2 ].updated ).toEqual( false );
			} );
		} );

		describe( 'With only sectors', function(){

			it( 'Should add an updated property', function(){

				const output = getOutput( getBackendStub( '/csv/all_files.companies.sectors' ) );

				expect( output.companies.sectors[ 0 ].updated ).toEqual( true );
				expect( output.companies.sectors[ 1 ].updated ).toEqual( false );
				expect( output.companies.sectors[ 2 ].updated ).toEqual( false );
			} );
		} );

		describe( 'With both only regions', function(){

			it( 'Should add an updated property', function(){

				const output = getOutput( getBackendStub( '/csv/all_files.companies.regions' ) );

				expect( output.companies.regions[ 0 ].updated ).toEqual( true );
				expect( output.companies.regions[ 1 ].updated ).toEqual( false );
				expect( output.companies.regions[ 2 ].updated ).toEqual( false );
			} );
		} );
	} );
} );
