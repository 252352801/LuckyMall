angular.module('LuckyMall.services')

    .factory('MySOOSer',function(API,$http){
        var initData=function(arr){
            for(var o in arr){
                arr[o].Avatar=angular.fromJson(arr[o].Avatar);
                arr[o].images=arr[o].Image.split("|");
                arr[o].bigImgIndex=-1;
                arr[o].bigImgUrl='';
            }
            return arr;
        };
        return {
            requestData:function(params,callback){
                $http({
                    method: API.mySOOList.method,
                    url: API.mySOOList.url,
                    data:params
                }).success(function (response, status, headers, config) {
                    if (status==200&&response) {
                        callback(initData(response),1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback(data, -1);
                });
            }
        };
    })