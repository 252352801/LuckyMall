angular.module('LuckyMall.controllers')
    .controller('PayEarnestSuccessCtrl', function ($scope, CartSer,$stateParams, $state,$cookies, $timeout, MyOrdersSer,TokenSer,
                                           Host,$rootScope) {
             var order_id=$stateParams.order_id;
             var goods_id=$stateParams.goods_id;
             $rootScope.$broadcast('cart-update');
               $scope.playGame=function(){
                   var g_url=Host.game + '?orderid=' + order_id + '&from=' + Host.gameOverPage + '&authorization=' + TokenSer.getToken();
                   $rootScope.openGame(g_url,order_id,goods_id);
               }

    });
