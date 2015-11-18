angular.module('LuckyCat.services')
.factory('HomeSer',function($http){
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
                method:'post',
                url:app.interface.todayData,
                data: {"PageIndex":0,"PageSize":1000}
            }).success(function(response,status,headers,config){
                data.today=response;
                    callback();
            }).error(function(data,status,headers,config){

            });
        },
        requestBannerData:function(callback){
            $http({
                method:'post',
                url:app.interface.bannerList,
                data: {"PageIndex":0,"PageSize":1000}
            }).success(function(response,status,headers,config){
               /* data.banner=[{
                    ImageData:'./res/test/banner/banner_01.jpg'
                },{
                    ImageData:'./res/test/banner/banner02.jpg'
                },{
                    ImageData:'./res/test/banner/banner03.jpg'
                },{
                    ImageData:'./res/test/banner/banner04.jpg'
                }];*/
               data.banner=response;
                callback();
            }).error(function(data,status,headers,config){

            });
        }
	};
})