angular.module('LuckyMall.controllers')
 .controller('ConfirmOrdersCtrl',function($rootScope,$scope,$state,$stateParams,CartSer,LoginSer,AddressSer,$timeout,WXPaySer,MyOrdersSer,API,PaymentSer){
        if(!LoginSer.isLogin()){
            $state.go('home');
        }
        $scope.source=$stateParams.source.split('=')[1];
        $scope.isModalAddressShow=false;
        $scope.isModalWaitingShow=false;
        $scope.inputTips='';
        $scope.value_btn_save='保存';
        $scope.polling=false;
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
            var post_data=(pay_method==0)?{"ShowUrl":'',"BankSimpleCode":initBankSimpleCode($scope.pay_type)}
                :{"ProductId":$scope.data_orders[0].Commodity.Id};
            var type=($scope.source=='shoppingCart')?0:1;
            var param={
                "AddressId":$scope.selected_address.Id,
                InvoiceTitle:($scope.invoice.type!=-1)?$scope.invoice.title:'',
                "Orders":order_id,
                "Method":pay_method,
                "Type":pay_type,
                "Data":angular.toJson(post_data)
            };
            console.log(angular.toJson(param));
            PaymentSer.purchaseOrders(type,param,function(response,status){
                if(status==1){
                    if(response.Code=='0X00') {
                        $scope.$emit('cart-update');
                        $rootScope.$broadcast('orders-update');
                        if ($scope.pay_type== 'weixin') { //如果是微信支付
                            WXPaySer.setTotalCost($scope.total_cost);
                            $state.go('WXPay',{trade_id:response.Data.OutTradeNo});
                        }else{
                            $timeout(function(){
                                $scope.isModalWaitingShow=true;
                            },5);
                            window.open(API.aliPaySubmit.url+response.Data.OutTradeNo);
                            $scope.polling=true;
                            pollingTradeStatus(response.Data.OutTradeNo);
                            $scope.trade_id=response.Data.OutTradeNo;
                        }
                    }else if(response.Code=='0X01'){
                        swal({
                            title: "地址信息有误!",
                            type: "error",
                            confirmButtonText: "确定"
                        });

                    }else if(response.Code=='0X02'){
                        swal({
                            title: "确认订单失败！",
                            text:'请您不要重复提交订单',
                            type: "error",
                            confirmButtonText: "确定"
                        });

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
         if($scope.source=='shoppingCart'){
             $scope.data_orders=CartSer.getConfirmData();//取已选择订单
         }else if($scope.source=='repay'){
             $scope.data_orders=PaymentSer.getData().orders;
             /*alert($scope.data_orders[0].Id);*/
         }else if($scope.source=='purchase'){
             var order_id=MyOrdersSer.getTempOrder().Id;
             $scope.data_orders=[CartSer.getOrderById(order_id)];
             console.log(angular.toJson($scope.data_orders));
         }
         AddressSer.requestAddressData(LoginSer.getData().UserModel.Id,function(response,status){
             if(status==1){
                 $scope.data_addresses=AddressSer.getData();
                 initPostData();  //初始化提交数据
             }
         });
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
        $scope.total_cost=cost.toFixed(2);//商品总价
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
                        $state.go('paySuccess');
                    }else{
                        pollingTradeStatus(trade_id);
                    }
                });
            },1000);
        }
});
