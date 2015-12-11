angular.module('LuckyMall.controllers')
 .controller('LogisticsInfoCtrl',function($scope,$state,$stateParams,LogisticsSer){
    $scope.isShowLoading=false;
        $scope.order_id=$stateParams.order_id;
        $scope.order_type=$stateParams.order_type;
        loadData();
        function loadData(){
            LogisticsSer.requestData($scope.order_id,$scope.order_type,function(response,status){
                if(status==1){
                    $scope.data_logistics=LogisticsSer.getData();
                }
            });
        }
});
