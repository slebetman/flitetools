function get (el) {
    if (typeof el == "string") {
        return document.getElementById(el);
    }
    return el;
}

function querystring (obj) {
	var q = [];
	
	for (var i in obj) {
		q.push(i+'='+obj[i]);
	}
	
	return q.join('&');
}