const paths = [
	[ '/2016/', 'Homepage', [] ],

	[ '/downloads/', 'MI - Downloads', [] ],

	[ '/2016/select-date/', 'Select Year for Dates', [] ],
	[ '/2016/select-date/2017/', 'Select Dates', [] ],

	[ '/2016/sector-teams/', 'Sector Teams list', [] ],
	[ '/2016/sector-teams/overview/', 'Sector Teams Review', [ '.column-date' ] ],
	[ '/2016/sector-teams/1/', 'Sector team detail', [ '.page-date' ] ],
	[ '/2016/sector-teams/1/wins/', 'Sector team HVC wins', [ '.page-date' ] ],
	[ '/2016/sector-teams/1/non-hvc-wins/', 'Sector team non HVC wins', [ '.page-date' ] ],

	[ '/2016/hvc-groups/', 'HVC Group list', [] ],
	[ '/2016/hvc-groups/1/', 'HVC Group detail', [ '.page-date' ] ],
	[ '/2016/hvc-groups/1/wins/', 'HVC Group HVC wins', [ '.page-date' ] ],

	[ '/2016/overseas-regions/', 'Overseas regions list', [ '.page-date' ] ],
	[ '/2016/overseas-regions/overview/', 'Overseas regions review', [ '.page-date' ] ],
	[ '/2016/overseas-regions/1/', 'Overseas region detail', [ '.page-date' ] ],
	[ '/2016/overseas-regions/1/wins/', 'Overseas region HVC wins', [ '.page-date' ] ],
	[ '/2016/overseas-regions/1/non-hvc-wins/', 'Overseas region non-hvc-wins', [ '.page-date' ] ],

	[ '/2016/hvc/E100/', 'HVC detail', [ '.page-date' ] ],
	[ '/2016/hvc/E100/wins/', 'HVC wins', [ '.page-date' ] ],

	[ '/2016/countries/', 'Countries list', [ '.page-date' ] ],
	[ '/2016/countries/AU/', 'Country detail', [ '.page-date' ] ],
	[ '/2016/countries/AU/wins/', 'Country HVC wins', [ '.page-date' ] ],
	[ '/2016/countries/AU/non-hvc-wins/', 'Country non HVC wins', [ '.page-date' ] ],

	[ '/2016/posts/', 'Posts list', [ '.page-date' ] ],
	[ '/2016/posts/australia-sydney/', 'Post detail', [ '.page-date' ] ],
	[ '/2016/posts/australia-sydney/wins/', 'Post HVC wins', [ '.page-date' ] ],
	[ '/2016/posts/australia-sydney/non-hvc-wins/', 'Post non HVC wins', [ '.page-date' ] ],

	[ '/2016/uk-regions/', 'UK Regions overview', [ '.page-date' ] ],
	[ '/2016/uk-regions/north-west/', ' UK Region detail', [ '.page-date', '.sub-heading-date' ] ],
	[ '/2016/uk-regions/north-west/wins/', ' UK Region HVC wins', [ '.page-date' ] ],
	[ '/2016/uk-regions/north-west/non-hvc-wins/', ' UK Region Non HVC wins', [ '.page-date' ] ],

	[ '/2016/investment/', 'Investment Homepage', [ '.fdi-overview-date', '.fdi-overview-yoy-date' ] ],
	[ '/2016/investment/sector-teams/1/', 'Investment - Sector team performance', [ '.page-date' ] ],
	[ '/2016/investment/sector-teams/1/hvc-performance/', 'Investment - Sector team HVC performance', [ '.page-date' ] ],
	[ '/2016/investment/sector-teams/1/non-hvc-performance/', 'Investment - Sector team Non HVC performance', [ '.page-date' ] ],
	[ '/2016/investment/sector-teams/1/hvc-projects/', 'Investment - Sector team HVC projects', [ '.page-date' ] ],
	[ '/2016/investment/sector-teams/1/non-hvc-projects/', 'Investment - Sector team Non HVC projects', [ '.page-date' ] ]
];

const scenarios = paths.reduce( ( output, pathInfo ) => {

	const [ path, label, hideSelectors ] = pathInfo;

	hideSelectors.push( '.experiments', '.hide-experiments' );

	output.push( {
		label,
		url: `http://localhost:9001${ path }`,
		selectors: [ 'document' ],
		hideSelectors,
		misMatchThreshold: 0,
		requireSameDimensions: true
	} );

	return output;

}, [] );

module.exports = {
	id: 'dev-test',
	viewports: [
		{
			"name": 'destop',
			"width": 1200,
			"height": 800
		},
		{
			"name": 'tablet_h',
			"width": 1024,
			"height": 568
		},
		{
			"name": 'tablet_v',
			"width": 568,
			"height": 1024
		}
	],
	scenarios,
	paths: {
		bitmaps_reference: 'src/test/backstop/data/bitmaps-reference',
		bitmaps_test: 'src/test/backstop/data/bitmaps-test',
		casper_scripts: 'src/test/backstop/data/casper-scripts',
		html_report: 'src/test/backstop/data/html-report',
		ci_report: 'src/test/backstop/data/ci-report'
	},
	casperFlags: [],
	engine: 'puppeteer',
	report: [
		'browser', 'CI'
	],
	debug: false
};
