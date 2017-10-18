const { getAll, getJson } = require( './_helpers' );

const transformFdiOverview = require( '../../transformers/fdi/overview' );
const transformFdiOverviewYoy = require( '../../transformers/fdi/overview-yoy' );

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

	//use export sector teams for now
	return getJson( '/mi/sector_teams/', req );
}

function getSectorTeam( req, teamId ){

	//use team list for now to return the name
	return getSectorTeams( req ).then( createIdMatcher( teamId ) );
}

function getOverseasRegions( req ){

	//use export overseas regions for now
	return getJson( '/mi/os_regions/', req );
}

function getOverseasRegion( req, teamId ){

	//use overseas regions list for now to return the name
	return getOverseasRegions( req ).then( createIdMatcher( teamId ) );
}

function getFdiOverview( req ){

	return getJson( '/mi/fdi/overview/', req, transformFdiOverview );
}

function getFdiOverviewYoy( req ){

	return getJson( '/mi/fdi/overview/yoy/', req, transformFdiOverviewYoy );
}

module.exports = {

	getSectorTeams,
	getSectorTeam,

	getOverseasRegions,
	getOverseasRegion,

	getFdiOverview,
	getFdiOverviewYoy,

	getHomepageData: function( req ){

		return getAll( 'getHomepageData', [

			getSectorTeams( req ),
			getOverseasRegions( req ),
			getFdiOverview( req ),
			getFdiOverviewYoy( req )

		], function( data ){

			return {
				sectorTeams: data[ 0 ],
				overseasRegions: data[ 1 ],
				overview: data[ 2 ],
				overviewYoy: data[ 3 ]
			};
		} );
	}
};
