var chai = require('chai');
chai.use(require('chai-stats'));
var expect = chai.expect;

var Units = require('../js/units');

describe('Units',function(){
	it('should instantiate without errors',function(){
		var units = new Units();
	});
	
	it('should accept base unit as argument',function(){
		new Units('cm');
	});
	
	it('should throw error if base unit is not supported',function(){
		expect(function(){
			new Units('garbage');
		}).to.throw(/Unsupported/);
	});
	
	it('should convert cm to inch',function(){
		var units = new Units('inch');
		expect(units.cm(1)).to.almost.equal(0.393701,3);
	});
	
	it('should convert inch to cm',function(){
		var units = new Units('cm');
		expect(units.inch(5)).to.almost.equal(12.7,3);
	});
	
	it('should convert inch to mm',function(){
		var units = new Units('mm');
		expect(units.inch(5)).to.almost.equal(127,3);
	});
	
	it('should convert inch to px',function(){
		var units = new Units();
		expect(units.inch(1)).to.equal(72);
	});
	
	it('should support scaled conversion by accepting scaling factor',function(){
		var units = new Units('px',0.5);
		expect(units.inch(2)).to.equal(72);
	});
});
