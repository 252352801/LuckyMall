angular.module('LuckyMall.controllers')
 .controller('AS_OrderDetailsCtrl',function($scope,$state,$stateParams,AS_OrderDetailsSer,LogisticsSer,MyOrdersSer){
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
                     $scope.data_consignee=angular.fromJson($scope.data_details.Order.ConsigneeInfo);
                    $scope.data_logistics=angular.fromJson($scope.data_details.Order.LogisticsInfo);
                    if($scope.data_details.Images!=''){
                            $scope.imgs=$scope.data_details.Images.split('|');
                    }else{
                            $scope.imgs=[];
                    }
       }

        /*加载快递数据*/
        function getKuaiDi100List(){
            LogisticsSer.getKuidiList(function(response,status){
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
