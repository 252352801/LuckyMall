angular.module('LuckyCat')

    /*地址输入验证*/
    .directive('requireAddress', function ($timeout) {
        return {
            link: function (scope,element, attrs) {
                element.bind('blur', function () {
                    if (element.val() == (''|undefined)) {
                        $timeout(function(){
                            scope[attrs.requireAddress]('请输入详细地址');
                        },5)
                    }else{
                        scope[attrs.requireAddress]('');
                    }
                });
            }
        };
    })

    /*新地址地区选择验证*/
    .directive('testNewAreaSelect', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                element.bind('change', function () {
                    $timeout(function() {
                        if (scope.new_province == '省份' || scope.new_city == '地级市' || scope.new_county == '市、县级市') {
                            $timeout(function () {
                                scope.tips.inputAreaTip = '请选择区域';
                            }, 5);
                        } else {
                            $timeout(function () {
                                scope.tips.inputAreaTip = '';
                            }, 5);
                        }
                    },10);
                });
            }
        };
    })

    /*编辑地址地区选择验证*/
    .directive('testEditAreaSelect', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                element.bind('change', function () {
                    $timeout(function() {
                        if (scope.edit_province == '省份' || scope.edit_city == '地级市' || scope.edit_county == '市、县级市') {
                            $timeout(function () {
                                scope.tips.inputAreaTip = '请选择区域';
                            }, 5);
                        } else {
                            $timeout(function () {
                                scope.tips.inputAreaTip = '';
                            }, 5);
                        }
                    },10);
                });
            }
        };
    })