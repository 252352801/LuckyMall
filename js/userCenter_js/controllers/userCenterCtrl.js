angular.module('LuckyCat.controllers')
 .controller('UserCenterCtrl',function($scope,LoginSer,$state,$timeout){
    $scope.isMTXXShow=false;

    if(LoginSer.getData()!=null){//判断是否登陆
        $scope.data_user=LoginSer.getData();
        $scope.simpleMobile=hideSomeStr($scope.data_user.UserModel.Mobile,3,8,'*');
    }else{
        $scope.data_user=null;
        //$state.go('login');
    }
    $scope.$on('changeMenu',function(e,menu_index){
        $scope.curMenu=menu_index;
    });
    
    /*关闭美图秀秀*/
    $scope.closeMTXX=function(){
        $timeout(function(){
            $scope.isMTXXShow=false;
        },5);
    };
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    function hideSomeStr(str,start,end,replace_str){
        var sub_str=str.substring(start,end);
        var finally_str='';
        for(var i=0;i<(end-start);i++){
            finally_str+=replace_str;
        }
        return str.replace(sub_str,finally_str);
    }
});
