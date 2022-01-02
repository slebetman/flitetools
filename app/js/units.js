var Units = (function(){
	var multipliers = {
		'px':1/72,
		'inch':1,
		'cm':0.393701,
		'mm':0.0393701
	}
	
	// Constructor:
	return function (base,scaling_factor) {
		this.base = base || 'px';
		this.scaling_factor = scaling_factor || 1;
	
		this.multiplier = multipliers[this.base];
		if (!this.multiplier) {
			throw new Error('Unsupported unit type:'+base);
		}
		
		for (var m in multipliers) {
			this[m] = (function(nm){
				return function (n) {
					return this.scaling_factor*n*nm/this.multiplier;
				}
			})(multipliers[m]);
		}
	}
})();

if (typeof module != 'undefined') module.exports = Units;
