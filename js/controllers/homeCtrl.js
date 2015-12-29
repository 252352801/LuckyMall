angular.module('LuckyMall.controllers')
 .controller('HomeCtrl',function($scope,HomeSer){
        if (HomeSer.getData().banner == null) {
            HomeSer.requestBannerData(function (response, status) {
                if (status == 1) {
                    $scope.data_banner = HomeSer.getData().banner;
                    $scope.$broadcast('bannerReady');
                }
                $scope.bannerReady = true;
            });
        } else {
            $scope.data_banner = HomeSer.getData().banner;
            $scope.$broadcast('bannerReady');
            $scope.bannerReady = true;
        }
        if (HomeSer.getTodayData() == null) {
            $scope.loadingToday = true;
            HomeSer.requestTodayData(function () {
                $scope.loadingToday = false;
                $scope.data_todayList = HomeSer.getTodayData();
                $scope.ready = true;
            });
        } else {
            $scope.loadingToday = false;
            $scope.data_todayList = HomeSer.getTodayData();
        }
});
