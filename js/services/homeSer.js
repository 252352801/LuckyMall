angular.module('LuckyMall.services')
.factory('HomeSer',function(API,$http){
	var data={
        banner:null,
        today:null,
        tomorrow:null
    };
      function initTodayData(obj){
          var result=new Array();
          for(var o in obj){
              if(isOnline(obj[o].CurrentTime,obj[o].StartTime)) {
                  if (obj[o].PromotionType == 1) {
                      obj[o].href = '/item/' + obj[o].TypeId;
                  } else if (obj[o].PromotionType == 0) {
                      obj[o].href = '/brand/'+obj[o].TypeId;
                  }
                  obj[o].remainTime = setRemainTime(obj[o].CurrentTime,obj[o].EndTime);
                  result.push(obj[o]);
              }
          }
          return result;
      }

        function initBannerData(obj){
            var result=new Array();
            for(var o in obj){
                    if (obj[o].PromotionType == 1) {
                        obj[o].href = '/item/' + obj[o].TypeId;
                    } else if (obj[o].PromotionType == 0) {
                        obj[o].href = '/brand/'+obj[o].TypeId;
                    }
                    result.push(obj[o]);
            }
            return result;
        }
              
        function setRemainTime(cur_time,end_time){
            var t_cur=new Date(cur_time.replace(/-/g,"/"));
            var t_end=new Date(end_time.replace(/-/g,"/"));
            return (t_end-t_cur)/1000;
        }
       /* 判断专题是否上线*/
      function isOnline(cur_time,start_time_str){
          var now_time=new Date(cur_time.replace(/-/,"/"));
          var start_time=new Date(start_time_str.replace(/-/,"/"));
          if(now_time>=start_time){
              return true;
          }else{
              return false;
          }
      }
	return {
        getData:function(){
            return data;
        },
		getTodayData:function(){
			return data.today;
		},
        requestTodayData:function(callback){
            $http({
                method:API.todayData.method,
                url:API.todayData.url,
                data: {"PageIndex":0,"PageSize":1000}
            }).success(function(response,status,headers,config){
                data.today=initTodayData(response);
                    callback();
            }).error(function(data,status,headers,config){

            });
        },
        requestBannerData:function(callback){
            $http({
                method:API.bannerList.method,
                url:API.bannerList.url,
                data: {"PageIndex":0,"PageSize":1000}
            }).success(function(response,status,headers,config){
                if(response&&response!=null&&response!=''){
                    for(var o in response){
                        response[o].ImageData=response[o].ImageData.split('|')[0];
                    }
                    data.banner=initBannerData(response);
                    callback(data.banner,1);
                }else{
                    callback(response,0);
                }
            }).error(function(data,status,headers,config){

            });
        }
	};
})