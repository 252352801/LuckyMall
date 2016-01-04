angular.module('LuckyMall.controllers')
 .controller('AfterServiceCtrl',function($scope,$state,$stateParams,MyOrdersSer,$timeout,AddressSer,LoginSer,FileUploader,UploadSer,OrderDetailsSer,LogisticsSer){
        $scope.order_id=$stateParams.order_id;
        $scope.order_status=$stateParams.order_status;
        $scope.service_type;//申请类型
        $scope.apply_amount=1;
        $scope.input_txt='';
        $scope.showLoading=false;
        $scope.isModalAddressShow=false;
        $scope.inputTips='';//地址输入提示
        $scope.value_btn_save='保存';
        $scope.value_btn_submit='提交申请';
        loadData();



        /*提示信息*/
        $scope.showInputTips=function(msg){
           // $timeout(function(){
                $scope.inputTips=msg;
           // });
        };
        /* 选择区域结束时的回调*/
        $scope.areaInputFinish=function(val){
            $scope.modal_area=val;
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
        /*关闭添加收货地址弹出框*/
        $scope.closeAddressModal=function(){
            $timeout(function(){
                $scope.isModalAddressShow=false;
            },5)
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
                        loadAddressList();
                        $scope.value_btn_save='保存';
                        $scope.closeAddressModal();
                    }
                });
            }
        };
        $scope.add=function(){
           if($scope.apply_amount<$scope.data_order.Count) {
                $scope.apply_amount++;
            }
        };
        $scope.reduce=function(){
            if($scope.apply_amount>1) {
                $scope.apply_amount--;
            }
        };
        /*售后类型切换*/
        $scope.changeType=function(new_type){
            $scope.service_type=new_type;
        };
        /*收货地址切换*/
        $scope.changeConsignee=function(new_address){
            $timeout(function(){
                $scope.selected_address=new_address;
            },5);
        };
    
    
         $scope.submit=function(){
             console.log($scope.input_txt);
             var img_info=new Array();
             var len=$scope.uploader.queue.length;
             for(var o in $scope.uploader.queue){
                 if($scope.uploader.queue[o].url){
                     var img_url=$scope.uploader.queue[o].url;
                     if(o<len-1){
                         img_url+='|';
                     }
                     img_info.push(img_url);
                 }
             }
             var params={
                 OrderId:$scope.order_id,//订单ID
                 RepairType: $scope.service_type,//申请类型 0维修 1换货 2退款
                 Count:$scope.apply_amount,//申请数量
                 ProblemDescription:$scope.input_txt,//问题描述
                 Images:img_info.join('')
             };
             console.log(params);
             if(!$scope.service_type){
                 swal({
                     title: "请选择您要申请售后类型!",
                     type: "error",
                     confirmButtonText: "确定"
                 });
             }else if(!params.ProblemDescription){
                 swal({
                     title: "请输入您申请售后的原因!",
                     text:'如商品非人为损坏、商品过期等',
                     type: "error",
                     confirmButtonText: "确定"
                 });
             }else{
                 $scope.value_btn_submit='正在提交...';
                 MyOrdersSer.submitAfterServiceApplication(params,function(resp,status){
                     $timeout(function(){
                         $scope.value_btn_submit='提交申请';
                     });
                     if(status==1){
                         swal({
                             title: "您的申请已成功提交!",
                             text:'请耐心等待客服回复',
                             type: "success",
                             confirmButtonText: "确定"
                         });
                         $state.go('UCIndex.myOrders',{status:'after'});
                     }else if(status==2) {
                         $state.go('login');
                     }else {
                         swal({
                             title: "申请失败!",
                             text:'请您联系客服',
                             type: "error",
                             confirmButtonText: "确定"
                         });
                     }
                 });
             }
             
         };

        function loadData(){
            OrderDetailsSer.requestData($scope.order_id,function(response,status){
                if(status==1){
                    $scope.data_order=OrderDetailsSer.getData();
                //   $scope.data_order.OrderStatus=2;
                    if($scope.data_order.OrderStatus!=4){//如果不是已完成的订单
                        $scope.service_type=0;
                        $scope.apply_amount=$scope.data_order.Count;
                    }
                    $scope.data_consignee=$scope.data_order.ConsigneeInfo;
                    $scope.data_logistics=$scope.data_order.LogisticsInfo;
                    $scope.$emit('changeMenu',$scope.data_order.OrderStatus);
                }
            });
            loadAddressList();
        }


        function loadAddressList(){
            /*加载收货地址*/
            AddressSer.requestAddressData(LoginSer.getData().UserModel.Id,function(response,status){
                if(status==1){
                    $scope.data_addresses=AddressSer.getData();
                    for(var o in $scope.data_addresses){
                        if($scope.data_addresses[o].Selected==true){
                            $scope.selected_address=$scope.data_addresses[o];//地址
                            break;
                        }
                    }
                }
            });
        };



        $scope.uploader =UploadSer.initUploader(10,20480); // 最大数量10  最大总大小2048kb(20MB)
});
