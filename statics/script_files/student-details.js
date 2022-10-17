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
document.getElementById('nav-students').style.opacity = '0.5';
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


