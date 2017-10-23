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

	getOverview,
	getOverviewYoy,

	getHomepageData: function( req ){

		return getAll( 'getHomepageData', [

			getSectorTeams( req ),
			//getOverseasRegions( req ),
			getOverview( req ),
			getOverviewYoy( req )

		], function( data ){

			return {
				sectorTeams: data[ 0 ],
				//overseasRegions: data[ 1 ],
				overview: data[ 1 ],
				overviewYoy: data[ 2 ]
			};
		} );
	}
};
