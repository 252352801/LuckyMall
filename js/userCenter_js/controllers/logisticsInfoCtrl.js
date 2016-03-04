angular.module('LuckyMall.controllers')
    .controller('LogisticsInfoCtrl',
    ['$scope', '$state', '$stateParams', 'LogisticsSer', 'OrderDetailsSer',
        function ($scope, $state, $stateParams, LogisticsSer, OrderDetailsSer) {
            $scope.loaded = false;
            $scope.order_id = $stateParams.order_id;
            $scope.order_type = $stateParams.order_type;
            loadData();
            function loadData() {
                $scope.loaded = false;
                OrderDetailsSer.requestData($scope.order_id, function (response, status) {
                    if (status == 1) {
                        $scope.loaded = true;
                        $scope.data_order = OrderDetailsSer.getData();
                        $scope.data_consignee = $scope.data_order.ConsigneeInfo;
                        $scope.data_logistics = $scope.data_order.LogisticsInfo;
                        $scope.$emit('changeMenu', $scope.data_order.OrderStatus);
                    }
                });
            }
        }]);
