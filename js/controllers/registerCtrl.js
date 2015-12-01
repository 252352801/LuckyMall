angular.module('LuckyCat.controllers',['LuckyCat.services'])

 .controller('RegisterCtrl',function($scope,VerifyCodeSer,$timeout,RegisterSer,$state){
    $scope.hasInputError=false;//是否有错误输入
    $scope.tips='';//提示信息初始化
       /* 显示提示信息*/
    $scope.showTips=function(msg){
        $scope.tips=msg;
        if(msg!=''){
            $timeout(function() {
                $scope.hasInputError = true;
            },5);
        }else{
            $timeout(function(){
                $scope.hasInputError=false;
            },5);
        }
    };
    /*获取验证码*/
    $scope.getVerifyCode=function(mobile_num){
        if(mobile_num==(''||undefined)){
            $scope.showTips('请先输入接收验证码的手机号喔！');
            return;
        }
        VerifyCodeSer.getVerifyCode(mobile_num,function(ver_code){
            console.log(ver_code);
            $scope.verify_code=ver_code;
        });
    };
    $scope.value_btn='同意协议并注册';
    $scope.register=function(mobile,password,re_password,nickname,code) {

        if(mobile==''||mobile==undefined){
            $scope.showTips('请输入手机号码 ！');
        }else{
            if(code==''||code==undefined){
                $scope.showTips('请输入验证码 ！');
            }else{
                if(password==''||password==undefined){
                    $scope.showTips('请输入密码 ！');
                }else{
                    if(re_password==''||re_password==undefined){
                        $scope.showTips('请再次输入您的密码 ！');
                    }else{
                        if(re_password!=password){
                            $scope.showTips('两次输入的密码不一致 ！');
                        }else{
                            $scope.showTips('');
                            swal("暂时未开放注册");
                            return; //暂时关闭注册
                            $scope.value_btn='正在提交...';
                            RegisterSer.register({
                                "Name":nickname,
                                "PhoneNumber":mobile,
                                "Password":password,
                                "Code":code
                            },function(response,status){  //回调函数
                                if(status==1){
                                    swal("恭喜！注册成功！");
                                    $state.go('login');
                                }else{
                                    swal({
                                        title: "注册失败！",
                                        type: "error",
                                        confirmButtonText: "确定"
                                    });
                                }
                                $scope.value_btn='同意协议并注册';
                            });
                        }
                    }
                }
            }
        }
    };

    $scope.showAlert=function(){
        swal("还没写喔");
    }



})
