angular.module('LuckyCat.controllers')
 .controller('HomeCtrl',function($scope,HomeSer,CategorySer){
    $scope.loadingToday=true;
    if(CategorySer.getData()==null){
        CategorySer.requestData(function(){
            $scope.data_category= CategorySer.getData();
        });
    }else{
        $scope.data_category= CategorySer.getData();
    }
     HomeSer.requestBannerData(function(){
         $scope.data_banner=HomeSer.getData().banner;
         $scope.bannerReady=true;
         $scope.$broadcast('bannerReady');
     });
    HomeSer.requestTodayData(function(){
       $scope.loadingToday=false;
       $scope.data_todayList=HomeSer.getTodayData();
       $scope.ready=true;
    });
});
