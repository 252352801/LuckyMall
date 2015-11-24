angular.module('LuckyCat.services')
.factory('MarketSer',function($http){
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
                method:'get',
                url:app.interface.marketOnline
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
                method:'post',
                url:app.interface.marketView,
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