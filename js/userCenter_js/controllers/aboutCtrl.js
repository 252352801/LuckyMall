angular.module('LuckyMall.controllers')
 .controller('AboutCtrl',
    ['$scope','$state','$stateParams',
        function($scope,$state,$stateParams){
        $scope.$emit('changeMenu',11);
}]);
