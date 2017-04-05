const transform = require( '../../../../../app/lib/transformers/win-list' );

const data = [
	{
		"id": 24164,
		"company": {
			"id": 94635,
			"name": "Senger - Roberts",
			"cdms_id": 91392
		},
		"hvc": {
			"id": 9770,
			"name": "minima aliquid totam"
		},
		"lead_officer": {
			"name": "Bennett Willms",
			"location": "Chad",
			"role": "Lead"
		},
		"credit": true,
		"win_date": "Mon Apr 03 2017 19:22:35 GMT+0100 (BST)",
		"export_amount": 851077174,
		"status": "0"
	},
	{
		"id": 13417,
		"company": {
			"id": 19943,
			"name": "Kuvalis, Predovic and Wiza",
			"cdms_id": 65718
		},
		"hvc": {
			"id": 96695,
			"name": "ea tempore soluta"
		},
		"lead_officer": {
			"name": "Florence Johnson",
			"location": "Egypt",
			"role": "Direct"
		},
		"credit": false,
		"win_date": "Mon Apr 03 2017 14:49:00 GMT+0100 (BST)",
		"export_amount": 342321822,
		"status": "1"
	},
	{
		"id": 36282,
		"company": {
			"id": 64263,
			"name": "Ward - Gutmann",
			"cdms_id": 59149
		},
		"hvc": {
			"id": 19561,
			"name": "qui libero ut"
		},
		"lead_officer": {
			"name": "Miss Danyka Dickens",
			"location": "Bolivia",
			"role": "Customer"
		},
		"credit": true,
		"win_date": "Tue Apr 04 2017 02:35:10 GMT+0100 (BST)",
		"export_amount": 388792209,
		"status": "2"
	},
	{
		"id": 31364,
		"company": {
			"id": 36175,
			"name": "Cummings Inc",
			"cdms_id": 23833
		},
		"hvc": {
			"id": 51208,
			"name": "nam maiores tenetur"
		},
		"lead_officer": {
			"name": "Vanessa Doyle",
			"location": "Central African Republic",
			"role": "Product"
		},
		"credit": true,
		"win_date": "Mon Apr 03 2017 07:52:12 GMT+0100 (BST)",
		"export_amount": 10611288,
		"status": "3"
	},
];

describe( 'Win List transformer', function(){

	let output;

	beforeEach( function(){
	
		output = transform( data );
	} );

	describe( 'Credit', function(){
	
		it( 'Should conver the boolean', function(){
	
			expect( output[ 0 ].credit.name ).toEqual( 'Yes' );
			expect( output[ 0 ].credit.modifyer ).toEqual( 'yes' );

			expect( output[ 1 ].credit.name ).toEqual( 'No' );
			expect( output[ 1 ].credit.modifyer ).toEqual( 'no' );
		} );
	} );

	describe( 'Status', function(){
	
		it( 'Should convert the status', function(){
	
			expect( output[ 0 ].status.name ).toEqual( 'Not yet sent' );
			expect( output[ 0 ].status.modifyer ).toEqual( 'not-sent' );

			expect( output[ 1 ].status.name ).toEqual( 'Sent but not confirmed' );
			expect( output[ 1 ].status.modifyer ).toEqual( 'sent' );

			expect( output[ 2 ].status.name ).toEqual( 'Confirmed' );
			expect( output[ 2 ].status.modifyer ).toEqual( 'confirmed' );

			expect( output[ 3 ].status.name ).toEqual( 'Rejected' );
			expect( output[ 3 ].status.modifyer ).toEqual( 'rejected' );
		} );
	} );
} );
