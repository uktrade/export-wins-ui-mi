const TableSorter = require( '../../../../app/lib/TableSorter' );
const spy = require( '../../helpers/spy' );

let sortKeys;
let defaultSort;

describe( 'TableSorter', function(){

	beforeEach( function(){

		sortKeys = {
			test: 'test'
		};

		defaultSort = { key: sortKeys.test, dir: 'asc' };
	} );

	describe( 'Creating it without the required params', function(){

		describe( 'Creating without sortKeys', function(){

			it( 'Should throw an error', function(){

				expect( function(){

					new TableSorter();

				} ).toThrow( new Error( 'sortKeys required for TableSorter' ) );
			} );
		} );

		describe( 'Creating without defaultSort', function(){

			it( 'Should throw an error', function(){

				expect( function(){

					new TableSorter( sortKeys );

				} ).toThrow( new Error( 'defaultSort required for TableSorter' ) );
			} );
		} );
	} );

	describe( 'sort method', function(){

		let inst;
		let createSorter;

		beforeEach( function(){

			inst = new TableSorter( sortKeys, defaultSort );
			createSorter = spy( 'createSorter' );
		} );

		describe( 'Calling without defining a createSorter method', function(){

			it( 'Should throw an error', function(){

				expect( function(){

					inst.sort( );

				} ).toThrow( new Error( 'Must define a createSorter function before sorting' ) );
			} );
		} );

		describe( 'Calling without any items', function(){

			it( 'Should return undefined', function(){

				inst.createSorter = createSorter;

				const r = inst.sort();

				expect( r ).toBeUndefined();
			} );
		} );
	} );

	describe( 'isValidSortKey', function(){

		let inst;
		let sortKeys;

		beforeEach( function(){

			sortKeys = {
				test: 'test',
				test2: 'test-no-match'
			};

			inst = new TableSorter( sortKeys, defaultSort );
		} );

		describe( 'With an invalid sortKey', function(){

			it( 'Should return false', function(){

				const isValid = inst.isValidSortKey( 'testing' );

				expect( isValid ).toEqual( false );
			} );
		} );

		describe( 'With a valid sort key', function(){

			describe( 'When the key matches the value', function(){

				it( 'Should return true', function(){

					const isValid = inst.isValidSortKey( sortKeys.test );

					expect( isValid ).toEqual( true );
				} );
			} );

			describe( 'When the key does not match the value', function(){

				it( 'Should return true', function(){

					const isValid = inst.isValidSortKey( sortKeys.test2 );

					expect( isValid ).toEqual( true );
				} );
			} );
		} );
	} );
} );
