angular.module('LuckyMall.controllers')
 .controller('HomeCtrl',function($scope,HomeSer,$cookies){
        if (HomeSer.getData().banner == null) {
            HomeSer.requestBannerData(function (response, status) {
                if (status == 1) {
                    $scope.data_banner = HomeSer.getData().banner;
                }
            });
        } else {
            $scope.data_banner = HomeSer.getData().banner;
        }
        if (HomeSer.getTodayData() == null) {
            $scope.loadingToday = true;
            HomeSer.requestTodayData(function () {
                $scope.loadingToday = false;
                $scope.data_todayList = HomeSer.getTodayData();
            });
        } else {
            $scope.loadingToday = false;
            $scope.data_todayList = HomeSer.getTodayData();
        }

        if(localStorage.getItem('access')){
            $scope.isFirstAcc=false;
        }else{
            $scope.isFirstAcc=true;
        }
        $scope.cancelGuide=function(){
            localStorage.setItem('access',true);
            $scope.isFirstAcc=false;
        };
});
