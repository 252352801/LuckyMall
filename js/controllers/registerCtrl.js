angular.module('LuckyMall.controllers')

    .controller('RegisterCtrl', function ($scope, VerifyCodeSer, $timeout, RegisterSer, $state) {
        $scope.hasInputError = false;//是否有错误输入
        $scope.tips = '';//提示信息初始化
        $scope.value_btn = '同意协议并注册';
        $scope.isModalProtocolShow=false;
        $scope.invalidMobile=new Array();
        /* 显示提示信息*/
        $scope.showTips = function (msg) {
            $scope.tips = msg;
            if (msg != '') {
                $timeout(function () {
                    $scope.hasInputError = true;
                }, 5);
            } else {
                $timeout(function () {
                    $scope.hasInputError = false;
                }, 5);
            }
        };
        /*获取验证码*/
        $scope.getVerifyCode = function (mobile_num) {
            if (mobile_num == ('' || undefined)) {
                $scope.showTips('请先正确输入接收验证码的手机号喔！');
            }else{
               // alert(isValid($scope.mobile));return;
                if($scope.isValid($scope.mobile)) {
                    VerifyCodeSer.getVerifyCode(mobile_num, function (ver_code) {
                        console.log(ver_code);
                        $scope.verify_code = ver_code;
                    });
                }else{
                    $scope.showTips('手机号'+$scope.mobile+'已注册！');
                    return false;
                }
            }
        };
        $scope.showProtocol = function () {
            $scope.isModalProtocolShow=true;
        };
        $scope.hideProtocol=function(){
            $scope.isModalProtocolShow=false;
        };
       /* 检测手机号码是否可用*/
        $scope.isMobileCanRegister=function(){
            if($scope.form_register.mobile.$valid){
                var mb=$scope.mobile;
                if(!$scope.isValid(mb)){
                    $scope.showTips('手机号'+mb+'已注册！');
                    ga('send', 'pageview', {
                        'page': '/register_success',
                        'title': '注册成功'
                    });
                }else{
                    RegisterSer.isSignUp(mb,function(response){
                        if(response==true){
                            $scope.invalidMobile.push(mb);
                            $scope.showTips('手机号'+mb+'已注册！');
                            ga('send', 'pageview', {
                                'page': '/register_success',
                                'title': '注册成功'
                            });
                        }else{
                            $scope.showTips('');
                        }
                    });
                }
            }
        };
       /* 注册提交*/
        $scope.submitRegister = function () {
            if($scope.form_register.$valid&&$scope.form_register.re_password.$modelValue==$scope.form_register.password.$modelValue){
                if($scope.isValid($scope.mobile)){
                    $scope.showTips('');
                    $scope.value_btn = '正在提交...';
                    RegisterSer.register({
                        "Name": $scope.nickname,
                        "PhoneNumber": $scope.mobile,
                        "Password":  $scope.password,
                        "Code":  $scope.code
                    }, function (response, status) {  //回调函数
                        if (status == 1) {
                            swal("恭喜！注册成功！");
                            $state.go('login');
                            ga('send', 'pageview', {
                                'page': '/register_success',
                                'title': '注册成功'
                            });
                        } else {
                            swal({
                                title: "注册失败！",
                                type: "error",
                                confirmButtonText: "确定"
                            });
                        }
                        $scope.value_btn = '同意协议并注册';
                    });
                }else{
                    $scope.showTips('手机号'+$scope.mobile+'已注册！');
                }
            }else{
                if($scope.form_register.mobile.$invalid){
                    if($scope.form_register.mobile.$error.required){
                        $scope.showTips('请输入手机号！');
                    }else{
                        $scope.showTips('请正确输入手机号！');
                    }
                }else if($scope.form_register.code.$invalid){
                    if($scope.form_register.code.$error.required) {
                        $scope.showTips('请输入验证码！');
                    }else{
                        $scope.showTips('您输入的验证码有误！');
                    }
                }else if($scope.form_register.password.$invalid){
                    if($scope.form_register.password.$error.required) {
                        $scope.showTips('请设置您的账号密码！');
                    }else{
                        $scope.showTips('您设置的密码不符合要求，请按要求输入！');
                    }
                }else if($scope.form_register.re_password.$modelValue!=$scope.form_register.password.$modelValue){
                    if($scope.form_register.re_password.$error.required){
                        $scope.showTips('请再次输入您的密码');
                    }else{
                        $scope.showTips('两次输入的密码不一致！');
                    }
                }
            }
        };
        /*检查手机号码是否已经在已注册的列表里（本地维护的一个数组）*/
        $scope.isValid=function(mb_num){
            for(var o in $scope.invalidMobile){
                if(mb_num==$scope.invalidMobile[o]){
                    return false;
                }
            }
            return true;
        };
    })
