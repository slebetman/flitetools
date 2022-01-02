window.onload = function(){
	var scale = 0.5;
	var px = new Units('px',scale);
	
	var c = Raphael('canvas', px.mm(297), px.mm(210));
	c.canvas.style.backgroundColor = 'white';
	c.canvas.style.border = '1px solid black';
	
	var form = {
		arc_in : get('in'),
		arc_out : get('out'),
		length : get('length'),
		in_unit : get('in_unit'),
		out_unit : get('out_unit'),
		length_unit : get('length_unit'),
		in_type : get('in_type'),
		out_type : get('out_type')
	};
	
	function plot () {
		var arc_in_unit = form.in_unit.value;
		var arc_out_unit = form.out_unit.value;
		var arc_len_unit = form.length_unit.value;
		
		var arc_in = px[arc_in_unit](+form.arc_in.value);
		var arc_out = px[arc_out_unit](+form.arc_out.value);
		var len = px[arc_len_unit](+form.length.value);
		
		function perimeter (type,value) {
			return funnel_cutter[type+'2perimeter'](value);
		}
		
		arc_in = perimeter(form.in_type.value,arc_in);
		arc_out = perimeter(form.out_type.value,arc_out);
		
		if (arc_in < arc_out) {
			var tmp = arc_in;
			arc_in = arc_out;
			arc_out = tmp;
		}
		
		var svg = funnel_cutter.svg(0,0,arc_in,arc_out,len);
		
		var bbox = funnel_cutter.bbox(svg.funnel,svg.coords);
		var margin = px.inch(0.5);
		
		c.clear();
		c.path(svg.path).translate(
			margin - bbox.x,
			margin - bbox.y
		);
		
		var pdflink = get('pdflink');
		
		pdflink.style.display = 'inline';
		pdflink.href = '/tube/pdf?' + querystring({
			arc1 : arc_in/scale,
			arc2 : arc_out/scale,
			length : len/scale
		});
	}
	
	var plot_if_changed = (function(){
		var prev_in = 0;
		var prev_out = 0;
		var prev_len = 0;
		
		return function () {
			var arc_in = +form.arc_in.value;
			var arc_out = +form.arc_out.value;
			var len = +form.length.value;
			var delay;
			
			if (
				prev_in != arc_in ||
				prev_out != arc_out ||
				prev_len != len
			) {
				clearTimeout(delay);
				delay = setTimeout(function(){
					plot_if_valid();
					prev_in = arc_in;
					prev_out = arc_out;
					prev_len = len;
				},250);
			}
		}
	})();
	
	function plot_if_valid () {
		var arc_in = +form.arc_in.value;
		var arc_out = +form.arc_out.value;
		var len = +form.length.value;
		
		if (
			arc_in && arc_out && len &&
			(arc_in != arc_out)
		) {
			plot();
		}
	}
	
	setInterval(plot_if_changed,100);
	for (n in form) {
		form[n].onchange = plot_if_valid;
	}
}
