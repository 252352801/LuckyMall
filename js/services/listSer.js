angular.module('LuckyCat.services')

.factory('ListSer',function(API,$http,$timeout){
	var data=[];
    var handleImgSrc=function(){
        for(var o in data){
            data[o].RollingImages=data[o].RollingImages.split('|');
            data[o].DetailImages=data[o].DetailImages.split('|');
        }
    };
	return {
		getData:function(){
			return data;
		},
        setData:function(new_data){
            if(new_data!=null){
                    data=new_data;
                    handleImgSrc();
            }else{
                    data=[];
            }
        }
	};
})

