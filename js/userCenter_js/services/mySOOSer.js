angular.module('LuckyMall.services')

    .factory('MySOOSer',function(API,$http){
        return {
            requestData:function(params,callback){
                $http({
                    method: API.mySOOList.method,
                    url: API.mySOOList.url,
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