angular.module('LuckyMall.controllers')
 .controller('AdviceAndFeedbackCtrl',
    ['$scope','$state','$stateParams',
        function($scope,$state,$stateParams){
        $scope.$emit('changeMenu',12);
}]);
