module.exports = {

	create: function( input ){

		if( Array.isArray( input ) ){

			input.forEach( ( item, index, arr ) => {

				//update existing item to keep properties on the array (like sort params)
				arr[ index ] = {

					id: item.id,
					name: item.name,
					wins: {
						total: item.wins.total,
						verify: item.wins.verify_win.count
					},
					jobs: item.jobs

				};
			} );
		}

		return input;
	}
};
