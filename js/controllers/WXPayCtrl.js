angular.module('LuckyCat.controllers')
 .controller('WXPayCtrl',function($rootScope,$scope,$state,WXPaySer,$stateParams,$timeout,PaymentSer){
        $scope.trade_id=$stateParams.trade_id;
        $scope.time_over=false;
        $scope.data={
            totalCost:WXPaySer.getData().totalCost
        };
        getQRCodeData();
       /* 获取二维码数据*/
        function getQRCodeData(){
            WXPaySer.getQRCodeData($scope.trade_id,function(response,status){
                if(status==1){
                    console.log(response);
                    $scope.QRCodeUrl=app.interface.QRCodeUrl+response;
                    pollingTradeStatus();//轮询  看交易单是否已经支付
                }
            });
        }

        function pollingTradeStatus(){
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
