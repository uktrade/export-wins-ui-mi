const exportBackendService = require('../lib/service/service.backend').export;
const renderError = require('../lib/render-error');
const globalSummary = require('../lib/view-models/global-summary');

module.exports = function (req, res) {

	exportBackendService.getHomepageData(req).then((data) => {
		const sectorTeams = data.sectorTeams.results;
		const overseasRegionGroups = data.overseasRegionGroups.results;
		const ukRegions = data.ukRegions.results;
		const globalHvcs = data.globalHvcs.results.filter((hvc, index, self) =>
			index === self.findIndex((hvc2) => hvc.code === hvc2.code)
		);
		const summary = globalSummary.create(data.globalWins);
		res.render('index.html', { sectorTeams, overseasRegionGroups, ukRegions, globalHvcs, summary });

	}).catch(renderError.createHandler(req, res));
};
