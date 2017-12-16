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

	describe( 'With all types of files', function(){

		let output;

		beforeEach( function(){

			output = getOutput( getBackendStub( '/csv/all_files' ) );
		} );

		it( 'Should set the name of the latest FDI file', function(){

			expect( output.fdi.latest.name ).toEqual( 'FDI Daily' );
		} );

		it( 'Should set the name of the latest SDI file', function(){

			expect( output.sdi.latest.name ).toEqual( 'Interactions Daily' );
		} );

		it( 'Should remove the date from the name for contacts by regions and sectors', function(){

			expect( output.contacts.regions[ 0 ].name ).toEqual( 'dolores voluptatem autem' );
			expect( output.contacts.regions[ 1 ].name ).toEqual( 'voluptatibus autem assumenda' );
			expect( output.contacts.regions[ 2 ].name ).toEqual( 'aut sapiente et' );
			expect( output.contacts.regions[ 3 ].name ).toEqual( 'amet reprehenderit eos' );
			expect( output.contacts.regions[ 4 ].name ).toEqual( 'sapiente unde enim' );
			expect( output.contacts.regions[ 5 ].name ).toEqual( 'qui commodi et' );
			expect( output.contacts.regions[ 6 ].name ).toEqual( 'nobis qui aperiam' );
			expect( output.contacts.regions[ 7 ].name ).toEqual( 'doloremque quisquam ut' );
			expect( output.contacts.regions[ 8 ].name ).toEqual( 'rerum ratione qui' );
			expect( output.contacts.regions[ 9 ].name ).toEqual( 'nulla voluptatem ipsa' );
			expect( output.contacts.regions[ 10 ].name ).toEqual( 'in accusamus perspiciatis' );

			expect( output.contacts.sectors[ 0 ].name ).toEqual( 'vel molestiae sapiente' );
			expect( output.contacts.sectors[ 1 ].name ).toEqual( 'consectetur rerum vel' );
			expect( output.contacts.sectors[ 2 ].name ).toEqual( 'dolor magnam officia' );
			expect( output.contacts.sectors[ 3 ].name ).toEqual( 'non et et' );
		} );

		it( 'Should remove the date from the name for companies by regions and sectors', function(){

			expect( output.companies.regions[ 0 ].name ).toEqual( 'esse pariatur natus' );
			expect( output.companies.regions[ 1 ].name ).toEqual( 'necessitatibus praesentium eaque' );
			expect( output.companies.regions[ 2 ].name ).toEqual( 'consequatur non quisquam' );
			expect( output.companies.regions[ 3 ].name ).toEqual( 'omnis repellendus officia' );

			expect( output.companies.sectors[ 0 ].name ).toEqual( 'quo quo asperiores' );
			expect( output.companies.sectors[ 1 ].name ).toEqual( 'dolorem porro qui' );
			expect( output.companies.sectors[ 2 ].name ).toEqual( 'id quia adipisci' );
			expect( output.companies.sectors[ 3 ].name ).toEqual( 'qui architecto qui' );
			expect( output.companies.sectors[ 4 ].name ).toEqual( 'dolor hic voluptatem' );
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
