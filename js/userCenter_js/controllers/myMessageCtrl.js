angular.module('LuckyCat.controllers')
 .controller('MyMessageCtrl',function($scope,$state,$stateParams){
        $scope.$emit('changeMenu',14);
});
