var express = require('express');
var router = express.Router();
var store = require('../store');
var Tweet = require('../models').Tweet;
var User = require('../models').User;
//var Sequelize = require('sequelize');
// var User = require('../models').User;
// User.find(1).complete(function(err,user) {
//     //console.log(user);
//     user.getTweets().complete(function(err,tweets) {
//         console.log(typeof tweets);
//   })
// });


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
      //console.log(allTweets);
      return allTweets;
    });
}

function findNameAndText(name,text)
{
  var allTweets = {};
  var fName = name;
  var fText = text;
  //console.log("hey");
  return allTweets = findAll().success(function(tweets)
  {
        //console.log(hey);
        var tweetId = 0;
        for(tweet in tweets)
        {
          //console.log(tweets[tweet].name);
          //return tweets[tweet];
          //console.log(fName,fText);
          tweetId = tweets[tweet].id;
          if(tweets[tweet].name == fName && tweets[tweet].tweet == fText)
          {
            // console.log(hey);
            //console.log(tweet);
            return tweets[tweet];
          }
        }
        tweetId++;
        return {name: fName, tweet: fText, id: tweetId}

        //return tweets;
  })
}

var findByUser = function(user)
{
  var tweetsByUser = {};  
  
  return  User.find({
            include:[Tweet],
            where: {name: user}
            }).success(function(u){
                //console.log(u);
                //console.log(u.dataValues.Tweets)
                for(tweet in u.dataValues.Tweets)
                {
                  //console.log(tweet);
                  tweetsByUser[tweet] = 
                  {
                    name: u.dataValues.name,
                    tweet: u.dataValues.Tweets[tweet].tweet,
                    id: u.dataValues.Tweets[tweet].id
                  }
                  //console.log(tweetsByUser[tweet]);
                }
                //console.log(tweetsByUser[tweet]);
                return tweetsByUser;
              })
 //console.log(tweetsByUser)
//return tweetsByUser;
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
                //console.log("------------");
                //console.log(tweetsByUser);
                //console.log("------------");
                return tweetsByUser;
              })
}

/* GET home page. */
router.get('/', function(req, res) {
	//var tweets = store.list();
  var list = findAll().success(function(tweets){
    res.render('index', { title: 'Twitter.js', tweets: tweets, show_form: true });    
  });
});
//router.get
 
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
	//var list = store.find({'name' : name, 'id' : id});
	
	//var tweetIDList = nameList
})

router.post('/submit', function(req, res) {
  //debugger;
  var name = req.body.name;
  var text = req.body.text;
  //store.push(name, text);
  //Create!!!!!! (maybe findOrCreate)
    var data = findNameAndText(name,text).success(function(tweet)
      {
        console.log("------------");
        console.log(tweet);
        console.log("------------");
        io.sockets.emit("new_tweet",  tweet );
        res.redirect('/'); 
      }); 
  // var data = findNameAndText(name,text);
  //console.log(data);
  //  console.log("------------");
  //var data = store.find({'name':name,'text':text});
  //io.sockets.emit("new_tweet",  data[0] );
  //res.redirect('/');
});

module.exports = router;
