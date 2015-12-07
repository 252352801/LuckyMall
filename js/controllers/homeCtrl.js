angular.module('LuckyMall.controllers')
 .controller('HomeCtrl',function($scope,HomeSer,CategorySer){
    $scope.loadingToday=true;
    if(CategorySer.getData()==null){
        CategorySer.requestData(function(){
            $scope.data_category= CategorySer.getData();
        });
    }else{
        $scope.data_category= CategorySer.getData();
    }
     HomeSer.requestBannerData(function(response,status){
         if(status==1){
             $scope.data_banner=HomeSer.getData().banner;
             $scope.bannerReady=true;
             $scope.$broadcast('bannerReady');
         }else{
             $scope.bannerReady=true;
         }
     });
    HomeSer.requestTodayData(function(){
       $scope.loadingToday=false;
       $scope.data_todayList=HomeSer.getTodayData();
       $scope.ready=true;
    });
});
