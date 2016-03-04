angular.module('LuckyMall.controllers')
    .controller('MyCouponCtrl',
    ['$scope', '$state', '$stateParams', 'CouponSer',
        function ($scope, $state, $stateParams, CouponSer) {
            $scope.$emit('changeMenu', 16);
            $scope.loading = false;
            $scope.page = {
                index: 0,
                pageSize: 6,
                totalCount: 0,
                totalPage: 0,
                items: []
            };
            loadData();

            $scope.currentPage = function () {
                if ($scope.data_coupon) {
                    return $scope.data_coupon.slice(($scope.page.index) * $scope.page.pageSize, ($scope.page.index + 1) * $scope.page.pageSize);
                } else {
                    return [];
                }
            };

            $scope.createPage = function () {
                $scope.page.index = 0;
                $scope.page.totalCount = $scope.data_coupon.length;
                $scope.page.totalPage = Math.ceil($scope.page.totalCount / $scope.page.pageSize);
                for (var i = 0; i < $scope.page.totalPage; i++) {
                    $scope.page.items.push(i);
                }
            };
            $scope.prevPage = function () {
                if ($scope.page.index > 0) {
                    $scope.page.index--;
                }
            };
            $scope.nextPage = function () {
                if ($scope.page.index < $scope.page.totalPage - 1) {
                    $scope.page.index++;
                }
            };
            $scope.changePage = function (index) {
                $scope.page.index = index;
            };
            function loadData() {
                var params = {
                    "PageIndex": 0,
                    "PageSize": 10000,
                    "TotalSize": 10000,
                    "TotalPage": 1
                };
                $scope.loading = true;
                CouponSer.requestData(params, function (resp, status) {
                    if (status == 1) {
                        $scope.data_coupon = CouponSer.getData();
                        $scope.balance = CouponSer.getTotalBalance();
                        $scope.createPage();
                    }
                    $scope.loading = false;
                });
            }

        }]);
