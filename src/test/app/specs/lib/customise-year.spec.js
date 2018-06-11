const customiseYear = require('../../../../app/lib/customise-year');
const target = customiseYear.target;

describe('target', function () {

	describe('When the date is before 2018', function () {
		it('Should return target', function () {
			expect(target(2017)).toEqual('target');
		});
	});

	describe('When the date is 2018 or after', function () {
		it('Should return aspiration', function () {
			expect(target(2018)).toEqual('aspiration');
		});
	});

});
