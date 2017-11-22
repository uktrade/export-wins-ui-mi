const { getAll, getJson } = require( '../_helpers' );

const transformFdiOverviewYoy = require( '../../../transformers/fdi/overview-yoy' );

function createIdMatcher( id ){

	return function( items ){

		for( let item of items.results ){

			if( item.id == id ){
				items.results = item;
				return items;
			}
		}

		throw new Error( 'Team not matched' );
	};
}

function getSectorTeams( req ){

	return getJson( '/mi/fdi/sector_teams/', req );
}

function getSectorTeam( req, teamId ){

	return getJson( `/mi/fdi/sector_teams/${ teamId }/`, req );
}

function getOverseasRegions( req ){

	//use export overseas regions for now
	return getJson( '/mi/os_regions/', req );
}

function getOverseasRegion( req, teamId ){

	//use overseas regions list for now to return the name
	return getOverseasRegions( req ).then( createIdMatcher( teamId ) );
}

function getUkRegions( req ){

	//use export overseas regions for now
	return getJson( '/mi/uk_regions/', req );
}

function getUkRegion( req, regionId ){

	return getUkRegions( req ).then( ( data ) => {

		//flatten grouped regions into one list
		data.results = data.results.region_groups.reduce( ( list, group ) => {

			group.regions.forEach( ( region ) => {

				list.push( region );
			} );

			return list;

		}, [] );

		return data;

	} ).then( createIdMatcher( regionId ) );
}

function getOverview( req ){

	return getJson( '/mi/fdi/overview/', req );
}

function getOverviewYoy( req ){

	return getJson( '/mi/fdi/overview/yoy/', req, transformFdiOverviewYoy );
}

module.exports = {

	getSectorTeams,
	getSectorTeam,

	getOverseasRegions,
	getOverseasRegion,

	getUkRegions,
	getUkRegion,

	getOverview,
	getOverviewYoy,

	getHomepageData: function( req ){

		return getAll( 'getHomepageData', [

			getSectorTeams( req ),
			getOverseasRegions( req ),
			getUkRegions( req ),
			getOverview( req ),
			getOverviewYoy( req )

		], function( data ){

			return {
				sectorTeams: data[ 0 ],
				overseasRegions: data[ 1 ],
				ukRegions: data[ 2 ],
				overview: data[ 3 ],
				overviewYoy: data[ 4 ]
			};
		} );
	}
};
