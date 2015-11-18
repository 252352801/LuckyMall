angular.module('LuckyCat.controllers')
 .controller('HelpCenterCtrl',function($scope,$state,$stateParams){
        $scope.$emit('changeMenu',10);
});
