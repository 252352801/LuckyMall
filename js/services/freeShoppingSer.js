angular.module('LuckyMall.services')
    .factory('FreeShoppingSer', function (API, $http) {
      return {
            requestData: function (params, callback) {
                $http({
                    method: API.onlineWelfare.method,
                    url: API.onlineWelfare.url,
                    data: params
                }).success(function (response,status) {
                    callback(response, status);
                }).error(function(response,status){
                    callback(response, status);
                })
            },
            getWelfarePlayChance:function(callback){
                $http({
                    method: API.welfarePlayChance.method,
                    url: API.welfarePlayChance.url
                }).success(function (response,status) {
                    callback(response, status);
                }).error(function(response,status){
                    callback(response, status);
                })
            },
          createOrder:function(id,callback){
              $http({
                  method: API.createWelfareOrder.method,
                  url: API.createWelfareOrder.url+id
              }).success(function (response,status) {
                  callback(response, status);
              }).error(function(response,status){
                  callback(response, status);
              })
          },
          testCompleteOrder:function(callback){
              $http({
                  method: API.testCompleteOrder.method,
                  url: API.testCompleteOrder.url
              }).success(function (response,status) {
                  callback(response, status);
              }).error(function(response,status){
                  callback(response, status);
              })
          }

        };
    })

