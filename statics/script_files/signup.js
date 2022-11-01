
let messages = document.querySelector('.messages')
let error_messages = document.querySelector('.error-messages')
let user, standards = [];
let content = ''
let grade_list = []
let standard;
let sec_list;
var element ;
// geting standard dropdown
fetch('https://schooltestproject.herokuapp.com/api/grades/', {
            method: 'GET',
        }).then(res => {
            return res.json()
        }).then(data => {
            grade_list = data.data
            console.log(data.data)
           if(data.status == 'failure'){
            window.location.href = `${host}/404`
           } 
        content += ` 
            <option value="" selected="">---------</option>`
        if(grade_list.length){
        for(i=0;i<grade_list.length;i++){
            content += ` <option value="${grade_list[i].grade}">${grade_list[i].grade}</option>`
        }
    }
        document.querySelector('.std-in-form').innerHTML = content
        })



    // get section dropdown
    function getsectionname(element){
         standard = element.value
         sec_list = null;
        ;
        content = ''
        for(i=0;i<grade_list.length;i++){
            if(grade_list[i].grade==standard){
                sec_list = grade_list[i].section
            }
        }
        content += ` 
            <option value="" selected="">---------</option>`
        if(sec_list.length){
        for(i=0;i<sec_list.length;i++){
            content += ` <option value="${sec_list[i]}">${sec_list[i]}</option>`
        }
    }
        document.querySelector('.sec-in-form').innerHTML = content
    }

    // user type change
    function user_type_change() {
        user = document.getElementById('id_user_type').value
        document.querySelector('.signup-errors').innerHTML = ''
        document.querySelector('.details').innerHTML = ''
        content = ''
        standards = []
        console.log(user)
        document.getElementById('standard-p').style.display = 'block'
            document.getElementById('section-p').style.display = 'block'
        if(user=='is_admin'){
            document.getElementById('standard-p').style.display = 'none'
            document.getElementById('section-p').style.display = 'none'
            document.getElementById('standard_add_btn').style.display = 'none'
        }
        else if (user == 'is_staff') {
            document.getElementById('standard_add_btn').style.display = 'block'
            document.getElementById('standard_add_btn').disabled = false
        } else {
            document.getElementById('standard_add_btn').style.display = 'none'
        }
    
    }


    // adding standards to the list(standards)
    function add_standard() {
        standard = document.getElementById('id_standard').value
        section = (document.getElementById('id_section').value).toUpperCase()
        if (!section.match(/[a-z]/i)) {
            document.querySelector('.signup-errors').innerHTML = '<li class="text-danger">give a valid section</li>'
            return
        }
        if(!standard){
            document.querySelector('.signup-errors').innerHTML = '<li class="text-danger">give a valid standard</li>'
            return
        }
        if(standards.includes(standard + '-' + section)){
        document.querySelector('.signup-errors').innerHTML = '<li class="text-danger">given standard and section altready exist</li>'
        return
        }
        standards.push(standard + '-' + section)
        document.getElementById('id_standard').value = ''
        document.getElementById('id_section').value = ''
        let content = ''
        if(standards.length){
    content += `<ul>Standards list 
            <p> No of standards-${standards.length} </p>`
    
        for (i = 0; i < standards.length; i++) {
            content += `<li>${standards[i]} <button onclick=delete_standard(${i})>delete</button></li>`
        }
        content += `</ul>`
    }
        document.querySelector('.signup-errors').innerHTML = ''
        document.querySelector('.details').innerHTML = content
    }

    // remove standards from the list(standards)
    function delete_standard(index){
    standards.splice(index,1);
    let content = ''
        if(standards.length){
    content += `<ul>Standards list 
            <p> No of standards-${standards.length} </p>`
    
                    for(i=0;i<standards.length;i++){
                      content += `<li>${standards[i]} <button onclick=delete_standard(${i})>delete</button></li>`
                    }
        }
        document.querySelector('.signup-errors').innerHTML = ''
                    document.querySelector('.details').innerHTML = content
  }
//   $("#signupbox").validate({
//     rules: {
//      id_email: "required",
//      id_phone: "required",
//      id_register_number: "required",
//      id_date_of_birth : "required",
//      id_first_name : "required",
//      id_full_name : "required",
//      id_address : "required",
//     },
//     messages: {
//      id_email: "Please fill your email",
//      id_phone: "Please fill your email",
//      id_register_number: "Please fill your register number",
//      id_date_of_birth : "Please fill your data birth",
//      id_first_name : "Please fill your first name",
//      id_full_name : "Please specify your name",
//      id_address : "Please fill your address",
//     }
//  })
 
    // signup function
  
    function closemessage(e){
        element = e.parentElement.parentElement.parentElement.parentElement
            $(`#${element.id}`).modal('hide')
        }
    function signup() {
        // // console.log(($("#signupbox").valid())) 
        // document.getElementById("myForm").submit();
        let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        var email = document.getElementById('id_email').value
        var phone = document.getElementById('id_phone').value
        var dob = document.getElementById('id_date_of_birth').value
        var type = document.getElementById('id_user_type').value
        var firstname = document.getElementById('id_first_name').value
        var lastname = document.getElementById('id_last_name').value
        var fullname = document.getElementById('id_full_name').value
        var address = document.getElementById('id_address').value
        var is_dataentry = document.getElementById('id_data_entry_user').value
        // let details = {'email':email,'phone':phone,'dob':dob,'reg':reg,'firstname':firstname,'fullname':fullname,'address':address} 
        let signup_errors = document.querySelector('.signup-error')
        let error_content = ''
        if(!email){
            error_content += `<li class='text-danger'>email is requied</li>`
        }        
        if(!phone){
            error_content += `<li class='text-danger'>phone number is required</li>`
        }
        if(!dob){
            error_content += `<li class='text-danger'>dob is requied</li>`
        }
        if(!firstname){
            error_content += `<li class='text-danger'>firstname is requied</li>`
        }
        if(!fullname){
            error_content += `<li class='text-danger'>full name is requied</li>`
        }
        if(!address){
            error_content += `<li class='text-danger'>address is requied</li>`
        }
        if(!email || !phone || !dob || !firstname || !fullname || !address){
            $('#messageModal-signup').modal('show')
            signup_errors.innerHTML = error_content
            return
        }

        /*var email = 's@gmail.com'
        var phone =  9992945428
        var dob = '2000-02-10'
        var reg ='s10'
        var standard = 1
        var section = 'c'
        var type = 'is_student'
        var firstname = 's'
        var lastname = 'p'
        var fullname = 'sp'
        var address ='home'
        var is_dataentry = 'false'*/
        if(document.getElementById('id_standard')){
        standard = document.getElementById('id_standard').value
        section = document.getElementById('id_section').value
        }
        if (!standards.length && standard && section) {
            standards.push(standard + '-' + section)
        }else if(type=='is_student'){
            document.querySelector('.signup-errors').innerHTML = '<li class="text-center text-danger">add a standard and section</li>'
            return
        }
        fetch('https://schooltestproject.herokuapp.com/api/signup/',
            {
                method: 'POST',
                body: JSON.stringify({
                    'email': email, 'phone': phone, 'date_of_birth': dob, 'user_type': type,
                    'is_data_entry': is_dataentry, 'first_name': firstname, 'last_name': lastname, 'standard': standards, 'full_name': fullname, 'address': address
                }
                ),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
            }).then(res => {
                return res.json()
            }).then(data => {
                if (`${data.status}` == 'Registered succesfull') {
                    window.location.href = `${host}/login`
                }
                document.getElementById('response').innerHTML = `${data.data.error[0]}`
                document.getElementById('response').style.display = 'block'
            })
        return true;
    }
    
    let input = document.getElementById('id_address')
    input.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            signup();
        }
    })

    function check_email(element){
        console.log(element.value)
        url_for_check = new URL('http://127.0.0.1:8000/api/check-user/');
        url_for_check.searchParams.append('email', element.value);
        fetch(url_for_check, {
            method: 'GET',
        }).then(res => {
            console.log(res,res.status)
            if(res.status != 200){
                document.querySelector('.email-error').innerHTML = 'email altready exits' 
            }
            else{
                document.querySelector('.email-error').innerHTML = ''
            }
        })
    }
    function check_phone(element){
        url_for_check = new URL('http://127.0.0.1:8000/api/check-user/');
        url_for_check.searchParams.append('phone', element.value);
        fetch(url_for_check, {
            method: 'GET',
        }).then(res => {
            if(res.status != 200){
                document.querySelector('.phone-error').innerHTML = 'phone number altready exits' 
            }else{
                document.querySelector('.phone-error').innerHTML = ''
            }
        })
    }