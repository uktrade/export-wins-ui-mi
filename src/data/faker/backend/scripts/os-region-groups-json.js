const generateSchema = require( './lib/generate-schema' );

module.exports = {

	createList: function(){

		let list = generateSchema( '/os_region_groups/index.schema' );
		let id = 1;
		let regionId = 1;

		for( let group of list.results ){

			group.id = id++;//Regions need to be sequential for the grouping work

			for( let region of group.regions ){

				region.id = regionId++;
			}
		}

		return list;
	}
};
