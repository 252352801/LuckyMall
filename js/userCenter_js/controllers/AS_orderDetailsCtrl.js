angular.module('LuckyMall.controllers')
 .controller('AS_OrderDetailsCtrl',function($scope,$state,$stateParams,AS_OrderDetailsSer,LogisticsSer,MyOrdersSer){
        $scope.order_id=$stateParams.order_id;
        $scope.showLoading=false;
        loadData();

        function loadData(){
            if(MyOrdersSer.getAfterOrders()==null){
                $scope.showLoading=false;
                MyOrdersSer.requestAfterOrders(function(response,status){
                    if(status==1){
                        $scope.$emit('changeMenu',5);
                       initData();
                    }
                });
            }else{
                initData();
                
            }
        }
    
       function initData(){
                    $scope.data_details= MyOrdersSer.getOrder(5,$scope.order_id);
                    $scope.data_logistics=JSON.parse($scope.data_details.Order.LogisticsInfo);
                    if($scope.data_details.Images!=''){
                            $scope.imgs=$scope.data_details.Images.split('|');
                    }else{
                            $scope.imgs=[];
                    }
       }
});
