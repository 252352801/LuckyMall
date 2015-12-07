angular.module('LuckyMall.controllers')
 .controller('SafeAccountCtrl',function($scope,$state,$stateParams,$timeout,UserSer){
        $scope.$emit('changeMenu',13);
        $scope.new_nickname=$scope.data_user.UserModel.NickName;
        $scope.nickName_editing=false;
       /* 显示“昵称”编辑框*/
        $scope.handleNickName=function(){
            if($scope.nickName_editing==false){
                $timeout(function(){
                    $scope.nickName_editing=true;
                },5)
            }else{
                /*提交更改操作*/
                UserSer.updateNickname($scope.new_nickname,function(response,status){
                    if(status&&response==true) {
                        $scope.$emit('user-update');
                        $timeout(function () {
                            $scope.nickName_editing = false;
                        })
                    }
                });
            }
        };
       /* 通知父级打开头像编辑框*/
        $scope.showMTXX=function(){
            $scope.$emit("showMTXX");
        };

});
