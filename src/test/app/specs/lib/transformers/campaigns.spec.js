const transform = require( '../../../../../app/lib/transformers/campaigns' );
const input = require( '../../../../../stubs/backend/sector_team_campaigns_2016-12-12' );
const parentSectorInput = require( '../../../../../stubs/backend/parent_sector_campaigns' );

/*
return {
		campaign: item[ 0 ],
		change: item[ 1 ],
		progress: {
			confirmed: item[ 2 ],
			unconfirmed: item[ 3 ]
		},
		value: {
			confirmed: item[ 4 ],
			total: item[ 5 ],
		},
		target: item[ 6 ]
	};
*/

describe( 'Sector campaigns transformer', function(){

	describe( 'Sector team', function(){
	
		it( 'Should return the correct format', function(){

			const output = transform( input );

			expect( Array.isArray( output ) ).toEqual( true );
			expect( output.length ).toBeGreaterThan( 0 );

			output.forEach( ( item ) => {

				expect( item.campaign ).toBeDefined();
				expect( item.change ).toBeDefined();
				expect( item.progress ).toBeDefined();
				expect( item.progress.confirmed ).toBeDefined();
				expect( item.progress.unconfirmed ).toBeDefined();
				expect( item.value ).toBeDefined();
				expect( item.value.confirmed ).toBeDefined();
				expect( item.value.total ).toBeDefined();
				expect( item.target ).toBeDefined();
				expect( item.status ).toBeDefined();
			} );
		} );
	} );

	describe( 'Parent Sector', function(){
	
		it( 'Should return the correct format', function(){

			const output = transform( parentSectorInput );

			expect( Array.isArray( output ) ).toEqual( true );
			expect( output.length ).toBeGreaterThan( 0 );

			output.forEach( ( item ) => {

				expect( item.campaign ).toBeDefined();
				expect( item.change ).toBeDefined();
				expect( item.progress ).toBeDefined();
				expect( item.progress.confirmed ).toBeDefined();
				expect( item.progress.unconfirmed ).toBeDefined();
				expect( item.value ).toBeDefined();
				expect( item.value.confirmed ).toBeDefined();
				expect( item.value.total ).toBeDefined();
				expect( item.target ).toBeDefined();
				expect( item.status ).toBeDefined();
			} );
		} );
	} );

} );
