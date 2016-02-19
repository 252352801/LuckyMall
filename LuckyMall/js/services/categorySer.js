/*angular.module('LuckyMall.services')

.factory('CategorySer',function($http){
	var data=null;
	return {
		getData:function(){
			return data;
		},
        requestData:function(callback){
            $http({
                method:'get',
                url:app.API.getAllCategory
            }).success(function(response,status,headers,config){
                data=response;
                if(typeof callback=='function'){
                    callback();
                }
            }).error(function(data,status,headers,config){

            });
        }
	};
})*/

