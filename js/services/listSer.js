angular.module('LuckyMall.services')
.factory('ListSer',function(API,$http,$timeout){
	var data=[];
    var initData=function(){
        for(var o in data){
            data[o].RollingImages=data[o].RollingImages.split('|');
            data[o].DetailImages=data[o].DetailImages.split('|');
            data[o].minPrice=Math.ceil(data[o].RetailPrice*data[o].MaxDiscount);
            data[o].maxPrice=Math.ceil(data[o].RetailPrice*data[o].MinDiscount);
        }
    };
	return {
		getData:function(){
			return data;
		},
        setData:function(new_data){
            if(new_data!=null){
                    data=new_data;
                    initData();
            }else{
                    data=[];
            }
        }
	};
})

