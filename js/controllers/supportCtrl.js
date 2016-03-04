angular.module('LuckyMall.controllers')
    .controller('SupportCtrl',
    ['$scope', '$state', '$stateParams',
        function ($scope, $state, $stateParams) {
            $scope.cur_url = $state.current.url;
            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $scope.cur_url = toState.url;
            });
            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                $scope.cur_state_name = toState.title.split('-')[0];
            });
            $scope.answer = [false, false, false, false, false, false, false, false];
            $scope.toggleAnswer = function (index) {
                $scope.answer[index] = !$scope.answer[index];
            };

        }]);
