angular.module('LuckyMall.services')

.factory('RegisterSer',function(API,$http,$timeout){
	return {
        register:function(params,callback){
            $http.post(API.register.url,params)
                .success(function(response){
                     if(response){
                            callback(response,1);
                     }else{
                         callback(response,0);
                     }
                });
        },
        isSignUp:function(mb_num,callback){
            $http.get(API.isMobileSignUp.url+mb_num)
                .success(function(response){
                    callback(response);
                })
        }
    };
})

