window.onload=function(){
	
	get('rubber').onchange = function () {
		if (this.value == 'custom') {
			get('custom').style.display = 'inline';
			get('custom_value').innerHTML = ""
		}
		else {
			get('custom').style.display = 'none';
			get('custom_value').innerHTML = '('+this.value+')';
		}
	}

	get('rubber').onchange();

	get('calculate').onclick = function () {
		var weight = +get('weight').value;
		var length = +get('length').value;
		var length_unit = +get('length_unit').value;
		var weight_unit = +get('weight_unit').value;
		
		var rubber = get('rubber').value;
		if (rubber == 'custom') {
			rubber = +get('custom').value;
		}
		else {
			rubber = +rubber;
		}
		
		length *= length_unit;
		weight *= weight_unit;
		
		var x1 = length/weight;
		var x2 = Math.sqrt(x1);
		var x3 = x2 * 6.35;
		var x4 = x3 * length;

		var max = Math.round(x4 * rubber);
		
		get('result').style.display = 'block';

		if (isNaN(max)) {
			get('result').innerHTML = "Inputs are invalid!";
		}
		else {
			get('result').innerHTML = 
				"Max winds = <b>"+max+"</b> turns";
		}
	}
	
}
