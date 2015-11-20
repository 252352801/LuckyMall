angular.module('LuckyCat.controllers')
 .controller('SafeAccountCtrl',function($scope,$state,$stateParams,$timeout){
        $scope.$emit('changeMenu',13);
        $scope.nickName_editing=false;
       /* 显示“昵称”编辑框*/
        $scope.handleNickName=function(){
            if($scope.nickName_editing==false){
                $timeout(function(){
                    $scope.nickName_editing=true;
                },5)
            }else{
                /*提交更改操作*/
                $timeout(function(){
                    $scope.nickName_editing=false;
                },5)
            }
        };
       /* 通知父级打开头像编辑框*/
        $scope.showMTXX=function(){
            $scope.$emit("showMTXX");
        };
});
