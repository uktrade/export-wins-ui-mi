const generateSchema = require( './lib/generate-schema' );

const MAX_REGIONS = 17;

function checkRegionCount( list ){

	let regionCount = 0;

	list.results = list.results.filter( ( group ) => {

		let inRange;

		group.regions = group.regions.filter( () => {

			regionCount++;
			inRange = ( regionCount <= MAX_REGIONS );

			return inRange;
		} );

		return inRange;
	} );
}

module.exports = {

	createList: function( year ){

		return generateSchema( '/os_region_groups/index.schema', year ).then( ( list ) => {

			let id = 1;
			let regionId = 1;

			checkRegionCount( list );

			for( let group of list.results ){

				group.id = id++;//Regions need to be sequential for the grouping work

				for( let region of group.regions ){

					region.id = regionId++;
				}
			}

			return list;
		} );
	}
};
