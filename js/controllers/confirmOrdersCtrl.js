angular.module('LuckyMall.controllers')
 .controller('ConfirmOrdersCtrl',['Host','$rootScope','$scope','$state','$stateParams','CartSer',
        'LoginSer','AddressSer','$timeout','WXPaySer','MyOrdersSer','API','PaymentSer',
        'OrderDetailsSer','TokenSer','RefreshUserDataSer','SOTDSvc',
        function(Host,$rootScope,$scope,$state,$stateParams,CartSer,LoginSer,AddressSer,$timeout,
                 WXPaySer,MyOrdersSer,API,PaymentSer,OrderDetailsSer,TokenSer,RefreshUserDataSer,SOTDSvc){
        if(!LoginSer.isLogin()){
            $state.go('home');
        }
        var submit_time=0;//提交次数v
        $scope.source=SOTDSvc.get().from;
       $scope.purchaseType=($scope.source=='repay')?1:0;//支付方式
        $scope.isModalAddressShow=false;
        $scope.isModalWaitingShow=false;
        $scope.inputTips='';
        $scope.value_btn_save='保存';
        $scope.btn_val_purchase='确认支付';
        $scope.polling=false;
        $scope.tips_unPay_showTime=5;
        loadConfirmOrderData();//加载本页必须的数据
        /*支付方式切换*/
        $scope.changePayType=function(new_type){
            $scope.pay_type=new_type;
        };
       /* 支付方式显示*/
        $scope.showPayType=function(){
            var result='';
           /* if($scope.data_balance>0&&$scope.total_earnest>0){
                    result+='喵喵钱包余额+';
            };*/
            switch($scope.pay_type){
                case 'zhifubao':result+='支付宝';break;
                case 'weixin':result+='微信支付';break;
                case 'bank_icbc':result+='(支付宝)工商银行网银支付';break;
                case 'bank_jianshe':result+='(支付宝)建设银行网银支付';break;
                case 'bank_nongye':result+= '(支付宝)农业银行网银支付';break;
                case 'bank_zhaoshang':result+= '(支付宝)招商银行网银支付';break;
                case 'bank_zhongguo':result+='(支付宝)中国银行网银支付';break;
                case 'bank_xingye':result+= '(支付宝)兴业银行网银支付';break;
                case 'bank_pingan':result+= '(支付宝)平安银行网银支付';break;
                case 'bank_youzheng':result+='(支付宝)邮政储蓄银行网银支付';break;
                case 'bank_guangfa':result+= '(支付宝)广发银行网银支付';break;
                case 'bank_jiaotong':result+='(支付宝)交通银行网银支付';break;
            }
            return result;
        };
        /*收货地址切换*/
        $scope.changeConsignee=function(new_address){
            $timeout(function(){
                $scope.selected_address=new_address;
            },5);
        };
        /*添加收货地址弹出框显示*/
        $scope.showAddressModal=function(){
            $scope.inputTips='';
            $scope.modal_consignee='';//初始化提交的数据
            $scope.modal_mobile='';
            $scope.modal_address='';
            $scope.modal_area='';
            $timeout(function(){
                $scope.isModalAddressShow=true;
            },5);
        };
       /* 选择区域结束时的回调*/
        $scope.areaInputFinish=function(val){
            $scope.modal_area=val;
        };
        /*关闭添加收货地址弹出框*/
        $scope.closeAddressModal=function(){
            $timeout(function(){
                $scope.isModalAddressShow=false;
            },5)
        };
        /*提示信息*/
        $scope.showInputTips=function(msg){
            $timeout(function(){
                   $scope.inputTips=msg;
            });
        };
        /*添加地址*/
        $scope.addAddress=function(){
            if($scope.form_address.$invalid){
                if($scope.form_address.consignee.$invalid){
                    $scope.showInputTips('请输入收货人姓名！');
                }else if($scope.form_address.mobile.$invalid){
                    if($scope.form_address.mobile.$error.pattern){
                        $scope.showInputTips('您输入的手机号码有误！');
                    }else if($scope.form_address.mobile.$error.required){
                        $scope.showInputTips('请输入收货人手机号码！');
                    }
                }else if($scope.form_address.area.$invalid){
                    $scope.showInputTips('请选择区域！');
                }else if($scope.form_address.address.$invalid){
                    $scope.showInputTips('请输入详细地址！');
                }
            }else{
                $scope.showInputTips('');
                var param={
                    "ConsigneeName":$scope.modal_consignee,
                    "Area":$scope.modal_area,
                    "ConsigneeAddress":$scope.modal_address,
                    "ConsigneeMobile":$scope.modal_mobile,
                    "UserId":LoginSer.getData().UserModel.Id,
                    "Selected": true
                };
                //console.log(angular.toJson(param));
                $scope.value_btn_save='正在提交...';
                AddressSer.addAddress(param,function(response,status){
                    if(status==1){
                        $scope.value_btn_save='保存';
                        loadConfirmOrderData();
                        $scope.closeAddressModal();
                    }
                });
            }
        };
        /*提交订单*/
        $scope.submitOrder=function(){
            $scope.polling=false;//取消轮询是否已支付
            clearTimeout($scope.timer_trade_status);

            if($scope.selected_address==null){
                swal('请选择收货地址！');
                return;
            }
            var order_id=new Array();
            for(var o in $scope.data_orders){
                order_id.push($scope.data_orders[o].Id);
            }
            var pay_method=($scope.pay_type=='weixin')?1:0;//1：微信支付，0：支付宝支付
            var pay_type=(pay_method==1)?0:($scope.pay_type=='zhifubao')?0:1;
            var post_data=(pay_method==0)?{"ShowUrl":'',"BankSimpleCode":initBankSimpleCode($scope.pay_type),"Token":TokenSer.getToken(),"RedirectUrl":'http://'+location.hostname+'/paySuccess'}
                :{"ProductId":$scope.data_orders[0].Commodity.Id,"Token":TokenSer.getToken(),"RedirectUrl":'http://'+location.hostname+'/paySuccess'};
            var param={
                "AddressId":$scope.selected_address.Id,
                InvoiceTitle:($scope.invoice.type!=-1)?$scope.invoice.title:'',
                "Orders":order_id,
                "Method":pay_method,
                "Type":pay_type,
                "Data":angular.toJson(post_data)
            };
            //console.log(angular.toJson(param));
            $scope.btn_val_purchase='正在处理...';
            var newWin={};
            if($scope.pay_type!= 'weixin'){
                newWin=window.open('_blank');//新窗口
                //console.log(newWin);
                newWin.location.href='http://'+Host.hostname+'/payWin';
            }
            PaymentSer.purchaseOrders($scope.purchaseType,param,function(response,status){
                $scope.btn_val_purchase='确认支付';
                if(status==1){
                    if(response.Code!='0X00'&&$scope.pay_type!= 'weixin'){//关闭新窗口
                        newWin.close();
                    }
                    if(response.Code=='0X00') {
                        submit_time++;
                        $scope.$emit('cart-update');
                        $rootScope.$broadcast('orders-update');
                        var tmp=SOTDSvc.get();
                        tmp.from='repay';
                        SOTDSvc.set(tmp);
                        if ($scope.pay_type== 'weixin') { //如果是微信支付
                           // var used_blc=($scope.data_balance>=$scope.total_earnest?$scope.total_earnest:$scope.data_balance);
                            WXPaySer.setTotalCost($scope.total_cost);
                            $state.go('WXPay',{trade_id:response.Data.OutTradeNo,type:1});
                        }else{
                            $timeout(function(){
                                $scope.isModalWaitingShow=true;
                            },5);
                            if(response.Data!=null) {
                                newWin.location.href = API.aliPaySubmit.url + response.Data.OutTradeNo;//支付url
                                $scope.polling = true;
                                pollingTradeStatus(response.Data.OutTradeNo);
                                $scope.trade_id = response.Data.OutTradeNo;
                            }else{//除了使用定金钱包的余额外，需要支付的金额为0时
                                newWin.close();
                                ga('send', 'pageview', {
                                    'page': '/complete_checkout',
                                    'title': '完成购买'
                                });
                                //  $rootScope.initFreeChance();//支付成功刷新机会
                                $state.go('paySuccess');
                            }
                        }
                    }else if(response.Code=='0X10'){
                        $scope.$emit('cart-update');
                        $rootScope.$broadcast('orders-update');
                        ga('send', 'pageview', {
                            'page': '/complete_checkout',
                            'title': '完成购买'
                        });
                      //  $rootScope.initFreeChance();//支付成功刷新机会
                        $state.go('paySuccess');

                    }else if(response.Code=='0X01'){
                        swal({
                            title: "地址信息有误!",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }else if(response.Code=='0X02'){
                        submit_time++;
                        if(submit_time>=1&&submit_time<20){
                            $scope.purchaseType=1;//第二次提交时改为重新支付方式
                            $scope.submitOrder();
                        }else{
                            swal({
                                title: "确认订单失败，请勿频繁重复提交订单！",
                                text:'已提交的订单可以在“我的订单”里找到',
                                type: "error",
                                confirmButtonText: "确定"
                            });
                        }

                    }else if(response.Code=='0X03'){
                        swal({
                            title: "创建交易失败！",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }else{
                        swal({
                            title: "未知错误！",
                            type: "error",
                            text:'错误码：0XXX',
                            confirmButtonText: "确定"
                        });
                    }
                }else{
                    if(status==401){
                        swal( "账号过期，请重新登陆！");
                        $state.go('login');
                    }
                }
            });
        };
        /*检测交易状态*/
        $scope.testTradeStatus=function(){
            PaymentSer.getStatusOfTrade($scope.trade_id,function(response,status){
                if(status===1){
                    $rootScope.$broadcast('orders-update');
                    ga('send', 'pageview', {
                        'page': '/complete_checkout',
                        'title': '完成购买'
                    });
                    //$rootScope.initFreeChance();
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
          if($scope.polling!=true){
              return;
          }
          $state.go('UCIndex.myOrders',{status:'unPay'});
      };
        /*关闭等待对话框*/
      $scope.closeWaitingPayModal=function(){
          $timeout(function(){
              $scope.isModalWaitingShow=false;
          },5);
      };
       $scope.$on('stop-polling-tradeStatus',function(){
            clearTimeout($scope.timer_trade_status);
            $scope.polling=false;
       });

        $scope.chooseInvoice=function(type){
            if($scope.invoice.type!=type){
                $scope.invoice.type=type;
                $scope.invoice.input=true;
            }else{
                $scope.invoice.type=-1;
                $scope.invoice.input=false;
                $scope.invoice.title='';
            }
        };
      /*初始化显示数据*/
     function loadConfirmOrderData(){
         var src=SOTDSvc.get().from;
         if(src=='game'){
             var order_id = SOTDSvc.get().orders[0];
             OrderDetailsSer.requestData(order_id, function (resp, status) {
                 if (status == 1) {
                     $scope.data_orders = [OrderDetailsSer.getData()];
                     if($scope.data_orders[0].OrderStatus==6){//如果订单失效
                         swal({
                             title: "此订单已失效！",
                             type: "error",
                             confirmButtonText: "确定"
                         });
                         $state.go('home');
                     }
                     initPostData();
                 }
             });
         }else {
             if (src == 'shoppingCart') {
                 CartSer.requestCartData(function(response,status){
                     if(status==1){
                         var id_arr=SOTDSvc.get().orders;//订单id数组
                         $scope.data_orders=CartSer.getOrders(id_arr);
                         initPostData();
                     }
                 });
             } else if (src == 'repay') {
                 MyOrdersSer.requestData(1,function(response,status){
                     if(status==1){
                         var id_arr=SOTDSvc.get().orders;//订单id数组
                         $scope.data_orders=MyOrdersSer.getOrders(1,id_arr);
                         initPostData();
                     }
                 });
             } else if (src== 'purchase') {
                 CartSer.requestCartData(function(response,status){
                     if(status==1){
                         var id_arr=SOTDSvc.get().orders;//订单id数组
                         $scope.data_orders=CartSer.getOrders(id_arr);
                         initPostData();
                     }
                 });
             }
         }
         RefreshUserDataSer.requestUserData(function(resp,status){
                 if(status==1){
                     var blc=RefreshUserDataSer.getData().EarnestValue;
                     $scope.data_balance=(blc>=0)?blc:0;
                 }
         });
     }

     $scope.setUsedBalance=function(){
         if($scope.data_balance>0){
             if($scope.data_balance>=$scope.total_earnest){
                 return $scope.total_earnest;
             }else{
                 return $scope.data_balance;
             }
         }
     };
      /*初始化提交数据*/
     function initPostData(){
         AddressSer.requestAddressData(LoginSer.getData().UserModel.Id,function(response,status){
             if(status==1){
                 $scope.data_addresses=AddressSer.getData();
                 $scope.selected_address=null;//选择的地址
                 for(var o in $scope.data_addresses){
                     if($scope.data_addresses[o].Selected==true){
                         $scope.selected_address=$scope.data_addresses[o];//地址
                         break;
                     }
                 }
             }
         });
        $scope.pay_type='zhifubao';//支付方式
        var amount=0;
        var cost=0;
         var total_earnest=0;
        for(var o in $scope.data_orders){
            amount+=$scope.data_orders[o].Count;
            cost+=$scope.data_orders[o].needToPay;
            if($scope.data_orders[o].OrderType!=2) {
                total_earnest += Math.ceil($scope.data_orders[o].UnitPrice * $scope.data_orders[o].EarnestPercent) * $scope.data_orders[o].Count - $scope.data_orders[o].EarnestMoney;
            }
        }
        $scope.total_amount=amount;//商品总数量
        $scope.total_cost=cost;//商品总价
         $scope.total_earnest=total_earnest;//定金总额
        $scope.invoice={
            type:-1,
            title:''
        };
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
                case 'bank_guangfa':return 'GDB';break;
                case 'bank_jiaotong':return 'COMM';break;
            }
        }

        function pollingTradeStatus(trade_id){
            if($scope.polling!=true){
                return;
            }
            $scope.timer_trade_status=$timeout(function(){
                PaymentSer.getStatusOfTrade(trade_id,function(response,status){
                    if(status===1){
                        $rootScope.$broadcast('orders-update');
                        ga('send', 'pageview', {
                            'page': '/complete_checkout',
                            'title': '完成购买'
                        });
                        $state.go('paySuccess');
                    }else{
                        pollingTradeStatus(trade_id);
                    }
                });
            },2000);
        }
}]);
