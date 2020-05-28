const clc = require('cli-color');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const readline = require('readline');
const padleft = require('pad-left');
const highlight = require('cli-highlight').highlight;
const term = require('terminal-kit').terminal;

let out = {
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

class Rlogtail {

	constructor(port = 8881, ip = "127.0.0.1") {
		this.trace = null;
		this.requestid = null;
		this.mode = 0;
		this.error = null;


		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(true);

		process.stdin.on('keypress', (str, key) => {
			if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
				term.info('bye')
				process.exit();
			} else if (key.name === 't') {
				this.mode = this.mode === 2 ? 0 : this.mode + 1;
				term.eraseLine();
				term.column(0);
				out.action('  show trace: ' + ['no', 'basic', 'full'][this.mode]);
				term.column(0);
			} else if (key.name === 'return') {
				term.clear();
				this.log_error(this.error, 1);
			} else if (key.name === 'space') {
				term.clear();
				this.log_error(this.error, 2);
			} else if (key.name === 'backspace') {
				term.clear();
				out.action('- rlogtail - \n');
			}
		});

		term.clear();
		out.action('RLOGTAIL \n\n');
		out.info('- "Enter" to show basic trace\n');
		out.info('- "Space" to show full trace\n');
		out.info('- "Backspace" to clear screen\n');
		out.info('- "t" to change auto show trace mode\n');
		out.info('- "q" or "ctrl-c" to quit\n\n');


		app.use(bodyParser.json({limit: '10mb', extended: true}))
		app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
		app.use(bodyParser.json());
		app.use('/', (req, res) => {
			this.message(req.body);
			res.send('thankyou');
		});

		let server = app.listen(port, ip, () => {
			let host = server.address().address;
			let port = server.address().port;
			out.action("Logtail listening at %s:%s\n", host, port);
		});
	}

	message(log) {
		var timestamp = new Date();

		if (this.requestid !== log.request.id) {
			this.requestid = log.request.id;
			out.header.time(
				"\n\n" +
				padleft(timestamp.getHours(), 2, '0') + ':' +
				padleft(timestamp.getMinutes(), 2, '0') + ':' +
				padleft(timestamp.getSeconds(), 2, '0') + ' '
			);
			out.header.host(' (' + log.request.id + ')\n');
			out.header.method('' + log.request.method + ' ');
			out.header.path(log.request.path + ' ');
			out.header.host(log.request.host + '\n');

		}

		if (log.type === 'error' || log.type === 'exception'){
			term.bell();
			this.log_error(log.message, this.mode);
		}
		else if (log.type === 'sql') this.log_sql(log.message);
		else this.log_info(log.message);
	}

	log_info(message) {
		out.message.info('[DBG] ');
		term(highlight(JSON.stringify(message, null, 2), {language: 'json'}));
		term("\n");
	}

	log_sql(message) {
		out.message.sql('[SQL] ');
		term(highlight(message, {language: 'sql', ignoreIllegals: true}) + "\n");
	}

	log_error(message, mode) {
		if (message === null) {
			term.eraseLine();
			out.info('  no error...');
			term.column(0);
			return;
		}

		out.message.error('[' + (message.errorlevel ? message.errorlevel : message.type) + '] ');
		out.error.message(message.message + "\n");
		out.error.file(message.file + ' @ ' + message.line + "\n");

		this.error = message;
		if (mode === 0) out.do('Press ENTER or SPACE to show trace information!');
		if (mode === 1) this.showtrace(message.trace, false);
		if (mode === 2) this.showtrace(message.trace, true);
	}

	showtrace(trace, showargs) {

		trace.reverse();

		let files = [];
		trace.forEach(trc => {
			if (typeof trc.file !== "undefined" && trc.file.length) files.push(trc.file);
		});

		let sim = files[0];
		files.forEach(file => {
			sim = comparestrings(sim, file);
		});

		out.action('Trace ');
		out.trace.file(" root: " + sim + "\n")

		trace.forEach((trc, index) => {
			out.trace.file(typeof trc.file !== 'undefined' ? trc.file.substr(sim.length) : ' ... ');
			out.trace.line(typeof trc.line !== 'undefined' ? ' ' + trc.line : '');
			out.trace.file(" > ");
			out.trace.class(typeof trc.class !== 'undefined' ? trc.class : '');
			out.trace.type(typeof trc.type !== 'undefined' ? trc.type : '');
			out.trace.function(trc.function);
			term('\n')
			if (showargs && Array.isArray(trc.args) && trc.args.length) term(highlight(JSON.stringify(
				trc.args,
				null,
				(trc.args.length  > 1 || (typeof trc.args[0]  === 'object' && Object.keys(trc.args[0]).length)) ? 2 : 0
				),{language: 'json'}) + "\n");
		});
		trace.reverse();
	}


}

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

module.exports = Rlogtail;