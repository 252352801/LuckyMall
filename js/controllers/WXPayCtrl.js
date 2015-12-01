angular.module('LuckyCat.controllers')
 .controller('WXPayCtrl',function($rootScope,$scope,$state,WXPaySer,$stateParams,$timeout,PaymentSer,API){
        $scope.trade_id=$stateParams.trade_id;
        $scope.time_over=false;
        $scope.totalCost=WXPaySer.getData().totalCost;
        $scope.polling=false;
        getQRCodeData();
        $scope.$on('stop-polling-tradeStatus',function(){
            $scope.polling=false;
        });
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
                        $state.go('paySuccess');
                    }else{
                        pollingTradeStatus();
                    }
                });
            },1000);
        }
});
