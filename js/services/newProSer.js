/*angular.module('LuckyCat.services',[])*/
app.factory('newProSer',function($http){
	var data=null
	return {
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
        }
	};
})