angular.module('LuckyCat.services')

.factory('RegisterSer',function($http,$timeout){
	return {
        register:function(params,callback){
            $http.post(app.interface.register,params)
                .success(function(response){
                     if(response){
                            callback(response,1);
                     }else{
                         callback(response,0);
                     }
                });
        }
    };
})

