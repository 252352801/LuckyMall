angular.module('LuckyCat.controllers')
 .controller('ListCtrl',function($scope,$stateParams,FilterSer,CategorySer,$timeout,ListSer){
    var pageSize=16;//每页大小（个数）
     $scope.cate_id=$stateParams.cate_id;
     $scope.item_id=$stateParams.item_id;//筛选项id
    /*初始化数据*/
     var initData=function(){
         $scope.showLoading=false;
         FilterSer.setData(CategorySer.getCategoryById($scope.cate_id));
         FilterSer.clearSelect();//清除所有选择
         if($scope.item_id!='all'){
             FilterSer.select($scope.item_id);//选择进入页面时选定的筛选项
         }
         $scope.data_filter=FilterSer.getData();
         $scope.sortByPrice=true;//价格排序方式 true:升序,false:降序
         search({sort_price:$scope.sortByPrice});//搜索数据
     };
     if(CategorySer.getData()==null){
         /*如果分类数据为空则请求数据*/
         CategorySer.requestData(function(){//请求成功后的回调
             initData();//初始化数据
         });
      }else{
         initData();
     }
     /* 搜索大类*/
     $scope.searchThisCategory=function(){
         FilterSer.clearSelect();//清除所有选择
         search({sort_price:$scope.sortByPrice});//搜索数据
     };
      /*选择筛选项*/
     $scope.select=function(val_id){
         FilterSer.select(val_id);
         search({sort_price:$scope.sortByPrice});
     };
      /*是否有被选的选项*/
     $scope.hasSelectedItem=function(res){
         for(var o in res){
             if(res[o].isSelected==true){
                 return true;
             }
         }
         return false;
     };
     /*取消选择*/
     $scope.cancelSelect=function(id){
         FilterSer.cancelSelect(id);
         search({sort_price:$scope.sortByPrice});
     };
     $scope.pageIndex=1;//当前页
    /*前一页*/
    $scope.prevPage=function(){
        if($scope.pageIndex>1){
            $scope.pageIndex--;
            $scope.data_list=ListSer.getData().slice(($scope.pageIndex-1)*pageSize,$scope.pageIndex*pageSize);//从返回的数据数组中取当前页的数据
        }
    };
    /*下一页*/
    $scope.nextPage=function(){
        if($scope.pageIndex>=$scope.totalPage) return;
        $scope.pageIndex++;
        $scope.data_list=ListSer.getData().slice(($scope.pageIndex-1)*pageSize,$scope.pageIndex*pageSize);
    };
    /*翻页*/
    $scope.changePage=function(index){
        $scope.pageIndex=index;
        $scope.data_list=ListSer.getData().slice(($scope.pageIndex-1)*pageSize,$scope.pageIndex*pageSize);//从返回的数据数组中取当前页的数据
    };
     /*价格排序*/
    $scope.searchWidthPrice=function(price_sort){
        if(price_sort){
            $scope.sortByPrice=price_sort;
        }else{
            $scope.sortByPrice=!$scope.sortByPrice;
        }
        search({sort_price:$scope.sortByPrice});
    };
    /*搜索*/
     function search(params){
         $scope.data_list=null;
         $scope.showLoading=true;
         FilterSer.search({
             sortByPrice:params.sort_price,
             callback: function (new_data) {
                 ListSer.setData(new_data);//把请求道的搜索结果存到ListSer服务
                 var data = ListSer.getData();
                 $scope.pageIndex = 1;//当前页
                 $scope.data_list = data.slice(($scope.pageIndex - 1) * pageSize, $scope.pageIndex * pageSize);//当前显示数据
                 $scope.totalAmount = data.length;//商品总数
                 var total_page=Math.ceil($scope.totalAmount/pageSize);
                 $scope.totalPage=(total_page<=0)?1:total_page;
                 createPage(data);//创建页码数组
                 $scope.showLoading=false;
             }
         });
     }
    function createPage(_data){
        $scope.page=[];//用于创建页码
        var len=_data.length>0?Math.ceil(_data.length/pageSize):1;
        for(var i=0;i<len;i++){
            $scope.page.push(i);
        }
    }
});
