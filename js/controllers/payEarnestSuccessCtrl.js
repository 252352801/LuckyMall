angular.module('LuckyMall.controllers')
    .controller('PayEarnestSuccessCtrl', function ($scope, CartSer,$stateParams, $state,$cookies, $timeout, MyOrdersSer,TokenSer,RefreshUserDataSer,OrderDetailsSer,
                                           Host,$rootScope,SOTDSvc) {
             var order_id=$stateParams.order_id;
        $scope.data_order=undefined;
        $scope.isEnough=false;
        loadOrderInfo();
             $rootScope.$broadcast('cart-update');
               $scope.playGame=function(){
                   var auth = TokenSer.getToken();
                   $scope.gameMenu.gameUrl.fingerGuessing = Host.game.fingerGuessing + '?id=' + order_id + '&mode=1&from=' + Host.playFrom + '&authorization=' + auth;
                   $scope.gameMenu.gameUrl.fishing = Host.game.fishing + '?id=' + order_id + '&mode=1&from=' + Host.playFrom + '&authorization=' + auth;
                   if(!auth){
                       $state.go('login');
                   }else {
                       var tmp_data = {
                           "from": 'game',
                           "orders": []
                       };
                       tmp_data.orders=[order_id];
                       SOTDSvc.set(tmp_data);
                       if ($scope.data_order != undefined) {
                             if(parseInt($scope.data_order.OriginalPrice>200)){
                                 $rootScope.openGame($scope.gameMenu.gameUrl.fishing,$scope.gameMenu.orderId,$scope.gameMenu.commodityId);
                             }else{
                                 $scope.gameMenu.show = true;
                             }
                       } else {
                           loadOrderInfo(function () {
                               if(parseInt($scope.data_order.OriginalPrice>200)){
                                   $rootScope.openGame($scope.gameMenu.gameUrl.fishing,$scope.gameMenu.orderId,$scope.gameMenu.commodityId);
                               }else{
                                   $scope.gameMenu.show = true;
                               }
                           });
                       }
                   }
               }

        $scope.gameMenu={//游戏菜单
            show:false,
            orderId:$stateParams.order_id,
            commodityId:$stateParams.commodity_id,
            gameUrl:{
                fingerGuessing:'',
                fishing:''
            }
        };



        function loadOrderInfo(callback){
            OrderDetailsSer.requestData(order_id,function(resp,status){
                if(status==1){
                    $scope.data_order=OrderDetailsSer.getData();
                    if(typeof callback=='function') {
                        callback();
                    }else{

                    }
                    $scope.isEnough=true;
                    $scope.playGame();
                }else{
                    $state.go('404');
                }
            });
        }

    });
