angular.module('LuckyMall.controllers')
 .controller('MyChallengeCardsCtrl',function($scope,ActivitySer){
        $scope.$emit('changeMenu',15);
        $scope.loading=false;
        $scope.data_clg_cards=0;
        ActivitySer.getArenaTickets(function(response,status) {
            if (status == 200) {
                $scope.data_clg_cards=response;
            }
        });
});
