
/****************************************************************
 * Toast
 */
function toast({ title = "", message = "", type = "info", duration = 3000 }) {
    const main = document.getElementById("toast");
    if (main) {
      const toast = document.createElement("div");
      // Auto remove toast
      const autoRemoveId = setTimeout(function () {
        main.removeChild(toast);
      }, duration + 1000);
      // Remove toast when clicked
      toast.onclick = function (e) {
        if (e.target.closest(".toast__close")) {
          main.removeChild(toast);
          clearTimeout(autoRemoveId);
        }
      };
  
      const icons = {
        success: "fas fa-check-circle",
        info: "fas fa-info-circle",
        warning: "fas fa-exclamation-circle",
        error: "fas fa-exclamation-circle"
      };
      const icon = icons[type];
      const delay = (duration / 1000).toFixed(2);
  
      toast.classList.add("toast", `toast--${type}`);
      toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;
  
      toast.innerHTML = `
                      <div class="toast__icon">
                          <i class="${icon}"></i>
                      </div>
                      <div class="toast__body">
                          <h3 class="toast__title">${title}</h3>
                          <p class="toast__msg">${message}</p>
                      </div>
                      <div class="toast__close">
                          <i class="fas fa-times"></i>
                      </div>
                  `;
      main.appendChild(toast);
    }
}

/******************************************
 * Login Event
 */

if(document.getElementById('btn-login')){
    let btnLogin = document.getElementById('btn-login');
    btnLogin.addEventListener('click', (e)=>{
        e.preventDefault();
        let username = document.getElementById('username').value
        let password = document.getElementById('password').value
        if(validateLogin(username, password)){
            login(username, password);
        }
    })
}

function login(username, password){
    
}

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