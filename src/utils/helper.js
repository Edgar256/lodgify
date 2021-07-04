export function titleCase(str) {
	if (str === undefined) return null;
	if (str.length === 0) return str;
	return str.toLowerCase().replace(/(^|\s)(\w)/g, function (x) {
		return x.toUpperCase();
	});
}
