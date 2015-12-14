angular.module('LuckyMall.services')
.factory('HomeSer',function(API,$http){
	var data={
        banner:null,
        today:null,
        tomorrow:null
    };
      function initHref(obj){
          for(var o in obj){
              if(obj[o].PromotionType==1){
                  obj[o].href='/goodsDetails/'+obj[o].TypeId;
              }else if(obj[o].PromotionType==0){
                  obj[o].href='/newProduct';
              }
          }
          return obj;
      }
	return {
        getData:function(){
            return data;
        },
		getTodayData:function(){
			return data.today;
		},
        requestTodayData:function(callback){
            $http({
                method:API.todayData.method,
                url:API.todayData.url,
                data: {"PageIndex":0,"PageSize":1000}
            }).success(function(response,status,headers,config){
                data.today=initHref(response);
                    callback();
            }).error(function(data,status,headers,config){

            });
        },
        requestBannerData:function(callback){
            $http({
                method:API.bannerList.method,
                url:API.bannerList.url,
                data: {"PageIndex":0,"PageSize":1000}
            }).success(function(response,status,headers,config){
                if(response&&response!=null&&response!=''){
                    for(var o in response){
                        response[o].ImageData=response[o].ImageData.split('|')[0];
                    }
                    data.banner=response;
                    callback(response,1);
                }else{
                    callback(response,0);
                }
            }).error(function(data,status,headers,config){

            });
        }
	};
})