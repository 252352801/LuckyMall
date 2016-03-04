angular.module('LuckyMall.controllers')
    .controller('GuideCtrl',
    ['$scope',
        function ($scope) {
        localStorage.setItem('access',true);
        $scope.isFirstAcc=false;
    }]);
