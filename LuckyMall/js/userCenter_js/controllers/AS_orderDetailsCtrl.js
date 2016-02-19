angular.module('LuckyMall.controllers')
 .controller('AS_OrderDetailsCtrl',function($scope,$state,$stateParams,AS_OrderDetailsSer,LogisticsSer,MyOrdersSer,ASOrderDetailsSer){
        $scope.order_id=$stateParams.order_id;
        $scope.showLoading=false;
        $scope.kd='auto';//快递选择
        $scope.btn_val='提交';
        loadData();
        getKuaiDi100List();
        $scope.submit_kd=function(){
            if($scope.kd=='auto'){
                swal({
                    title: "请选择快递！",
                    type: "error",
                    confirmButtonText: "确定"
                });
            }else{
                alert($scope.kd);
            }
        };
        function loadData(){
            ASOrderDetailsSer.requestData($scope.order_id,function(response,status){
                if(status==1){
                    $scope.data_details=ASOrderDetailsSer.getData();
                    console.log( $scope.data_details);
                    $scope.data_consignee=$scope.data_details.Order.ConsigneeInfo;
                    $scope.data_logistics=angular.fromJson($scope.data_details.LogisticsInfo);
                    $scope.$emit('changeMenu',$scope.data_details.Order.OrderStatus);
                }
            });
        }

        /*加载快递数据*/
        function getKuaiDi100List(){
            LogisticsSer.getKDiList(function(response,status){
                if(status==1){
                    $scope.data_kd_list=response;
                }
            });
        }
        $scope.MathCeilPrice=function(val){
           return  Math.ceil(val);
        };
    
        $scope.MathCeilPrice=function(val){
            return Math.ceil(val);
        };
});
