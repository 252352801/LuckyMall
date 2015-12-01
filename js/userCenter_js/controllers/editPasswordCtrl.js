angular.module('LuckyCat.controllers')
 .controller('EditPasswordCtrl',function($scope,$state,$stateParams,LoginSer,EditPasswordSer,$timeout){
        $scope.$emit('changeMenu',13);
        initPostData();//初始化数据
        $scope.input_tips='';
        $scope.show_update_success=false;
        $scope.value_btn="确定";
       /* $scope*/
        /*修改密码*/
        $scope.updatePassword=function(){
            if($scope.old_pw==''){
                $timeout(function(){$scope.input_tips='请输入您的旧密码！'},5);
            }else{
                if($scope.new_pw==''){
                    $timeout(function(){$scope.input_tips='请输入新密码！'},5);
                }else{
                    if($scope.new_pw_re==''){
                        $timeout(function(){$scope.input_tips='请再次输入新密码！'},5);
                    }else{
                        if($scope.new_pw_re!=$scope.new_pw){
                            $timeout(function(){ $scope.input_tips='两次输入的密码不一致！'},5);
                        }else{
                            $timeout(function(){$scope.input_tips=''},1);
                            var param={
                                passwords:[$scope.old_pw,$scope.new_pw]
                            };
                            $scope.value_btn="正在处理...";
                            EditPasswordSer.updatePassword(param,function(response,status){
                                if(status==1){
                                    $timeout(function(){
                                        $scope.show_update_success=true;
                                        $scope.return_time=5;
                                        countDownReturn();
                                        $scope.value_btn="确定";
                                    });
                                }else{
                                    swal({
                                        title: "修改密码失败!",
                                        text:'您输入的旧密码有误！',
                                        type: "error",
                                        confirmButtonText: "确定"
                                    });
                                    $timeout(function(){
                                        $scope.value_btn="确定";
                                    });
                                }
                            });
                        }
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
