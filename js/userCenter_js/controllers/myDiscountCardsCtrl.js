angular.module('LuckyCat.controllers')
 .controller('MyDiscountCardsCtrl',function($scope,$state,$stateParams,DiscountCardSer){
        $scope.$emit('changeMenu',7);
        $scope.card_status=$stateParams.params.split('=')[1];
        loadData();
        /*加载数据*/
        function loadData(){
            DiscountCardSer.requestData(function(resp,status){
                if(status==1){
                    $scope.data_card=DiscountCardSer.getData();
                }
            })
        }
});
