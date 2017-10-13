const regionPerformanceViewModel = require( './uk-region-performance' );

module.exports = {

	create: function( dateRange, groups ){

		const viewGroups = [];

		for( let group of groups ){

			const regions = [];

			for( let region of group.regions ){

				regions.push( {
					id: region.id,
					name: region.name,
					exports: regionPerformanceViewModel.create( { date_range: dateRange, results: region } )
				} );
			}

			viewGroups.push( {
				name: group.name,
				regions
			} );
		}

		return viewGroups;
	}
};
