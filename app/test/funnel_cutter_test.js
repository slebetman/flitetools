var chai = require('chai');
chai.use(require('chai-stats'));
var expect = chai.expect;

var funnel_cutter = require('../js/funnel_cutter');

describe('Funnel cutter',function(){
	it('should calculate funnel shape given two arcs and the funnel length',function(){
		for (var arc_angle = 1;arc_angle < 4;arc_angle += 0.1) {
			var r1 = 2;
			var r2 = 1;
			var arc1 = arc_angle * r1;
			var arc2 = arc_angle * r2;
			
			var funnel = funnel_cutter.calculate(arc1,arc2,(r1-r2));
			
			expect(funnel.r1).to.equal(r1);
			expect(funnel.r2).to.equal(r2);
			expect(funnel.angle).to.equal(arc_angle);
		}
	});
	
	it('should generate an error if arcs are the same length',function(){
		expect(function(){
			funnel_cutter.calculate(1,1,1);
		}).to.throw(Error);
	});
	
	it('should handle r2 larger than r1',function(){
		var arc_angle = Math.PI;
		var r1 = 1;
		var r2 = 2;
		var arc1 = arc_angle * r1;
		var arc2 = arc_angle * r2;
		
		var funnel = funnel_cutter.calculate(arc1,arc2,(r2-r1));
		
		expect(funnel.r1).to.equal(r1);
		expect(funnel.r2).to.equal(r2);
		expect(funnel.angle).to.equal(arc_angle);
	});
	
	it('should convert area to perimeter',function(){
		var r = 5;
		var a = Math.PI * r * r;
		var p = 2 * Math.PI * r;
		
		expect(funnel_cutter.area2perimeter(a)).to.almost.equal(p,3);
	});
	
	it('should calculate funnel shape based on area',function(){
		var arc_angle = Math.PI;
		var r1 = 2;
		var r2 = 1;
		var p1 = Math.PI * r1;
		var p2 = Math.PI * r2;
		var rr1 = p1/(2*Math.PI);
		var rr2 = p2/(2*Math.PI);
		var a1 = Math.PI * rr1 * rr1;
		var a2 = Math.PI * rr2 * rr2;
		
		var funnel = funnel_cutter.calculate(
			funnel_cutter.area2perimeter(a1),
			funnel_cutter.area2perimeter(a2),
			(r1-r2)
		);
		
		expect(funnel.r1).to.almost.equal(r1,3);
		expect(funnel.r2).to.almost.equal(r2,3);
		expect(funnel.angle).to.almost.equal(arc_angle,3);
	});
	
	it('should calculate funnel shape based on diameter',function(){
		var arc_angle = Math.PI;
		var r1 = 2;
		var r2 = 1;
		var p1 = Math.PI * r1;
		var p2 = Math.PI * r2;
		var rr1 = p1/(2*Math.PI);
		var rr2 = p2/(2*Math.PI);
		
		var funnel = funnel_cutter.calculate(
			funnel_cutter.diameter2perimeter(rr1*2),
			funnel_cutter.diameter2perimeter(rr2*2),
			(r1-r2)
		);
		
		expect(funnel.r1).to.almost.equal(r1,3);
		expect(funnel.r2).to.almost.equal(r2,3);
		expect(funnel.angle).to.almost.equal(arc_angle,3);
	});
	
	it('should calculate coordinates of arc end points',function(){
		var arc_angle = Math.PI;
		var r = 2;
		
		var coords = funnel_cutter.arc_coords(0,0,r,arc_angle);
		
		expect(coords.start.x).to.equal(r);
		expect(coords.end.x).to.equal(-r);
		expect(coords.start.y).to.equal(0);
		expect(coords.end.y).to.almost.equal(0,3);
	});
	
	it('should calculate bounding box',function(){
		var arc_angle = Math.PI;
		var r1 = 1;
		var r2 = 2;
		var arc1 = arc_angle * r1;
		var arc2 = arc_angle * r2;
		
		var funnel = funnel_cutter.calculate(arc1,arc2,(r2-r1));
		
		var bbox = funnel_cutter.bbox(funnel);
		
		expect(bbox).to.deep.equal({
			x: -r2,
			y: 0,
			x2: r2,
			y2: r2,
			width: 2*r2,
			height: r2
		});
	});
	
	it('should draw svg funnel',function(){
		var arc_angle = Math.PI;
		var r1 = 1;
		var r2 = 2;
		var arc1 = arc_angle * r1;
		var arc2 = arc_angle * r2;
		
		var funnel = funnel_cutter.svg(0,0,arc1,arc2,(r2-r1));
		
		expect(funnel.path).to.be.a('string');
		expect(funnel.path).to.match(/M 1 0/);
		expect(funnel.path).to.match(/A 1 1 0 0 1 -1 0/);
		expect(funnel.path).to.match(/A 2 2 0 0 0 2 0/);
		expect(funnel.coords).to.deep.equal([
			{start : {x:1,y:0},
			 end : {x:-1,y:0}},
			{start : {x:2,y:0},
			 end : {x:-2,y:0}}
		]);
	});
});

