(function(g){
	var UNI_KOR_FROM	= 0xAC00;
	var UNI_KOR_TO		= 0xD7A3;
	
	var F_SOUNDS = ["ㄱ", "ㄲ", "ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"]; //초성
	var M_SOUNDS = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"]; //중성
	var L_SOUNDS = ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"]; //종성

	var F_SIZE = F_SOUNDS.length;
	var M_SIZE = M_SOUNDS.length;
	var L_SIZE = L_SOUNDS.length;
	var ML_SIZE = M_SIZE*L_SIZE;
	
	var isValidKor = function(c){
		var u = 0x0000;
		if(c.charCodeAt)
		{
			u = c.charCodeAt(0) || u;
			return ( (UNI_KOR_FROM-1) < u ) && ( u < (UNI_KOR_TO+1) ) 
		}
		else
			return false;
	};
	
	var getFirstSoundIdx		= function(x){	return Math.floor(x/ML_SIZE); 	};
	var getMiddleSoundIdx	= function(x){	return Math.floor(x/L_SIZE); 	};
	var getLastSoundIdx		= function(x){	return x % L_SIZE; 	};
	
	var getAllSoundIdx = function(u){
		var idxs = [];
		idxs.push(getFirstSoundIdx(u));
		idxs.push(getMiddleSoundIdx(u-idxs[0]*ML_SIZE));
		idxs.push(getLastSoundIdx(u-idxs[1]*L_SIZE));
		
		return idxs;
	};
	
	var arrangeSound = function(c){
		var sound =null;
		var u = 0, idxs = null;
		if(isValidKor(c))
		{
			u = c.charCodeAt(0) - UNI_KOR_FROM;
			idxs = getAllSoundIdx(u);
			
			sound = "";
			sound += F_SOUNDS[idxs[0]];
			sound += M_SOUNDS[idxs[1]];
			sound += L_SOUNDS[idxs[2]];
		}
		else
			sound = c.charAt(0);
		
		return sound;
	};
	
	g.getSounds = function(s){
		if(typeof s == "string")
		{
			var sounds = "";
			for(var len=s.length,i=0;i<len;i++)
				sounds += arrangeSound(s.charAt(i));
			
			return sounds;
		}
		else
			return s;
	};
	
	g.getFirstSounds = function(s){
		if(typeof s == "string")
		{
			var sounds = "";
			for(var len=s.length,i=0;i<len;i++){
				var c = s.charAt(i);
				var u = c.charCodeAt(0);
				if(isValidKor(c)) sounds += F_SOUNDS[getFirstSoundIdx(u - UNI_KOR_FROM)];
				else if ( ( (0x3131-1) < u ) && ( u < (0x314E+1) ) )		sounds += c;
			}
			
			return sounds;
		}
		else
			return s;		
	};	
	
})(window);