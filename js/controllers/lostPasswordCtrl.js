angular.module('LuckyMall.controllers')
 .controller('LostPasswordCtrl',function($scope,$state,LostPasswordSer,RegisterSer,VerifyCodeSer,$timeout){
    $scope.btn_val_submit='提交';

        $scope.tips = '';//提示信息初始化
        $scope.invalidMobile=new Array();
        $scope.s_key='';//会话密钥
        $scope.captchaCode='';
        $scope.error={//注册时的错误对象
            mobile:false,
            imgCode:false,
            code:false,
            password:false,
            repPassword:false
        };
        var lock_cc=true;//获取图片验证码的锁,防止疯狂点击


        RegisterSer.getSessionKey(function(response,status){
            if(status==1){
                console.log('会话密钥：'+response);
                $scope.s_key=response;
                $scope.getCaptchaCode();
            }
        });

        $scope.getCaptchaCode=function(){
            if(lock_cc){
                lock_cc=false;
                RegisterSer.getCaptchaCode(function (response, status) {
                    if (status == 1) {
                        $scope.captchaCode = response;
                        console.log($scope.captchaCode);
                    }
                    lock_cc=true;
                });
            }else{
                alert("哎呀，您的手速太快了");
            }
        };
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
        /*获取手机验证码*/
        $scope.getVerifyCode = function (mobile_num) {
            if (mobile_num == ('' || undefined)) {
                setCurrentError('mobile');
                $scope.showTips('请先正确输入接收验证码的手机号喔！');
            }else{
                if($scope.form_resetPW.img_code.$invalid){
                    setCurrentError('imgCode');
                    $scope.showTips('请先输入图片中的验证码喔！');
                }else{
                    VerifyCodeSer.getVerifyCode(mobile_num,$scope.s_key,$scope.img_code, function (response,status) {
                        if(status==1) {
                            $scope.verify_code = response;
                        }else{
                            setCurrentError('imgCode');
                            $scope.showTips('验证码错误！');
                        }
                    });
                }
            }
        };
        /* 找回密码提交*/
        $scope.resetPassword=function(){
                if($scope.form_resetPW.$valid&&$scope.form_resetPW.re_password.$modelValue==$scope.form_resetPW.password.$modelValue){
                    clearErrors();
                        $scope.showTips('');
                        $scope.btn_val_submit='正在提交...';
                       LostPasswordSer.resetPassword([
                           //[0]:手机号码;[1]:短信验证码;[2]:新密码
                           $scope.mobile,$scope.code,$scope.password
                        ], function (response, status) {  //回调函数
                           var resp_code=angular.fromJson(response).code;
                            if (status == 1) {
                                if(resp_code=='0X00') {
                                    swal("恭喜！找回密码成功！");
                                    $state.go('login');
                                }else if(resp_code=='104'){
                                    setCurrentError('code');
                                    $scope.showTips('验证码有误！');
                                }
                            } else if(status == 0){
                                swal({
                                    title: "请求失败!",
                                    text: '重新试一下',
                                    type: "error",
                                    confirmButtonText: "确定"
                                });
                            }else if(status == -1){
                                swal({
                                    title: "网络错误!",
                                    text: '网络不给力啊',
                                    type: "error",
                                    confirmButtonText: "确定"
                                });
                            }
                           $scope.btn_val_submit='提交';
                        });

                }else{
                    if($scope.form_resetPW.mobile.$invalid){
                        setCurrentError('mobile');
                        if($scope.form_resetPW.mobile.$error.required){
                            $scope.showTips('请输入手机号！');
                        }else{
                            $scope.showTips('请正确输入手机号！');
                        }
                    }else if($scope.form_resetPW.code.$invalid){
                        setCurrentError('code');
                        if($scope.form_resetPW.code.$error.required) {
                            $scope.showTips('请输入验证码！');
                        }else{
                            $scope.showTips('您输入的验证码有误！');
                        }
                    }else if($scope.form_resetPW.password.$invalid){
                        setCurrentError('password');
                        if($scope.form_resetPW.password.$error.required) {
                            $scope.showTips('请设置新的密码！');
                        }else{
                            $scope.showTips('密码必须为6-24位字符（区分大小写）！');
                        }
                    }else if($scope.form_resetPW.re_password.$modelValue!=$scope.form_resetPW.password.$modelValue){
                        setCurrentError('repPassword');
                        if($scope.form_resetPW.re_password.$error.required){
                            $scope.showTips('请再次输入您的密码');
                        }else{
                            $scope.showTips('两次输入的密码不一致！');
                        }
                    }
                }
        };
        /*设置当前错误*/
        function setCurrentError(index){
            for(var o in $scope.error){
                $scope.error[o]=false;
            }
            $scope.error[index]=true;
        }
        /*清空当前错误*/
        function clearErrors(){
            for(var o in $scope.error){
                $scope.error[o]=false;
            }
        }
        /*清除某一个错误状态,取消错误提示*/
        $scope.clearError=function(index){
            $scope.error[index]=false;
            $scope.showTips('');
        };
});
