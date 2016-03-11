angular.module('LuckyMall.controllers')
    .controller('CartCtrl', ['$scope', 'CartSer', 'LoginSer', '$state', '$timeout', 'TokenSer', 'RefreshUserDataSer','Host','SOTDSvc','$rootScope',
        function ($scope, CartSer, LoginSer, $state, $timeout, TokenSer, RefreshUserDataSer,Host,SOTDSvc,$rootScope) {
        $scope.data_eo={};//要付定金的订单数据
        $scope.isModal1show = false;
        $scope.isModal2show = false;
        $scope.isModalGetDiscountShow=false;//获取折扣modal
        $scope.data_modal_getDisc={};////获取折扣modal 订单数据
        loadCartData();//加载购物车数据
        //"http://120.25.60.19:9004?orderid=307103168&from=120.24.175.151:9001/cart&authorization=b373119f-9670-4447-a5d2-781461191f17"

        $scope.$on('cart-update', function () {
            RefreshUserData();
            loadCartData();
        });
        $scope.$on('cart-time-over', function () {
            loadCartData();
        });
        $scope.gameHost = app.gameHost;
        $scope.callbackURL = app.gameOverPage;
        $scope.authorization = TokenSer.getToken();
        $scope.removeOrder = function (order_id) {
            swal({
                    title: "确定要删除吗?",
                    text: "删除后商品将从购物车移除!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: '取消',
                    confirmButtonText: "确定",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                },
                function () {
                    CartSer.cancelOrder(order_id, function (response, status) {
                        if (status == 1) {
                            swal({
                                title: "删除成功!",
                                type: "success",
                                confirmButtonText: "确定"
                            });
                            loadCartData();
                            $scope.$emit('cart-update');
                        } else if (status == 0) {
                            swal({
                                title: "您不能删除此订单!",
                                type: "error",
                                confirmButtonText: "确定"
                            });
                        }else if(status==401){
                            swal({
                                title: "您的登陆状态已过期，请重新登陆!",
                                type: "error",
                                confirmButtonText: "确定"
                            });
                            $scope.$emit('exit');
                        }
                    });
                });
        };
        /*跳转订单确认页*/
        $scope.goConfirmPage = function () {
            if(CartSer.getConfirmData().length>0) {
                var arr=CartSer.getConfirmData();
                var tmp_data={
                    "from":'shoppingCart',
                    "orders":[]
                };
                for(var o in arr){
                        tmp_data.orders.push(arr[o].Id);
                }
                SOTDSvc.set(tmp_data);
                $state.go('confirmOrder');
            }else{
                swal({
                    title: "您未选择订单!",
                    text:'请先勾选需要支付的订单',
                    type: "error",
                    confirmButtonText: "确定"
                });
            }
        };
        $scope.freePlayGame=function(order_id,comm_id){
            ga('send', 'pageview', {
                'page': '/enter_freegame',
                'title': '进入免费游戏'
            });
            var g_url=Host.game+ '?orderid=' + order_id + '&from=' + Host.playFrom + '&authorization=' + TokenSer.getToken();

            $scope.openModalBFFP(g_url,order_id,comm_id);
        };
        /*是否全部勾选*/
        $scope.isCheckedAll=function(){
             for(var o in $scope.data_cart){
                 if(!$scope.data_cart.isSelected){
                     return false;
                 }
             }
            return true;
        };
       $scope.toggleCheckedAll=function(){
                CartSer.toggleCheckedAll();
       };
        $scope.testChecked=function(){
            CartSer.testChecked();
        };


        $scope.showModalGetDisc=function(order){
            $scope.isModalGetDiscountShow=true;
            $scope.data_modal_getDisc=order;
        };
        function loadCartData() {
            $scope.loaded=false;
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
                $scope.loaded=true;
            });

          /*  RefreshUserDataSer.requestUserData(function (response, status) {
                if (status == 1) {
                    $scope.data_user = RefreshUserDataSer.getData();
                }
            });*/

        }
        function RefreshUserData() {
            RefreshUserDataSer.requestUserData(function (response, status) {
                if (status == 1) {
                    $scope.data_user = RefreshUserDataSer.getData();
                }
            });
        }
    }]);
