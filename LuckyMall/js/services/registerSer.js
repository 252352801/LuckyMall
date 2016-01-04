angular.module('LuckyMall.services')

.factory('RegisterSer',function(API,$http,$timeout){
    var session_key=null;
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
       /* 手机号是否已使用*/
        isSignUp:function(mb_num,callback){
            $http.get(API.isMobileSignUp.url+mb_num)
                .success(function(response){
                    callback(response);
                })
        },
       /* 获取会话密钥*/
        getSessionKey:function(callback){
            $http.get(API.getSessionKey.url)
                .success(function(response){
                    session_key=response;
                    callback(response,1);
                })
                .error(function(){
                    callback('请求超时',-1);
                })
        },
        /* 获取图片验证码*/
        getCaptchaCode:function(callback){
            $http.get(API.getCaptchaCode.url+session_key)
                .success(function(response){
                    callback(response,1);
                })
                .error(function(){
                    callback('请求超时',-1);
                })
        }

    };
})

