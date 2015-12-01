angular.module('LuckyCat.controllers')
 .controller('PayForEarnestCtrl',function($rootScope,$scope,$state,$stateParams,CartSer,LoginSer,$timeout,WXPaySer,PaymentSer,API){
        $scope.isModalWaitingShow=false;
        $scope.pay_type='zhifubao';//支付方式
        loadPageData();//加载本页必须的数据
        /*支付方式切换*/
        $scope.changePayType=function(new_type){
            $scope.pay_type=new_type;
        };
       /* 支付方式显示*/
        $scope.showPayType=function(){
            switch($scope.pay_type){
                case 'zhifubao':return '支付宝';break;
                case 'weixin':return '微信支付';break;
                case 'bank_icbc':return '中国工商银行网银支付';break;
                case 'bank_jianshe':return '中国建设银行网银支付';break;
                case 'bank_nongye':return '中国农业银行网银支付';break;
                case 'bank_zhaoshang':return '中国招商银行网银支付';break;
                case 'bank_zhongguo':return '中国银行网银支付';break;
                case 'bank_xingye':return '兴业银行网银支付';break;
                case 'bank_pingan':return '平安银行网银支付';break;
                case 'bank_youzheng':return '中国邮政储蓄银行银行网银支付';break;
            }
        };

        /*提交订单*/
        $scope.submitOrder=function(){
            var pay_method=($scope.pay_type=='weixin')?1:0;//1：微信支付，0：支付宝支付
            var pay_type=(pay_method==1)?0:($scope.pay_type=='zhifubao')?0:1;
            var post_data=(pay_method==0)?{"ShowUrl":'',"BankSimpleCode":initBankSimpleCode($scope.pay_type)}
                :{"ProductId":$scope.data_order.Commodity.Id};
            var param={
                "Method":pay_method,
                "Type":pay_type,
                "Data":angular.toJson(post_data)
            };
            PaymentSer.payForEarnest($scope.data_order.Id,param,function(response,status){
                if(status==1){
                    if(response!=''&&response!=null&&response!=undefined) {
                        $scope.$emit('cart-update');
                        $rootScope.$broadcast('orders-update');
                        if ($scope.pay_type== 'weixin') { //如果是微信支付
                            WXPaySer.setTotalCost($scope.earnest_cost);
                            $state.go('WXPay',{trade_id:response.OutTradeNo});
                        }else{
                            $timeout(function(){
                                $scope.isModalWaitingShow=true;
                            },5);
                            window.open(API.aliPaySubmit.url+response.OutTradeNo);
                            pollingTradeStatus(response.OutTradeNo);
                            $scope.trade_id=response.OutTradeNo;
                        }
                    }else{
                        swal({
                            title: "支付定金失败！",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                }
            });
        };
        /*检测交易状态*/
        $scope.testTradeStatus=function(){
            PaymentSer.getStatusOfTrade($scope.trade_id,function(response,status){
                if(status===1){
                    $rootScope.$broadcast('orders-update');
                    $state.go('paySuccess');
                }else{
                    $scope.isTipsUnFinishShow=true;
                    $scope.r_t=5000;
                }
            });
        };
        /*返回等待付款*/
        $scope.returnWaitingModal=function(){
            $scope.isTipsUnFinishShow=false;
        };
        /*支付时间到期*/
      $scope.payTimeOver=function(){
          alert("支付超时！");
          $state.go('UCIndex.myOrders',{status:'unPay'});
      };
        /*关闭等待对话框*/
      $scope.closeWaitingPayModal=function(){
          $timeout(function(){
              $scope.isModalWaitingShow=false;
          },5);
      };
      /*初始化显示数据*/
     function loadPageData(){
         var order_id=$stateParams.params.split('=')[1];
         if(CartSer.getData()==null){
             CartSer.requestCartData(function(response,status){
                if(status==1){
                    $scope.data_order=CartSer.getOrderById(order_id);
                    $scope.earnest_cost=$scope.data_order.UnitPrice*$scope.data_order.Count*$scope.data_order.EarnestPercent.toFixed(2);//需支付的定金总额
                }
             });
         }else{
             $scope.data_order=CartSer.getOrderById(order_id);
             $scope.earnest_cost=$scope.data_order.UnitPrice*$scope.data_order.Count*$scope.data_order.EarnestPercent.toFixed(2);//需支付的定金总额
         }
         $scope.data_orders='';
     }

        /*银行简码对应*/
        function initBankSimpleCode(str){
            switch(str){
                case 'bank_icbc':return 'ICBCB2C';break;
                case 'bank_jianshe':return 'CCB';break;
                case 'bank_nongye':return 'ABC';break;
                case 'bank_zhaoshang':return 'CMB';break;
                case 'bank_zhongguo':return 'BOCB2C';break;
                case 'bank_xingye':return 'CIB';break;
                case 'bank_pingan':return 'SPABANK';break;
                case 'bank_youzheng':return 'POSTGC';break;
            }
        }
        function pollingTradeStatus(trade_id){
            $timeout(function(){
                PaymentSer.getStatusOfTrade(trade_id,function(response,status){
                    if(status===1){
                        $rootScope.$broadcast('orders-update');
                        $state.go('paySuccess');
                    }else{
                        pollingTradeStatus(trade_id);
                    }
                });
            },1000);
        }
});
