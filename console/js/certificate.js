/**
 * Created by huangfeng on 2015/12/23.
 */

//获取证书列表
var authorization="Bearer "+$.cookie('accessToken');

var pageSize= 10,listMark=["0"];

function goPage(mark){
    $.ajax({
        url: "/api/certificate?pageSize="+pageSize+"&mark="+mark,
        dataType:"json",
        beforeSend: function(request) {
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
            for(var i=0;i<length;i++){
                var status='';
                if(list[i].status==0){
                    status='正常';
                }else if(list[i].status==1){
                    status ='过期'
                }else{
                    status ='废弃'
                }

                var certBlob = new Blob([list[i].cert],{type:"text/plain"});
                var keyBlob = new Blob([list[i].key],{type:"text/plain"});

                buff.push('<div class="item"><h3><span class="icon-safe"></span>'+list[i].name+'</h3>' +
                    '<div class="row"><div class="col-md-12">备注： '+list[i].remarks+'</div></div>' +
                    '<div class="row"><div class="col-md-3">状态 <b>正常</b></div><div class="col-md-3">创建日期 <b>'+list[i].created.substring(0,10)+'</b></div>' +
                    '<div class="col-md-3"></div><div class="col-md-3"></div></div>' +
                    '<div class="row"><div class="col-md-3"><a href="'+URL.createObjectURL(certBlob)+'" download="cert-'+list[i].id+'.pem"><span class="glyphicon glyphicon-download-alt"></span><b>下载证书</b></a></div>' +
                    '<div class="col-md-3"><a href="'+URL.createObjectURL(keyBlob)+'" download="key-'+list[i].id+'.pem"><span class="glyphicon glyphicon-download-alt"></span><b>下载密钥</b></a></div>' +
                    '<div class="col-md-3"><a href="#" data-toggle="modal" remarks="'+list[i].remarks+'" uuid="'+list[i].id+'" class="modify-cert" data-target="#modify"><span class="glyphicon glyphicon-pencil"></span><b>修改备注</b></a></div>' +
                    '<div class="col-md-3"><a href="javascript:;" class="remove-cert" uuid="'+list[i].id+'"><span class="glyphicon glyphicon-trash"></span><b>废弃</b></a></div></div></div>')
            };
            $("#list").html(buff.join(''));
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    })

}

goPage(listMark[0])

/*
$.ajax({
    url: "/api/certificate?pageSize=10",
    dataType:"json",
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", authorization);
    },
    success: function(data){
        if(data.list.length==0) return;
        var buff=[],list=data.list,length=list.length;
        for(var i=0;i<length;i++){
            var status='';
            if(list[i].status==0){
                status='正常';
            }else if(list[i].status==1){
                status ='过期'
            }else{
                status ='废弃'
            }

            var certBlob = new Blob([list[i].cert],{type:"text/plain"});
            var keyBlob = new Blob([list[i].key],{type:"text/plain"});

            buff.push('<div class="item"><h3><span class="icon-safe"></span>'+list[i].name+'</h3>' +
                '<div class="row"><div class="col-md-12">备注： '+list[i].remarks+'</div></div>' +
                '<div class="row"><div class="col-md-3">状态 <b>正常</b></div><div class="col-md-3">创建日期 <b>'+list[i].created.substring(0,10)+'</b></div>' +
                '<div class="col-md-3"></div><div class="col-md-3"></div></div>' +
                '<div class="row"><div class="col-md-3"><a href="'+URL.createObjectURL(certBlob)+'" download="cert-'+list[i].id+'.pem"><span class="glyphicon glyphicon-download-alt"></span><b>下载证书</b></a></div>' +
                '<div class="col-md-3"><a href="'+URL.createObjectURL(keyBlob)+'" download="key-'+list[i].id+'.pem"><span class="glyphicon glyphicon-download-alt"></span><b>下载密钥</b></a></div>' +
                '<div class="col-md-3"><a href="#" data-toggle="modal" remarks="'+list[i].remarks+'" uuid="'+list[i].id+'" class="modify-cert" data-target="#modify"><span class="glyphicon glyphicon-pencil"></span><b>修改备注</b></a></div>' +
                '<div class="col-md-3"><a href="javascript:;" class="remove-cert" uuid="'+list[i].id+'"><span class="glyphicon glyphicon-trash"></span><b>废弃</b></a></div></div></div>')
        };

        $("#list").html(buff.join(''));
    }
})*/

//创建证书
var form_create= $("#form_create").Validform({
    tiptype:function(msg,o,cssctl){
        if(!o.obj.is("form")){
            var objtip=o.obj.parent().find("span");
            cssctl(objtip,o.type);
            if(objtip.hasClass("Validform_wrong")){
                objtip.text(msg).show();
            }else{
                objtip.hide();
            }
        }
    },
    btnSubmit:"#btn-submit-create",
    ajaxPost:true,
    postonce:true,
    url:"/api/certificate",
    beforeSubmit:function(curform){
        // $("#btn_form_pwd").html("提交中..");
        var data={
            "name":$("input[name='name']").val(),
            "remarks":$("input[name='remarks']").val()
        };
        form_create.config({
            ajaxpost:{
                contentType:"application/json",
                data:JSON.stringify(data),
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", authorization);
                }
            }
        })
    },
    callback:function(data){
        location.reload()
    }
});

$("#btn-create").on("click",function(){
    form_create.resetForm();
    $("#creat .form-group").find("span").removeClass("Validform_checktip").html("")
})
//修改备注

$("body").on("click",".modify-cert",function(){
    $("input[name='modify_remarks']").val($(this).attr('remarks'));
    $("input[name='modify_id']").val($(this).attr('uuid'));
});

var form_modify= $("#form_modify").Validform({
    tiptype:function(msg,o,cssctl){
        if(!o.obj.is("form")){
            var objtip=o.obj.parent().find("span");
            cssctl(objtip,o.type);
            if(objtip.hasClass("Validform_wrong")){
                objtip.text(msg).show();
            }else{
                objtip.hide();
            }
        }
    },
    btnSubmit:"#btn-submit-modify",
    ajaxPost:true,
    postonce:true,
    beforeSubmit:function(curform){
        var data={
            "remarks":$("input[name='modify_remarks']").val()
        };
        form_modify.config({
            ajaxpost:{
                contentType:"application/json",
                type:"PUT",
                data:JSON.stringify(data),
                url:"/api/certificate/"+$("input[name='modify_id']").val(),
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", authorization);
                }
            }
        })
    },
    callback:function(data){
        utils.alertMsgTip("修改成功");
        setTimeout(function(){
            location.reload()
        },1000)
    }
});


//废弃证书

$("body").on("click",'.remove-cert',function(){
   var uuid=$(this).attr("uuid")
    if(confirm("确定废弃此证书?")){
        $.ajax({
            url: "/api/certificate/"+uuid,
            dataType: "json",
            type:"DELETE",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", authorization);
            },
            success: function (){
                utils.alertMsgTip("删除成功");
                setTimeout(function(){
                    location.reload()
                },1000)

            }

        })
    }

})