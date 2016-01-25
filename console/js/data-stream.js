/**
 * Created by huangfeng on 2015/12/17.
 */

//数据流列表

var authorization="Bearer "+$.cookie('accessToken');
var pageSize= 10,listMark=["0"],listsearchMark=["0"];

/*$.ajax({
    url: "/api/stream?pageSize="+pageSize,
    dataType: "json",
    beforeSend: function (request) {
        request.setRequestHeader("Authorization", authorization);
    },
    success: function(data){
        var list = data.list, len = list.length;
        if (len == 0) return;
        var buff = [];
        for (var i = 0; i < len; i++) {
            buff.push('<tr><td>' + list[i].name + '</td><td>' + list[i].action + '</td><td>' + list[i].created.substring(0, 10) + '</td>' +
                '<td><a href="javascript:;" dataId="' + list[i].id + '" class="btn-link btn-delete">删除</a>' +
                '<a href="javascript:;" data-toggle="modal" data-target="#myModal" dataId="' + list[i].id + '" class="btn-link btn-edit">编辑</a></td></tr>')
        }
        $("#list").html(buff.join(''));
        if(data.more){
            page++;
            currentMark=data.mark;
            listMark.push(data.mark);
            $("#page").show();
            $("#next").html('<a href="javascript:;" onclick="goPage(1,\''+data.mark+'\')">下一页</a>')
        }
    }

});*/


function goPage(mark){
    $.ajax({
        url: "/api/stream?pageSize="+pageSize+"&mark="+mark,
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success: function(data){
            if(data.list==0) {
                if(listMark.length==1){
                    $("#page").hide();
                }else{
                    $("#page").show();
                    utils.alertMsgTip("没有下一页了")
                }
                return;
            };
            var buff = [], list = data.list, length = list.length;
            var len = listMark.length;
            for (var l = 0; l < len; l++) {
                if (listMark[l] == data.mark) {
                    listMark = listMark.slice(0,l+1);
                    break;
                } else {
                    if (l == (listMark.length - 1)) {
                        listMark.push(data.mark);
                    }
                }
            }
            var previous=0;
            if(listMark.length - 3<0){
                previous=0
            }else{
                previous=listMark.length - 3;
            }
            $("#previous").html('<a href="javascript:goPage(\'' + listMark[previous] + '\')">上一页</a>')
            $("#next").html('<a href="javascript:goPage(\'' + data.mark + '\')">下一页</a>');
            $("#currentPage").html('当前第'+(listMark.length-1)+'页')
            $("#page").show();

            for (var i = 0; i < length; i++) {
                buff.push('<tr><td>' + list[i].name + '</td><td>' + list[i].action + '</td><td>' + list[i].created.substring(0, 10) + '</td>' +
                    '<td><a href="javascript:;" dataId="' + list[i].id + '" class="btn-link btn-delete">删除</a>' +
                    '<a href="javascript:;" data-toggle="modal" data-target="#myModal" dataId="' + list[i].id + '" class="btn-link btn-edit">编辑</a></td></tr>')
            }
            $("#list").html(buff.join(''));

        }

    });

}

goPage(listMark[0])

$("#action-output .btn-xs").on("click",function(){
    $("#action-output .output-item").hide();
    $("."+$(this).attr("show")).show();
    $(this).addClass("btn-info").removeClass("btn-link").siblings().removeClass("btn-info").addClass("btn-link")
})


$("input[name='action-type']").on("click",function(){
    $(".table-wrapper .table-bordered").hide();
    $("#"+$(this).attr("show")).show();
    var v= $('input:radio[name="action-type"]:checked').val();
})

$("#btn-create-data-stream").on("click",function(){
    $("#myModalLabel").html("新建数据流");
    $("#save-data-stream").show()
    $("#update-data-stream").hide()
    $("input[name='action-type']").prop("checked",false);
    $("input[name='action-type']").eq(0).prop("checked",true);
    $(".table-wrapper .table-bordered").hide();
    $("#action-input").show();
    $("input[name='name']").val("").prop("disabled",false);
    $("input[name='input-topic']").val("");
    $("textarea[name='input-schema']").val("");
    $("input[name='output-topic']").val("");
    $("input[name='uri']").val("");
    $("input[name='to']").val("");
    $("input[name='subject']").val("");
    $("input[name='topic']").val("");
    $("input[name='all-schema']").val("");
})


//创建数据流

$("#save-data-stream").on("click",function(){
    var name = $.trim($("input[name='name']").val());
    if (name.length == 0) {
        alert("名称不能为空");
        return
    }
    var action= $('input:radio[name="action-type"]:checked').val();
    if(action=="input"){
        var schema= $.trim($("textarea[name='input-schema']").val());
        if(schema.length==0){
            alert("schema不能为空");
            return;
        }
        var topic=[];
        $("input[name='input-topic']").each(function(i,z){
           if($.trim($(this).val()).length>0){
               topic.push($(this).val())
           }
        });
        if(topic.length==0){
            alert("至少输入一个主题");
            return;
        };
         var data={
             name:name,
             define:{
                 "action":"input",
                 "topic":topic,
                 "schema":schema
             }
         };
        postAjax(data)
    }

    if(action=="output"){
        var type=$("#action-output .btn-info").attr("show");
        if (type == "MQTT") {
            var output_topic = $.trim($("input[name='output-topic']").val());
            if (output_topic.length == 0) {
                alert("主题不能为空");
                return;
            }
            var data = {
                name: name,
                define: {
                    "action": "output",
                    "topic": [output_topic],
                    "type": "MQTT"
                }
            };
            postAjax(data)
        };
        if (type == "HTTP") {
            var uri = $.trim($("input[name='uri']").val());
            if (uri.length == 0) {
                alert("uri不能为空");
                return;
            }
            var data = {
                name: name,
                define: {
                    "action": "output",
                    "type": "HTTP",
                    "uri": uri
                }
            };
            postAjax(data)
        }

        if (type == "EMAIL") {
            var to = $.trim($("input[name='to']").val());
            if (to.length == 0) {
                alert("收件人不能为空");
                return;
            }
            var subject = $.trim($("input[name='subject']").val());
            if (subject.length == 0) {
                alert("主题不能为空");
                return;
            }
            var data = {
                name: name,
                define: {
                    "action": "output",
                    "type": "EMAIL",
                    "to": to,
                    "subject": subject,
                }
            };
            postAjax(data)
        }

    };

    if(action=="all"){
        var topic = $.trim($("input[name='topic']").val());
        if (topic.length == 0) {
            alert("主题不能为空");
            return;
        }
        var all_schema = $.trim($("textarea[name='all-schema']").val());
        if (all_schema.length == 0) {
            alert("schema不能为空");
            return;
        }
        var data = {
            name: name,
            define: {
                "action": "all",
                "topic": [topic],
                "schema": all_schema
            }
        };
        postAjax(data)
    }


})

function postAjax(data){
    $.ajax({
        url: "/api/stream/",
        dataType: "json",
        type:"post",
        contentType:'application/json',
        data:JSON.stringify(data),
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success:function(data,textStatus,xhr){
            location.reload()
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    })
}


$(".addTheme").on("click",function(){
    var item = '<div class="item"><div class="form-group input-group-sm"><input type="text" name="input-topic" class="form-control" placeholder="输入主题"></div>' +
        ' <button type="button" class="btn btn-link btn-sm btn-qx">取消</button> ' +
        '</div>';
    $("#topic").append(item)
});

$("body").on("click",".btn-qx",function(){
    $(this).parent().remove();
})


//删除数据流

$("body").on("click",".btn-delete",function(){
    if(!confirm("确定删除?")){
        return;
    }
    var self=$(this).parent().parent()
    var id =$(this).attr("dataId")
    $.ajax({
        url: "/api/stream/"+id,
        type:"DELETE",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success: function (){
            self.remove();
            utils.alertMsgTip("删除成功")
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    })
});

//获取数据流

var updateId='';

$("body").on("click",".btn-edit",function(){
    $("#myModalLabel").html("编辑数据流");
    $("#save-data-stream").hide();
    $("#update-data-stream").show();
    updateId=$(this).attr("dataid");
    $.ajax({
        url: "/api/stream/"+updateId,
        dataType: "json",
        contentType:'application/json',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success: function(data){
            $("input[name='name']").val(data.name).prop("disabled",true);
            var action=data.define.action;
            if(action=="input"){
                $("input[name='action-type']").prop("checked",false);
                $("input[name='action-type']").eq(0).prop("checked",true);
                $(".table-wrapper .table-bordered").hide();
                $("#action-input").show();
                $("textarea[name='input-schema']").val(JSON.stringify(data.define.schema));
                var topic=data.define.topic,topicArray=[];
                $.each(topic,function(i,v){
                    topicArray.push('<div class="item"><div class="form-group input-group-sm">' +
                        '<input type="text" class="form-control" value="'+v+'" placeholder="输入主题" name="input-topic"></div>' +
                        '<button class="btn btn-link btn-sm btn-qx" type="button">取消</button></div>');
                });
                $("#topic").html(topicArray.join(''));
            };

            if(action=="output"){
                $("input[name='action-type']").prop("checked",false);
                $("input[name='action-type']").eq(1).prop("checked",true);
                $(".table-wrapper .table-bordered").hide();
                $("#action-output").show();
                $("#action-output .output-item").hide();
                if(data.define.type=="MQTT"){
                    $("#btn-group button").addClass("btn-link").removeClass("btn-info");
                    $("#btn-group .btn-MQTT").addClass("btn-info").removeClass("btn-link");
                    $("#action-output .MQTT").show();
                    $("input[name='output-topic']").val(data.define.topic[0])
                }
                if(data.define.type=="HTTP"){
                    $("#btn-group button").addClass("btn-link").removeClass("btn-info");
                    $("#btn-group .btn-HTTP").addClass("btn-info").removeClass("btn-link");
                    $("#action-output .HTTP").show();
                    $("input[name='uri']").val(data.define.uri)
                }
                if(data.define.type=="EMAIL"){
                    $("#btn-group button").addClass("btn-link").removeClass("btn-info");
                    $("#btn-group .btn-EMAIL").addClass("btn-info").removeClass("btn-link");
                    $("#action-output .EMAIL").show();
                    $("input[name='to']").val(data.define.to)
                    $("input[name='subject']").val(data.define.subject)
                }

            };

            if(action=="all"){
                $("input[name='action-type']").prop("checked",false);
                $("input[name='action-type']").eq(2).prop("checked",true);
                $(".table-wrapper .table-bordered").hide();
                $("#action-all").show();
                $("#action-output .output-item").hide();
                $("#action-output .EMAIL").show();
            }

            $("#update-data-stream").attr("updataId",updateId)

        }
    })


})



//修改数据流

$("#update-data-stream").on("click",function(){

    var name = $.trim($("input[name='name']").val());
    if (name.length == 0) {
        alert("名称不能为空");
        return
    }
    var action= $('input:radio[name="action-type"]:checked').val();
    if(action=="input"){
        var schema= $.trim($("textarea[name='input-schema']").val());
        if(schema.length==0){
            alert("schema不能为空");
            return;
        }
        var topic=[];
        $("input[name='input-topic']").each(function(i,z){
            if($.trim($(this).val()).length>0){
                topic.push($(this).val())
            }
        });
        if(topic.length==0){
            alert("至少输入一个主题");
            return;
        };
        var data={
            id: updateId,
            define:{
                "action":"input",
                "topic":topic,
                "schema":schema
            }
        };
        updateAjax(data)
    }

    if(action=="output"){
        var type=$("#action-output .btn-info").attr("show");
        if (type == "MQTT") {
            var output_topic = $.trim($("input[name='output-topic']").val());
            if (output_topic.length == 0) {
                alert("主题不能为空");
                return;
            }
            var data = {
                id: updateId,
                define: {
                    "action": "output",
                    "topic": [output_topic],
                    "type": "MQTT"
                }
            };
            updateAjax(data)
        };
        if (type == "HTTP") {
            var uri = $.trim($("input[name='uri']").val());
            if (uri.length == 0) {
                alert("uri不能为空");
                return;
            }
            var data = {
                id: updateId,
                define: {
                    "action": "output",
                    "type": "HTTP",
                    "uri": uri
                }
            };
            updateAjax(data)
        }

        if (type == "EMAIL") {
            var to = $.trim($("input[name='to']").val());
            if (to.length == 0) {
                alert("收件人不能为空");
                return;
            }
            var subject = $.trim($("input[name='subject']").val());
            if (subject.length == 0) {
                alert("主题不能为空");
                return;
            }
            var data = {
                id: updateId,
                define: {
                    "action": "output",
                    "type": "EMAIL",
                    "to": to,
                    "subject": subject,
                }
            };
            updateAjax(data)
        }

    };

    if(action=="all"){
        var topic = $.trim($("input[name='topic']").val());
        if (topic.length == 0) {
            alert("主题不能为空");
            return;
        }
        var all_schema = $.trim($("textarea[name='all-schema']").val());
        if (all_schema.length == 0) {
            alert("schema不能为空");
            return;
        }
        var data = {
            name: name,
            define: {
                "action": "all",
                "topic": [topic],
                "schema": all_schema
            }
        };

        updateAjax(data)
    }
})

function updateAjax(data){
    $.ajax({
        url: "/api/stream/"+updateId,
        dataType: "json",
        type:"put",
        contentType:'application/json',
        data:JSON.stringify(data),
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success:function(data,textStatus,xhr){
            utils.alertMsgTip(data._message)
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    })
}

