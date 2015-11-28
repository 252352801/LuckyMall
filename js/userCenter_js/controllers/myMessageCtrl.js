angular.module('LuckyCat.controllers')
    .controller('MyMessageCtrl', function ($scope, $state, $stateParams) {
        $scope.$emit('changeMenu', 14);
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

                });
            swal("这条消息非常重要，您还是不要删了吧");
        };
    });
