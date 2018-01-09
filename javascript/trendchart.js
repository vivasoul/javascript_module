/*
#Example inputSet#
a = {
	x_set : {
		cd	: [1,2,3],													//ORDERED
		cd_nm : ['일','이','삼']
	},
	y_set : {
		cd : ['a','b','c','d','e','f'],										//ORDERED
		cd_nm : ['에이','비','씨','디','이','에프']
	},
	raw_data : {
		x : ['3', '1', '3', '1', '3', '3', '2', '3', '2', '1', '1', '2', '2', '1'],	//ORDERED
		y : ['f', 'd', 'd', 'a', 'a', 'b', 'b', 'c', 'd', 'b', 'f', 'e', 'a', 'e'],
		z : [5, 3, 15, 8, 7, 19, 28, 13, 8, 20, 7, 29, 13, 24]
	}
};
*/


var TrendSet = function(x_set, y_set, datas){
	var x_len = x_set["cd"].length;
	var y_len = y_set["cd"].length;

	this["categories"] = [];
	this["categories"].push({ "category" : [] });
	for(var i=0; i<x_len; i++)
		this["categories"][0]["category"].push({"label" : x_set["cd_nm"][i] });

	this["dataset"] = [];
	this["datamap"] = {};

	for(var j=0; j<y_len; j++)
	{
		this["dataset"].push({"seriesname" : y_set["cd_nm"][j], "data" : new Array(x_len)});
		for(var k=0; k<x_len; k++)
		{
			var key = x_set["cd"][k]+""+y_set["cd"][j];
			this["datamap"][key] = [j,k];
/*  "dashed" : "1"  */
			if(datas)	{
				this["dataset"][j]["data"][k] = { "value" : datas[key] || 0};
				if(k > x_len-2) this["dataset"][j]["data"][k]["dashed"] = "1"; 
			}
		}
	}
};

TrendSet.prototype.setData = function(x,y,z){
	var key = this["datamap"][x+""+y];
	this["dataset"][key[0]]["data"][key[1]] = z;
};

var SubTrendSet = function(seriesnames, trendSet){
	if( !(trendSet instanceof TrendSet) ) throw "trendSet is not an instance of TrendSet";
	
	this.chart = rawCopy(trendSet.chart) || {};
	this.chart.caption += ":["+seriesnames.join(",")+"]";
	
	this.categories = rawCopy(trendSet.categories) || [];
	this.dataset = [];
	this.series = {};
	for(var i=0, len = trendSet.dataset.length; i<len; i++){
		for(var j=0, s_len = seriesnames.length; j<s_len; j++){
			//console.log(seriesnames[j] + " VS "+trendSet.dataset[i].seriesname);
			if(seriesnames[j] == trendSet.dataset[i].seriesname){
				this.series[seriesnames[j]]= this.dataset.length;
				this.dataset.push(rawCopy(trendSet.dataset[i]));
				break;
			}
		}
	}
	if(this.dataset.length < 1) throw "No matched sub_category :: "+seriesnames[0];
	else								return this;
};
/*
{ 
	x_set : {
		cd	: [1,2,3],													//ORDERED
		cd_nm : ['일','이','삼']
	},
	forecast_data :{	
		"청약" : [ 10, 5, 8, 7],
		"순위" : [ 1, ,2, 3, 4]
	}
}
*/
SubTrendSet.prototype.extendForecast = function(x_set, data, isOverlap){
	var x_len = x_set["cd"].length;
	
	var category = this["categories"][0]["category"];
	if(isOverlap && category.length) category.pop();
	for(var i=0; i<x_len; i++)	category.push({"label" : x_set["cd_nm"][i] });
	//{ "value" : data[i] || 0, "dashed" : "1" }
	for(var srz_name in data)	{
		if(srz_name in this.series){
			var destination  = this.dataset[this.series[srz_name]].data;
			if( isOverlap && destination.length) {
			    destination.pop();
			    if(destination.length) destination[destination.length-1]["dashed"] = 1;
			}
			var src = data[srz_name];
			for(var j=0; j<src.length; j++) destination.push({ "value" : src[j], "dashed" : 1 });
		}
	}
};

TrendSet.prototype.subSet = function(seriesnames){
	if(typeof seriesnames  == "string") seriesnames = [seriesnames];
	return new SubTrendSet(seriesnames, this);
};