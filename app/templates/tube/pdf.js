var Units = require('../../js/units');
var funnel_cutter = require('../../js/funnel_cutter');
var PDFkit = require('pdfkit');

module.exports = function pdf (locals) {
	var px = new Units('px');
	var pdf = new PDFkit({size:'A4',layout:'landscape'});

	var svg = funnel_cutter.svg(1,1,locals.arc1,locals.arc2,locals.length);
		
	var bbox = funnel_cutter.bbox(svg.funnel,svg.coords);
	var margin = px.inch(0.5);
	
	pdf.translate(margin-bbox.x,margin-bbox.y).
		path(svg.path).stroke();
	
	return pdf;
}
