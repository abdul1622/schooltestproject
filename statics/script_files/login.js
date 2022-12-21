
var host = window.location.protocol + "//" + window.location.host;
let messages = document.querySelector('.login-err-message')
// login function
function login() {
    var email = document.getElementById('id_email').value
    if (!/@gmail\.com$/.test(email)) {
        messages.innerHTML = 'invalid email'
        return
    }
    var phone = document.getElementById('id_phone').value
    var phoneformat = /^\d{10}$/;
    if (!phone.match(phoneformat)) {
        messages.innerHTML = 'invalid phone number'
        return
    }
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch('http://127.0.0.1:8000/api/simple-login/',
        {
            method: 'POST',
            body: JSON.stringify({ 'email': email, 'phone': phone }),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.status == 'success') {
                console.log("data=", data)
                console.log("email=1", data.data.email)
                console.log("tokendata=", data.data.token)
                console.log(data.data)
                localStorage.setItem('id', data.data.id)
                localStorage.setItem('user_type', data.data.user_type)
                if(data.data.data_entry){
                    localStorage.setItem('data_entry', true)
                }else{
                    localStorage.setItem('data_entry', false)
                }
               let  data_entry = localStorage.getItem('data_entry')
               data_entry = (data_entry === 'true')
                console.log(data_entry)
                localStorage.setItem("token", data.data.token);

                fetch('http://127.0.0.1:8000/api/profile/', {
                    method: 'GET',
                    headers: {
                        'content-Type': 'application/json',
                        'Authorization': 'token' + ' ' + data.data.token,
                    }
                }).then(res => {
                    return res.json()
                }).then(d => {
                    console.log(d)
                    if (d.data.profile.standard) {
                        localStorage.setItem("standard", d.data.profile.standard);
                    }
                    let user_type = localStorage.getItem('user_type')
                    if (user_type == 'is_admin') {
                        window.location.href = `${host}/index`
                    } else {
                        window.location.href = `${host}/profile`
                    }
                    //   return standard
                })
            }
            else {
                document.getElementById('loginerror').style.display = 'block';

            }

        })
}

let input = document.getElementById('id_phone')
input.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        login();
    }
})

