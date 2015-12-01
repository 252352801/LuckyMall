angular.module('LuckyCat.controllers')
    .controller('MyMessageCtrl', function ($scope,$timeout,$stateParams,MessageSer) {
        $scope.$emit('changeMenu', 14);
        $scope.pageIndex=1;
        $scope.page_info={
            "PageIndex":0,//当前第几页
            "PageSize":10,//每页大小
            "TotalSize":100,//总共条数
            "TotalPage": 10//总共页数
        };
        $scope.msg_type=$stateParams.msg_type;//消息类型  0：未读  1：已读
        loadData();
        /*删除消息*/
        $scope.removeMsg = function (msg_id) {
            swal({
                    title: "确定要删除吗?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: '取消',
                    confirmButtonText: "确定",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                },
                function () {
                    MessageSer.removeMsg(msg_id,function(response,status){
                        if(status==1) {
                            swal({
                                title: "删除成功!",
                                type: "success",
                                confirmButtonText: "确定"
                            });
                            refreshData();
                        }else{
                            swal({
                                title:response,
                                type: "error",
                                confirmButtonText: "确定"
                            });
                        }
                    });
                });
        };
       /* 加载本页数据*/
        function loadData(){
            if(MessageSer.getData($scope.msg_type)==null){
                var post_data=$scope.page_info;
                MessageSer.requestMsg($scope.msg_type,post_data, function (response, status) {
                    if (status == 1) {
                        $timeout(function(){
                            $scope.data_msg = formatMsgTime(MessageSer.getData($scope.msg_type));
                        });
                    }
                });
            }else{
                $timeout(function(){
                    $scope.data_msg = formatMsgTime(MessageSer.getData($scope.msg_type));
                });
            }
        }
        /* 刷新本页数据*/
        function refreshData(){
            var post_data=$scope.page_info;
            MessageSer.requestMsg($scope.msg_type,post_data, function (response, status) {
                if (status == 1) {
                    $timeout(function(){
                        $scope.data_msg = formatMsgTime(MessageSer.getData($scope.msg_type));
                    });
                }
            });
        }
        /*格式化消息时间的显示*/
        function formatMsgTime(data){
            for(var o in data){
                var str =data[o].CreateTime;
                str = str.replace(/-/g,"/");
                var date_time = new Date(str );
                var date_time_now=new Date();
                var past_time=(date_time_now.getTime()-date_time.getTime())/1000/60;//经过的时间（分）
                if(past_time<=0){
                    data[o].showTime='刚刚';
                }else if(past_time<60){
                    data[o].showTime=parseInt(past_time)+'分钟前';
                }else if((past_time/60)<24){
                    data[o].showTime=parseInt(past_time/60)+'小时前';
                }else if((past_time/60/24)<=30){
                    data[o].showTime=parseInt(past_time/60/24)+'天前';
                }else{
                    data[o].showTime=parseInt(data[o].CreateTime);
                }
            }
            return data;
        }



    });



