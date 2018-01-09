(function($){
	var isNumber =/(^[0-9]+[.]?[0-9]*$)|(^[0-9]+[.]?[0-9]*[eE][+-][0-9]+$)/;
 	
	var Comparator =  function(field, reverse){
		var f = field;
		var r = reverse || 1;
		
		var compare = function(a,b){		
			var result;
			var isSum = false;
			
			a = a[f];
			b = b[f];
			
			if(a.indexOf("합계") > -1)			{ a = 1; b=0; isSum = true; }
			else if(b.indexOf("합계") > -1)	{ a = 0; b=1; isSum = true; }
			
			if(isNumber.test(a) && isNumber.test(b))		result = Number(a) - Number(b);
			else														result = (a > b) - (b >a);
			
			return isSum ? -1*result : r * result;
		};		
		
		this.asc = function(){	 r = 1; return compare; };
		this.desc = function(){	 r = -1; return compare; };
	};	
	
	var SortData = function(fields, _data){
		var data = _data || [];
		var compMap = {};
		
		for(var i=0,len=fields.length; i<len; i++) {
			var f = fields[i];
			compMap[f] = new Comparator(f);
		}
		
		var getComparator = function(field){
			return compMap[field];
		};			
			
		this.setData = function(d){	data = d;	};
		this.getData = function(d){ return data;	};
		this.size = function(){ return data.length; };
		
		this.sort = function(field, reverse){
			var c = getComparator(field);
			data.sort(reverse ? c.desc() : c.asc() );
		};
	};
	
	var getRenderCallback = function($table, renderer){
		return function(e){
			var $this = jQuery(this);
			var $parent = $this.parent();
			var sortSet = $table.prop("_ubi_sortData");
			
			if(!sortSet) return;
			if(sortSet.size() < 1) return;
			
			$parent.find("i.fa-sort-desc").removeClass("fa-sort-desc");
			$parent.find("i.fa-sort-asc").removeClass("fa-sort-asc");

			if(this.sortOrder == "asc")
			{
				sortSet.sort($this.attr("data-id"), false);								
				$this.find("i").addClass("fa-sort-asc");
				this.sortOrder = "desc";
			}
			else
			{
				sortSet.sort($this.attr("data-id"), true);
				$this.find("i").addClass("fa-sort-desc");
				this.sortOrder = "asc";						
			}
			
			renderer($table, sortSet.getData());
		};
	};
	
	var TableSort = function(_$table){
		var $table = _$table;
		var renderer = function(){};
		this.add = function(_renderer){
			if(!$table.prop("_ubi_sortData"))
			{	
				var $ths = $table.find("thead th");
				if($ths.size() < 1) $ths = $table.find("tr:eq(0)>th");
				if($ths.size() < 1) return;
				
				fields = [];
				
				$ths.each(function(i, dom){
					
					var $dom = jQuery(dom);		
					var data_id = $dom.attr("data-id");
					if($dom.attr("no-sort") != "yes" && data_id)
					{
						if($dom.find("i").size() < 1){	var icon = document.createElement("i"); icon.className = "fa"; dom.appendChild(icon);  }
						
						dom.onclick = getRenderCallback($table, _renderer);					
						fields.push(data_id);
					}
				});
				renderer = _renderer;
				$table.prop("_ubi_sortData", new SortData(fields));
			}
			return this;
		};
		
		this.update = function(data){
			if($table.prop("_ubi_sortData"))	$table.prop("_ubi_sortData").setData(data);
			
			return this;
		};
		
		this.init = function(){
			var $ths = $table.find("thead th");
			if($ths.size() < 1) $ths = $table.find("tr:eq(0)>th");
			
			if($ths.size() > 0){			
				$ths.find("i.fa-sort-desc").removeClass("fa-sort-desc");
				$ths.find("i.fa-sort-asc").removeClass("fa-sort-asc");
				$ths.prop("sortOrder", "asc");
			}
			
			return this;
		};
		
		this.render = function(){
			var sortData = $table.prop("_ubi_sortData");
			if(sortData) renderer($table, sortData.getData());
		};
	};
	
	$.fn.TableSort = function(){
		if(!this.prop("_ubi_table_sort")){			
			this.prop("_ubi_table_sort", new TableSort(this));
		}
		return this.prop("_ubi_table_sort");
	}
	
})(jQuery);
