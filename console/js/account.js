/**
 * Created by huangfeng on 2015/12/17.
 */

$.ajax({
    url:"/ucenter/user/basic.do",
    dataType:'json',
    success: function(data){
        $("input[name='contact']").val(data.contact);
        $("input[name='tel']").val(data.tel);
        $("input[name='company']").val(data.company);

    }
})


$(".equipment-top .btn").on("click",function(){
    var show = $(this).attr("show");
    $(this).addClass("btn-black").parent().siblings().find(".btn").removeClass("btn-black");
    $(".data-item").hide();
    $("#"+show).show();
})


//修改资料
var form_account= $("#form_account").Validform({
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
    ajaxPost:true,
    postonce:true,
    beforeSubmit:function(curform){
        $("#btn_form_account").html("提交中..");
         var data={
         "contact":$("input[name='contact']").val(),
         "tel":$("input[name='tel']").val(),
         "company":$("input[name='company']").val()
         };
        form_account.config({
            ajaxpost: {
                //可以传入$.ajax()能使用的，除dataType外的所有参数;
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, textStatus, xhr) {
                    $("#error-account-msg").html(data._message).show();
                    setTimeout(function(){
                    $("#error-account-msg").fadeOut("slow")
                    },2000)
                },
                error: function (xhr, textStatus, errorThrown) {
                    var response = eval("(" + xhr.responseText + ")");
                    $("#error-account-msg").html(response._message).show();
                },
                complete: function (xhr, textStatus) {
                    $("#btn_form_account").html("提交");
                }
            }
        })
    },
    callback:function(data){

    }
});

//修改邮箱
var form_email= $("#form_email").Validform({
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
    ajaxPost:true,
    postonce:true,
    //btnSubmit:"#submit_form_email",
    beforeSubmit:function(curform){
        $("#btn_form_email").html("提交中..");
        var data={
            "password":hex_md5($("input[name='password']").val()),
            "email":$("input[name='email']").val()
        };
        form_email.config({
            ajaxpost:{
                contentType:"application/json",
                data:JSON.stringify(data),
                success:function(data,textStatus,xhr){
                    $("#error-email-msg").html(data._message).show();
                    setTimeout(function(){
                        $("#error-email-msg").fadeOut("slow")
                    },2000)
                },
                error:function(xhr,textStatus,errorThrown){
                    var response = eval("("+xhr.responseText+")");
                    $("#error-email-msg").html(response._message).show();
                },
                complete:function(xhr,textStatus){
                    $("#btn_form_email").html("提交");
                }
            }
        })
    },
    callback:function(data){

    }
});

//修改密码
var form_pwd= $("#form_pwd").Validform({
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
    ajaxPost:true,
    postonce:true,
    beforeSubmit:function(curform){
        $("#btn_form_pwd").html("提交中..");
        var data={
            "oldPassword":hex_md5($("input[name='oldPassword']").val()),
            "newPassword":hex_md5($("input[name='newPassword']").val())
        };
        form_pwd.config({
            ajaxpost:{
                contentType:"application/json",
                data:JSON.stringify(data),
                success:function(data,textStatus,xhr){
                    $("#error-pwd-msg").html(data._message).show();
                    setTimeout(function(){
                        $("#error-pwd-msg").fadeOut("slow")
                    },2000)
                },
                error:function(xhr,textStatus,errorThrown){
                    var response = eval("("+xhr.responseText+")");
                    $("#error-pwd-msg").html(response._message).show();
                },
                complete:function(xhr,textStatus){
                    $("#btn_form_pwd").html("提交");
                }
            }
        })
    },
    callback:function(data){

    }
});