angular.module('LuckyMall.controllers')
    .controller('MySOOCtrl',
    ['$scope', '$state', '$stateParams','MySOOSer',
        function ($scope, $state, $stateParams,MySOOSer) {
            $scope.$emit('changeMenu', 17);


            function MySOO() {
                var $this=this;
                this.page={
                    index:0,
                    pageSize:8,
                    count:0,
                    pageCount:0,
                    items:[0,1,2,3,4,5,6,7,8,9,10,11,12]
                };
                this.pageError=false;
                this.data=[];
                this.loadData=function(){
                    var params={
                        "status": 0,
                        "pSize": 100,
                        "pIndex": 0
                    };
                    MySOOSer.requestData(params,function(response,status){
                        if(status==1&&response){
                            $this.data=response;
                            console.log(response);
                        }else{
                            $this.pageError=true;
                        }
                    });
                };
            }
            $scope.mySOO=new MySOO();
            $scope.mySOO.loadData();






















        }]);
