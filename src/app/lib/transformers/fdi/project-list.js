function createProject( project ){

	return {
		code: project.project_code,
		value: project.value,
		jobs: {
			new: project.number_new_jobs,
			safe: project.number_safeguarded_jobs
		},
		stage: project.stage,
		date: project.date_won,
		company: {
			name: project.company_name,
			reference: project.company_reference
		},
		investmentValue: project.investment_value,
		sector: project.sector.name,
		ukRegion: project.uk_region.name,
		relationshipManager: project.client_relationship_manager
	};
}

module.exports = function( projects ){

	if( Array.isArray( projects ) ){

		return projects.map( createProject );
	}

	return projects;
};
