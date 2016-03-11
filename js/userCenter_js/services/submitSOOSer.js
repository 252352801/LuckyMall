angular.module('LuckyMall.services')

    .factory('SubmitSOOSer',function(API,$http){
        return {
            canShowOff:function(order_id,callback){
                $http.get(API.canShowOff.url+order_id).success(function(response,status){
                    if(status==200){
                        callback(response,1);
                    }else{
                        callback(response,0);
                    }
                }).error(function(response,status){
                    callback(response,-1);
                });
            },
            submit:function(params,callback){
                $http({
                    method: API.submitShowOffOrder.method,
                    url: API.submitShowOffOrder.url,
                    data:params
                }).success(function (response, status, headers, config) {
                    if (status==200&&response) {
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback(data, -1);
                });
            }
        };
    })