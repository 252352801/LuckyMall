angular.module('LuckyMall.controllers')
    .controller('HelpCenterCtrl',
    ['$scope', '$state', '$stateParams',
        function ($scope, $state, $stateParams) {
            $scope.$emit('changeMenu', 10);
        }]);
