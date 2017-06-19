
const groupImages = {
	// unknown
	0: '/public/img/overseas-region-maps/0.jpg',
	// South Pacific
	1: '/public/img/overseas-region-maps/4.png',
	// Europe
	2: '/public/img/overseas-region-maps/1.png',
	// Near East & North Africa
	3: '/public/img/overseas-region-maps/2.png',
	// East
	4: '/public/img/overseas-region-maps/3.png',
	// East, West & South Africa
	5: '/public/img/overseas-region-maps/5.png',
	// Americas
	6: '/public/img/overseas-region-maps/6.png',
};

const regionConfigs = {
	2016: {
		1:  { colour: 'pink' },		// 'North Africa'
		2:  { colour: 'purple' },	// 'South East Asia'
		3:  { colour: 'green' },	// 'North America'
		4:  { colour: 'green' },	// 'West Africa'
		5:  { colour: 'purple' },	// 'Western Europe'
		6:  { colour: 'blue' },		// 'Latin America'
		7:  { colour: 'pink' },		// 'Australia & NZ'
		8:  { colour: 'pink' },		// 'East Africa'
		9:  { colour: 'blue' },		// 'South Asia'
		10: { colour: 'pink' },		// 'Central European Network'
		11: { colour: 'green' },	// 'Nordic Baltic Network'
		12: { colour: 'green' },	// 'Turkey & Caucasus (includes Russia)'
		13: { colour: 'green' },	// 'North East Asia'
		14: { colour: 'blue' },		// 'Middle East'
		15: { colour: 'blue' },		// 'South Africa'
		16: { colour: 'pink' },		// 'China'
		17: { colour: 'blue' }		// 'Mediterranean'
	},
	2017: {
		1:  { colour: 'pink' },		// 'North Africa'
		2:  { colour: 'purple' },	// 'South East Asia'
		3:  { colour: 'green' },	// 'North America'
		5:  { colour: 'purple' },	// 'Western Europe'
		6:  { colour: 'pink' },		// 'Latin America'
		7:  { colour: 'pink' },		// 'Australia & NZ'
		9:  { colour: 'blue' },		// 'South Asia'
		10: { colour: 'pink' },		// 'Central European Network'
		11: { colour: 'green' },	// 'Nordic Baltic Network'
		12: { colour: 'green' },	// 'Turkey & Caucasus (includes Russia)'
		13: { colour: 'green' },	// 'North East Asia'
		14: { colour: 'blue' },		// 'Middle East'
		16: { colour: 'pink' },		// 'China'
		17: { colour: 'blue' },		// 'Mediterranean'
		18: { colour: 'blue' }		// 'Africa'
	},
};

function createImage( id ){

	const url = groupImages[ id ] || groupImages[ 0 ];

	return {
		url,
		width: 265,
		height: 136
	};
}

module.exports = function( groups, regions ){

	if( !groups ){ throw new Error( 'Groups are required' ); }
	if( !regions ){ throw new Error( 'Regions are required' ); }

	const year = regions.financial_year.id;
	//create list of regions keyed by id to make it easy to get one
	const regionList = {};
	const yearRegionConfig = regionConfigs[ year ];

	regions.results.forEach( ( region ) => {

		const regionConfig = yearRegionConfig[ region.id ];

		region.colour = ( regionConfig && regionConfig.colour );
		regionList[ region.id ] = region;
	} );

	groups.results.forEach( ( group ) => {

		group.image = createImage( group.id );
		group.regions = group.regions.map( ( groupRegion ) => {

			const region = regionList[ groupRegion.id ];

			if( !region ){

				throw new Error( 'Region not found for id ' + groupRegion.id );
			}

			region.name = groupRegion.name;

			return region;
		} );
	} );

	regions.results = groups.results;

	return regions;
};
