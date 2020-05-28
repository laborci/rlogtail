#!/usr/bin/env node

let Rlogtail = require('./rlogtail');
let ArgumentParser = require('argparse').ArgumentParser;

let argparser = new ArgumentParser({
	addHelp: true,
	description: 'Rlogtail'
});
argparser.addArgument(['-p', '--port'], {help: 'listening port', defaultValue: 8881});
argparser.addArgument(['-a', '--address'], {help: 'listening host', defaultValue: "127.0.0.1"});

let args = argparser.parseArgs();

new Rlogtail(args.port, args.host);