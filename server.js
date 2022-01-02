#!/usr/bin/env node
var fs = require('fs');
var express = require('express');
var site = express();

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var controllers = __dirname + '/app/controllers/';

site.engine('.html', require('ejs-locals'));
site.set('view engine','html');
site.set('views',__dirname + '/app/templates');

site.get('/favicon.*',function(req,res){
	res.send('');
});

site.get('/',function(req,res){
	var controllers = __dirname + '/app/controllers/';
	fs.readdir(controllers,function(err,files){
		var apps = {};
		files = files.sort();
		(function applist(){
			if (files.length) {
				var fname = files.shift();
				fs.readFile(controllers + fname,'utf8',function(err,txt){
					if (txt) {
						var appname = fname.replace(/_controller\.js$/,'');
						var description = txt.match(/title\s*:\s*['"](.+?)['"]/)[1];
						apps[appname] = description;
					}
					applist();
				});
			}
			else {
				res.render('index',{
					title : 'Simple tools for aeromodelling',
					apps  : apps
				});
			}
		})();
	});
});

site.get('/js/*',function(req,res){
	res.sendfile(__dirname + '/app/js/' + req.params[0]);
});

site.get('/css/*',function(req,res){
	res.sendfile(__dirname + '/app/css/' + req.params[0]);
});

site.get('/:app',function(req,res){
	var app = require(controllers + req.params.app + '_controller');
	var locals = app.main(req,res) || {};
	locals.title = app.title || '';
	res.render(req.params.app,locals);
});

site.get('/:app/:method',function(req,res){
	var app = require(controllers + req.params.app + '_controller');
	var locals = app[req.params.method](req,res) || {};
	if (typeof locals != 'string') {
		locals.title = app.title || '';
		res.render([req.params.app,req.params.method].join('/'),locals);
	}
});

// Handle 404
site.use(function(req, res) {
	res.status(400);
	res.render('error.html', {
		title: '404: File Not Found',
		error: ''
	});
});

// Handle 500
site.use(function(error, req, res, next) {
	res.status(500);
	res.render('error.html', {
		title:'500: Internal Server Error',
		error: error
	});
});

site.listen(port,ipaddress);
console.log('Server started..');
