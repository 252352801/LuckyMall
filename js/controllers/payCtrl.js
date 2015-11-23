angular.module('LuckyCat.controllers')
 .controller('PayCtrl',function($scope,PaySer,$stateParams,CartSer,$state,$timeout,TokenSer){
        $scope.trade_id=$stateParams.trade_id;
        $scope.time_over=false;
        $scope.data={
            totalCost:PaySer.getData().totalCost
        };
        getQRCodeData();
       /* 获取二维码数据*/
        function getQRCodeData(){
            PaySer.getQRCodeData($scope.trade_id,function(response,status){
                if(status==1){
                    console.log(response);
                    $scope.QRCodeUrl=app.interface.QRCodeUrl+response;
                    return response;
                }
            });
        }
});
