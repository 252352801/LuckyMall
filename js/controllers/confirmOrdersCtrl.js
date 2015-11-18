angular.module('LuckyCat.controllers')
 .controller('ConfirmOrdersCtrl',function($scope,CartSer,LoginSer,$state,AddressSer,$timeout){
        if(!LoginSer.isLogin()){
            $state.go('home');
        }
        $scope.isModalAddressShow=false;
        $scope.inputTips='';
        $scope.value_btn_save='保存';
        loadConfirmOrderData();//加载本页必须的数据
        /*支付方式切换*/
        $scope.changePayType=function(new_type){
            $scope.pay_type=new_type;
            console.log($scope.pay_type);
        };
       /* 支付方式显示*/
        $scope.showPayType=function(){
            switch( $scope.pay_type){
                case 'zhifubao':return '支付宝';break;
                case 'weixin':return '微信支付';break;
                case 'caifutong':return '财付通';break;
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
            _init_area(["s_province","s_city","s_county"]);//初始化地址选择器
            $scope.modal_consignee='';//初始化提交的数据
            $scope.modal_mobile='';
            $scope.modal_address='';
            $scope.modal_province='';
            $scope.modal_city='';
            $scope.modal_county='';
            $timeout(function(){
                $scope.isModalAddressShow=true;
            },5);
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
            if($scope.modal_consignee==''){
                $scope.showInputTips('请输入收货人姓名！');
            }else{
                if($scope.modal_mobile==''){
                    $scope.showInputTips('请输入收货人手机号码！');
                }else{
                    if($scope.modal_province==''||$scope.modal_city==''||$scope.modal_county==''){
                        $scope.showInputTips('请选择区域！');
                    }else{
                        if($scope.modal_address==''){
                            $scope.showInputTips('请输入详细地址！');
                        }else{
                            var param={
                                "ConsigneeName":$scope.modal_consignee,
                                "Area":formatArea($scope.modal_province,$scope.modal_city,$scope.modal_county),
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
                    }
                }
            }
        };
        /*提交订单*/
        $scope.submitOrder=function(){
            var order_id=new Array();
            for(var o in $scope.data_orders){
                order_id.push({"Id":$scope.data_orders[o].Id});
            }
            console.log('收货地址id:'+$scope.selected_address.Id+'\n'+'订单id:'+angular.toJson(order_id)+'\n'+'支付方式：'+$scope.pay_type+'\n'+'交易总额：'+$scope.total_cost);
            var param={
                "AddressId":$scope.selected_address.Id,
                "OrderInfos":order_id,
                "Method":2,
                "Amount":$scope.total_cost
            };
            CartSer.purchaseOrders(param,function(response,status){
                if(status==1){
                    $scope.$emit('cart-update');
                    setTimeout(function(){
                        $state.go('orderSubmitSuccess');
                    },1000)
                }
            });
        };
      /*初始化显示数据*/
     function loadConfirmOrderData(){
         $scope.data_orders=CartSer.getConfirmData();//取已选择订单
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
            cost+=$scope.data_orders[o].cost;
        }
        $scope.total_amount=amount;//商品总数量
        $scope.total_cost=cost;//商品总价
     }
        /*格式化地区信息*/
        function formatArea(_province,_city,_county){
            var area='';
            if(_province==_city){
                area=_province+' '+_county;
            }else{
                area=_province+' '+_city+' '+_county;
            }
            return area;
        }
});
