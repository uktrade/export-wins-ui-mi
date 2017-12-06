const marketsViewModel = require( '../../../../../../app/sub-apps/investment/view-models/fdi-sector-team-markets' );
const getBackendStub = require( '../../../../helpers/get-backend-stub' );

const input = getBackendStub( '/investment/fdi/sector_teams/sector_team' );

describe( 'FDI Sector Team markets', function(){

	it( 'Should create the correct output', function(){

		const output = marketsViewModel.create( input.results.markets );

		expect( Array.isArray( output ) ).toEqual( true );

		for( let market of output ){

			expect( market.name ).toBeDefined();
			expect( Array.isArray( market.results ) ).toEqual( true );

			expect( market.results[ 0 ].type ).toEqual( 'Target' );
			expect( market.results[ 1 ].type ).toEqual( 'Verified' );
			expect( market.results[ 2 ].type ).toEqual( 'Result confirmed' );
			expect( market.results[ 3 ].type ).toEqual( 'Total' );

			market.results.forEach( ( result ) => {

				expect( result.type ).toBeDefined();
				expect( result.modifyer ).toBeDefined();
				expect( result.total.number ).toBeDefined();
				expect( result.total.percent ).toBeDefined();
				expect( result.high ).toBeDefined();
				expect( result.good ).toBeDefined();
				expect( result.standard ).toBeDefined();
			} );
		}
	} );

	it( 'Should combine the verified and confirmed into a faux total item', function(){

		const output = marketsViewModel.create( input.results.markets );

		for( let market of output ){

			const verified = market.results[ 1 ];
			const confirmed = market.results[ 2 ];
			const totals = market.results[ 3 ];

			expect( totals.total.number ).toEqual( verified.total.number + confirmed.total.number );
			expect( totals.high ).toEqual( verified.high + confirmed.high );
			expect( totals.good ).toEqual( verified.good + confirmed.good );
			expect( totals.standard ).toEqual( verified.standard + confirmed.standard );
		}
	} );
} );
