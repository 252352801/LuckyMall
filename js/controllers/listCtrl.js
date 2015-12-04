angular.module('LuckyCat.controllers')
    .controller('ListCtrl', function ($scope, $stateParams, FilterSer, CategorySer, $timeout, ListSer, $state) {
        var pageSize = 16;//每页大小（个数）
        var params = new initSearchItems($stateParams.params);
        $scope.cate_id = params.category;
        $scope.items_id = params.items;//筛选项id
        if (FilterSer.getCategoryData() == null) {
            /*如果分类数据为空则请求数据*/
            CategorySer.requestData(function () {//请求成功后的回调
                FilterSer.setCategoryData(CategorySer.getCategoryById(params.category));
                initData();//初始化数据
            });
        } else {
            initData();
        }
        /*选择筛选项*/
        $scope.select = function (item_id) {
            FilterSer.addSelection(item_id);
            $state.go('list', {params: setUrlParams()});
        };

        /*多选提交搜索*/
        $scope.multiSearch=function(filter_id){
            FilterSer.cancelMultiSelect(filter_id);
            FilterSer.addMultiSelection(filter_id);
            $state.go('list', {params: setUrlParams()});
        };

        /*多选框开关*/
        $scope.toggleMultiSelect=function(filter_id){
            FilterSer.toggleMultiSelect(filter_id);
        };
       /* 关闭复选框*/
        $scope.closeMultiSelect=function(filter_id){
            FilterSer.cancelMultiSelect(filter_id);
            FilterSer. resetMultiSelection(filter_id)
        };

        /*勾选与取消勾选*/
        $scope.multiSelect=function(filter_id,item_id){
            FilterSer.multiSelect(filter_id,item_id);
        };

        /*取消选择*/
        $scope.cancelSelect = function (id) {
            FilterSer.removeSelection(id);
            $state.go('list', {params: setUrlParams()});
        };
        /*是否有被选的选项*/
        $scope.hasSelectedItem = function (res) {
            for (var o in res) {
                if (res[o].isSelected == true) {
                    return true;
                }
            }
            return false;
        };
       /*重置该选项*/
        $scope.resetFilter=function(filter_id){
           FilterSer.resetFilter(filter_id);
            $state.go('list', {params: setUrlParams()});
        };

        /*判断是否已多选*/
        $scope.isMultiSelected=function(choice){
            for(var o in choice.FilterItemModels){
                if(choice.FilterItemModels[o].isMultiSelected){
                    return true;
                }
            }
            return false;
        };
        $scope.pageIndex = 1;//当前页
        /*前一页*/
        $scope.prevPage = function () {
            if ($scope.pageIndex > 1) {
                $scope.pageIndex--;
                $scope.data_list = ListSer.getData().slice(($scope.pageIndex - 1) * pageSize, $scope.pageIndex * pageSize);//从返回的数据数组中取当前页的数据
            }
        };
        /*下一页*/
        $scope.nextPage = function () {
            if ($scope.pageIndex >= $scope.totalPage) return;
            $scope.pageIndex++;
            $scope.data_list = ListSer.getData().slice(($scope.pageIndex - 1) * pageSize, $scope.pageIndex * pageSize);
        };
        /*翻页*/
        $scope.changePage = function (index) {
            $scope.pageIndex = index;
            $scope.data_list = ListSer.getData().slice(($scope.pageIndex - 1) * pageSize, $scope.pageIndex * pageSize);//从返回的数据数组中取当前页的数据
        };
        /*价格排序*/
        $scope.searchWidthPrice = function (price_sort) {
            if (price_sort) {
                $scope.sortByPrice = price_sort;
            } else {
                $scope.sortByPrice = !$scope.sortByPrice;
            }
            search({sort_price: $scope.sortByPrice});
        };
        /*初始化搜索条件*/
        function initSearchItems(str) {
            var arr = str.split('_');
            var items = arr.slice(1);
            for (var i = 0, len = items.length; i < len; i++) {
                items[i] = items[i].split('=')[1];
            }
            this.category = arr[0].split('=')[1];
            this.items = items;
            console.log(angular.toJson(items));
        }

        /*初始化数据*/
        function initData() {
            $scope.showLoading = false;
            var data = {
                category: params.category,
                items: params.items
            };
            FilterSer.setSelectData(data);
            FilterSer.clearSelect();
            FilterSer.select();
            $scope.data_filter = FilterSer.getCategoryData();
            $scope.sortByPrice = true;//价格排序方式 true:升序,false:降序
            search({sort_price: $scope.sortByPrice});//搜索数据
        }

        /*搜索*/
        function search(params) {
            $scope.data_list = null;
            $scope.showLoading = true;
            FilterSer.search({
                sortByPrice: params.sort_price,//价格默认排序：从低到高
                category: $scope.cate_id,
                items: $scope.items_id,
                callback: function (new_data) {
                    ListSer.setData(new_data);//把请求道的搜索结果存到ListSer服务
                    var data = ListSer.getData();
                    $scope.pageIndex = 1;//当前页
                    $scope.data_list = data.slice(($scope.pageIndex - 1) * pageSize, $scope.pageIndex * pageSize);//当前显示数据
                    $scope.totalAmount = data.length;//商品总数
                    var total_page = Math.ceil($scope.totalAmount / pageSize);
                    $scope.totalPage = (total_page <= 0) ? 1 : total_page;
                    createPage(data);//创建页码数组
                    $scope.showLoading = false;
                }
            });
        }

        function createPage(_data) {
            $scope.page = [];//用于创建页码
            var len = _data.length > 0 ? Math.ceil(_data.length / pageSize) : 1;
            for (var i = 0; i < len; i++) {
                $scope.page.push(i);
            }
        }

        /*构建url的参数*/
        function setUrlParams() {
            var result = 'category=' + params.category;
            var _items = FilterSer.getSelectData().items;
            for (var o in _items) {
                    result += '_item=' + _items[o];
            }
            return result;
        }
    });
