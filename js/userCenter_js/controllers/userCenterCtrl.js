angular.module('LuckyMall.controllers')
 .controller('UserCenterCtrl',function($scope,LoginSer,$state,$timeout,UserSer){
    $scope.isMTXXShow=false;
    $scope.e_val=LoginSer.getData().UserModel.LuckyEnergy.PaidValue;//幸运能量
    if(LoginSer.getData()!=null){//判断是否登陆
        $scope.data_user=UserSer.getData();
        $scope.simpleMobile=hideSomeStr($scope.data_user.UserModel.Mobile,3,8,'*');
    }else{
        $scope.data_user=null;
        return;
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
        /*监听打开头像编辑*/
     $scope.$on("showMTXX",function(){
         $scope.openMTXX();
     });
       /* 打开头像编辑*/
      $scope.openMTXX=function(){
          $timeout(function(){
              $scope.isMTXXShow=true;
          });
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
