angular.module('LuckyMall.controllers')

    .controller('RegisterCtrl',
    ['$rootScope', '$scope', 'VerifyCodeSer', '$timeout', 'RegisterSer', '$state', 'LoginSer', '$cookies','Host','$http',
        function ($rootScope, $scope, VerifyCodeSer, $timeout, RegisterSer, $state, LoginSer, $cookies,Host,$http) {
            $scope.hasInputError = false;//是否有错误输入
            $scope.tips = '';//提示信息初始化
            $scope.value_btn = '立即注册';
            $scope.isModalProtocolShow = false;
            $scope.invalidMobile = new Array();
            $scope.s_key = '';//会话密钥
            $scope.captchaCode = '';
            $scope.img_code='XXXX';
            $scope.shareCode='';
            $scope.error = {//注册时的错误对象
                mobile: false,
                imgCode: false,
                code: false,
                password: false,
                repPassword: false,
                response:false
            };
            var lock_cc = true;//获取图片验证码的锁,防止疯狂点击

            RegisterSer.getSessionKey(function (response, status) {
                if (status == 1) {
                    //console.log('会话密钥：'+response);
                    $scope.s_key = response;
                    $scope.getCaptchaCode();
                }
            });

            $scope.getCaptchaCode = function () {
                if (lock_cc) {
                    lock_cc = false;
                    RegisterSer.getCaptchaCode(function (response, status) {
                        if (status == 1) {
                            $scope.captchaCode = response;
                        }
                        lock_cc = true;
                    });
                } else {
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
            /*设置当前错误*/
            function setCurrentError(index) {
                for (var o in $scope.error) {
                    $scope.error[o] = false;
                }
                $scope.error[index] = true;
            }

            /*清空当前错误*/
            function clearErrors() {
                for (var o in $scope.error) {
                    $scope.error[o] = false;
                }
            }

            /*清除某一个错误状态,取消错误提示*/
            $scope.clearError = function (index) {
                $scope.error['response'] = false;
                $scope.error[index] = false;
                $scope.showTips('');
            };
            /*获取手机验证码*/
            $scope.getVerifyCode = function (mobile_num) {
                if (mobile_num == ('' || undefined)) {
                    setCurrentError('mobile');
                    $scope.showTips('请先正确输入接收验证码的手机号喔！');
                } else {
                    if ($scope.isValid($scope.mobile)) {
                        VerifyCodeSer.getVerifyCode(mobile_num,$scope.s_key,$scope.img_code, function (response, status) {
                            if (status == 1) {
                                //$scope.verify_code = response;
                                var resp = angular.fromJson(response);
                                if (resp.code == '104') {
                                    setCurrentError('imgCode');
                                    $scope.showTips('图形验证码错误！');
                                    $scope.getCaptchaCode();
                                } else if (resp.code == 22) {
                                    $scope.showTips('每个手机每小时最多能获取3次短信验证码！');
                                }
                            }
                        });
                    } else {
                        setCurrentError('mobile');
                        $scope.showTips('手机号' + $scope.mobile + '已注册！');
                        return false;
                    }
                }
            };


            $scope.showProtocol = function () {
                $scope.isModalProtocolShow = true;
            };
            $scope.hideProtocol = function () {
                $scope.isModalProtocolShow = false;
            };
            /* 检测手机号码是否可用*/
            $scope.isMobileCanRegister = function () {
                if ($scope.form_register.mobile.$valid) {
                    var mb = $scope.mobile;
                    if (!$scope.isValid(mb)) {
                        setCurrentError('mobile');
                        $scope.showTips('手机号' + mb + '已注册！');
                    } else {
                        RegisterSer.isSignUp(mb, function (response) {
                            if (response == false) {
                                $scope.invalidMobile.push(mb);
                                setCurrentError('mobile');
                                $scope.showTips('手机号' + mb + '已注册！');
                            } else {
                                $scope.showTips('');
                            }
                        });
                    }
                }
            };
            /* 注册提交*/
            $scope.submitRegister = function () {


                if ($scope.form_register.$valid && $scope.form_register.re_password.$modelValue == $scope.form_register.password.$modelValue) {
                    clearErrors();
                    if ($scope.isValid($scope.mobile)) {
                        $scope.showTips('');
                        $scope.value_btn = '正在提交...';
                        RegisterSer.register({
                            "Name": $scope.mobile,
                            "PhoneNumber": $scope.mobile,
                            "Password": $scope.password,
                            "Code": $scope.code,
                            "ShareCode": $scope.shareCode
                        }, function (response, status) {  //回调函数
                            if (status == 1) {
                                if(response.Code==0) {
                                    $scope.$emit('refresh-coupon');
                                    ga('send', 'pageview', {
                                        'page': '/register_success',
                                        'title': '注册成功!'
                                    });
                                    $rootScope.woopra.track($rootScope.woopra.evet.RG);
                                    LoginSer.setData(response.Data);
                                    $cookies.put('Token', response.Data.Token); //设置token cookie
                                    $http.defaults.headers.common.Authorization = 'Basic ' + $cookies.get('Token');//设置请求头
                                    $rootScope.$broadcast("user-login");
                                    $rootScope.isLogin = true;
                                    swal({
                                            title: "注册成功！",
                                            text: "您获得了一个抢红包的机会，是否马上开抢？",
                                            type: "success",
                                            showCancelButton: true,
                                            confirmButtonColor: "#DD6B55",
                                            cancelButtonText: '下次再说',
                                            confirmButtonText: "立即抢红包",
                                            closeOnConfirm: true,
                                            showLoaderOnConfirm: true
                                        },
                                        function () {
                                            $timeout(function(){
                                                var g_url = Host.game.fishing + '?id=0&mode=5&from=' + Host.playFrom + '&authorization=' +response.Data.Token; //设置游戏地址
                                                $rootScope.openGame(g_url,'','');
                                            },10);
                                        }
                                    );
                                    $state.go('home');
                                }else{
                                    setCurrentError('response');
                                    $scope.showTips(response.Msg);
                                }
                            } else {
                                swal({
                                    title: "注册失败！",
                                    text:'请检查您的网络设置',
                                    type: "error",
                                    confirmButtonText: "确定"
                                });
                            }
                            $scope.value_btn = '立即注册';
                        });
                    } else {
                        setCurrentError('mobile');
                        $scope.showTips('手机号' + $scope.mobile + '已注册！');
                    }
                } else {
                    if ($scope.form_register.mobile.$invalid) {
                        setCurrentError('mobile');
                        if ($scope.form_register.mobile.$error.required) {
                            $scope.showTips('请输入手机号！');
                        } else {
                            $scope.showTips('请正确输入手机号！');
                        }
                    } else if (!$scope.isValid($scope.mobile)) {
                        setCurrentError('mobile');
                        $scope.showTips('手机号' + $scope.mobile + '已注册！');
                    }
                    else if ($scope.form_register.code.$invalid) {
                        setCurrentError('code');
                        if ($scope.form_register.code.$error.required) {
                            $scope.showTips('请输入短信验证码！');
                        } else {
                            $scope.showTips('您输入的短信验证码有误！');
                            $scope.getCaptchaCode();
                        }
                    } else if ($scope.form_register.password.$invalid) {
                        setCurrentError('password');
                        if ($scope.form_register.password.$error.required) {
                            $scope.showTips('请设置您的账号密码！');
                        } else {
                            $scope.showTips('密码必须为6-24位字符（区分大小写）！');
                        }
                    } else if ($scope.form_register.re_password.$modelValue != $scope.form_register.password.$modelValue) {
                        setCurrentError('repPassword');
                        if ($scope.form_register.re_password.$error.required) {
                            $scope.showTips('请再次输入您的密码');
                        } else {
                            $scope.showTips('两次输入的密码不一致！');
                        }
                    }
                }
            };
            /*检查手机号码是否已经在已注册的列表里（本地维护的一个数组）*/
            $scope.isValid = function (mb_num) {
                for (var o in $scope.invalidMobile) {
                    if (mb_num == $scope.invalidMobile[o]) {
                        return false;
                    }
                }
                return true;
            };
        }])
