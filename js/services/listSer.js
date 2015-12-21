angular.module('LuckyMall.services')
.factory('ListSer',function(API,$http,$timeout){
	var data=[];
    var brands=null;
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
        getBrands:function(){
            return brands;
        },
        setData:function(new_data){
            if(new_data!=null){
                    data=new_data;
                    initData();
            }else{
                    data=[];
            }
        },
        sortByPriceUp:function(){ //从小到大
            if(data){
                data.sort(function(a,b){return a.maxPrice- b.maxPrice;});
                console.log(data);
            }
        },
        sortByPriceDown:function(){ //从大到小
            if(data){
               data.sort(function(a,b){return b.maxPrice- a.maxPrice;});
                console.log(data);
            }
        },
        requestBrandsData:function(cate_id,callback){
            $http({
                method:API.getBrandsByCategoryId.method,
                url:API.getBrandsByCategoryId.url+cate_id
            }).success(function(response){
                if(response){
                    brands=response;
                    callback(response,1);
                }else{
                    callback('无法获取品牌数据/品牌数据为空',0);
                }
            }).error(function(){
                callback('网络错误',-1);
            });
        }

	};
})

