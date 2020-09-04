const exportBackendService = require('../lib/service/service.backend').export;
const renderError = require('../lib/render-error');
const globalSummary = require('../lib/view-models/global-summary');
const removeDuplicateHvcs = require('../lib/view-models/remove-duplicate-hvcs');

module.exports = function (req, res) {

	exportBackendService.getHomepageData(req).then((data) => {
		const sectorTeams = data.sectorTeams.results;
		const overseasRegionGroups = data.overseasRegionGroups.results;
		const ukRegions = data.ukRegions.results;
		const globalHvcs = removeDuplicateHvcs.removeDuplicates(data.globalHvcs.results);
		const summary = globalSummary.create(data.globalWins);
		
		res.render('index.html', { sectorTeams, overseasRegionGroups, ukRegions, globalHvcs, summary });

	}).catch(renderError.createHandler(req, res));
};
