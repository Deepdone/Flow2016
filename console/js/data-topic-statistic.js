/**
 * Created by huangfeng on 2015/12/17.
 */

var authorization="Bearer "+getCookie("accessToken");
var topic=utils.getRequest().topic;
$(".breadcrumb h2").html(topic)
var dataTypeTxt="过去24小时";
function getDateByType(hourly){
    $("#selectType").val("hourly");
    var pdata={
        topic:topic,
        start:Date.now()-86400000,
        end:Date.now(),
        granuity:"hourly"
    }
    $.ajax({
        url: "/api/topic/statistic?"+$.param(pdata),
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success:function(data,textStatus,xhr){
            initData(data,"hourly");
            initFile(pdata);
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    });
}

getDateByType("hourly");

$("#selectType").on("change",function(){
    var type=$(this).val();
    if(type=="hourly"){
        dataTypeTxt="过去24小时"
        var pdata={
            topic:topic,
            start:Date.now()-86400000,
            end:Date.now(),
            granuity:"hourly"
        }
    }
    if(type=="daily"){
        dataTypeTxt="过去7天";
        var pdata={
            topic:topic,
            start:Date.now()-86400000*7,
            end:Date.now(),
            granuity:"daily"
        }
    }
    if(type=="month"){
        dataTypeTxt="过去一个月";
        var pdata={
            topic:topic,
            start:Date.now()-86400000*30,
            end:Date.now(),
            granuity:"daily"
        }
    }
    myChart.showLoading({
        text: '正在努力的读取数据中...',    //loading
    });
    $.ajax({
        url: "/api/topic/statistic?"+$.param(pdata),
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success:function(data,textStatus,xhr){
            myChart.hideLoading();
            initData(data,type);
            initFile(pdata);
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    });
})



var myChart;

// 路径配置
require.config({
    paths: {
        echarts: '../js/echarts/'
    }
});

// 切换数据

 function initData(data,type){
      var xAxisData=[];
      var seriesData=[];
      var list=data.list,len=list.length;
      for(var i=0;i<len;i++){
          if(type=="hourly"){
              xAxisData.push(list[i].time.substring(11,16))
          }else{
              xAxisData.push(list[i].time.substring(0,10))
          }
          seriesData.push(list[i].count)
      }
     require(
         [
             'echarts',
             'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
             'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
         ],
         function (ec) {
             myChart = ec.init(document.getElementById('main'));
             var option = {
                 title : {
                     text: dataTypeTxt
                 },
                 tooltip : {
                     trigger: 'axis'
                 },
                 /*legend: {
                     data:[data.topic]
                 },*/
                 /*toolbox: {
                     show : true,
                     feature : {
                         mark : {show: true},
                         dataView : {show: true, readOnly: false},
                         magicType : {show: true, type: ['line', 'bar']},
                         restore : {show: true},
                         saveAsImage : {show: true}
                     }
                 },*/
                 calculable : true,
                 xAxis : [
                     {
                         type : 'category',
                         //data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                         data:xAxisData
                     }
                 ],
                 yAxis : [
                     {
                         type : 'value'
                     }
                 ],
                 series : [
                     {
                         name:'',
                         type:'bar',
                         itemStyle: {
                             normal: {
                                 color:"#6CD7D9"
                             }
                         },
                        // data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                         data:seriesData
                     }
                 ]
             };

             // 为echarts对象加载数据
             myChart.setOption(option);
         }
     );

 }


//文件下载

 function initFile(data){
     var txtdata={
         type:"text",
         start:data.start,
         end:data.end,
         granuity:data.granuity,
         topic:topic,
         access_token:getCookie("accessToken")
     }
     var binarydata={
         type:"binary",
         start:data.start,
         end:data.end,
         granuity:data.granuity,
         topic:topic,
         access_token:getCookie("accessToken")
     }
     var txtUrl="/api/topic/file?"+ $.param(txtdata);
     var binaryUrl="/api/topic/file?"+ $.param(binarydata);
     $("#list").html('<tr><td style="border: none; font-weight: bold">文件下载</td>' +
         '<td style="border: none"><a class="btn-link btn-output-file" href="'+txtUrl+'")>普通文件</a></td>' +
         '<td style="border: none"><a class="btn-link btn-output-binary" href="'+binaryUrl+'">二进制</a></td></tr>')
 }
