angular.module('LuckyMall.controllers')
 .controller('MyWalletCtrl',
    ['$scope','$state','$stateParams','WalletSer',
        function($scope,$state,$stateParams,WalletSer){
        $scope.$emit('changeMenu',6);
        
        if(WalletSer.getData()==null){
            WalletSer.requestData(function(resp,status){
                if(status==1){
                    $scope.data_wallet=WalletSer.getData();
                }
            });
        }else{
             $scope.data_wallet=WalletSer.getData();
        }
         
}]);
