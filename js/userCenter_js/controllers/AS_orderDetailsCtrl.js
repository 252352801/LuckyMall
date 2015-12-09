angular.module('LuckyMall.controllers')
 .controller('AS_OrderDetailsCtrl',function($scope,$state,$stateParams,AS_OrderDetailsSer,LogisticsSer){
        $scope.order_id=$stateParams.order_id;
        $scope.showLoading=false;
        loadData();

        function loadData(){
            AS_OrderDetailsSer.requestData($scope.order_id,function(response,status){
                if(status==1){
                    $scope.data_details=AS_OrderDetailsSer.getData();
                    $scope.data_logistics=$scope.data_details.Order.LogisticsInfo;
                   // $scope.data_logistics_trace=$scope.data_logistics;
                    $scope.$emit('changeMenu',$scope.data_details.Order.OrderStatus);
                }
            });
        }
});
