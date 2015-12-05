angular.module('LuckyCat.controllers')
 .controller('AfterServiceCtrl',function($scope,$state,$stateParams,MyOrdersSer,$timeout){
        $scope.order_id=$stateParams.order_id;
        $scope.order_status=$stateParams.order_status;
        $scope.service_type=2;
        $scope.apply_amount=1;
        $scope.showLoading=false;
        loadData();

        $scope.add=function(){
           if($scope.apply_amount<$scope.data_order.Count) {
                $scope.apply_amount++;
            }
        };
        $scope.reduce=function(){
            if($scope.apply_amount>1) {
                $scope.apply_amount--;
            }
        };
        /*售后类型切换*/
        $scope.changeType=function(new_type){
            $scope.service_type=new_type;
        };
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
                        $scope.data_order=MyOrdersSer.getOrder($scope.order_status,$scope.order_status);
                        $scope.showLoading=false;
                    }
                });
            }else{
                $scope.data_order=MyOrdersSer.getOrder($scope.order_status,$scope.order_id);
            }
        }


});
