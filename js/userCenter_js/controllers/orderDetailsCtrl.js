angular.module('LuckyMall.controllers')
 .controller('OrderDetailsCtrl',function($scope,$state,$stateParams,OrderDetailsSer,AddressSer){
        $scope.order_id=$stateParams.order_id;
        $scope.file_count=1;
        $scope.showLoading=false;
        loadData();


        function loadData(){
            OrderDetailsSer.requestData($scope.order_id,function(response,status){
                if(status==1){
                    console.log(angular.toJson(response));
                    $scope.data_order=OrderDetailsSer.getData();
                    $scope.$emit('changeMenu',$scope.data_order.OrderStatus);
                }
            });
        }
});
