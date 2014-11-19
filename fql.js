// Place your code here:

// Adds properties of obj2 into obj1
function merge(obj1, obj2) {
	for (key in obj2) {
		obj1[key] = obj2[key]
	}
	return obj1;
}

// function objConcat(obj1,obj2)
// {
// 	for(var key in obj2)
// 	{
// 		obj1[key] = obj2[key];
// 	}
// 	return obj1;
// }


var FQL = function(data) {
	this.movies = data || [];
	this.indices = {};
}

FQL.prototype.exec = function() {
	return this.movies;
}

FQL.prototype.count = function()
{
	return this.exec().length;
}

// Array.prototype.count = function() {
// 	return this.length;
// }

FQL.prototype.limit = function(num) {
	var newMovieData = new FQL(this.movies.slice(0,num));
	return newMovieData;
}

FQL.prototype.where = function(func) {
	//debugger;
	var results = [];
	this.movies.forEach(function(ele) {
		if(func(ele))
		{
			results.push(ele);
		}
		//results.push(func(ele));
	});
	var resultData = new FQL(results);
	return resultData;
}

FQL.prototype.select = function(arr) {
	var results = [], tempObj = {};
	this.movies.forEach(function(ele) {
		for(var x=0; x<arr.length; x++) {
			tempObj[arr[x]] = ele[arr[x]];
		}
		results.push(tempObj);
		tempObj = {};
	});
	var resultData = new FQL(results);
	return resultData;
}

FQL.prototype.order = function(str) {
	if(str === 'rank')
	{
		//debugger;
		this.movies.sort(function(a,b)
		{
			//a.rank - b.rank;
			//var temp;
			if(a.rank > b.rank)
			{
				return 1;
			}
			else if(a.rank < b.rank)
			{
				return -1;
			}
			else
			{
				return 0;
			}
		});
		return this;
	}
}

FQL.prototype.left_join =  function(table,func) {
	var results = [];
	var tempObj = {};
	this.movies.forEach(function(ele1) 
	{
		table.movies.forEach(function(ele2) 
		{
			if(func(ele1, ele2)) 
			{
				tempObj = merge(tempObj,ele1);
				tempObj = merge(tempObj,ele2);
				results.push(tempObj);
 				tempObj = {};
			}
 		});
	});

	var resultData = new FQL(results);
	return resultData;
}

FQL.prototype.addIndex = function(str) {
	debugger;
	this.indices[str] = {};
	//var results = []
	var counter = 0;
	//var temp;
	for (key in this.movies) 
	{
		//temp = this.indices[str][this.movies[key].name];
		if(this.indices[str][this.movies[key][str]] === undefined)
		{
			this.indices[str][this.movies[key][str]] = [counter++];
		}
		else
		{
			this.indices[str][this.movies[key][str]].push(counter++);
		}
	}
	debugger;
	//results.push(counter);
	//return results;
};

FQL.prototype.push = function(datum)
{
	this.movies.push(datum);
}

module.exports = 
{
FQL:FQL,
merge:merge
};