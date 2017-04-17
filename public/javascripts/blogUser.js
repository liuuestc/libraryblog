/**
 * Created by liuuestc on 16-10-31.
 */
// $(document).ready(function () {
//
// });


function checkReg() {
    //如果有值为空则返回false
    if($('#username').val()=='' || $('#email').val() == '' ||$('#password').val() == '' || $('#password_confirm').val() == '' ){
        alert("有没填写的选项");
        return false;
    }
    else if($('#password').val() != $('#password_confirm').val() ){
        alert("两次密码输入不一样");
        return false;
    }
    else{
        return true;
    }
}

function checkLogin() {
    if ($('#username').val() == '' || $('#password') == ''){
        alert('没有填写用户名或密码！');
        return false;
    }else {
        return true;
    }
    
}
