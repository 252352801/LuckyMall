angular.module('LuckyMall.services')

.factory('EditPasswordSer',function(API,$http,TokenSer){
	return {
       updatePassword:function(params,callback){
            $http({
                method:API.updatePassword.method,
                url:API.updatePassword.url,
                data:params.passwords,
                headers: {
                    'Authorization': TokenSer.getAuth()
                }
            }).success(function(response,status,headers,config){
                if(response){
                    callback(response,1);
                }else{
                    callback(response,0);
                }
            }).error(function(data,status,headers,config){
                    callback(data,0);
            });
        }
	};
})

