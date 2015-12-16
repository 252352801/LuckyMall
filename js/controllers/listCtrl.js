angular.module('LuckyMall.controllers')
    .controller('ListCtrl', function ($scope, $stateParams, FilterSer, CategorySer, $timeout, ListSer, $state) {
        $scope.cate_id=$stateParams.category.split('=')[1];
        var pageSize = 16;//每页大小（个数）
        initParams();
        function initParams(){
            var collect_ft = new Array();
            if($stateParams.filters) {
                var filters = $stateParams.filters.split(';');
                for (var o in filters) {
                    var filter = {
                        filterId: filters[o].split('_')[0].split('=')[1],
                        type: filters[o].split('_')[1],//0单选  1 多选
                        items: filters[o].split('_')[2].split('=')[1].split(',')
                    };
                    collect_ft.push(filter);
                }
            }
            $scope.params={
                categoryId:$stateParams.category.split('=')[1],
                filters:collect_ft,
                getItems:function(){
                    var items=new Array();
                    if(this.filters.length>0) {
                        for (var o in this.filters) {
                            items = items.concat(this.filters[o].items);
                        }
                    }
                    return items;
                }
            };
        }
      console.log('已选筛选项：'+$scope.params.getItems());
        if (CategorySer.getData()== null) {
            /*如果分类数据为空则请求数据*/
            CategorySer.requestData(function () {//请求成功后的回调
                FilterSer.setCategoryData(CategorySer.getCategoryById($scope.params.categoryId));
                initData();//初始化数据
            });
        } else {
            FilterSer.setCategoryData(CategorySer.getCategoryById($scope.params.categoryId));
            initData();
        }
        /*选择筛选项*/
        $scope.select = function (filter_id,item_id) {
            FilterSer.addSelection(filter_id,item_id);
            goListPage();
        };

        /*多选提交搜索*/
        $scope.multiSearch=function(filter){
            var has_change=false;
            for(var o in filter.FilterItemModels){
                if(filter.FilterItemModels[o].isMultiSelected==true){
                    has_change=true;
                    break;
                }
            }
            if(has_change) {
                FilterSer.closeMultiSelect(filter.Id);
                FilterSer.addMultiSelection(filter.Id);
                goListPage();
            }else{
                FilterSer.closeMultiSelect(filter.Id);
                FilterSer. resetMultiSelection(filter.Id);
            }
        };

        /*多选框开关*/
        $scope.toggleMultiSelect=function(filter_id){
            FilterSer.toggleMultiSelect(filter_id);
        };
       /* 关闭复选框*/
        $scope.closeMultiSelect=function(filter_id){
            FilterSer.closeMultiSelect(filter_id);
            FilterSer. resetMultiSelection(filter_id);
        };
        /*勾选与取消勾选*/
        $scope.multiSelect=function(filter_id,item_id){
            FilterSer.multiSelect(filter_id,item_id);
        };

        /*取消选择*/
        $scope.removeChoice = function (filter_id) {
            FilterSer.removeSelection(filter_id);
            goListPage();
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
            goListPage();
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

       /* 已选的多选项显示格式化*/
        $scope.formatMultiChoice=function(filter){
            var str=filter.FilterName+'：';
            var org_str=str;
            for(var o in filter.FilterItemModels){
                if(filter.FilterItemModels[o].isMultiSelected==true){
                    if(str!=org_str) {
                        str+=',';
                    }
                    str += filter.FilterItemModels[o].ItemValue;
                }
            }
            return str;
        };

        /*初始化数据*/
        function initData() {
            $scope.showLoading = false;
            FilterSer.setSelectData($scope.params);
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
                category: $scope.params.categoryId,
                items: $scope.params.getItems(),
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

        /*前往list页面*/
        function goListPage(){
            var obj=FilterSer.getSelectData();
            var params_filter='';
            for(var o in obj.filters){
            /*    alert(obj.filters[o].items.toString());*/
                params_filter+='filter='+obj.filters[o].filterId+'_'+obj.filters[o].type+'_items='+obj.filters[o].items.toString();
                if(o<obj.filters.length-1){
                    params_filter+=';';
                }
            }
            $state.go('list',{
                category:'category='+obj.categoryId,
                filters:params_filter
            });
        }
    });
