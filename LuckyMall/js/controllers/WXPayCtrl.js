angular.module('LuckyMall.controllers')
 .controller('WXPayCtrl',function($rootScope,$scope,$state,WXPaySer,$stateParams,$timeout,PaymentSer,API,$cookies){
        $scope.trade_id=$stateParams.trade_id;
        $scope.type=$stateParams.type;
        $scope.time_over=false;
        $scope.totalCost=Math.ceil(WXPaySer.getData().totalCost);
        $scope.polling=false;
        getQRCodeData();
        $scope.$on('stop-polling-tradeStatus',function(){
            $scope.polling=false;
        });
    
        $scope.goBack=function(){
            PaymentSer.setIsBacktoPay(true);
            window.history.back(-1);
        };
        $scope.repay=function(order){
            var repay_order=new Array();
            repay_order.push(order);
            PaymentSer.setOrdersData(repay_order);
            $state.go('confirmOrder',{source:'source=repay'});
        };
       /* 获取二维码数据*/
        function getQRCodeData(){
            WXPaySer.getQRCodeData($scope.trade_id,function(response,status){
                if(status==1){
                    console.log(response);
                    $scope.QRCodeUrl=API.QRCodeUrl.url+response;
                    $scope.polling=true;
                    pollingTradeStatus();//轮询  看交易单是否已经支付
                }
            });
        }

        function pollingTradeStatus(){
            if($scope.polling!=true){
                return;
            }
            $timeout(function(){
                PaymentSer.getStatusOfTrade($scope.trade_id,function(response,status){
                    if(status===1){
                        $rootScope.$broadcast('orders-update');
                        ga('send', 'pageview', {
                            'page': '/complete_checkout',
                            'title': '完成购买'
                        });
                        $rootScope.initFreeChance();//支付成功刷新机会
                        if($scope.type==1) {
                            $state.go('paySuccess');
                        }else{
                            $state.go('payEarnestSuccess',{order_id:$rootScope.game.orderId,commodity_id:$rootScope.game.commodityId});
                        }
                    }else{
                        pollingTradeStatus();
                    }
                });
            },1000);
        }
});
