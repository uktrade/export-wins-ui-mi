const { getAll, getJson } = require( './_helpers' );

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

module.exports = {

	getSectorTeams,
	getSectorTeam,

	getOverseasRegions,
	getOverseasRegion,

	getHomepageData: function( req ){

		return getAll( 'getHomepageData', [

			getSectorTeams( req ),
			getOverseasRegions( req )

		], function( data ){

			return {
				sectorTeams: data[ 0 ],
				overseasRegions: data[ 1 ]
			};
		} );
	}
};
