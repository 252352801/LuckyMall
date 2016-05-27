angular.module('LuckyMall.controllers')
    .controller('WXPayCtrl',
    ['$rootScope', '$scope', '$state', 'WXPaySer', '$stateParams', '$timeout', 'PaymentSer', 'API', '$cookies', 'SOTDSvc',
        function ($rootScope, $scope, $state, WXPaySer, $stateParams, $timeout, PaymentSer, API, $cookies, SOTDSvc) {
            $scope.trade_id = $stateParams.trade_id;
            $scope.type = $stateParams.type;//支付类型   0支付定金  1支付尾款
            $scope.time_over = false;
            $scope.totalCost = WXPaySer.getData().totalCost;
            $scope.polling = false;
            getQRCodeData();
            $scope.$on('stop-polling-tradeStatus', function () {
                $scope.polling = false;
            });
            $scope.goBackRePay = function () {
                if ($scope.type == 1) {
                    var tmp = SOTDSvc.get();
                    tmp.from = 'repay';//设为重新支付
                    SOTDSvc.set(tmp);
                    //console.log(SOTDSvc.get());
                    $state.go('confirmOrder', {source: 'source=repay'});
                } else {
                    window.history.back(-1);
                }
            };
            /* 获取二维码数据*/
            function getQRCodeData() {
                WXPaySer.getQRCodeData($scope.trade_id, function (response, status) {
                    if (status == 1) {
                        //console.log(response);
                        $scope.QRCodeUrl = API.QRCodeUrl.url + response;
                        $scope.polling = true;
                        pollingTradeStatus();//轮询  看交易单是否已经支付
                    }
                });
            }

            function pollingTradeStatus() {
                if ($scope.polling != true) {
                    return;
                }
                $timeout(function () {
                    PaymentSer.getStatusOfTrade($scope.trade_id, function (response, status) {
                        if (status === 1) {
                            $rootScope.$broadcast('orders-update');
                            if ($scope.type == 1) {
                                localStorage.removeItem('unFinishTradeOfOrders');
                                ga('send', 'pageview', {
                                    'page': '/complete_checkout',
                                    'title': '完成购买'
                                });
                                {
                                    $rootScope.woopra.evet.CP.properties = $rootScope.woopraTempData.confirmOrders.properties;
                                    $rootScope.woopra.track($rootScope.woopra.evet.CP);
                                }
                                $state.go('paySuccess');
                            } else {
                                localStorage.removeItem('unFinishTradeOfEarnest');
                                $rootScope.woopra.evet.PE.properties=$rootScope.woopraTempData.payForEarnest.properties;
                                $rootScope.woopra.track($rootScope.woopra.evet.PE);
                                $state.go('payEarnestSuccess', {order_id: $rootScope.game.orderId, commodity_id: $rootScope.game.commodityId});
                            }
                        } else {

                            pollingTradeStatus();
                        }
                    });
                }, 2000);
            }
        }]);
