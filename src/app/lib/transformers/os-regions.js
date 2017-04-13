
const groupList = [
	{
		name: 'Europe',
		regions: [ 10, 17, 11, 5 ]
	},
	{
		name: 'Near East and North Africa',
		regions: [ 14, 1, 12 ]
	},
	{
		name: 'East',
		regions: [ 16, 13, 9 ]
	},
	{
		name: 'South Pacific',
		regions: [ 7, 2 ]
	},
	{
		name: 'Americas',
		regions: [ 3, 6 ]
	},
	{
		name: 'East, West & South Africa',
		regions: [ 8, 15, 4 ]
	}
];

module.exports = function( regions ){

	let regionList = {};
	let groups = [];

	//put all regions in an object keyed by id
	for( let region of regions.results ){

		regionList[ region.id ] = region;
	}

	//loop through the groups and replace the region id, with the region object
	for( let group of groupList ){

		let groupRegions = [];

		for( let regionId of group.regions ){

			groupRegions.push( regionList[ regionId ] );
		}

		groups.push({
			name: group.name,
			regions: groupRegions
		});
	}

	return groups;
};
