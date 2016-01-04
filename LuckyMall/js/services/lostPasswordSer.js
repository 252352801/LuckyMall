angular.module('LuckyMall.services')
    .factory('LostPasswordSer', function (API, $http, $timeout) {
        return {
            resetPassword: function (params, callback) {
                $http({
                    method: API.resetPassword.method,
                    url: API.resetPassword.url,
                    data: params
                }).success(function (response) {
                    if (response) {
                        callback(response, 1);
                    }else{
                        callback(response, 0);
                    }
                }).error(function(resp,status){
                    callback(status, -1);
                });
            }

        };
    })

