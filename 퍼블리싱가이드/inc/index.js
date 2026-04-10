'use strict';

var md = new Remarkable('full', {
	html: true,
	xhtmlOut: false,
	linkify: true,
	typographer: true,
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(lang, str).value;
			} catch (err) {}
		}

		try {
			return hljs.highlightAuto(str).value;
		} catch (err) {}

		return ''; // use external default escaping
	}
});

md.renderer.rules.table_open = function() {
	return '<table class="table table-bordered">\n';
};

md.renderer.rules.paragraph_open = function (tokens, idx) {
	var line;
	if (tokens[idx].lines && tokens[idx].level === 0) {
		line = tokens[idx].lines[0];
		return '<p class="line" data-line="' + line + '">';
	}
	return '<p>';
};

md.renderer.rules.heading_open = function (tokens, idx) {
	var line;
	if (tokens[idx].lines && tokens[idx].level === 0) {
		line = tokens[idx].lines[0];
		return '<h' + tokens[idx].hLevel + ' class="line" data-line="' + line + '">';
	}
	return '<h' + tokens[idx].hLevel + '>';
};

document.addEventListener('DOMContentLoaded', function() {
	var input = document.getElementById('inputEl').innerText;
	var output = document.getElementById('outputEl');

	output.innerHTML = md.render(input);
});