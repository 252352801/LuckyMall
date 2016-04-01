angular.module('LuckyMall.services')
    .factory('FreeShoppingSer', function (API, $http) {
      return {
            requestData: function (params, callback) {
                $http({
                    method: API.freeShopping.method,
                    url: API.freeShopping.url,
                    data: params
                }).success(function (response,status) {
                    callback(response, status);
                }).error(function(response,status){
                    callback(response, status);
                })
            },
            getFreeShoppingPlayChance:function(callback){
                $http({
                    method: API.freeShoppingPlayChance.method,
                    url: API.freeShoppingPlayChance.url
                }).success(function (response,status) {
                    callback(response, status);
                }).error(function(response,status){
                    callback(response, status);
                })
            }

        };
    })

