/**
 * Created by liuuestc on 16-11-4.
 * 用于处理ajax交互程序
 */

$(document).ready(function () {
    //处理访客主题事件
    $('#le').click(function () {
        returnTitle('Language');
    });
    $('#iy').click(function () {
       returnTitle('Ideology');
    });
    $('#ca').click(function () {
       returnTitle('China');
    });
    $('#fn').click(function () {
       returnTitle('Foreign');
    });

    //处理访客从blog首页访问文章
    $('#getBlog0').click(function () {
       var getUrl = $('#getBlog0 a').attr('href');
        $.get(getUrl,
        function (response, status) {
            if(status == 'success'){
                $('#blog').html(response);
            }else {
                alert('与服务器连接失败');
            }
        });
    });
    $('#getBlog2').click(function () {
        var getUrl = $('#getBlog2 a').attr('href');
        $.get(getUrl,
            function (response, status) {
                if(status == 'success'){
                    $('#blog').html(response);
                }else {
                    alert('与服务器连接失败');
                }
            });
    });
    $('#getBlog3').click(function () {
        var getUrl = $('#getBlog3 a').attr('href');
        $.get(getUrl,
            function (response, status) {
                if(status == 'success'){
                    $('#blog').html(response);
                }else {
                    alert('与服务器连接失败');
                }
            });
    });
    $('#getBlog1').click(function () {
        var getUrl = $('#getBlog1 a').attr('href');
        $.get(getUrl,
            function (response, status) {
                if(status == 'success'){
                    $('#blog').html(response);
                }else {
                    alert('与服务器连接失败');
                }
            });
    });
    $('#getBlog4').click(function () {
        var getUrl = $('#getBlog4 a').attr('href');
        $.get(getUrl,
            function (response, status) {
                if(status == 'success'){
                    $('#blog').html(response);
                }else {
                    alert('与服务器连接失败');
                }
            });
    });
    $('#getBlog5').click(function () {
        var getUrl = $('#getBlog5 a').attr('href');
        $.get(getUrl,
            function (response, status) {
                if(status == 'success'){
                    $('#blog').html(response);
                }else {
                    alert('与服务器连接失败');
                }
            });
    });
    $('#getBlog6').click(function () {
        var getUrl = $('#getBlog6 a').attr('href');
        $.get(getUrl,
            function (response, status) {
                if(status == 'success'){
                    $('#blog').html(response);
                }else {
                    alert('与服务器连接失败');
                }
            });
    });
    $('#getBlog7').click(function () {
        var getUrl = $('#getBlog7 a').attr('href');
        $.get(getUrl,
            function (response, status) {
                if(status == 'success'){
                    $('#blog').html(response);
                }else {
                    alert('与服务器连接失败');
                }
            });
    });
    //给作者留言
    $('#submit2').click(function () {
        if ($('#email').val() == ''){
            alert('邮箱不能为空');
            return;
        }
        if($('#message').val().length < 15){
            alert('留言不能少于十五个字符');
            return;
        }

        var postUrl = '/processor/contact';
        $.post(postUrl,
            {
                firstname:$('#firstname').val(),
                lastname : $('#lastname').val(),
                email : $('#email').val(),
                subject : $('#subject').val(),
                message : $('#message').val()
            },
            function (response, status) {
            if (status == 'success'){
                if (response['status'] == 'ok'){
                    confirm('留言提交成功,非常感谢你的留言！');
                    location.href = '#';
                }
                else {
                    alert('留言提交失败，请重新提交！');
                    return;
                }
            }else {
                alert('与服务器连接失败 ，请再次提交');
            }
        });
    });
    //评论文本（password为空不显示）
    $("#submitComment").click(function() {
        if ($('#cmtname').val() == '' || $('#cmtpassword').val() == ''){
            alert('姓名和密码不能为空');
            return;
        }
        if($('#cmtmessage').val().length < 15){
            alert('留言不能少于十五个字符');
            return;
        }
        var postUrl = $('form').attr('action');
        $.post(postUrl,
            {
                cmtname:$('#cmtname').val(),
                cmtpassword : $('#cmtPassword').val(),
                message : $('#cmtmessage').val()
            },
            function (response, status) {
                if (status == 'success'){
                    if (response['status'] == 'ok'){
                        var text = addcomment($('#cmtmessage').val(),$('#cmtname').val());
                        $("#cmtlist .row :first").prepend(text);
                        location.href = '#';
                    }
                    else {
                        alert('用户名密码错误，留言提交失败，请重新提交！');
                        return;
                    }
                }else {
                    alert('与服务器连接失败 ，请再次提交');
                }
            });
    });
});

function getblog() {
    alert(this.attr('href'));
    return false;
}


//最重要的函数确定怎么添加文章列表
function returnTitle(subject) {
    var getUrl = '/articles/class/'+subject+'/0';
    $.get(getUrl,function (response, status) {
        if (status = 'success'){
            console.log(response);
                $('#blog').html(response);
                //判断是否有下一页，下面的函数添加上一页或下一页
        }
        else {
            alert('与服务器连接失败！');
        }
    });
}


//暂时未使用
//根据标题返回文章的url，addTitle函数使用
function returnUrl(title,id) {
    var url;
    url = "<a href=" + "/article/" + id +">" + title +"</a>" ;
    return url;
}
//转换时间到字符串, addTitle函数使用
function processDateString(date) {
    var dt = new Date(date.toString());
    return dt.getFullYear() + '-' + dt.getMonth() + '-' + dt.getDate() +
        '  ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
}

function nextPage(url) {
    $.get(url,function (response, status) {
        if (status = 'success'){
            $('#blog').html(response);
            //判断是否有下一页，下面的函数添加上一页或下一页
        }
        else {
            alert('与服务器连接失败！');
            location.href = '#';
        }
    });
}

function addcomment(message,name) {
    var dt = new Date();
    var time =  dt.getFullYear() + '-' + dt.getMonth() + '-' + dt.getDate() +
        '  ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
    var text = " <div class='row' style='text-align: left;margin-left: -5%'><div class='col-md-12'> <blockquote> <p>" +
        message +
    "</p> <small>"+ time + " by:"+" <cite>"+ name+"</cite></small> </blockquote></div></div>";
    return text;
}