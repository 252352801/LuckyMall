angular.module('LuckyCat.controllers')
 .controller('AboutCtrl',function($scope,$state,$stateParams){
        $scope.$emit('changeMenu',11);
});
