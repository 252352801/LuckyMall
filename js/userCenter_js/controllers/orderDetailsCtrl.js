angular.module('LuckyMall.controllers')
    .controller('OrderDetailsCtrl',
    ['$scope', '$state', '$stateParams', 'OrderDetailsSer',
        function ($scope, $state, $stateParams, OrderDetailsSer) {
            $scope.order_id = $stateParams.order_id;
            $scope.file_count = 1;
            $scope.showLoading = false;
            loadData();


            function loadData() {
                OrderDetailsSer.requestData($scope.order_id, function (response, status) {
                    if (status == 1) {
                        $scope.data_order = OrderDetailsSer.getData();
                        $scope.data_consignee = $scope.data_order.ConsigneeInfo;
                        $scope.data_logistics = $scope.data_order.LogisticsInfo;
                        //console.log($scope.data_logistics);
                        $scope.$emit('changeMenu', $scope.data_order.OrderStatus);
                    }
                });
            }

            $scope.MathCeilPrice = function (val) {
                return Math.ceil(val);
            };

        }]);
