#!/usr/bin/env node

let Rlogtail = require('./src/rlogtail');
let ArgumentParser = require('argparse').ArgumentParser;
let ListenerTcp = require('./src/listener-tcp');
let ListenerSocket = require('./src/listener-socket');

const cwd = process.cwd() + "/";


let argparser = new ArgumentParser({
	addHelp: true,
	description: 'Rlogtail'
});

argparser.addArgument(['-p', '--port'], {help: 'listening port', defaultValue: 8881});
argparser.addArgument(['-a', '--address'], {help: 'listening host', defaultValue: "127.0.0.1"});
argparser.addArgument(['-s', '--socket'], {help: 'socketfile', defaultValue: null});


let args = argparser.parseArgs();
let listener = args.socket === null ? new ListenerTcp(args.port, args.address) : new ListenerSocket(cwd+args.socket);

new Rlogtail(listener);