let net = require('net');
let fs = require('fs');

let out = require('./out-style');

class ListenerSocket {
	constructor(socketfile) {
		this.connections = {};
		this.server = null;
		this.handler = (message) => {console.log(message)}
		this.init(socketfile)
		this.shutdown = false;
		process.on('SIGINT', () => this.cleanup());
	}

	init(socketfile) {
		fs.stat(socketfile, (err, stats) => {
			if (err) {
				out.info('No leftover socket found.\n');
			} else {
				out.info('Removing leftover socket.\n')
				fs.unlink(socketfile, (err) => {
					if (err) {
						console.error(err);
						process.exit(0);
					}
				});
			}
			this.createServer(socketfile);
		});
	}

	createServer(socketfile) {
		out.info('Creating server.\n');
		this.server = net.createServer(stream => {
				let client = Date.now();
				let msg = '';
				this.connections[client] = (stream);
				stream.on('end', () => delete this.connections[client]);
				stream.on('data', (message) => {
					msg += message.toString();
					if (msg.charCodeAt(msg.length - 1) === 125) {
						this.handler(JSON.parse(msg));
						msg = '';
					}
					//console.log(msg)
				});
			})
			.listen(socketfile).on('connection', (socket) => {});
		out.action('Logtail listening at ' + socketfile + '\n');
	}

	onMessage(handler) { this.handler = handler; }

	cleanup() {
		if (!this.shutdown) {
			this.shutdown = true;
			out.action('\n', "Destroying server.", '\n');
			if (Object.keys(this.connections).length) {
				let clients = Object.keys(this.connections);
				while (clients.length) {
					let client = clients.pop();
					this.connections[client].write('__disconnect');
					this.connections[client].end();
				}
			}
			this.server.close();
		}
	}
}

module.exports = ListenerSocket;