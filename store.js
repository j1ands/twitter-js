var _ = require("underscore");
var FQL = require("./FQL").FQL;
var merge = require("./FQL").merge;

console.log();

//var data = [];
var data = new FQL();
//data1.push({"name": "jordan", "text": "hey", "id": 0});

//console.log(data1);
 
module.exports =
{
  push: function(name,text)
  {
    data.push(
    {
      "name" : name,
      "text" : text,
      "id" : data.count()
    });
  },
  list: function()
  {
    return data.exec();
  },
  find: function(properties)
  {
    var temp;
    temp = data.where(function(element)
      {
        var trueOrFalse = false;
        for(key in properties)
        {
          if(element[key] == properties[key])
          {
            trueOrFalse = true;
          }
        }
        return trueOrFalse;
      });
    return temp.movies;
  }
}

// module.exports = 
// {
//   push: function(name, text)
//   {
//   	data.push(
//   	{
//     	"name": name,
//     	"text": text,
//       "id" : data.length
//   	});
//   },

//   list: function()
//   {
//   	return data;
//   },

//   find: function(properties)
//   {
//     //console.log("hey");
//     //console.log(data);
//     //var returned;
//   	return _.where(data, properties);
//     //console.log(returned);
//     //return returned;
//   }
// }

var randArrayEl = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};
 
var getFakeName = function() {
  var fakeFirsts = ['Nimit', 'Dave', 'Will', 'Charlotte', 'Jacob','Ethan','Sophia','Emma','Madison'];
  var fakeLasts = ["Alley", 'Stacky', 'Fullstackerson', 'Nerd', 'Ashby', 'Gatsby', 'Hazelnut', 'Cookie', 'Tilde', 'Dash'];
  //return randArrayEl(fakeFirsts);
  return randArrayEl(fakeFirsts) + " " + randArrayEl(fakeLasts);
};
 
var getFakeTweet = function() {
  var awesome_adj = ['awesome','breathtaking','amazing','sexy','sweet','cool','wonderful','mindblowing'];
  return "Fullstack Academy is " + randArrayEl(awesome_adj) + "! The instructors are just so " + randArrayEl(awesome_adj) + ". #fullstacklove #codedreams";
};
 
for(var i=0; i<10; i++) {
  module.exports.push(getFakeName(), getFakeTweet());
}