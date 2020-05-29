const express = require('express');
const bodyParser = require('body-parser');
const app = express();
let out = require('./out-style');

class ListenerTcp {
	constructor(port = 8881, address = '127.0.0.1') {
		this.handler = (message) => {console.log(message)}
		app.use(bodyParser.json({limit: '10mb', extended: true}))
		app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
		app.use(bodyParser.json());
		app.use('/', (req, res) => {
			this.handler(req.body);
			res.send('thankyou');
		});

		let server = app.listen(port, address, () => {
			let host = server.address().address;
			let port = server.address().port;
			out.action("Logtail listening at %s:%s\n", host, port);
		});
	}

	cleanup(){}
	onMessage(handler) { this.handler = handler; }
}

module.exports = ListenerTcp;