const TIME_COOKIE_VALID = 60;

function validateLogin(username, password){
    let isOk = true;
    let usernameBlock = document.getElementById('username')
    let passwordBlock = document.getElementById('password')
    if(username === ''){
        usernameBlock.style.border = "1px solid var(--danger-color)"
        toast({
            title: 'Invalid',
            message: 'Please enter username',
            type: 'error',
            duration: 3000
        })
        isOk = false;
    }
    else{
        usernameBlock.style.border = "1px solid var(--grey-color)"
    }


    if(password === ''){
        toast({
            title: 'Invalid',
            message: 'Please enter password',
            type: 'error',
            duration: 3000
        })
        passwordBlock.style.border = "1px solid var(--danger-color)"
        isOk = false
    }
    else{
        passwordBlock.style.border = "1px solid var(--grey-color)"
    }
    return isOk;
}

function setCookie(cname, cvalue, exminutes) {
    const d = new Date();
    d.setTime(d.getTime() + (exminutes*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

if(document.getElementById('btn-login')){
    let btnLogin = document.getElementById('btn-login');
    btnLogin.addEventListener('click', (e)=>{
        e.preventDefault();
        let username = $('#username').val();
        let password = $('#password').val();
        if(validateLogin(username, password)){
            login(username, password);
        }
    })
}

function login(username, password){
    $.ajax({
        url: '/login',
        type: 'POST',
        data: {
            username,
            password
        },
        success: function(data){
            if(data){
                if(data.role === 'admin'){
                    setCookie('token', data.token, TIME_COOKIE_VALID);
                    window.location.href = "/admin/home";
                }
                if(data.role === 'guest'){
                    setCookie('token', data.token, TIME_COOKIE_VALID);
                    window.location.href = "/me/home";
                }
            } else{
                let usernameBlock = document.getElementById('username')
                let passwordBlock = document.getElementById('password')
                usernameBlock.style.border = "1px solid var(--grey-color)"
                passwordBlock.style.border = "1px solid var(--grey-color)"
                toast({
                    title: 'Warning',
                    message: 'Username or password is not correct',
                    type: 'error',
                    duration: 3000,
                });
            }
        }
    })
}
