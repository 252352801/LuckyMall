angular.module('LuckyCat.controllers')
 .controller('MyAddressesCtrl',function($scope,$state,$stateParams,AddressSer,$timeout,LoginSer){
        $scope.$emit('changeMenu',9);//切换菜单显示消息
        $scope.isAddFormShow=AddressSer.isShowAddForm();//是否显示添加新地址表单
        $scope.isEditFormShow=false;////是否显示编辑地址表单
        $scope.value_btn_add='提交';
        $scope.value_btn_edit='保存';
        loadData();//加载地址数据
        initTips();//初始化提示信息
        /*显示添加新地址表单*/
        $scope.showAddForm=function(){
            initNewAddressData();
            $scope.hideEditForm();
            AddressSer.setAddForm(true);
            $timeout(function(){
                $scope.isAddFormShow=AddressSer.isShowAddForm();
            },5);
        };
       /* 隐藏添加新地址表单*/
        $scope.hideAddForm=function(){
            AddressSer.setAddForm(false);
            $timeout(function(){
                $scope.isAddFormShow=AddressSer.isShowAddForm();
            },5);
        };
        /*显示编辑地址表单*/
        $scope.showEditForm=function(list){
            $scope.hideAddForm();
            var area=list.Area.split(" ");
            var prov,city,county;
            if(area.length>2){
                prov=area[0];
                city=area[1];
                county=area[2];
            }else{
                prov=area[0];
                city=area[0];
                county=area[1];
            }
            initEditAddressData(prov,city,county,list.ConsigneeAddress,list.ConsigneeName,list.ConsigneeMobile,list.Id,list.Selected);
            AddressSer.setEditForm(true);
            $timeout(function(){
                $scope.isEditFormShow=AddressSer.isShowEditForm();
            });
        };
        /* 隐藏编辑地址表单*/
        $scope.hideEditForm=function() {
            AddressSer.setEditForm(false);
            $timeout(function(){
                $scope.isEditFormShow=AddressSer.isShowEditForm();
            },5);
        };
        /*地址输入提示*/
        $scope.inputAddressTip=function(msg){
            $timeout(function(){
                $scope.tips.inputAddressTip=msg;
            },5);
        };
        /*姓名输入提示*/
        $scope.inputNameTip=function(msg){
            $timeout(function(){
                $scope.tips.inputConsigneeTip=msg;
            },5);
        };
        /*手机输入提示*/
        $scope.inputMobileTip=function(msg){
            $timeout(function(){
                $scope.tips.inputMobileTip=msg;
            },5);
        };
        /*添加新地址*/
        $scope.addAddress=function(){
            if($scope.new_province=="省份"||$scope.new_city=="地级市"||$scope.new_county=="市、县级市"){
                    $scope.tips.inputAreaTip='请选择区域';return;
            }else{
                    $scope.tips.inputAreaTip='';
                    if($scope.new_address==''|$scope.new_address==undefined){
                        $scope.tips.inputAddressTip='请输入地址';return;
                    }else{
                        if($scope.new_consignee==''||$scope.new_consignee==undefined){
                            $scope.tips.inputConsigneeTip='请输入收货人姓名';return;
                        }else{
                            if($scope.new_mobile==''|$scope.new_mobile==undefined){
                                $scope.tips.inputMobileTip='请输入收货人手机号码';return;
                            }
                        }
                    }
            }
            if(!isInputFinish()){
                return;
            }
            var param={
                "ConsigneeName":$scope.new_consignee,
                "Area":formatArea($scope.new_province,$scope.new_city,$scope.new_county),
                "ConsigneeAddress":$scope.new_address,
                "ConsigneeMobile":$scope.new_mobile,
                "UserId":LoginSer.getData().UserModel.Id,
                "Selected": $scope.new_setDefault
            };
            console.log(angular.toJson(param));
            $scope.value_btn_add='正在提交...';
            AddressSer.addAddress(param,function(response,status){
                if(status==1){
                    swal({
                        title: "添加成功!",
                        text:'祝您有个愉快的购物之旅',
                        type: "success",
                        confirmButtonText: "确定"
                    });
                    $scope.value_btn_add='提交';
                    loadData();
                }
            });
        };
        /*编辑地址提交*/
        $scope.updateAddress=function(){
            var param={
                "Id":$scope.edit_id,
                "ConsigneeName":$scope.edit_consignee,
                "Area":formatArea($scope.edit_province,$scope.edit_city,$scope.edit_county),
                "ConsigneeAddress":$scope.edit_address,
                "ConsigneeMobile":$scope.edit_mobile,
                "UserId":LoginSer.getData().UserModel.Id,
                "Selected": $scope.edit_setDefault2
            };
            $scope.value_btn_edit='正在提交...';
            console.log('id:'+param.Id+'\n'+'收货人：'+param.ConsigneeName+'\n'+'地区:'+param.Area+'\n'+'地址：'+param.ConsigneeAddress+'\n'+'手机：'+param.ConsigneeMobile+'\n'+'用户Id:'+param.UserId+'\n'+'是否默认:'+param.Selected);
            AddressSer.updateAddress(param,function(response,status){
                if(status==1){
                    swal({
                        title: "修改成功!",
                        type: "success",
                        confirmButtonText: "确定"
                    });
                }
                $scope.value_btn_edit='保存';
                $scope.hideEditForm();
                loadData();
            })
        };
        /*删除收货地址*/
        $scope.removeAddress=function(a_id){
            swal({
                title: "确定要删除吗?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                cancelButtonText:'取消',
                confirmButtonText: "确定",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
            function(){
                AddressSer.removeAddress(a_id,function(response,status){
                    if(status==1){
                        swal({
                            title: "删除成功!",
                            text:'该收获地址已从您的列表中移除',
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        loadData();
                    }
                });
            });
        };
        /*设置默认地址*/
        $scope.setDefault=function(a_id){
            swal({
                title: "将该地址设为默认收货地址吗?",
                text:'购物时将默认使用“默认地址”',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                cancelButtonText:'取消',
                confirmButtonText: "确定",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
            function(){
                AddressSer.setDefaultAddress(a_id,function(response,status){
                    if(status==1){
                        swal({
                            title: "设置成功!",
                            type: "success",
                            confirmButtonText: "确定"
                        });
                        loadData();
                    }
                });
            });
        };
       /* 加载地址数据*/
        function loadData(){
            $scope.showLoading=true;
            var u_id=LoginSer.getData().UserModel.Id;
            AddressSer.requestAddressData(u_id,function(response,status){
                if(status==1){
                    $timeout(function(){
                        $scope.data_address=AddressSer.getData();
                        $scope.showLoading=false;
                    },5);
                }
            });
        }
       /* 初始化新地址数据*/
        function initNewAddressData(){
            _init_area(["s_province","s_city","s_county"]);//初始化地址选择器
            $scope.new_province="省份";
            $scope.new_city="地级市";
            $scope.new_county="市、县级市";
            $scope.new_setDefault=false;
            $scope.new_consignee='';
            $scope.new_address='';
            $scope.new_mobile='';
        }
    
        /* 初始化编辑地址数据*/
        function initEditAddressData(province,city,conty,address,name,mobile,id,is_default){
            _init_area(["edit_province","edit_city","edit_county"]);
            $scope.edit_province=province;
            $scope.edit_city=city;
            $scope.edit_county=conty;
            $scope.edit_consignee=name;
            $scope.edit_address=address;
            $scope.edit_mobile=mobile;
            $scope.edit_setDefault2=is_default;
            $scope.edit_id=id;
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
       /* 是否正确完成输入*/
        function isInputFinish(){
            for(var o in $scope.tips){
                if($scope.tips[o]!=''){//提示不为空则输入有误
                    return false;
                }
            }
            return true;
        }
        /*提示信息初始化*/
        function initTips() {
            $scope.tips={
                inputAreaTip:'',
                inputAddressTip:'',
                inputConsigneeTip:'',
                inputMobileTip:''
            };
        }
});
