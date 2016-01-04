/*
*	全国三级城市联动 js版
*/
function Dsy(){
	this.Items = {};
}
Dsy.prototype.add = function(id,iArray){
	this.Items[id] = iArray;
}
Dsy.prototype.Exists = function(id){
	if(typeof(this.Items[id]) == "undefined") return false;
	return true;
}

function change(v){
	var str="0";
	for(var i=0;i<v;i++){
		str+=("_"+(document.getElementById(s[i]).selectedIndex-1));
	};
	var ss=document.getElementById(s[v]);
	with(ss){
		length = 0;
		options[0]=new Option(opt0[v],opt0[v]);
		if(v && document.getElementById(s[v-1]).selectedIndex>0 || !v){
			if(dsy.Exists(str)){
				ar = dsy.Items[str];
				for(var i=0;i<ar.length;i++){
					options[length]=new Option(ar[i],ar[i]);
				}//end for
				if(v){ options[0].selected = true; }
			}
		}//end if v
		if(++v<s.length){change(v);}
	}//End with
}

var dsy = new Dsy();

//var s=["s_province","s_city","s_county"];//三个select的id
var s;
var opt0 = ["省份","地级市","市、县级市"];//初始值
function _init_area(id_array){  //初始化函数
    s=id_array;
	for(var i=0;i<s.length-1;i++){
	  //document.getElementById(s[i]).onchange=new Function("change("+(i+1)+")");
        document.getElementById(s[i]).addEventListener('change',new Function("change("+(i+1)+")"));
	}
	change(0);
}
/* 代码整理：懒人之家 www.lanrenzhijia.com */