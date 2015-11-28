angular.module('LuckyCat.controllers')
    .controller('MessageDetailsCtrl', function ($scope, $state, $stateParams) {
        $scope.$emit('changeMenu', 14);
        $scope.msg_id=$stateParams.param.split('=')[1];
    });
