angular.module('LuckyCat.services')

.factory('EditPasswordSer',function($http,TokenSer){
	return {
       updatePassword:function(params,callback){
            $http({
                method:'post',
                url:app.interface.updatePassword+params.userId,
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

