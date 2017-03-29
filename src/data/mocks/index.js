function createPromise( mockPath ){

	return function(){

		return new Promise( ( resolve/*, reject */ ) => {
			
			resolve( require( mockPath ) );
		} );
	};
}

module.exports = {
	sectorTeamCampaigns: createPromise( './sector-team-campaigns' ),
	sectorTeamMonths: createPromise( './sector-team-months' ),
	sectorTeamTopNonHvc: createPromise( './sector-team-top-non-hvc' ),
	regionsOverview: createPromise( './region-overview' ),
	sectorTeamsOverview: createPromise( './sector-teams-overview' ),
	win: createPromise( './win' ),
	hvc: createPromise( './hvc' )
};
