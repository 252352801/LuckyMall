angular.module('LuckyMall.controllers')
    .controller('PayForEarnestCtrl',
    ['$rootScope', '$scope', '$state', '$stateParams', 'CartSer', 'LoginSer', 'UserSer', 'UserSer', '$timeout',
        'WXPaySer', 'PaymentSer', 'API', 'OrderDetailsSer', 'Host', 'TokenSer', 'RefreshUserDataSer',
        function ($rootScope, $scope, $state, $stateParams, CartSer, LoginSer, UserSer, UserSer, $timeout, WXPaySer, PaymentSer, API, OrderDetailsSer, Host, TokenSer, RefreshUserDataSer) {

            $scope.isModalWaitingShow = false;
            $scope.isUseBalance = false;//是否使用余额
            $scope.pay_type = 'zhifubao';//支付方式
            $scope.isProtocolShow = false;
            loadPageData(loadWallet);//加载本页必须的数据
            /*支付方式切换*/
            $scope.changePayType = function (new_type) {
                $scope.pay_type = new_type;
            };


            $scope.agreeProtocol = function () {
                $scope.isProtocolShow = false;
                UserSer.agreeEarnestProtocol(function (response, status) {
                    if (status == 1) {
                        $scope.$emit('user-update');//更新用户数据
                    }
                });
            };

            /* 支付方式显示*/
            $scope.showPayType = function () {
                var result = '';
                /* if($scope.isUseBalance){
                 if($scope.needToPay()<=0){
                 result+='喵喵钱包余额';
                 return result;
                 }else{
                 result+='喵喵钱包余额+';
                 }
                 };*/
                switch ($scope.pay_type) {
                    case 'zhifubao':
                        result += '支付宝';
                        break;
                    case 'weixin':
                        result += '微信支付';
                        break;
                    case 'bank_icbc':
                        result += '(支付宝)工商银行网银支付';
                        break;
                    case 'bank_jianshe':
                        result += '(支付宝)建设银行网银支付';
                        break;
                    case 'bank_nongye':
                        result += '(支付宝)农业银行网银支付';
                        break;
                    case 'bank_zhaoshang':
                        result += '(支付宝)招商银行网银支付';
                        break;
                    case 'bank_zhongguo':
                        result += '(支付宝)中国银行网银支付';
                        break;
                    case 'bank_xingye':
                        result += '(支付宝)兴业银行网银支付';
                        break;
                    case 'bank_pingan':
                        result += '(支付宝)平安银行网银支付';
                        break;
                    case 'bank_youzheng':
                        result += '(支付宝)邮政储蓄银行网银支付';
                        break;
                    case 'bank_guangfa':
                        result += '(支付宝)广发银行网银支付';
                        break;
                    case 'bank_jiaotong':
                        result += '(支付宝)交通银行网银支付';
                        break;
                }
                return result;
            };

            /*提交订单*/
            $scope.submitOrder = function () {
                var pay_method = ($scope.pay_type == 'weixin') ? 1 : 0;//1：微信支付，0：支付宝支付
                var pay_type = (pay_method == 1) ? 0 : ($scope.pay_type == 'zhifubao') ? 0 : 1;
                var post_data = (pay_method == 0) ? {"ShowUrl": '', "BankSimpleCode": initBankSimpleCode($scope.pay_type), "Token": TokenSer.getToken(), "RedirectUrl": 'http://' + location.hostname + '/payEarnestSuccess'}
                    : {"ProductId": $scope.data_order.Commodity.Id, "Token": '', "RedirectUrl": ''};
                var param = {
                    "Method": pay_method,
                    "Type": pay_type,
                    "Data": angular.toJson(post_data),
                    "UseEarnest": $scope.isUseBalance
                };
                $scope.type = 1;//支付类型  0完全用余额支付  1用余额+选择的支付方式支付
                var newWin;
                if ($scope.pay_type != 'weixin' && $scope.type == 1) {
                    newWin = window.open('_blank');
                    newWin.location.href = 'http://' + Host.hostname + '/payWin';
                }
                PaymentSer.payForEarnest($scope.type, $scope.data_order.Id, param, function (response, status) {
                    if (status == 1) {
                        if ($scope.type == 1) {
                            if (response != '' && response != null && response != undefined) {
                                $scope.$emit('cart-update');
                                $rootScope.$broadcast('orders-update');
                                if ($scope.pay_type == 'weixin') { //如果是微信支付
                                    WXPaySer.setTotalCost($scope.earnest_cost);
                                    $state.go('WXPay', {trade_id: response.OutTradeNo, type: 0});
                                } else {
                                    $timeout(function () {
                                        $scope.isModalWaitingShow = true;
                                    });
                                    newWin.location.href = API.aliPaySubmit.url + response.OutTradeNo;//新窗口地址改变
                                    //location.href = API.aliPaySubmit.url + response.OutTradeNo;
                                    pollingTradeStatus(response.OutTradeNo);
                                    $scope.trade_id = response.OutTradeNo;
                                }
                            } else {
                                swal({
                                    title: "支付定金失败！",
                                    type: "error",
                                    confirmButtonText: "确定"
                                });
                                newWin.close();
                            }
                        } else {
                            $state.go('payEarnestSuccess', {order_id: $scope.data_order.Id, commodity_id: $scope.data_order.Commodity.Id});
                        }
                    } else {
                        swal({
                            title: "支付定金失败！",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                        newWin.close();
                    }
                });
            };
            /*检测交易状态*/
            $scope.testTradeStatus = function () {
                PaymentSer.getStatusOfTrade($scope.trade_id, function (response, status) {
                    if (status === 1) {
                        $rootScope.$broadcast('user-update');
                        $rootScope.$broadcast('orders-update');
                        ga('send', 'pageview', {
                            'page': '/complete_earnest',
                            'title': '完成支付定金'
                        });
                        $rootScope.initFreeChance();//支付成功刷新机会
                        $state.go('payEarnestSuccess', {order_id: $stateParams.params, commodity_id: $scope.commodityId});
                    } else {
                        $scope.isTipsUnFinishShow = true;
                        $scope.r_t = 5000;
                    }
                });
            };
            /*返回等待付款*/
            $scope.returnWaitingModal = function () {
                $scope.isTipsUnFinishShow = false;
            };
            /*支付时间到期*/
            $scope.payTimeOver = function () {
                $state.go('UCIndex.myOrders', {status: 'unPay'});
            };
            /*关闭等待对话框*/
            $scope.closeWaitingPayModal = function () {
                $timeout(function () {
                    $scope.isModalWaitingShow = false;
                }, 5);
            };
            /*初始化显示数据*/
            function loadPageData(callback) {
                var order_id = $stateParams.params;
                OrderDetailsSer.requestData(order_id, function (resp, status) {
                    if (status == 1) {
                        $scope.data_order = OrderDetailsSer.getData();
                        $scope.commodityId = $scope.data_order.CommodityId;
                        $scope.earnest_cost = parseInt($scope.data_order.TotalEarnestPrice) - $scope.data_order.EarnestMoney;//需支付的定金总额
                        callback();
                    }
                });
                if (UserSer.getData().UserModel == null) {
                    RefreshUserDataSer.requestUserData(function (response, status) {
                        if (status == 1) {
                            UserSer.setUserData(RefreshUserDataSer.getData());
                            if (UserSer.getData().UserModel.IsAgreeEarnest == true) {
                                $scope.isProtocolShow = false;
                            } else {
                                $scope.isProtocolShow = true;
                            }
                        }
                    });
                } else {
                    console.log(UserSer.getData());
                    if (UserSer.getData().UserModel.IsAgreeEarnest == true) {
                        $scope.isProtocolShow = false;
                    } else {
                        $scope.isProtocolShow = true;
                    }
                }
            }

            /*银行简码对应*/
            function initBankSimpleCode(str) {
                switch (str) {
                    case 'bank_icbc':
                        return 'ICBCB2C';
                        break;
                    case 'bank_jianshe':
                        return 'CCB';
                        break;
                    case 'bank_nongye':
                        return 'ABC';
                        break;
                    case 'bank_zhaoshang':
                        return 'CMB';
                        break;
                    case 'bank_zhongguo':
                        return 'BOCB2C';
                        break;
                    case 'bank_xingye':
                        return 'CIB';
                        break;
                    case 'bank_pingan':
                        return 'SPABANK';
                        break;
                    case 'bank_youzheng':
                        return 'POSTGC';
                        break;
                    case 'bank_guangfa':
                        return 'GDB';
                        break;
                    case 'bank_jiaotong':
                        return 'COMM';
                        break;
                }
            }

            function loadWallet() {
                RefreshUserDataSer.requestUserData(function (resp, status) {
                    if (status == 1) {
                        var blc = RefreshUserDataSer.getData().EarnestValue;
                        $scope.data_balance = (blc >= 0) ? blc : 0;
                    }
                });
            }

            $scope.needToPay = function () {
                if ($scope.isUseBalance) {
                    if ($scope.data_balance <= $scope.earnest_cost) {
                        return $scope.earnest_cost - $scope.data_balance;
                    } else {
                        return 0;
                    }
                } else {
                    return $scope.earnest_cost;
                }
            };
            /**
             * 勾选/取消勾选定金钱包支付
             */
            $scope.toggleCheckWallet = function () {
                $scope.isUseBalance = !$scope.isUseBalance;
            };
            function pollingTradeStatus(trade_id) {
                $timeout(function () {
                    PaymentSer.getStatusOfTrade(trade_id, function (response, status) {
                        if (status === 1) {
                            $rootScope.$broadcast('user-update');
                            $rootScope.$broadcast('orders-update');
                            $state.go('payEarnestSuccess', {order_id: $stateParams.params, commodity_id: $scope.commodityId});

                        } else {
                            pollingTradeStatus(trade_id);
                        }
                    });
                }, 1000);
            }
        }]);
