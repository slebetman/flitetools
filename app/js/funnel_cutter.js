var PI = Math.PI;

function fixNumbers (obj,decimals) {
	if (typeof obj == 'number') {
		obj = parseFloat(obj.toFixed(decimals));
	}
	else if (obj instanceof Array) {
		for (var i=0;i<obj.length;i++) {
			obj[i] = fixNumbers(obj[i]);
		}
	}
	else if (obj && typeof obj != 'string') {
		for (var i in obj) {
			obj[i] = fixNumbers(obj[i]);
		}
	}
	return obj;
}

var funnel_cutter = {
	calculate : function (arc1,arc2,length) {
		arc_ratio = arc2/arc1;
		
		if (arc_ratio == 1) {
			throw new Error('Arcs cannot be the same length');
		}
		
		var r1 = length/(1-arc_ratio);
		var r2 = r1 * arc_ratio;
		var arc_angle = arc1/r1;
		
		return {
			r1 : Math.abs(r1),
			r2 : Math.abs(r2),
			angle : Math.abs(arc_angle)
		}
	},
	area2perimeter : function (area) {
		return fixNumbers(Math.sqrt(area/PI) * 2 * PI,5);
	},
	diameter2perimeter : function (diameter) {
		return fixNumbers(PI * diameter,5);
	},
	arc_coords : function (x,y,radius,angle) {
		var xx = x + radius * Math.cos(angle);
		var yy = y + radius * Math.sin(angle);
		
		return {start:{x:x+radius,y:y},end:{x:xx,y:yy}}
	},
	bbox : function (funnel,arcs) {
		var r1 = funnel.r1;
		var r2 = funnel.r2;
		var angle = funnel.angle;
		
		var arc = arcs || [
			this.arc_coords(0,0,r1,angle),
			this.arc_coords(0,0,r2,angle)
		];
		
		var box = {
			x : r1 < r2 ? r1:r2,
			x2 : r1 > r2 ? r1:r2,
			y : 0,
			y2 : r1 > r2 ? r1:r2
		}
		var xy = ['x','y'];
		var points = ['start','end'];
		
		for (var i=0;i<arc.length;i++) {
			var this_arc = arc[i];
			for (var j=0;j<xy.length;j++) {
				var this_xy = xy[j];
				for (var k=0;k<points.length;k++) {
					var this_point = points[k];					
					if (box[this_xy] > this_arc[this_point][this_xy]) {
						box[this_xy] = this_arc[this_point][this_xy];
					}
					if (box[this_xy+'2'] < this_arc[this_point][this_xy]) {
						box[this_xy+'2'] = this_arc[this_point][this_xy];
					}
				}
			}
		}
		
		if (angle > (PI*3/2)) {
			box.x = -box.x2;
			box.y2 = box.x2;
			box.y = -box.x2;
		}
		else if (angle > PI) {
			box.x = -box.x2;
			box.y2 = box.x2;
		}
		
		box.width = box.x2 - box.x;
		box.height = box.y2 - box.y;
		
		return fixNumbers(box,5);
	},
	svg : function (x,y,arc1,arc2,length) {
		var funnel = this.calculate(arc1,arc2,length);
		var r1 = funnel.r1;
		var r2 = funnel.r2;
		var angle = funnel.angle;
		
		var arc = [
			this.arc_coords(x,y,r1,angle),
			this.arc_coords(x,y,r2,angle)
		];
		
		arc = fixNumbers(arc);
		
		return {
			funnel : funnel,
			coords : arc,
			path : [
				'M', arc[0].start.x, arc[0].start.y,
				'A', r1, r1, 0, +(angle > Math.PI), 1, arc[0].end.x, arc[0].end.y,
				'L', arc[1].end.x, arc[1].end.y,
				'A', r2, r2, 0, +(angle > Math.PI), 0, arc[1].start.x, arc[1].start.y,
				'Z'
			].join(' ')
		};
	}
}

if (typeof module != 'undefined') module.exports = funnel_cutter;



/* Math deriving equation to calculate funnel shape:
 * 
 * arc1 = arc_angle * r1
 * arc2 = arc_angle * r2
 * 
 * arc1/r1 = arc2/r2
 * 
 * arc1 = arc2 r1/r2
 * 
 * r2 arc1 = arc2 r1
 * 
 * r2/r1 = arc2/arc1 ........... (1)
 * 
 * r1-r2 = length
 * 
 * r1 = r2 + length  ........... (2)
 * 
 * r1 = r1*arc_ratio + length
 * 
 * length = r1 - r1*arc_ratio
 * 
 * length = r1(1-arc_ratio)
 * 
 * r1 = length/(1-arc_ratio) ... (3)
 */
