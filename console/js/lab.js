/**
 * Created by huangfeng on 2015/12/17.
 */


require.config({
    paths: {
        echarts: '../js/echarts'
    }
});
var init=false;
var fistDate=[];//是否第一次加载数据
var arrayData=[];
var arrayOption=[];
var arrayXAxisData=[];
var arraySeriesData=[];
var dataMsg="";//接收的数据
var addDataNum=0//记录增加数据次数
var authorization=getCookie('accessToken');//jQuery Cookie与 echarts 有冲突用原生的getCookie
var bearer_authorization="Bearer "+authorization;

//模拟发布
$("#btn-publish").on("click",function(){
    var topic = $.trim($("input[name='topic']").val());
    if (topic.length == 0) {
        utils.alertMsgTip("主题不能为空")
        return;
    }
    var message = $.trim($("textarea[name='message']").val());
    if (message.length == 0) {
        utils.alertMsgTip("消息不能为空")
        return;
    }
    if($("#inlineRadio1").is(":checked")){
        if(message.indexOf("{")==-1){
            utils.alertMsgTip("JSON格式不对")
            return;
        }
        try {
            JSON.parse(message);
        } catch (e) {
            utils.alertMsgTip("JSON格式不对")
            return;
        }
    }
    if(message.indexOf("{")!=-1){
        try {
            JSON.parse(message);
        } catch (e) {
            utils.alertMsgTip("JSON格式不对")
            return;
        }
    }
    var data = {
            topic: topic,
            message: message
        };

    $(this).prop("disabled",true);
    var self=$(this)
    $.ajax({
        url: "/api/message",
        dataType: "json",
        contentType:'application/json',
        type:"post",
        data:JSON.stringify(data),
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", bearer_authorization);
        },
        success: function(data){
            utils.alertMsgTip("发布成功");
            if($("#inlineRadio3").is(":checked")){
                $("textarea[name='message']").val("")
                //$("input[name='topic']").val("")
            }
            self.prop("disabled",false)
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
            self.prop("disabled",false)
        }
    })

});

//模拟订阅
var ws=null;
$("#btn-subscribe").on("click",function(){
    if($(this).prop("disabled")){
        return;
    }
    var topic = $.trim($("input[name='subscibe-topic']").val());
    if (topic.length == 0) {
        utils.alertMsgTip("主题不能为空");
        return;
    }
    if(!window.WebSocket) {
        utils.alertMsgTip("你的浏览器不支持WebSocket");
        return
    }
    var query= $.param({
        access_token:authorization,
        topic:topic
    },true)
    ws=new WebSocket("ws://"+location.host+"/api/subscribe?"+query,"mqtt");
    //监听消息
    ws.onmessage = function(event){
        var data=JSON.parse(event.data);
        var posMsg=data.message;
        if(typeof posMsg!="object"){//处理文本数据
            $("#home-table").html('<tr><td width="150" class="text-right">message：</td><td>'+data.message+'</td></tr>');
            $("#message").html(data.message);
            return;
        }
        var tempDataMsg =dataMsg;
        dataMsg = flatten(posMsg);
        $("#message").html(formatJson(data.message));
        if(!init){
            init=true;
            var buff=[];
            for(var n in dataMsg){
                if(!isNaN(Number(dataMsg[n]))){
                    buff.push('<tr><td width="150" class="text-right text-middle">'+n+'：</td><td width="800"><div class="statistic" style="height: 150px; width: 800px;" id="'+n+'" val="'+dataMsg[n]+'"></div></td><td style="font-size: 30px;" id="txt'+ n.replace(".","_")+'" class="text-left text-middle"></td></tr>')
                }else{
                    buff.push('<tr><td width="150" class="text-right text-middle">'+n+'：</td><td><div class="text-right text-middle txt-topic" style="font-size: 30px;" id="txt'+ n.replace(".","_")+'">'+dataMsg[n]+'</div></td><td></td></tr>')
                }
            }
            $("#home-table").html(buff.join(''));
            require(
                [
                    'echarts',
                    'echarts/chart/bar',
                    'echarts/chart/line'
                ],
                function (ec) {
                    $(".statistic").each(function(i,n){
                        var name=$(this).attr("id");
                        var value=parseFloat($(this).attr("val"));
                        $("#txt"+name.replace(".","_")).html(value)
                        arrayData.push(name)
                        fistDate[i]=true;
                        arraySeriesData[i]=[];
                        arraySeriesData[i].push(value,value);
                        arrayXAxisData[i]=[];
                        arrayXAxisData[i].push("","");
                        arrayData[i] = ec.init(document.getElementById(name));
                        arrayOption[i]={
                            tooltip : {
                                trigger: 'axis'
                            },
                            timeline:false,
                            grid:{
                                borderWidth:0,
                                x:20,
                                y:15,
                                x2:20,
                                y3:15
                            },
                            xAxis : [
                                {
                                    type : 'category',
                                    data : arrayXAxisData[i],
                                    axisLabel:{
                                        //  interval:3//间隔
                                    },
                                    boundaryGap:false,
                                    show:false
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value',
                                    show:false,
                                }
                            ],
                            series : [
                                {
                                    name:name,
                                    type:'line',
                                    itemStyle: {
                                        normal: {
                                            color:"#6CD7D9"
                                        }
                                    },
                                    symbol:"none",//不显示圆点
                                    data:arraySeriesData[i]
                                }
                            ]
                        };
                        arrayData[i].setOption(arrayOption[i]);
                        console.log(arraySeriesData[i])
                        console.log(arrayXAxisData[i])
                    })
                }
            );
        }
        else{
            var addData=[],addNumData=[];
            for(var u in dataMsg){
                    addData.push(dataMsg[u])
                    $("#txt"+ u.replace(".","_")).html(dataMsg[u]);
                    if(!isNaN(Number(dataMsg[u]))){
                        addNumData.push(dataMsg[u]);
                    }
            }

            var len=arrayData.length;
            console.log(len)
            for(var i=0;i<len;i++){
                if(arrayXAxisData[i].length==50){
                    arraySeriesData[i].push(parseFloat(addNumData[i]));
                    var len=arraySeriesData[i].length-1;
                    arrayData[i].addData([
                        [
                            0,        // 系列索引
                            arraySeriesData[i][len], // 新增数据
                            false,     // 新增数据是否从队列头部插入
                            false     // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
                        ]
                    ]);
                }else{

                    if(fistDate[i]){
                        fistDate[i]=false;
                        arraySeriesData[i] = arraySeriesData[i].slice(1);
                        arrayXAxisData[i] = arrayXAxisData[i].slice(1);
                    }
                    arraySeriesData[i].push(parseFloat(addNumData[i]));
                    //console.log(parseFloat(addData[i])) NAN
                    arrayXAxisData[i].push("");
                    arrayData[i].setOption({
                        xAxis : [
                            {
                                data:arrayXAxisData[i]
                            }
                        ],
                        series : [
                            {
                                data:arraySeriesData[i]
                            }
                        ]
                    })
                }
            }
        }

        //增加字段
        var flattenMsg=flatten(data.message);
        if (tempDataMsg != "") {
            if (!isObjectKeyEqual(tempDataMsg, flattenMsg)) {//数据有增减的情况
                addDataNum++;
                var difObj = differenceObj(tempDataMsg, flattenMsg);
                var buffAdd=[];
                for (var add in difObj.tempAdd) {
                    if(!isNaN(Number(difObj.tempAdd[add]))){
                        buffAdd.push('<tr><td width="150" class="text-right text-middle">'+add+'：</td><td width="800"><div class="statistic-'+addDataNum+'" style="height: 150px; width: 800px;" id="'+add+'" val="'+dataMsg[add]+'"></div></td><td style="font-size: 30px;" id="txt'+ add.replace(".","_")+'" class="text-left text-middle"></td></tr>')
                    }else{
                        buffAdd.push('<tr><td width="150" class="text-right text-middle">'+add+'：</td><td style="font-size: 30px;" id="txt'+ add.replace(".","_")+'">'+dataMsg[add]+'</td><td class="text-middle"></td></tr>')
                    }
                }
                $("#home-table").append(buffAdd.join(''));

                require(
                    [
                        'echarts',
                        'echarts/chart/bar',
                        'echarts/chart/line'
                    ],
                    function (ec) {
                        $(".statistic-"+addDataNum).each(function(i,n){
                            console.log(i)
                            var name=$(this).attr("id");
                            var value=parseFloat($(this).attr("val"));
                            $("#txt"+name.replace(".","_")).html(value)
                            arrayData.push(name)
                            fistDate[arrayData.length-1]=true;
                            arraySeriesData[arrayData.length-1]=[];
                            arraySeriesData[arrayData.length-1].push(value,value);
                            arrayXAxisData[arrayData.length-1]=[];
                            arrayXAxisData[arrayData.length-1].push("","");
                            //console.log(arraySeriesData[arrayData.length-1])
                            //console.log(arrayXAxisData[arrayData.length-1])
                            arrayData[arrayData.length-1] = ec.init(document.getElementById(name));
                            arrayOption[arrayData.length-1]={
                                tooltip : {
                                    trigger: 'axis'
                                },
                                timeline:false,
                                grid:{
                                    borderWidth:0,
                                    x:20,
                                    y:15,
                                    x2:20,
                                    y3:15
                                },
                                xAxis : [
                                    {
                                        type : 'category',
                                        data : arrayXAxisData[arrayData.length-1],
                                        axisLabel:{
                                            //  interval:3//间隔
                                        },
                                        boundaryGap:false,
                                        show:false
                                    }
                                ],
                                yAxis : [
                                    {
                                        type : 'value',
                                        show:false
                                    }
                                ],
                                series : [
                                    {
                                        name:name,
                                        type:'line',
                                        itemStyle: {
                                            normal: {
                                                color:"#6CD7D9"
                                            }
                                        },
                                        symbol:"none",//不显示圆点
                                        data:arraySeriesData[arrayData.length-1]
                                    }
                                ]
                            };
                            //console.log(arrayData)
                            console.log(arrayData.length)
                            arrayData[arrayData.length-1].setOption(arrayOption[arrayData.length-1]);
                        })

                    }
                );

            }
        }


    };
    // 打开WebSocket
    ws.onclose = function(event) {
        console.log("状态 "+this.readyState+" 已断开")
    };
    // 打开WebSocket
    ws.onopen = function(event) {
        utils.alertMsgTip("订阅成功");
        //$("#btn-subscribe").prop("disabled",true);
        $("#btn-subscribe").hide();
        $("#btn-qxscribe").show();
        $("#eChartsShow").show();
    };
    ws.onerror =function(event){
        console.log(event.data);
    };

});


function clearDate(){
    ws.close();
    $("input[name='subscibe-topic]").val("")
    $("input[name='topic]").val("")
    $("textarea[name='message]").val("");
    $("#btn-qxscribe").hide();
    $("#btn-subscribe").show();
    //location.reload()
}

function initDate(){
    $("input[name='subscibe-topic]").val("")
    $("input[name='topic]").val("")
    $("textarea[name='message]").val("");
    $("#btn-qxscribe").hide()
    $("#btn-subscribe").show()
}

initDate();

$(".dataFlow-top .btn").on("click",function(){
    var show = $(this).attr("show");
    $(this).addClass("btn-black").parent().siblings().find(".btn").removeClass("btn-black");
    $(".data-item").hide();
    $("#"+show).show();
})
