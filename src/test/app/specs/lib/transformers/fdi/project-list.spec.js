const transform = require( '../../../../../../app/lib/transformers/fdi/project-list' );
const getBackendStub = require( '../../../../helpers/get-backend-stub' );


describe( 'FDI Project list Transformer', function(){

	describe( 'With a full response', function(){

		let input;

		beforeEach( function(){

			//get stub each time
			input = getBackendStub( '/investment/fdi/sector_teams/win_table' );
		} );

		function checkItems( list ){

			expect( Array.isArray( list ) ).toEqual( true );

			for( let item of list ){

				expect( item.code ).toBeDefined();
				expect( item.value ).toBeDefined();
				expect( item.jobs.new ).toBeDefined();
				expect( item.jobs.safe ).toBeDefined();
				expect( item.stage ).toBeDefined();
				expect( item.date ).toBeDefined();
				expect( item.company.name ).toBeDefined();
				expect( item.company.reference ).toBeDefined();
				expect( item.investmentValue ).toBeDefined();
				expect( item.sector ).toBeDefined();
				expect( item.ukRegion ).toBeDefined();
				expect( item.relationshipManager ).toBeDefined();
			}
		}

		it( 'Should transform the response to the correct format', function(){

			checkItems( transform( input.results.investments.hvc ) );
			checkItems( transform( input.results.investments.non_hvc ) );
		} );
	} );

	describe( 'With no results', function(){

		it( 'Should return the input', function(){

			expect( transform( null ) ).toEqual( null );
		} );
	} );
} );
