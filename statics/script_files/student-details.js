let user, standards = [];
let students=[];
let content = '';
let grade_list;
let token = localStorage.getItem("token")
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
      document.querySelector('.std-in-form').innerHTML = content
      })

//  section list
function getsectionname(element){
      let standard = element.value
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
      document.querySelector('.sec-in-form').innerHTML = content
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
  let table2 = `<table class='--user' id='usr'>`;
    table2 += `<tr class="header">
           <th >Email</th>
           <th >Phone</th>
           <th>RegNo</th>
           <th>FullName</th>
           <th>FirstName</th>
           <th>LastName</th>
           <th>Date Of Birth</th>
           <th>Address</th>
           <th>Standard</th>
           <th id="action" >Action</th>
    </tr>`;
         console.log(students.length)
         students.forEach((d, index) => {
          console.log('to')
            table2 = table2 + `<tbody><tr id=${d.id}>`;
            table2 = table2 + '<td class="useremail">' + `${d.email}` + '</td>';
            table2 = table2 + '<td class="userphone">' + `${d.phone}` + '</td>';
            table2 = table2 + '<td class="userreg">' + `${d.register_number}` + '</td>';
            table2 = table2 + '<td class="userfullname">' + `${d.profile?.full_name}` + '</td>';
            table2 = table2 + '<td class="userfirstname">' + `${d.profile?.first_name}` + '</td>';
            table2 = table2 + '<td class="userlastname">' + `${d.profile?.last_name}` + '</td>';
            table2 = table2 + '<td class="userDOB">' + `${d.date_of_birth}` + '</td>';
            table2 = table2 + '<td class="useraddress">' + `${d.profile?.address}` + '</td>';
            table2 = table2 + '<td class="userstandard">' + `${d.profile?.standard}` + '</td>';
            table2 = table2 + '<td>' + ` <i id="edit" data-toggle="modal" data-target="#FormModal" class="fa fa-edit"></i><i id="delete" data-toggle="modal" data-target="#delete-user-Modal" class="fa fa-trash-o" ></i>` + '</td></tbody>',
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

