angular.module('LuckyMall.controllers')
    .controller('ShowOffOrdersCtrl',
        ['$rootScope','$scope', '$state', '$stateParams',  '$timeout',"ShowOffOrdersSer",
        function ($rootScope,$scope, $state,$stateParams,$timeout,ShowOffOrdersSer) {

            function ShowOffOrders(){
                var $this=this;
                this.data=[];
                this.page={
                    index:0,
                    pageSize:8,
                    count:0,
                    pageCount:0,
                    items:[0,1,2,3,4,5,6,7,8,9,10,11,12]
                };
                this.loadData=function(){
                    var params={
                        status:1, pSize:10000, pIndex: 0
                    };
                    ShowOffOrdersSer.requestData(params,function(response,status){
                        if(status==1&&response){
                            for(var o in response){
                                response[o].CreateTime=response[o].CreateTime.split(' ')[0];
                            }
                            $this.data=response;
                            console.log(response);
                        }
                    })
                }
            }
            $scope.soo=new ShowOffOrders();
            $scope.soo.loadData();


    }])
    .controller('SOODetailsCtrl',
    ['$rootScope','$scope', '$state', '$stateParams',  '$timeout',"ShowOffOrdersSer",
        function ($rootScope,$scope, $state,$stateParams,$timeout,ShowOffOrdersSer) {




        }]);

