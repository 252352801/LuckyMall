angular.module('LuckyCat.services')
.factory('HomeSer',function(API,$http){
	var data={
        banner:null,
        today:null,
        tomorrow:null
    };
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
                data.today=response;
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
                    data.banner=response;
                    callback(response,1);
                }else{
                    callback(response,0);
                }
                /*data.banner=[{
                    ImageData:'./res/test/banner/banner_01.jpg'
                },{
                    ImageData:'./res/test/banner/banner02.jpg'
                },{
                    ImageData:'./res/test/banner/banner03.jpg'
                },{
                    ImageData:'./res/test/banner/banner04.jpg'
                }];*/
            }).error(function(data,status,headers,config){

            });
        }
	};
})