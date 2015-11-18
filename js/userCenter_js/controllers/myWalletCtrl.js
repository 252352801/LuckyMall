angular.module('LuckyCat.controllers')
 .controller('MyWalletCtrl',function($scope,$state,$stateParams){
        $scope.$emit('changeMenu',6);
});
