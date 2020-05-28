#!/usr/bin/env node

let Rlogtail = require('./rlogtail');

new Rlogtail();

//var clc = require('cli-color');
//var express = require('express');
//var bodyParser = require('body-parser');
//var app = express();
//var readline = require('readline');
//var padleft = require('pad-left');
//var highlight = require('cli-highlight').highlight;
//
//var trace = null;
//var requestid = null;
//var mode = 0;
//var modes = ['no', 'basic', 'full'];
//
//app.use(bodyParser.json({limit: '10mb', extended: true}))
//app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
//
//readline.emitKeypressEvents(process.stdin);
//process.stdin.setRawMode(true);
//
//process.stdin.on('keypress', (str, key) => {
//	if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
//		console.log('bye')
//		process.exit();
//	} else if (key.name === 'return') {
//		readline.clearLine(process.stdout, 0);
//		showtrace( false);
//	}else if (key.name === 't') {
//		mode++;
//		if(mode>2) mode = 0;
//		process.stdout.write('show trace: ' + modes[mode] + "        \033[0G");
//	} else if (key.name === 'space') {
//		readline.clearLine(process.stdout, 0);
//		showtrace( true);
//	} else if (key.name === 'backspace') {
//		const blank = '\n'.repeat(process.stdout.rows);
//		console.log(blank);
//		readline.cursorTo(process.stdout, 0, 0);
//		readline.clearScreenDown(process.stdout);
//		console.log('- rlogtail - ');
//	}
//});
//
//app.use(bodyParser.json());
//
//app.use('/', function (req, res) {
//	message(req.body);
//	res.send('thankyou');
//});
//
//
//var server = app.listen(8881, '127.0.0.1', () => {
//	var host = server.address().address;
//	var port = server.address().port;
//	console.log("Logtail listening at http://%s:%s", host, port);
//	console.log(clc.blackBright('- "Enter" to show basic trace'))
//	console.log(clc.blackBright('- "Space" to show full trace'))
//	console.log(clc.blackBright('- "Backspace" to clear screen'))
//	console.log(clc.blackBright('- "t" to change auto show trace mode'))
//	console.log(clc.blackBright('- "q" or "ctrl-c" to quit'))
//});
//
//function message(log, showargs) {
//	var timestamp = new Date();
//
//	if (requestid !== log.request.id) {
//		requestid = log.request.id;
//		console.log(
//			"\n" +
//			styles.header.time(
//				padleft(timestamp.getHours(), 2, '0') + ':' +
//				padleft(timestamp.getMinutes(), 2, '0') + ':' +
//				padleft(timestamp.getSeconds(), 2, '0')
//			) + ' ' +
//			styles.header.method('[' + log.request.method + ']') + ' ' +
//			styles.header.path(log.request.path) + ' ' +
//			styles.header.host(log.request.host) + ' ' +
//			styles.header.host('(' + log.request.id + ')')
//		);
//	}
//
//	if (log.type === 'error' || log.type === 'exception') errorlog(log.message);
//	else if (log.type === 'sql') sqlLog(log.message);
//	else console.log(clc.cyan('[info] ') + highlight(JSON.stringify(log.message, null, 2), {language: 'json'}));
//}
//
//function sqlLog(message) {
//	console.log(
//		clc.blue('[SQL]: ') + highlight(message, {language: 'sql', ignoreIllegals: true})
//	);
//}
//
//function errorlog(message) {
//
//	trace = message.trace;
//
//	type = message.errorlevel ? message.errorlevel : message.type;
//	console.log(
//		clc.red.bold.blink('[' + type + '] ') +
//		clc.cyan(message.file) + ' @' +
//		message.line
//	);
//	console.log(message.message);
//	if(mode === 0)	console.log(clc.blue('Press ENTER or SPACE to show trace information!'));
//	if(mode === 1) showtrace(false);
//	if(mode === 2) showtrace(true);
//}
//
//function showtrace(showargs) {
//
//	if (trace === null) {
//		process.stdout.write("No trace\033[0G");
//		return;
//	}
//
//	tr = trace.reverse();
//
//	let files = [];
//	tr.forEach(trc=>{
//		if(typeof trc.file !== "undefined" && trc.file.length) files.push(trc.file);
//	});
//
//	let sim = files[0];
//	files.forEach(file=>{
//		sim = comparestrings(sim, file);
//	});
//
//	console.log('- - - - - - - - - - - - - - - - - - - - - ');
//	console.log(sim);
//
//	tr.forEach( (trc, index) => {
//		console.log(
//			(typeof trc.file !== 'undefined' ? styles.trace.file(trc.file.substr(sim.length)) : styles.trace.file(' ... ')) +	(typeof trc.line !== 'undefined' ? ' ' + trc.line : '') + styles.trace.file(" > ") +
//			(typeof trc.class !== 'undefined' ? styles.trace.class(trc.class) : '') +
//			(typeof trc.type !== 'undefined' ? styles.trace.type(trc.type) : '') +
//			styles.trace.function(trc.function)
//
//		)
//
//		if (showargs && Array.isArray(trc.args) && trc.args.length) console.log(highlight(JSON.stringify(trc.args, null, trc.args.length > 1 ? 2 : 0), {language: 'json'}) + "\n");
//	});
//	trace.reverse();
//}
//
//function comparestrings(str1, str2){
//	let length = Math.min(str1.length, str2.length);
//	var sim = '';
//	for(var i = 0; i<=length; i++){
//		if(str1.substr(i, 1) === str2.substr(i, 1)){
//			sim += str1.substr(i, 1);
//		}else{
//			return sim;
//		}
//	}
//	return sim;
//}
//
//var styles = {
//	header: {
//		time: clc.white.bold,
//		host: clc.blackBright,
//		method: clc.green.bold,
//		path: clc.blue
//	},
//	trace: {
//		file: clc.blackBright,
//		class: clc.cyan,
//		type: clc.white,
//		function: clc.green
//	}
//};