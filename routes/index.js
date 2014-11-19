var express = require('express');
var router = express.Router();
var store = require('../store');
var Tweet = require('../models').Tweet;
var User = require('../models').User;

function findAll()
{
    
    var allTweets = {}; 
    
    return Tweet.findAll({include:[User]}).success(function(userTweets){
      for(tweet in userTweets)
      { 
          allTweets[tweet] = 
          { 
            name: userTweets[tweet].dataValues.User.dataValues.name, 
            tweet: userTweets[tweet].dataValues.tweet,
            id: userTweets[tweet].dataValues.id
          };
      }
      return allTweets;
    });
}

function findNameAndText(name,text)
{
  var allTweets = {};
  var fName = name;
  var fText = text;
  return allTweets = findAll().success(function(tweets)
  {
        var tweetId = 0;
        for(tweet in tweets)
        {
          tweetId = tweets[tweet].id;
          if(tweets[tweet].name == fName && tweets[tweet].tweet == fText)
          {
            return tweets[tweet];
          }
        }
        tweetId++;
        return {name: fName, tweet: fText, id: tweetId}
  })
}

var findByUser = function(user)
{
  var tweetsByUser = {};  
  
  return  User.find({
            include:[Tweet],
            where: {name: user}
            }).success(function(u){
                for(tweet in u.dataValues.Tweets)
                {
                  tweetsByUser[tweet] = 
                  {
                    name: u.dataValues.name,
                    tweet: u.dataValues.Tweets[tweet].tweet,
                    id: u.dataValues.Tweets[tweet].id
                  }
                }
                return tweetsByUser;
              })
}

var findById = function(id)
{
  var tweetsByUser = {};  
  
  return  Tweet.find({
            include:[User],
            where: {id: id}
            }).success(function(u){
                tweetsByUser[id] =
                {
                  name: u.dataValues.User.dataValues.name,
                  tweet: u.dataValues.tweet,
                  id: id
                }
                return tweetsByUser;
              })
}

/* GET home page. */
router.get('/', function(req, res) {
  var list = findAll().success(function(tweets){
    res.render('index', { title: 'Twitter.js', tweets: tweets, show_form: true });    
  });
});

router.get('/users/:name', function(req, res) {
  var name = req.params.name;
  var list = findByUser(name).success(function(tweets){
      res.render('index', { title: 'Twitter.js - Posts by '+name, tweets: tweets, show_form: true, form_name: name });
    });
});

router.get('/users/:name/tweets/:id', function(req, res) {
	var name = req.params.name;
	var id = parseInt(req.params.id);

  var list = findById(id).success(function(tweets){
    res.render('index', { title: 'Twitter.js - Post by '+name, tweets: tweets, show_form: true });  
  });
})

router.post('/submit', function(req, res) {
  var name = req.body.name;
  var text = req.body.text;

  User.findOrCreate({where: {name: name}})
  .done(function(err, users) {
    var userId = users[0].id;

    User.count()
    .success(function(num) {
      if(num == userId)
      {
        users[0].updateAttributes({
          name: name 
        }).success(function() {})
      }
    });

    Tweet.create({tweet: text, UserId: userId})
      .done(function(err, newTweet) {
        newTweet.name = name;
        console.log(newTweet);
        io.sockets.emit("new_tweet", newTweet, name);
        res.redirect('/');
    });
  });
});

module.exports = router;
