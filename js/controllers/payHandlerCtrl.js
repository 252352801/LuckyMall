angular.module('LuckyMall.controllers')
    .controller('PayHandlerCtrl',
    ['$scope', 'CartSer', 'LoginSer', '$state', '$cookies', '$timeout', 'MyOrdersSer', 'TokenSer', '$stateParams', 'PaymentSer',
        function ($scope, CartSer, LoginSer, $state, $cookies, $timeout, MyOrdersSer, TokenSer, $stateParams, PaymentSer) {
            $scope.payHandling = true;
            $scope.type = $stateParams.type;//交易类型
            $scope.trade_id = $stateParams.trade_id;//交易单号
            $scope.auth = $stateParams.auth;//auth
            $state.go('home');
            var polling_time = 0;
            authorization();//授权登陆
            /* 授权*/
            function authorization() {
                var auth = $scope.auth;
                LoginSer.authorization(function (response, status) {
                    if (status == 1) {
                        getStatusOfTrade();
                    } else {
                    }
                }, auth);
            }

            /*获取交易单状态*/
            function getStatusOfTrade() {
                pollingStatus();
            }

            //根据交易单号获取订单
            function getOrderByTradeId(callback) {
                PaymentSer.getOrderByTradeId($scope.trade_id, function (resp, status) {
                    if (status == 1) {
                        $scope.order_id = resp.Id;
                        $scope.commodity_id = resp.CommodityId;
                        callback();
                    }
                });
            }

            /*轮询请求*/
            function pollingStatus() {
                PaymentSer.getStatusOfTrade($scope.trade_id, function (resp, status) {
                    if (status == 1) {//已成功
                        switch ($scope.type) {
                            case 2://付定金
                                getOrderByTradeId(function () {
                                    $state.go('payEarnestSuccess', {order_id: $scope.order_id, commodity_id: $scope.commodity_id});
                                });
                                break;
                            case 1://付订单
                                $state.go('paySuccess');
                                break;
                        }
                    } else {//未成功  继续
                        polling_time++;
                        if (polling_time < 10) {
                            $timeout(function () {
                                pollingStatus();
                            }, 1000);
                        } else {//请求10次失败之后返回失败
                            switch ($scope.type) {
                                case 2://付定金
                                    $state.go('shoppingCart');
                                    break;
                                case 1://付订单
                                    $state.go('UCIndex.myOrders', {status: 'unPay'});
                                    break;
                            }
                        }
                    }
                    $scope.payHandling = false;
                });
            }
        }]);
