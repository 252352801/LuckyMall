angular.module('LuckyCat.controllers')
    .controller('MessageDetailsCtrl', function ($scope, $state, $stateParams,MessageSer) {
        $scope.$emit('changeMenu', 14);
        $scope.page={
            "PageIndex":0,//当前第几页
            "PageSize":100,//每页大小
            "TotalSize": 1000,//总共条数
            "TotalPage": 10//总共页数
        };
        var url_params=$stateParams.params.split('_');
        $scope.msg_type=url_params[0].split('=')[1];
        $scope.msg_id=url_params[1].split('=')[1];
        $scope.msg_text_id=url_params[2].split('=')[1];
        loadData();
        /*加载数据*/
        function loadData(){
            if(MessageSer.getData($scope.msg_type)==null){
                MessageSer.requestMsg($scope.msg_type,$scope.page,function(response,status){
                    if(status==1){
                        $scope.data_msg=MessageSer.getMsgById($scope.msg_type,$scope.msg_id);
                        //alert(MessageSer.getMsgById($scope.msg_type,$scope.msg_id));
                    }
                });
            }else{
                $scope.data_msg=MessageSer.getMsgById( $scope.msg_type,$scope.msg_id);
            }
            MessageSer. requestMsgContentById($scope.msg_id,function(response,status){//加载消息内容
                if(status==1){
                    $scope.data_msg_content=response;
                }
            });
        }
    });
