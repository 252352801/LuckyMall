angular.module('LuckyMall.controllers')
    .controller('CartCtrl', function ($scope, CartSer, LoginSer, $state, $timeout, TokenSer, RefreshUserDataSer,Host,$rootScope) {
        $scope.data_eo={};//要付定金的订单数据
        $scope.isModal1show = false;
        $scope.isModal2show = false;
        loadCartData();//加载购物车数据
        //"http://120.25.60.19:9004?orderid=307103168&from=120.24.175.151:9001/cart&authorization=b373119f-9670-4447-a5d2-781461191f17"

        $scope.$on('cart-update', function () {
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
                        }
                    });
                });
        };
        /*跳转订单确认页*/
        $scope.goConfirm = function () {
            $state.go('confirmOrder', {source: 'source=shoppingCart'});
        };
        $scope.freePlay=function(order_id,comm_id){
            ga('send', 'pageview', {
                'page': '/enter_freegame',
                'title': '进入免费游戏'
            });
            var g_url=Host.game+ '?orderid=' + order_id + '&from=' + Host.gameOverPage + '&authorization=' + TokenSer.getToken();
            $rootScope.openGame(g_url,order_id,comm_id);
        };







      /*  $scope.play=function(){
            ga('send', 'pageview', {
                'page': '/enter_paygame',
                'title': '进入付定金游戏'
            });
            $rootScope.openGame($scope.gameUrl,$scope.game_orderId,$scope.game_commodityId);
        }
        $scope.showModal1 = function (order, total_cost) {
            $scope.data_eo=order;
            if (testEnergy(total_cost,order.EarnestPercent,order.EarnestMoney,$scope.data_user.LuckyEnergy.PaidValue)) {//判断能量是否能进入游戏; 参数依次为  总价 定金比例 已付定金 用户剩余能量
                $scope.energy.isEnough = true;
            }else {
                $scope.energy.isEnough = false;
            }
            $scope.gameUrl = Host.game + '?orderid=' + order.Id + '&from=' + Host.gameOverPage + '&authorization=' + TokenSer.getToken(); //设置游戏地址
            $scope.game_orderId=order.Id;
            $scope.game_commodityId=order.CommodityId;
            $scope.isModal1show = true;
        };
        $scope.closeModal1 = function () {
            $scope.isModal1show = false;
            $scope.agree = false;
            $scope.energy.tips = '';
        };
        $scope.showModal2 = function () {
            $scope.isModal1show = false;
            $scope.isModal2show = true;
        };
        $scope.closeModal2 = function () {
            $scope.agree = false;
            $scope.isModal2show = false;
        };
        $scope.returnModal1 = function () {
            $scope.isModal1show = true;
            $scope.isModal2show = false;
        };

        $scope.payForEarnest = function () {
            if ($scope.agree) {
                $state.go('payForEarnest',{params:'order_id='+$scope.data_eo.Id});
            } else {
            }
        };
        *//*
         *检查能量是否够4发炮弹* *//*
        function testEnergy(total_cost,percent,paid_value,remain_energy) {
            var per_cost=total_cost*percent/10; // 每发消耗￥=每发消耗能量=原价*定金百分比/10
            var remain_amount=remain_energy/per_cost;//剩余能量支持的弹药数量
            if(remain_amount>=10){
                $scope.energy.tips = '喵喵体力充足，快去赢取更多折扣吧！';
                return true;
            }else{
                if(paid_value>0){
                    if(remain_amount>=1){
                        $scope.energy.tips = '进入游戏赢取更多折扣吧！';
                        return true;
                    }else{
                        $scope.energy.tips = '喵喵体力不支，可先去付定金获得赠送体力！';
                        return false;
                    }
                }else{
                    if(remain_amount<4){
                        $scope.energy.tips = '喵喵体力不足，可先去付定金获得赠送体力！';
                        return false;
                    }else if(remain_amount>=4){
                        $scope.energy.tips = '喵喵体力不多，建议先去支付定金获赠体力！';
                        return true;
                    }
                }
            }
        }*/

        function loadCartData() {
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

          /*  RefreshUserDataSer.requestUserData(function (response, status) {
                if (status == 1) {
                    $scope.data_user = RefreshUserDataSer.getData();
                }
            });*/

        }
    });
