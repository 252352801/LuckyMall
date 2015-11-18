angular.module('LuckyCat.controllers')
 .controller('CartCtrl',function($scope,CartSer,LoginSer,$state,$timeout,TokenSer,RefreshUserDataSer){
        $scope.isModal1show=false;
        $scope.isModal2show=false;
        $scope.energy={
          isEnough:true,
          tips:''
        };
    if(!LoginSer.isLogin()){
        $state.go('login');
        return;
    }
    loadCartData();//加载购物车数据
        //"http://120.25.60.19:9004?orderid=307103168&from=120.24.175.151:9001/cart&authorization=b373119f-9670-4447-a5d2-781461191f17"

    $scope.$on('cart-update',function(){
        loadCartData();
    });
    $scope.gameHost=app.gameHost;
    $scope.callbackURL=app.gameOverPage;
    $scope.authorization=TokenSer.getToken();
    $scope.removeOrder=function(order_id){
        swal({
            title: "确定要删除吗?",
            text: "删除后商品将从购物车移除!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            cancelButtonText:'取消',
            confirmButtonText: "确定",
            closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
            function(){
                CartSer.cancelOrder(order_id,function(response,status){
                    if(status==1){
                        swal({
                            title: "删除成功!",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        loadCartData();
                        $scope.$emit('cart-update');
                    }else if(status==0){
                        swal({
                            title: "您不能删除此订单!",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                });
            });
    };
        /*跳转订单确认页*/
        $scope.goConfirm = function () {
            $state.go('confirmOrder');
        };
        $scope.showModal1 = function (order_id,total_cost) {
            if(testEnergy($scope.data_user.LuckyEnergy.PaidValue,total_cost)){//如果能量值足够
                $scope.energy.tips='您的能量值充足，祝您好运！';
                $scope.energy.isEnough=true;
            }else{
                $scope.energy.tips='您的能量值余量较少，可能无法支持您完成本次游戏赢取折扣卡，建议您先去付定金获取更多的能量后再进入游戏赢取折扣卡！';
                $scope.energy.isEnough=false;
            }
            $scope.gameUrl=app.gameHost+'?orderid='+order_id+'&from='+app.gameOverPage+'&authorization='+TokenSer.getToken();
            $scope.isModal1show = true;
        };
        $scope.showModal2 = function () {
            $scope.isModal1show = false;
            $scope.isModal2show = true;
        };
        $scope.closeModal1=function(){
            $scope.isModal1show=false;
            $scope.agree=false;
            $scope.energy.tips='';
        };
        $scope.closeModal2=function(){
            $scope.agree=false;
            $scope.isModal2show=false;
        };
        $scope.returnModal1=function(){
            $scope.isModal1show = true;
            $scope.isModal2show = false;
        };

    $scope.payForEnergy=function(){
        if($scope.agree){
            swal("支付定金...");
        }else{
        }
    };
     /*
     *检查能量是否够三发炮弹* */
    function testEnergy(paid_value,total_cost){
        if((paid_value/total_cost)>0.03){
            return true;
        }else{
            return false;
        }
    }
    function loadCartData(){
        CartSer.requestCartData(function (response, status) {
            if (status == 1) {
                $timeout(function () {
                    $scope.data_cart = CartSer.getData();
                }, 5);
            } else { //购物车数据为空
                $timeout(function () {
                    $scope.data_cart = new Array();
                }, 5);
            }
        });

        RefreshUserDataSer.requestUserData(function(response,status){
            if(status==1){
                $scope.data_user=RefreshUserDataSer.getData();
            }
        });
       /* if(CartSer.getData()==null) {
            CartSer.requestCartData(function (response, status) {
                if (status == 1) {
                    $timeout(function () {
                        $scope.data_cart = CartSer.getData();
                    }, 5);
                } else { //购物车数据为空
                    $timeout(function () {
                        $scope.data_cart = new Array();
                    }, 5);
                }
            });
        }else{
            $scope.data_cart = new Array();
            $timeout(function () {
                $scope.data_cart = new Array();
            }, 5);
        }*/
    }
});
