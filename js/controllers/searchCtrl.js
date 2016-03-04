angular.module('LuckyMall.controllers')
    .controller('SearchCtrl',
    ['$rootScope', '$scope', '$stateParams', 'SearchSer', '$timeout', '$state',
        function ($rootScope, $scope, $stateParams, SearchSer, $timeout, $state) {

            {//init
                $scope.params_sort = {
                    price: -1//价格排序 -1未排序  0升序 1降序
                };
                $scope.isShowModalWishing = false;//是否显示愿望框
                $scope.btn_val = {
                    submitWishing: '提交'
                };
                $scope.wishingUrl = '';//提交愿望的链接
                $scope.loaded = true;
                $scope.kw = $stateParams.keyword;
                $scope.page = {
                    index: 0,//当前页
                    pageSize: 40,//每页大小
                    total: 0,//总条数
                    totalPage: 0,//总页数
                    pageItems: []
                }

            }
            /*===============init end===================*/
            /**
             * 价格排序
             * @param {int} type -1未排序 0升序 1降序
             */
            $scope.sortWidthPrice = function (type) {
                if (type != undefined) {
                    $scope.params_sort.price = type;
                } else {
                    if ($scope.params_sort.price == 1) {
                        $scope.params_sort.price = 0;
                    } else {
                        $scope.params_sort.price = 1;
                    }
                }

                if ($scope.params_sort.price == 0) {
                    $scope.data_allItems = SearchSer.sortByPriceUp($scope.data_allItems);
                } else if ($scope.params_sort.price == 1) {
                    $scope.data_allItems = SearchSer.sortByPriceDown($scope.data_allItems);
                }
                $scope.page.index = 0;//设置默认页
                $scope.data_items = getCurrentPage($scope.data_allItems);//取当前页
            };
            $scope.search = function () {
                var params = {
                    "key": $scope.kw,
                    psize: 10000,
                    pindex: 0

                };
                $scope.loaded = false;
                SearchSer.searchCommodities(params, function (response, status) {
                    $scope.loaded = true;
                    $scope.data_allItems = response;//所有搜索结果
                    $scope.page.total = response.length;//设置总条数
                    $scope.page.totalPage = Math.ceil($scope.page.total / $scope.page.pageSize);//设置总页数
                    $scope.page.index = 0;//设置默认页
                    $scope.data_items = getCurrentPage(response);//取当前页
                    createPage($scope.data_allItems);
                });

            };
            $scope.search();


            $scope.prevPage = function () {
                if ($scope.page.index > 0) {
                    $scope.page.index--;
                    $scope.data_items = getCurrentPage($scope.data_allItems);
                }
            };
            $scope.nextPage = function () {
                if ($scope.page.index < $scope.page.totalPage - 1) {
                    $scope.page.index++;
                    $scope.data_items = getCurrentPage($scope.data_allItems);
                }
            };
            $scope.changePage = function (index) {
                $scope.page.index = index;
                $scope.data_items = getCurrentPage($scope.data_allItems);
            };

            $scope.showModalWishing = function () {
                $scope.isShowModalWishing = true;
            };
            $scope.hideModalWishing = function () {
                $scope.isShowModalWishing = false;
                $scope.wishingUrl = '';
                $scope.btn_val.submitWishing = '提交';
            };
            $scope.submitWishing = function () {
                if ($rootScope.isLogin) {
                    if ($scope.wishingUrl != '') {
                        $scope.btn_val.submitWishing = '正在提交...';
                        var params = {
                            Id: 0,
                            UserId: 0,
                            BrandName: '',
                            CommodityName: '',
                            Remark: $scope.wishingUrl,
                            CreateTime: ''
                        }
                        SearchSer.submitWishing(params, function (response, status) {
                            if (status == 200 && response) {
                                swal('您的愿望已提交！', '', 'success');
                            } else {
                                swal('提交失败，请重试！', '', 'error');
                            }
                            $scope.hideModalWishing();
                        });
                    }
                } else {
                    $scope.$emit("show-login-modal");
                }
            };
            function createPage(_data) {
                $scope.page.pageItems = [];//用于创建页码
                var len = _data.length > 0 ? Math.ceil(_data.length / $scope.page.pageSize) : 1;
                for (var i = 0; i < len; i++) {
                    $scope.page.pageItems.push(i);
                }
                //console.log($scope.page);
            }

            function getCurrentPage(arr) {
                return arr.slice($scope.page.index * $scope.page.pageSize, ($scope.page.index + 1) * $scope.page.pageSize);
            }

        }]);
