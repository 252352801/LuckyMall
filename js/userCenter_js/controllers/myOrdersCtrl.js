angular.module('LuckyCat.controllers')
 .controller('MyOrdersCtrl',function($scope,$state,$stateParams,$timeout,MyOrdersSer){
    var pageSize=3;//每页条数
    $scope.pageIndex=1;//当前页
    $scope.showLoading=true;
    $scope.data_orders={//订单数据
        all:new Array(),
        curPage:new Array()
    };
    switch($stateParams.status){
        /*case 'all':$scope.curTab='tab1';$scope.$emit('changeMenu',1);break;//当前tab*/
        case 'unPay':$scope.curTab='tab1';$scope.$emit('changeMenu',1);loadTab(1);break;
        case 'paid':$scope.curTab='tab2';$scope.$emit('changeMenu',2);loadTab(2);break;
        case 'unReceive':$scope.curTab='tab3';$scope.$emit('changeMenu',3);loadTab(3);break;
        case 'finish':$scope.curTab='tab4';$scope.$emit('changeMenu',4);loadTab(4);break;
        case 'refund':$scope.curTab='tab5';$scope.$emit('changeMenu',5);break;
    }
    /*请求订单数据*/
    $scope.loadData=function(){
        $scope.loaded=0;//已加载数据数量
        if(MyOrdersSer.getUnPayOrders()==null){  
            MyOrdersSer.requestData(1,function(response,status){//请求未支付订单
                $scope.data_orders_upPay=MyOrdersSer.getUnPayOrders();
                $scope.loaded++;
            });
        }else{
            $scope.data_orders_upPay=MyOrdersSer.getUnPayOrders();
            $scope.loaded++;
        }

        if(MyOrdersSer.getPaidOrders()==null){
            MyOrdersSer.requestData(2,function(response,status){//请求已支付订单
                $scope.data_orders_paid=MyOrdersSer.getPaidOrders();
                $scope.loaded++;
            });
        }else{
            $scope.data_orders_paid=MyOrdersSer.getPaidOrders();
            $scope.loaded++;
        }

        if(MyOrdersSer.getUnReceiveOrders()==null){
            MyOrdersSer.requestData(3,function(response,status){//请求待收货订单
                 $scope.data_orders_upReceive=MyOrdersSer.getUnReceiveOrders();
                $scope.loaded++;
            });
        }else{
            $scope.data_orders_upReceive=MyOrdersSer.getUnReceiveOrders();
            $scope.loaded++;
        }

        if(MyOrdersSer.getFinishOrders()==null){
            MyOrdersSer.requestData(4,function(response,status){//请求已完成订单
                $scope.data_orders_finish=MyOrdersSer.getFinishOrders();
                $scope.loaded++;
            });
        }else{
            $scope.data_orders_finish=MyOrdersSer.getFinishOrders();
            $scope.loaded++;
        }
        $scope.$watch('loaded',function(newValue, oldValue){
            if(newValue>=4){
                    $scope.showLoading=false;
            }
        },true);
    };
    $scope.loadData();

        /*前一页*/
        $scope.prevPage=function(){
            if($scope.pageIndex>1){
                $scope.pageIndex--;
                $scope.data_orders.curPage=$scope.data_orders.all.slice(($scope.pageIndex-1)*pageSize,$scope.pageIndex*pageSize);//从返回的数据数组中取当前页的数据
            }
        };
        /*下一页*/
        $scope.nextPage=function(){
            if($scope.pageIndex>=totalPage()) {return;}
            $scope.pageIndex++;
            $scope.data_orders.curPage=$scope.data_orders.all.slice(($scope.pageIndex-1)*pageSize,$scope.pageIndex*pageSize);
        };
        /*翻页*/
        $scope.changePage=function(index){
            $scope.pageIndex=index;
            $scope.data_orders.curPage=$scope.data_orders.all.slice(($scope.pageIndex-1)*pageSize,$scope.pageIndex*pageSize);//从返回的数据数组中取当前页的数据
        };
    /*根据订单状态类型加载订单数据*/
    function loadTab(order_type){
           switch(order_type){
                case 1:
                    $timeout(function(){
                        $scope.data_orders.all=MyOrdersSer.getUnPayOrders();
                        $scope.data_orders.curPage=getFirstPage(MyOrdersSer.getUnPayOrders());
                        createPage(MyOrdersSer.getUnPayOrders());
                    },5);
                    break;
               case 2:
                   $timeout(function(){
                       $scope.data_orders.all=MyOrdersSer.getPaidOrders();
                       $scope.data_orders.curPage=getFirstPage(MyOrdersSer.getPaidOrders());
                       createPage(MyOrdersSer.getPaidOrders());
                   },5);
                   break;
                case 3:
                    $timeout(function(){
                        $scope.data_orders.all=MyOrdersSer.getUnReceiveOrders();
                        $scope.data_orders.curPage=getFirstPage(MyOrdersSer.getUnReceiveOrders());
                        createPage(MyOrdersSer.getUnReceiveOrders());
                     },5);
                    break;
                case 4:
                    $timeout(function(){
                        $scope.data_orders.all=MyOrdersSer.getFinishOrders();
                        $scope.data_orders.curPage=getFirstPage(MyOrdersSer.getFinishOrders());
                        createPage(MyOrdersSer.getFinishOrders());
                     },5);
                    break;
        }
    }
    function unKnow(){
        console.log('待定······');
        $scope.data_orders=new Array();
    }

      function getFirstPage(_data){
            if(_data!=null){
                if(_data.length>pageSize){
                    return _data.slice(($scope.pageIndex - 1) * pageSize, $scope.pageIndex * pageSize);//取第一页数据
                }
            }else{
                return new Array();
            }
      }
     function createPage(_data){
            $scope.page=[];//用于创建页码
            if(_data==null){
                $scope.page=[1];
                return;
            }else if(_data.length==0){
                $scope.page=[1];
                return;
            }
            var len=Math.ceil(_data.length/pageSize);
           console.log(_data.length);
            for(var i=0;i<len;i++){
                $scope.page.push(i);
            }
         console.log($scope.page);
    }
        /*计算总页数*/
    function totalPage(){
         var result=Math.ceil($scope.data_orders.all.length/pageSize);
         return result<=0?1:result;
    }
});
