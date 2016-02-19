angular.module('LuckyMall.controllers')
    .controller('GuideCtrl', function ($scope) {
        localStorage.setItem('access',true);
        $scope.isFirstAcc=false;
    });
