const Logger = require('./logger');
const term = require('terminal-kit').terminal;
const out = require('./out-style');
const readline = require('readline');


class Rlogtail {

	constructor(listener) {
		this.listener = listener;
		this.logger = new Logger();

		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(true);

		process.stdin.on('keypress', (str, key) => {
			if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
				this.listener.cleanup();
				out.info('bye\n');
				process.exit();
			} else if (key.name === 't') {
				this.logger.mode = this.logger.mode === 2 ? 0 : this.logger.mode + 1;
				term.eraseLine();
				term.column(0);
				out.action('  show trace: ' + ['no', 'basic', 'full'][this.logger.mode]);
				term.column(0);
			} else if (key.name === 's') {
				this.logger.dumpSQL = !this.logger.dumpSQL;
				term.eraseLine();
				term.column(0);
				out.action('  show sql: ' + this.logger.dumpSQL ? 'yes' : 'no');
				term.column(0);
			} else if (key.name === 'return') {
				term.clear();
				this.logger.showlasterror(1);
			} else if (key.name === 'space') {
				term.clear();
				this.logger.showlasterror(2);
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

		this.listener.onMessage((message)=>this.logger.log(message));
	}
}

module.exports = Rlogtail;