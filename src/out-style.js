const term = require('terminal-kit').terminal;

const out = {
	info: term.brightBlack,
	action: term.black,
	do: term.brightBlue,
	header: {
		time: term.black.bold,
		host: term.brightBlack,
		method: term.brightGreen.bold,
		path: term.brightBlue.bold
	},
	message: {
		info: term.brightBlue.bold,
		sql: term.yellow.bold,
		error: term.red.bold
	},
	error: {
		file: term.cyan,
		message: term.brightYellow,
	},
	trace: {
		file: term.brightBlack,
		line: term.white,
		class: term.cyan,
		type: term.white,
		function: term.green
	}
}
module.exports = out;