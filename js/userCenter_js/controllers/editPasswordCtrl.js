angular.module('LuckyMall.controllers')
 .controller('EditPasswordCtrl',function($scope,$state,$stateParams,LoginSer,EditPasswordSer,$timeout,$rootScope){
        $scope.$emit('changeMenu',13);
        initPostData();//初始化数据
        $scope.input_tips='';
        $scope.show_update_success=false;
        $scope.value_btn="确定";
       /* $scope*/
        /*修改密码*/

        $scope.updatePassword=function(){
            if($scope.form_ud_pw.$valid){
                if($scope.form_ud_pw.new_pw.$modelValue!=$scope.form_ud_pw.new_pw_rep.$modelValue){
                    $scope.input_tips='两次输入的密码不一致！';
                }else {
                    $timeout(function () {
                        $scope.input_tips = ''
                    }, 1);
                    var param = {
                        passwords: [$scope.old_pw, $scope.new_pw]
                    };
                    $scope.value_btn = "正在处理...";
                    EditPasswordSer.updatePassword(param, function (response, status) {
                        if (status == 1) {
                           /* $timeout(function () {
                                $scope.show_update_success = true;
                                $scope.return_time = 5;
                                countDownReturn();
                                $scope.value_btn = "确定";
                            });*/
                            swal({
                                title: "修改密码成功!",
                                text: '请您重新登陆！',
                                type: "success",
                                confirmButtonText: "确定"
                            });
                            $rootScope.login_target={
                              state:'UCIndex.safeAccount',
                              params:{}
                            };
                            $state.go('login');
                        } else {
                            swal({
                                title: "修改密码失败!",
                                text: '请确认您输入的旧密码是否正确！',
                                type: "error",
                                confirmButtonText: "确定"
                            });
                            $timeout(function () {
                                $scope.value_btn = "确定";
                            });
                        }
                    });
                }
            }else{
                if($scope.form_ud_pw.old_pw.$error.required){
                    $scope.input_tips='请输入您的旧密码！';
                }else if($scope.form_ud_pw.new_pw.$invalid){
                    if($scope.form_ud_pw.new_pw.$error.required){
                        $scope.input_tips='请输入您的新密码！';
                    }else{
                        $scope.input_tips='密码必须为8-24位字母与数字或下划线组合！';
                    }
                }else if($scope.form_ud_pw.new_pw_rep.$invalid){
                    if($scope.form_ud_pw.new_pw_rep.$error.required){
                        $scope.input_tips='请确认并再次输入您的新密码！';
                    }
                }
            }
        };

        /*返回*/
        $scope.returnOrg=function(){
            $state.go('UCIndex.safeAccount');
            $timeout(function() {
                $scope.show_update_success = false;
                initPostData();
            },5);
        };
       /* 初始化数据*/
        function initPostData(){
            $scope.old_pw='';
            $scope.new_pw='';
            $scope.new_pw_re='';
        }
        function countDownReturn(){
            $timeout(function(){
                if($scope.return_time>0){
                    $scope.return_time--;
                    countDownReturn();
                }else{
                    $state.go('UCIndex.safeAccount');
                    $scope.show_update_success=false;
                    initPostData();
                }
            },1000);
        }
});
