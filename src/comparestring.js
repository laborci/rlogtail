function comparestrings(str1, str2) {
	let length = Math.min(str1.length, str2.length);
	var sim = '';
	for (var i = 0; i <= length; i++) {
		if (str1.substr(i, 1) === str2.substr(i, 1)) {
			sim += str1.substr(i, 1);
		} else {
			return sim;
		}
	}
	return sim;
}

module.exports = comparestrings;