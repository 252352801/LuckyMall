angular.module('LuckyMall.services')
.factory('MarketSer',function(API,$http){
	var data={
        marketOnline:null,
        pageData:null
    };
	return {
        getData:function(){
            return data;
        },
        requestMarketList:function(callback){
            $http({
                method:API.marketOnline.method,
                url:API.marketOnline.url
            }).success(function(response){
                if(response){
                    data.marketOnline=response;
                    callback(response,1);
                }
            }).error(function(data,status,headers,config){

            });
        },
        requestMarketPage:function(param,callback){
            $http({
                method:API.marketView.method,
                url:API.marketView.url,
                data:param
            }).success(function(response){
                if(response){
                    data.pageData=response;
                    callback(response,1);
                }
            }).error(function(data,status,headers,config){

            });
        }
	};
})