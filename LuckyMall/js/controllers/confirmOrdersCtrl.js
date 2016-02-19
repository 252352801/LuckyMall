angular.module('LuckyMall.controllers')
 .controller('ConfirmOrdersCtrl',function(Host,$rootScope,$scope,$state,$stateParams,CartSer,LoginSer,AddressSer,$timeout,WXPaySer,MyOrdersSer,API,PaymentSer,OrderDetailsSer,TokenSer){
        if(!LoginSer.isLogin()){
            $state.go('home');
        }
        var submit_time=0;//提交次数v
        $scope.source=$stateParams.source.split('=')[1];
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
            switch($scope.pay_type){
                case 'zhifubao':return '支付宝';break;
                case 'weixin':return '微信支付';break;
                case 'bank_icbc':return '(支付宝)工商银行网银支付';break;
                case 'bank_jianshe':return '(支付宝)建设银行网银支付';break;
                case 'bank_nongye':return '(支付宝)农业银行网银支付';break;
                case 'bank_zhaoshang':return '(支付宝)招商银行网银支付';break;
                case 'bank_zhongguo':return '(支付宝)中国银行网银支付';break;
                case 'bank_xingye':return '(支付宝)兴业银行网银支付';break;
                case 'bank_pingan':return '(支付宝)平安银行网银支付';break;
                case 'bank_youzheng':return '(支付宝)邮政储蓄银行网银支付';break;
                case 'bank_guangfa':return '(支付宝)广发银行网银支付';break;
                case 'bank_jiaotong':return '(支付宝)交通银行网银支付';break;
            }
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
                console.log(angular.toJson(param));
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
            console.log('收货地址id:'+$scope.selected_address.Id+'\n'+'订单id:'+angular.toJson(order_id)+'\n'+'支付方式：'+$scope.pay_type+'\n'+'交易总额：'+$scope.total_cost);
            var pay_method=($scope.pay_type=='weixin')?1:0;//1：微信支付，0：支付宝支付
            var pay_type=(pay_method==1)?0:($scope.pay_type=='zhifubao')?0:1;
            var post_data=(pay_method==0)?{"ShowUrl":'',"BankSimpleCode":initBankSimpleCode($scope.pay_type),"Token":TokenSer.getToken(),"RedirectUrl":'http://www.xingyunmao.cn/payHandler/'}
                :{"ProductId":$scope.data_orders[0].Commodity.Id,"Token":'',"RedirectUrl":''};
            var param={
                "AddressId":$scope.selected_address.Id,
                InvoiceTitle:($scope.invoice.type!=-1)?$scope.invoice.title:'',
                "Orders":order_id,
                "Method":pay_method,
                "Type":pay_type,
                "Data":angular.toJson(post_data)
            };
            console.log(angular.toJson(param));
            $scope.btn_val_purchase='正在处理...';
            if($scope.pay_type!= 'weixin'){
                var newWin=window.open('_blank');//新窗口
                newWin.location.href='http://'+Host.hostname+'/payWin';
            }
            PaymentSer.purchaseOrders($scope.purchaseType,param,function(response,status){
                $scope.btn_val_purchase='确认支付';
                if(status==1){
                    if(response.Code=='0X00') {
                        submit_time++;
                        $scope.$emit('cart-update');
                        $rootScope.$broadcast('orders-update');
                        if ($scope.pay_type== 'weixin') { //如果是微信支付
                            WXPaySer.setTotalCost($scope.total_cost);
                            $state.go('WXPay',{trade_id:response.Data.OutTradeNo,type:1});
                        }else{
                            $timeout(function(){
                                $scope.isModalWaitingShow=true;
                            },5);
                            $scope.pay_url=API.aliPaySubmit.url+response.Data.OutTradeNo;//支付url
                           // var newWin=window.open('_blank');
                            newWin.location.href=$scope.pay_url;
                            //location.href=$scope.pay_url;
                            $scope.polling=true;
                            pollingTradeStatus(response.Data.OutTradeNo);
                            $scope.trade_id=response.Data.OutTradeNo;
                        }
                    }else if(response.Code=='0X10'){
                        newWin.close();
                        $rootScope.$broadcast('orders-update');
                        ga('send', 'pageview', {
                            'page': '/complete_checkout',
                            'title': '完成购买'
                        });
                        $rootScope.initFreeChance();//支付成功刷新机会
                        $state.go('paySuccess');

                    }else if(response.Code=='0X01'){
                        swal({
                            title: "地址信息有误!",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                        newWin.close();
                    }else if(response.Code=='0X02'){
                        newWin.close();
                        submit_time++;
                        if(submit_time>=1&&submit_time<10){
                            $scope.purchaseType=1;//第二次提交时改为重新支付方式
                            $scope.submitOrder();
                        }else{
                            swal({
                                title: "确认订单失败，请勿重复提交订单！",
                                text:'已提交的订单可以在“我的订单”里找到',
                                type: "error",
                                confirmButtonText: "确定"
                            });
                        }

                    }else if(response.Code=='0X03'){
                        newWin.close();
                        swal({
                            title: "创建交易失败！",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }else{
                        newWin.close();
                        swal({
                            title: "未知错误！",
                            type: "error",
                            text:'错误码：0XXX',
                            confirmButtonText: "确定"
                        });
                    }
                }else{
                    newWin.close();
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
                    $rootScope.initFreeChance();
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
         if($scope.source=='game'){
             var order_id = MyOrdersSer.getTempOrder();
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
                     AddressSer.requestAddressData(LoginSer.getData().UserModel.Id,function(response,status){
                         if(status==1){
                             $scope.data_addresses=AddressSer.getData();
                             initPostData();  //初始化提交数据
                         }
                     });
                 }
             });
         }else {
             if ($scope.source == 'shoppingCart') {
                 $scope.data_orders = CartSer.getConfirmData();//取已选择订单
             } else if ($scope.source == 'repay') {
                 $scope.data_orders = PaymentSer.getData().orders;
             } else if ($scope.source == 'purchase') {
                 var order_id = MyOrdersSer.getTempOrder().Id;
                 $scope.data_orders = [CartSer.getOrderById(order_id)];
                 console.log(angular.toJson($scope.data_orders));
             }
             AddressSer.requestAddressData(LoginSer.getData().UserModel.Id,function(response,status){
                 if(status==1){
                     $scope.data_addresses=AddressSer.getData();
                     initPostData();  //初始化提交数据
                 }
             });
         }
     }
      /*初始化提交数据*/
     function initPostData(){
        $scope.pay_type='zhifubao';//支付方式
         $scope.selected_address=null;//选择的地址
        for(var o in $scope.data_addresses){
            if($scope.data_addresses[o].Selected==true){
                $scope.selected_address=$scope.data_addresses[o];//地址
                break;
            }
        }
        var amount=0;
        var cost=0;
        for(var o in $scope.data_orders){
            amount+=$scope.data_orders[o].Count;
            cost+=$scope.data_orders[o].needToPay;
        }
        $scope.total_amount=amount;//商品总数量
        $scope.total_cost=cost;//商品总价
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
                        $rootScope.initFreeChance();
                        $state.go('paySuccess');
                    }else{
                        pollingTradeStatus(trade_id);
                    }
                });
            },1000);
        }
});