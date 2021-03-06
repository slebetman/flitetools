function assignLocals(query,vars) {
	var locals = {};
	for (var i=0;i<vars.length;i++) {
		var v = vars[i];
		var q = query[v];
		
		if (q === undefined) {
			throw new Error('query parameter "' + v + '" missing');
		}
		else {
			locals[v] = q;
		}
	}
	return locals;
}

var tube = {
	title : 'EDF thrust tube plotter',
	main : function (req,res) {},
	pdf : function (req,res) {
		var locals = assignLocals(req.query,['arc1','arc2','length']);
		var pdf = require('../templates/tube/pdf.js');
		var doc = pdf(locals);

		res.type('application/pdf');
		res.attachment();
		doc.pipe(res);
		doc.end();
		
		return 'no render';
	}
}

module.exports = tube;
