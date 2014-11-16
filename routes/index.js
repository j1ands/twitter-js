var express = require('express');
var router = express.Router();
var store = require('../store');

/* GET home page. */
router.get('/', function(req, res) {
	var tweets = store.list();
	res.render('index', { title: 'Twitter.js', tweets: tweets, show_form: true });
});
//router.get
 
router.get('/users/:name', function(req, res) {
  var name = req.params.name;
  console.log(name);
  //var firstOrLast = name
  //console.log(store.list());
  // var random = store.find({text: "amazing"});
  // console.log(random);
  var list = store.find({'name': name});
  //console.log(list);
  res.render('index', { title: 'Twitter.js - Posts by '+name, tweets: list, show_form: true, form_name: name });
});

router.get('/users/:name/tweets/:id', function(req, res) {
	var name = req.params.name;
	var id = parseInt(req.params.id);

	var list = store.find({'name' : name, 'id' : id});
	res.render('index', { title: 'Twitter.js - Post by '+name, tweets: list, show_form: true });

	//var tweetIDList = nameList
})

router.post('/submit', function(req, res) {
  var name = req.body.name;
  var text = req.body.text;
  store.push(name, text);
  var data = store.find({'name':name,'text':text});
  io.sockets.emit("new_tweet",  data[0] );
  res.redirect('/');
});

module.exports = router;
