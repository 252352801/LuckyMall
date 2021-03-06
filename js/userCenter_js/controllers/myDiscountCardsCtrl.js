angular.module('LuckyMall.controllers')
    .controller('MyDiscountCardsCtrl',
    ['$scope', '$state', '$stateParams', 'DiscountCardSer',
        function ($scope, $state, $stateParams, DiscountCardSer) {
            $scope.$emit('changeMenu', 7);
            $scope.card_status = $stateParams.params.split('=')[1];
            $scope.showLoading = false;
            loadData();
            /*加载数据*/
            function loadData() {
                if (DiscountCardSer.getData() == null) {
                    $scope.showLoading = true;
                    DiscountCardSer.requestData(function (resp, status) {
                        if (status == 1) {
                            $scope.data_card = DiscountCardSer.getData();
                            console.log($scope.data_card);
                        }
                        $scope.showLoading = false;
                    })
                } else {
                    $scope.data_card = DiscountCardSer.getData();
                }
            }
        }]);
