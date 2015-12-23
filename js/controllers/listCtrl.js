angular.module('LuckyMall.controllers')
    .controller('ListCtrl', function ($scope, $stateParams, FilterSer, CategorySer, $timeout, ListSer, $state) {
        /*执行流程：
         *1.从url中取参数，存到$scope.params；------initParams()
         *2.获取品类、品牌数据,重置FilterSer里相关数据的状态
         *3.将品类、品牌数据存到FilterSer,并根据数据设置勾选状态FilterSer.select()  -------initData()
         *4.从$scope.params中获取请求参数，执行搜索操作------------------------search()
         *5.单选或多选时，根据FilterSer中数据构建URL，重新进入该页面 -------goListPage();
        */


        $scope.cate=$stateParams.category.split('=')[1];
        if($scope.cate.split('_').length==1){
            $scope.cate_id=$scope.cate;
        }else{
            $scope.cate_id=$scope.cate.split('_')[0];
            $scope.cate_sub_id=$scope.cate.split('_')[1];
        }
        $scope.price_order=false;//价格排序方式  false:从小到大   true:从大到小
        $scope.showAllBrands=false;//显示所有品牌
        $scope.showBMSBox=false;//品牌多选框是否显示
        var pageSize = 16;//每页大小（个数）
        initParams();
        testCategory();
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
            if($stateParams.brands!=0){
                $scope.brandParams={
                    isMultiSelected:($stateParams.brands.split('=')[1].split('_')[0]==1)?true:false,
                    items:$stateParams.brands.split('=')[1].split('_')[1].split(',')
                };
            }else{
                $scope.brandParams={
                    isMultiSelected:false,
                    items:[]
                }
            }
            $scope.params={
                categoryId:$scope.cate_id,
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

        /*获取品牌集合*/
        function loadBrands(cate_id,callback){
            ListSer.requestBrandsData(cate_id, function (response, status) {
                if (status == 1) {
                    FilterSer.setBrandsData(response);
                    $scope.data_brands = FilterSer.getBrandsData();
                }
                if(typeof callback=='function'){
                    callback();
                }
            });
        }














        function testCategory(){
            var brand_id_param;
            if (CategorySer.getData()== null) {
                /*如果分类数据为空则请求数据*/
                CategorySer.requestData(function (){//请求成功后的回调
                     handleResult();
                    loadBrands(brand_id_param,initData);
                });
            }else{
                    handleResult();
                    loadBrands(brand_id_param,initData);
            }


            function handleResult(){
                $scope.data_menu=CategorySer.getData();
                var cate=CategorySer.getCategoryById($scope.cate_id);
                $scope.category=cate;
                $scope.cateName=cate.CategoryName;
                console.log(cate);
                if(cate.FilterModels.length>0) {
                    $scope.hasSubCate=false;
                    FilterSer.setCategoryData(CategorySer.getCategoryById($scope.params.categoryId));
                    brand_id_param=$scope.cate_id;
                }else{
                    $scope.hasSubCate=true;
                    brand_id_param=$scope.cate_sub_id?$scope.cate_sub_id:$scope.cate_id;
                    FilterSer.setCategoryData(cate);
                }
            }
        }



        /*选择子类*/
        $scope.selectSubCate=function(subCate_id){
            FilterSer.selectSubCategory(subCate_id);
            loadBrands(subCate_id);
            $scope.data_filter = FilterSer.getSubCategoryById(subCate_id);
            goListPage();
        };
    
        /*选择全部子类*/
        $scope.selectAllSubCategory=function(){
            FilterSer.resetSubCategorySelection();
            $state.go('list',{category:'category='+$scope.cate_id,brands:0,filters:''});
        };

       /* 是否有已选的子类*/
        $scope.hasSelectedSubCate=function(){
            for(var o in $scope.category.SubCategories){
                if($scope.category.SubCategories[o].isSelected==true){
                    return true;
                }
            }
            return false;
        };
       /* 显示/隐藏更多品牌*/
        $scope.toggleShowBrands=function(){
            $scope.showAllBrands=!$scope.showAllBrands;
        };
       /* 选择品牌*/
        $scope.selectBrand = function (brand_id) {
            FilterSer.selectBrand(brand_id);
            goListPage();
        };
       /*选择品牌（勾选）*/
        $scope.multiSelectBrand=function(brand_id){
            FilterSer.multiSelectBrand(brand_id);
        };
        $scope.multiBrandSearch=function(){
            FilterSer.addBrandMultiSelection();
        };
        /*品牌筛选重置*/
        $scope.resetBrands=function(){
           FilterSer.resetBrandsSelection();
             goListPage();
        };
        /*选择筛选项*/
        $scope.select = function (filter_id,item_id) {
            FilterSer.addSelection(filter_id,item_id);
            goListPage();
        };
    
        /*多选品牌提交搜索*/
        $scope.multiBrandSearch=function(){
            var has_change=false;
            for(var o in $scope.data_brands){
                if($scope.data_brands[o].isMultiSelected==true){
                    has_change=true;
                    break;
                }
            }
            if(has_change) {
                FilterSer.addBrandMultiSelection();
                $scope.showBMSBox=false;
                goListPage();
            }else{
                FilterSer.resetBrandsMultiSelection();
                $scope.showBMSBox=false;
            }
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

        /*品牌多选框打开/关闭*/
        $scope.toggleBrandsMultiSelect=function(){
            $scope.showBMSBox=!$scope.showBMSBox;
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
        $scope.hasSelectedBrand=function(){
            for(var o in $scope.data_brands){
                if($scope.data_brands[o].isSelected==true){
                    return true;
                }
            }
            return false;
        },
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
            if (price_sort==0||price_sort==1) {
                if(price_sort==$scope.price_order){
                    return;
                }else{
                    $scope.price_order=price_sort;
                }
            } else {
                $scope.price_order=!$scope.price_order;
            }
            if($scope.price_order){
                ListSer.sortByPriceDown();
            }else{
                ListSer.sortByPriceUp();
            }
            var data = ListSer.getData();
            $scope.pageIndex = 1;//当前页
            $timeout(function(){
                $scope.data_list = data.slice(($scope.pageIndex - 1) * pageSize, $scope.pageIndex * pageSize);//当前显示数据
            });
        };

       /* 已多选品牌显示格式化*/
        $scope.formatBrandMultiChoice=function(){
            var str='品牌：';
            var org_str=str;
            for(var o in $scope.data_brands){
                if($scope.data_brands[o].isMultiSelected==true){
                    if(str!=org_str) {
                        str+=',';
                    }
                    str+=$scope.data_brands[o].BrandName;
                }
            }
            return str;
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
            FilterSer.setSelectBrandData($scope.brandParams);
            if(!$scope.hasSubCate){
                FilterSer.setSubCategory(null);
                FilterSer.clearSelect();
                FilterSer.select();
                $scope.data_filter = FilterSer.getCategoryData();
            }else {
                 FilterSer.setSubCategory($scope.cate_sub_id);
                 $scope.data_filter = FilterSer.getSubCategoryById($scope.cate_sub_id);
                 FilterSer.clearSelectWithSubCategory();
                 FilterSer.selectWithSubCategory();
            }
            console.log("cate_data:"+$scope.data_filter);
            $scope.sortByPrice = true;//价格排序方式 true:升序,false:降序
            search({sort_price: $scope.sortByPrice});//搜索数据
        }

        /*搜索*/
        function search(params) {
            $scope.data_list = null;
            $scope.showLoading = true;
            var search_id=$scope.cate_sub_id?$scope.cate_sub_id:$scope.cate_id;
            FilterSer.search({
                sortByPrice: params.sort_price,//价格默认排序：从低到高
                category:search_id,
                items: $scope.params.getItems(),
                FilterBrand:($scope.brandParams.items.length<=0)?false:true,
                Brands:($scope.brandParams==null)?[]:$scope.brandParams.items,
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
            var params_brands='';
            var obj_brand=FilterSer.getSelectBrandsData();
            if(obj_brand.items.length<=0){
                params_brands=0;
            }else{
                params_brands='brands=';
                if(obj_brand.isMultiSelected){
                    params_brands+=1;
                }else{
                    params_brands+=0;
                }
                params_brands+='_'+obj_brand.items.toString();
            }
            var category='category='+obj.categoryId;
            if(FilterSer.getSubCategory()!=null){
                category+='_'+FilterSer.getSubCategory();
            }
            $state.go('list',{
                category:category,
                brands:params_brands,
                filters:params_filter
            });
        }
    });
