angular.module('LuckyMall.controllers')
    .controller('PayEarnestSuccessCtrl', function ($scope, CartSer,$stateParams, $state,$cookies, $timeout, MyOrdersSer,TokenSer,RefreshUserDataSer,OrderDetailsSer,
                                           Host,$rootScope) {
             var order_id=$stateParams.order_id;
             var goods_id=$stateParams.commodity_id;
        loadUserData();
             $rootScope.$broadcast('cart-update');
               $scope.playGame=function(){
                   var g_url=Host.game + '?id=' + order_id + '&mode=1&from=' + Host.playFrom + '&authorization=' + TokenSer.getToken();
                   $rootScope.openGame(g_url,order_id,goods_id);
               }



        function loadUserData() {
            RefreshUserDataSer.requestUserData(function (response, status) {
                if (status == 1) {
                    $scope.data_user = RefreshUserDataSer.getData();
                    loadOrderInfo(function(){
                        var org_cost= Math.ceil($scope.data_order.UnitPrice*$scope.data_order.Count);
                        $scope.isEnough=testEnergy(org_cost, $scope.data_order.EarnestPercent, $scope.data_order.EarnestMoney, $scope.data_user.LuckyEnergy.PaidValue);
                    });
                }
            });
        }


        function loadOrderInfo(callback){
            OrderDetailsSer.requestData(order_id,function(resp,status){
                if(status==1){
                    $scope.data_order=OrderDetailsSer.getData();
                    callback();
                }
            });
        }

        /**检查能量是否够进入游戏*/
        function testEnergy(total_cost,percent,paid_value,remain_energy) {
            var per_cost=total_cost*percent/10; // 每发消耗￥=每发消耗能量=原价*定金百分比/10
            var remain_amount=remain_energy/per_cost;//剩余能量支持的弹药数量
            if(remain_amount>=10){
                return true;
            }else{
                if(paid_value>0){
                    if(remain_amount>=1){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    if(remain_amount<4){
                        return false;
                    }else if(remain_amount>=4){
                        return true;
                    }
                }
            }
        }

    });
