const term = require('terminal-kit').terminal;
const padleft = require('pad-left');
const highlight = require('cli-highlight').highlight;
const comparestrings = require('./comparestring');
const out = require('./out-style');

class Logger {

	constructor() {
		this.mode = 0;
		this.trace = null;
		this.requestid = null;
		this.error = null;
		this.dumpSQL = false;
	}

	log(log) {
		if(log.type === 'sql' && !this.dumpSQL) return;

		let timestamp = new Date();

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

		if (log.type === 'error' || log.type === 'exception') {
			term.bell();
			this.log_error(log.message, this.mode);
		}
		else if (log.type === 'sql') this.log_sql(log.message);
		else if (log.type === 'info') this.log_info(log.message);
	}

	log_info(message) {
		out.message.info('[DBG] ');
		out.info(message.file + ' @ '+message.line + "\n");
		term(highlight(JSON.stringify(message.message, null, 2), {language: 'json'}));
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

	showlasterror(mode){
		this.log_error(this.error, mode)
	}

	showtrace(trace, showargs) {

		trace.reverse();

		let files = [];
		trace.forEach(trc => {
			if (typeof trc.file !== "undefined" && trc.file.length) files.push(trc.file);
		});

		let sim = files[0];
		files.forEach(file => sim = comparestrings(sim, file));

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
			if (showargs && Array.isArray(trc.args) && trc.args.length) console.log(highlight(JSON.stringify(
				trc.args,
				null,
				(trc.args.length > 1 ) ? 2 : 0
			), {language: 'json'}) + "\n");
		});
		trace.reverse();
	}

}

module.exports = Logger;