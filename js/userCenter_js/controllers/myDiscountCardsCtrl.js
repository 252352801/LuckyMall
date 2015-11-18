angular.module('LuckyCat.controllers')
 .controller('MyDiscountCardsCtrl',function($scope,$state,$stateParams){
        $scope.$emit('changeMenu',7);
});
