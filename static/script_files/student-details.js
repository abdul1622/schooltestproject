let user, standards = [];
let students=[];
let content = '';
let grade_list;
let token = localStorage.getItem("token")
document.getElementById('reg-no-div').style.display = 'none'
$(document).ready(function(){ 
  if(!token){
    return window.location.href = '/login';
  }
  var user = localStorage.getItem('user_type')
  if (user == 'is_student'){
   return window.location.href = '/404'; 
  }
document.getElementById('nav-students').style.opacity = '0.5';

})
function reload() {
  window.location.href = window.location.href;
}
fetch('https://schooltestproject.herokuapp.com/api/grades/', {
          method: 'GET',
          headers: new Headers({
          'Authorization': 'token' + ' ' + token,
          'Content-Type': 'application/json'
        })
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
      document.querySelector('.grade-in-form').innerHTML = content
      document.getElementById('std').innerHTML=content
      })

//  section list
function getsectionname(element){
      let standard = element.value
      console.log(standard,'selected')
      let sec_list;
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
      document.querySelector('.section-in-form').innerHTML = content
      document.getElementById('sec').innerHTML=content
  }
document.getElementById('id_section').addEventListener('change',()=>{
  var std=document.getElementById('id_grade').value
  var sec=document.getElementById('id_section').value
  var whole= std+'-'+sec
  console.log(whole)
  var table, tr, td, txtValue;
  table = document.getElementById("usr");
  tr = table.getElementsByTagName("tr");
  const stdcount=[]
  for (i = 0; i < tr.length; i++) {
      alltags = tr[i].getElementsByClassName("userstandard");
      isFound = false;
      for(j=0; j< alltags.length; j++) {
        td = alltags[j];
        if (td) {
            console.log(td)
            txtValue = td.textContent || td.innerText;
            if (txtValue.indexOf(whole) > -1) {
                tr[i].style.display = "";
                isFound = true;
                stdcount.push(tr)
                document.getElementById('count').innerHTML=`No of students - ${stdcount.length}`
            }
          }       
        }
        if(!isFound && tr[i].className !== "header") {
          tr[i].style.display = "none";
        }
      }
})
function add_form(){
   document.getElementById('email').value = ''
   document.getElementById('phone').value = ''
   document.getElementById('dob').value = ''
   document.getElementById('fname').value = ''
   document.getElementById('lname').value = ''
   document.getElementById('ffname').value = ''
   document.getElementById('std').value = ''
   document.getElementById('address').value = ''
   document.getElementById('reg-no-div').style.display = 'none'
   $('#student-FormModal').modal('show')
}

let messages = document.querySelector('.messages')
let error_messages = document.querySelector('.error-messages')
button = document.getElementById('userdetail-btn');
var host = window.location.protocol + "//" + window.location.host;
let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
let form = document.getElementById('userDetails')
  fetch('https://schooltestproject.herokuapp.com/api/user-details/', {
    method: 'GET',
    headers: new Headers({
      'Authorization': 'token' + ' ' + token,
      'Content-Type': 'application/json',
    })
  }).then(res => {
    return res.json()
  }).then(data => {
    data.forEach((d, index) => {
      if (`${d.user_type}` == 'is_student') {
        students.push(d)
      }
  })
  console.log(students)
  let table2 = `<table class='table md-mt-2 text-white' id='usr'>`;
    table2 += `<tr class='table-heading'>
           <th  scope="col" >Email</th>
           <th  scope="col" >Phone</th>
           <th  scope="col">RegNo</th>
           <th  scope="col">FullName</th>
           <th  scope="col">FirstName</th>
           <th  scope="col">LastName</th>
           <th  scope="col">Date Of Birth</th>
           <th  scope="col">Address</th>
           <th  scope="col">Standard</th>
           <th id="action"  scope="col">Action</th>
    </tr>`;
         console.log(students.length)
         students.forEach((d, index) => {
          console.log('to')
            table2 = table2 + `<tbody><tr id=${d.id} scope="row">`;
            table2 = table2 + '<td class="useremail">' + `${d.email}` + '</td>';
            table2 = table2 + '<td class="userphone">' + `${d.phone}` + '</td>';
            table2 = table2 + '<td class="userreg">' + `${d.register_number}` + '</td>';
            table2 = table2 + '<td class="userfullname">' + `${d.profile?.full_name}` + '</td>';
            table2 = table2 + '<td class="userfirstname">' + `${d.profile?.first_name}` + '</td>';
            table2 = table2 + '<td class="userlastname">' + `${d.profile?.last_name}` + '</td>';
            table2 = table2 + '<td class="userDOB">' + `${d.date_of_birth}` + '</td>';
            table2 = table2 + '<td class="useraddress">' + `${d.profile?.address}` + '</td>';
            table2 = table2 + '<td class="userstandard">' + `${d.profile?.standard}` + '</td>';
            table2 = table2 + '<td>' + ` <i id="edit" data-toggle="modal" data-target="#student-FormModal" class="fa fa-edit"></i><i id="delete" data-toggle="modal" data-target="#delete-user-Modal" class="fa fa-trash-o" ></i>` + '</td></tbody>',
              table2 = table2 + `</tr>`;
            })
        table2 += "</table>";
        container2.innerHTML = table2;
})  

container2.addEventListener('click', (e) => {
    form_email = document.getElementById('email');
    form_phone = document.getElementById('phone');
    form_reg = document.getElementById('reg');
    form_dob = document.getElementById('dob');
    form_fname = document.getElementById('fname');
    form_lname = document.getElementById('lname');
    form_fullname = document.getElementById('ffname');
    form_std = document.getElementById('std');
   // form_sec = document.getElementById('sec');
    form_ad = document.getElementById('address');
    button = document.getElementById('userdetail-btn');
    e.preventDefault();
    let delbutton = e.target.id == 'delete';
    let editbutton = e.target.id == 'edit';
    let id = e.target.parentElement.parentElement.id
    console.log(id)
    yes = document.getElementById('yes')
    no = document.getElementById('no')
    if (delbutton) {
      yes.setAttribute("onClick", `deletestudent(${id})`);
    }
    if (editbutton) {
      url = "https://schooltestproject.herokuapp.com/api/user-details/"
      const parent = e.target.parentElement.parentElement;
      console.log(parent)
      let email = parent.querySelector(".useremail").textContent;
      let phone = parent.querySelector('.userphone').textContent;
      let reg = parent.querySelector('.userreg').textContent;
      let dob = parent.querySelector('.userDOB').textContent;
      let fullname = parent.querySelector('.userfullname').textContent;
      let lastname = parent.querySelector('.userlastname').textContent;
      let firstname = parent.querySelector('.userfirstname').textContent;
      let stdsec=parent.querySelector('.userstandard').textContent;
      let standard = parseInt(stdsec);
      let section = stdsec.slice(-1);
      let address = parent.querySelector('.useraddress').textContent;
      document.getElementById('exampleModalLabel').innerHTML=fullname
      document.getElementById('email').value = email
      document.getElementById('phone').value = phone
      document.getElementById('reg').value = reg
      document.getElementById('dob').value = dob
      document.getElementById('ffname').value = fullname
      document.getElementById('lname').value = lastname
      document.getElementById('fname').value = firstname
      document.getElementById('std').value = standard
            let sec_list;
  content = ''
  
  for(i=0;i<grade_list.length;i++){
      if(grade_list[i].grade==standard){
          sec_list = grade_list[i].section
      }
  }
  content += ` 
      <option value="" selected="">---------</option>`
  if(sec_list && sec_list.length){
  for(i=0;i<sec_list.length;i++){
      content += ` <option value="${sec_list[i]}">${sec_list[i]}</option>`
  }
}
  document.querySelector('.sec-in-form').innerHTML = content

      document.getElementById('sec').value = section
      document.getElementById('address').value = address
      button.addEventListener('click', () => {
        if (!standards.length) {
          standard = document.getElementById('std').value
          section = (document.getElementById('sec').value).toUpperCase()
          standards.push(standard + '-' + section)
      }
        fetch(`${url}${id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token' + ' ' + localStorage.getItem('token'),
            'X-CSRFToken': csrftoken
          },
          body: JSON.stringify({
            'email': form_email.value, 'phone': form_phone.value, 'date_of_birth': form_dob.value, 'register_number': form_reg.value,
            'profile': { 'first_name': form_fname.value, 'last_name': form_lname.value, 'standard': standards, 'full_name': form_fullname.value, 'address': form_ad.value }
          }
          )
        }).then(response => {
          console.log(response)
          if (response.status == 200) {
            error_messages.innerHTML = ''
            messages.innerHTML = 'updated successfully'
            $("#messageModal-student").modal("show")
            $("#FormModal").modal("hide")
          }
        })
      })
    }
    if (!editbutton) {
      let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
      var is_dataentry = 'false'
      var email = document.getElementById('email').value
      var phone = document.getElementById('phone').value
      var dob = document.getElementById('dob').value
      var reg = document.getElementById('reg').value
      var standard = document.getElementById('std').value
      var section = document.getElementById('sec').value
      var type = 'is_student'
      var firstname = document.getElementById('fname').value
      var lastname = document.getElementById('lname').value
      var fullname = document.getElementById('ffname').value
      var address = document.getElementById('address').value
      var is_dataentry = 'false'
      if (!standards.length) {
        standard = document.getElementById('std').value
        section = (document.getElementById('sec').value).toUpperCase()
        console.log(standards)
        standards.push(standard + '-' + section)
      }
      fetch('https://schooltestproject.herokuapp.com/api/signup/',
        {
          method: 'POST',
          body: JSON.stringify({
            'email': email, 'phone': phone, 'date_of_birth': dob, 'register_number': reg, 'user_type': type,
            'is_data_entry': is_dataentry, 'first_name': firstname, 'last_name': lastname, 'standard': standards, 'full_name': fullname, 'address': address
          }
          ),
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }
        }).then(response => {
          if (response.status == 201) {
            console.log("Sucess response", response)
            error_messages.innerHTML = ''
            messages.innerHTML = 'created successfully'
          }
          return response.json();
        }).then(function (data) {
          if (data.status != 'success') {
            console.log(data)
            messages.innerHTML = ''
            error_messages.innerHTML = `<li>${(data.data.error)}</li>`
          }
          
        })
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
            document.querySelector('.email-error').innerHTML = 'email already exits' 
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
