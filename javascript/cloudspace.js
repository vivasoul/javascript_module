var CloudSpace = function(dom_id,w,h,opt){
	opt = opt || {};
	
	this.config = {
		"WIDTH"		: w,
		"HEIGHT"	: h,
		"MAX_RADIUS": opt["MAX_RADIUS"] || 50,
		"MAX_TRY"	: opt["MAX_TRY"] || 100
	};	
	
	this._space = null;	
	this.paper = Raphael(dom_id,this.config["WIDTH"],this.config["HEIGHT"]);	
	this.init();
};

CloudSpace.prototype.init = function(){
	var ymax = this.config["HEIGHT"];
	var xmax = this.config["WIDTH"];
	
	this._space = {};
	
	for(var i=0; i<ymax; i++)
	{
		this._space[i] = {};
		for(var j=0; j<xmax; j++) 
		{
			this._space[i][j] = true;
		}
	}
	this.paper.clear();
};

CloudSpace.prototype.verifyCircle = function(cx,cy,r){
	var ymax = Math.floor(cy+r), ymin = Math.ceil(cy-r);		
	var check = true;
		
	var space = {};	
	for(var y=ymin;y<ymax;y++)
	{
		space[y]={};
		var xhfwd = Math.sqrt(r*r-(y-cy)*(y-cy));
		var xmax = Math.floor(cx+xhfwd);
		var xmin = Math.ceil(cx-xhfwd);
		for(var x=xmin;x<xmax;x++)
		{
			if(this._space[y] && this._space[y][x]) 
			{
				space[y][x] = true;									
			}
			else
			{
				check = false;
				break;
			}
		}			
	}
	return check ? space : null;
};

CloudSpace.prototype.drawCircle = function(w,h,r,t){	

	var space;		
	space=this.verifyCircle(w,h,r);			
	
	if(space)
	{
		for(var row_idx in space)
		{
			var row = space[row_idx];
			for(var col_idx in row)
			{
				this._space[row_idx][col_idx] = false;
			}
		}		
		
		var fontSize = (2*r/t.length)*0.9;
		fontSize = fontSize > 0 ? fontSize : 5;
		
		var color = "#"+(Math.round(Math.random()*220)+16).toString(16)
					   +(Math.round(Math.random()*220)+16).toString(16)
					   +(Math.round(Math.random()*220)+16).toString(16);

		this.paper.circle(w,h,r).attr({"fill":color, "stroke":color, "title":t, "cursor":"pointer"});
		this.paper.text(w,h,t).attr({"fill":"#FFF", "font-size":fontSize, "font-weight":"bold", "title":t, "cursor":"pointer"});
		
		return true;
	}
	else
	{
		console.log("Cannot draw circle. It is already occupied.");
		return false;
	}
};


CloudSpace.prototype.drawCircleRandom = function(r,t){	

	var space,w,h;
	var try_cnt = 0;
	var c = this.config;
	
	while(!space)	{
		try_cnt++;
		
		var xsign = Math.random() > 0.5 ? -1 : 1;
		var ysign = Math.random() > 0.5 ? -1 : 1;
		
		var calibration = (c["MAX_TRY"]-try_cnt)/c["MAX_TRY"];
		
		w = c["WIDTH"]/2*(1+xsign*(c["MAX_RADIUS"]-r*calibration)/c["MAX_RADIUS"]*Math.random() );
		h = c["HEIGHT"]/2*(1+ysign*(c["MAX_RADIUS"]-r*calibration)/c["MAX_RADIUS"]*Math.random() );
		
		space=this.verifyCircle(w,h,r);		
					
		if(try_cnt > c["MAX_TRY"]-1) break;
	}
	
	if(space)
	{
		for(var row_idx in space)
		{
			var row = space[row_idx];
			for(var col_idx in row)
			{
				this._space[row_idx][col_idx] = false;
			}
		}		
		
		var fontSize = (2*r/t.length)*0.9;
		fontSize = fontSize > 0 ? fontSize : 5;
		
		var color = "#"+(Math.round(Math.random()*220)+16).toString(16)
					   +(Math.round(Math.random()*220)+16).toString(16)
					   +(Math.round(Math.random()*220)+16).toString(16);

		this.paper.circle(w,h,r).attr({"fill":color, "stroke":color, "title":t, "cursor":"pointer"});
		this.paper.text(w,h,t).attr({"fill":"#FFF", "font-size":fontSize, "font-weight":"bold", "title":t, "cursor":"pointer"});
		
		return true;
	}
	else
	{
		console.log("failed to draw circle.");
		
		return false;
	}
};

var getEffectiveSet = function(max_r, arr){
    if(arr.length < 0) return [];
    arr.sort(function(a,b){ return b-a;});
    var MAX_R = max_r;
    var MIN_R = 5;
    var r_variation = MAX_R - MIN_R;
    var eff_set = [];
    var max_value = arr[0];

    for(var i=0; i<arr.length; i++)
    {
        eff_set.push(Math.round(arr[i]/max_value*r_variation)+MIN_R);
    }

    return eff_set;
};


