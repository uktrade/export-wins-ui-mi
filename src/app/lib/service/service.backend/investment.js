const { getAll, getJson } = require( './_helpers' );

function getSectorTeams( req ){

	//use export sector teams for now
	return getJson( '/mi/sector_teams/', req );
}

function getSectorTeam( req, teamId ){

	//use team list for now to return the name
	return getSectorTeams( req ).then( ( teams ) => {

		for( let team of teams.results ){

			if( team.id == teamId ){
				teams.results = team;
				return teams;
			}
		}

		throw new Error( 'Team not matched' );
	} );
}

module.exports = {

	getSectorTeams,
	getSectorTeam,

	getHomepageData: function( req ){

		return getAll( 'getHomepageData', [

			getSectorTeams( req )

		], function( data ){

			return {
				sectorTeams: data[ 0 ]
			};
		} );
	}
};
