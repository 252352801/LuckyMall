angular.module('LuckyMall.controllers')
 .controller('OrderDetailsCtrl',function($scope,$state,$stateParams,MyOrdersSer,LogisticsSer,PaymentSer){
        $scope.order_id=$stateParams.order_id;
        $scope.order_status=$stateParams.order_status;
        $scope.showLoading=false;
        loadData();
        initPayInfo();
        getTradeInfo();
        function loadData(){
            var flag=-1;//订单是否为空的标志
            switch(parseInt($scope.order_status)) {
                case 1:
                    $scope.$emit('changeMenu',1);
                    flag=(MyOrdersSer.getUnPayOrders()==null)?true:false;
                    break;
                case 2:
                    $scope.$emit('changeMenu',2);
                    flag=(MyOrdersSer.getPaidOrders()==null)?true:false;
                    break;
                case 4:
                    flag=(MyOrdersSer.getFinishOrders()==null)?true:false;
                    break;
            }
            if(flag){
                $scope.showLoading=true;
                MyOrdersSer.requestData($scope.order_status,function(resp,status){
                    if(status==1){
                        $scope.data_order=MyOrdersSer.getOrder($scope.order_status,$scope.order_id);
                        $scope.showLoading=false;
                    }
                });
            }else{
                $scope.data_order=MyOrdersSer.getOrder($scope.order_status,$scope.order_id);
            }
        }

        function translateStr(){
            for(var o in $scope.data_order.ConsigneeInfo){
                $scope.data_order.ConsigneeInfo[o]=unescape($scope.data_order.ConsigneeInfo[o].replace(/\\u/g,"%u"));
            }

        }

        /*初始化支付信息*/
        function initPayInfo(){
            if($scope.order_status!=(0||1)){
                
            }
        }

        function getTradeInfo(){
            PaymentSer.getTradeInfoByOrderId($scope.order_id,function(response,status){
                if(status==1){
                    $scope.data_tradeinfo=response;
                }
            });
        }
});
