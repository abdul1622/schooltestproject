let stdsec;
let editbutton = false
let userid;
let user, standards = [];
let staffs = [];
let grade_list;
let content = ''
let token = localStorage.getItem("token")
let messages = document.querySelector('.messages')
let error_messages = document.querySelector('.error-messages')
add = document.getElementById('addstaff')
let button;
var host = window.location.protocol + "//" + window.location.host;
let form = document.getElementById('userDetails')
const container2 = document.querySelector('.container2');
$(document).ready(function () {
  if (!token) {
    return window.location.href = '/login';
  }
  var user = localStorage.getItem('user_type')
  if (user != 'is_admin') {
    return window.location.href = '/404';
  }
  document.getElementById('nav-staffs').style.opacity = '0.5';
})
$('[data-dismiss=modal]').on('click', function (e) {
  var $t = $(this),
    target = $t[0].href || $t.data("target") || $t.parents('.modal') || [];

  $(target)
    .find("input,textarea,select")
    .val('')
    .end()
  standards = []
  if (document.querySelector('.inner')) {
    document.querySelector('.inner').innerHTML = ''
  }
  if (document.getElementById('update')) {
    document.getElementById('update').id = 'userdetail-btn'
  }


})

function add_form(){
 document.getElementById('email').value= ''
 document.getElementById('phone').value= ''
 document.getElementById('reg').value= ''
  document.getElementById('dob').value= ''
 document.getElementById('fname').value= ''
   document.getElementById('lname').value= ''
 document.getElementById('ffname').value= ''
  document.getElementById('std').value= ''
 document.getElementById('sec').value= ''
  document.getElementById('address').value= ''
  document.getElementById('reg-no-div').style.display = 'none'
   $('#SFormModal').modal('show')
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
  content = ''
  if (data.status == 'failure') {
    window.location.href = `${host}/404`
  }
  content += ` 
          <option value="" selected="">---------</option>`
  if (grade_list.length) {
    for (i = 0; i < grade_list.length; i++) {
      content += ` <option value="${grade_list[i].grade}">${grade_list[i].grade}</option>`
    }
  }
  document.querySelector('.std-in-form').innerHTML = content
})
function getsectionname(element) {
  let standard = element.value
  let sec_list;
  content = ''
  for (i = 0; i < grade_list.length; i++) {
    if (grade_list[i].grade == standard) {
      sec_list = grade_list[i].section
    }
  }
  content += ` 
          <option value="" selected="">---------</option>`
  if (sec_list.length) {
    for (i = 0; i < sec_list.length; i++) {
      content += ` <option value="${sec_list[i]}">${sec_list[i]}</option>`
    }
  }
  document.querySelector('.sec-in-form').innerHTML = content
}
add = document.getElementById('addstaff')
var host = window.location.protocol + "//" + window.location.host;
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
    if (`${d.user_type}` == 'is_staff') {
      staffs.push(d)
    }
  })
  let table2 = `<table class='table text-white' id='usr'>`;
  table2 += `<tr class="header">
         <th  scope="col" >Email</th>
         <th  scope="col">Phone</th>
         <th  scope="col">RegNo</th>
         <th  scope="col">FullName</th>
         <th  scope="col">FirstName</th>
         <th  scope="col">LastName</th>
         <th scope="col" >Date Of Birth</th>
         <th scope="col">Address</th>
         <th scope="col">Standard</th>
         <th scope="col" id="action" >Action</th>
  </tr>`;
  console.log(staffs.length)
  staffs.forEach((d, index) => {

    let std = new Array
    for (let standard of d.profile?.standard) {
      std.push(`${standard}`)
    }

    console.log(std)
    table2 = table2 + `<tr id=${d.id} class='list'>`;
    table2 = table2 + '<td class="useremail">' + `${d.email}` + '</td>';
    table2 = table2 + '<td class="userphone">' + `${d.phone}` + '</td>';
    table2 = table2 + '<td class="userreg">' + `${d.register_number}` + '</td>';
    table2 = table2 + '<td class="userfullname">' + `${d.profile?.full_name}` + '</td>';
    table2 = table2 + '<td class="userfirstname">' + `${d.profile?.first_name}` + '</td>';
    table2 = table2 + '<td class="userlastname">' + `${d.profile?.last_name}` + '</td>';
    table2 = table2 + '<td class="userDOB">' + `${d.date_of_birth}` + '</td>';
    table2 = table2 + '<td class="useraddress">' + `${d.profile?.address}` + '</td>';
    table2 = table2 + `<td class="userstandard" onclick="std('${std}',${index},${false})" id=${std}>` + `${std[0]} (${std.length})` + '</td>';
    table2 = table2 + '<td>' + ` <i id="edit" data-toggle="modal" data-target="#SFormModal"  class="fa fa-edit" onclick="edit(${index},${d.id})"></i><i id="delete" data-toggle="modal" data-target="#delete-staff-Modal" class="fa fa-trash-o" onclick="deleteuser(${d.id})" ></i>` + '</td></tbody>',
      table2 = table2 + `</tr>`;
  })
  table2 += "</table>";
  container2.innerHTML = table2;
})

function std(id, index, flag) {
  var td = document.querySelectorAll('.userstandard')
  ar = id.split(',')
  console.log(ar.length, ar)
  if (!flag) {
    if (ar.length > 1) {
      content = ''
      for (let i of ar) {
        content += `<li>${i}</li>`
      }
      td[index].innerHTML = content
    }
    console.log(document.getElementById(`${id}`))
    document.getElementById(`${id}`).setAttribute("onclick", `std('${id}',${index},${true})`);
  } else {
    td[index].innerHTML = `${ar[0]} (${ar.length})`
    document.getElementById(`${id}`).setAttribute("onclick", `std('${id}',${index},${false})`);
  }
}
function edit(index, id) {
  document.getElementById('userdetail-btn').id = 'update'
  let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  tr = document.querySelectorAll('.list')[index]
  let email = tr.querySelector(".useremail").textContent;
  let phone = tr.querySelector('.userphone').textContent;
  let reg = tr.querySelector('.userreg').textContent;
  let dob = tr.querySelector('.userDOB').textContent;
  let fullname = tr.querySelector('.userfullname').textContent;
  let lastname = tr.querySelector('.userlastname').textContent;
  let firstname = tr.querySelector('.userfirstname').textContent;
  console.log(email)
  document.getElementById('exampleModalLabel').innerHTML = fullname
  form_email = document.getElementById('email');
  form_phone = document.getElementById('phone');
  form_reg = document.getElementById('reg');
  form_dob = document.getElementById('dob');
  form_fname = document.getElementById('fname');
  form_lname = document.getElementById('lname');
  form_fullname = document.getElementById('ffname');
  form_std = document.getElementById('std');
  form_sec = document.getElementById('sec');
  form_ad = document.getElementById('address');
  button = document.getElementById('update');
  if ((tr.querySelector('.userstandard').id).split(',').length) {
    standards = tr.querySelector('.userstandard').id.split(',');
    console.log(standards)
  } else {
    standards = []
    console.log(standards)
  }
  let editcontent = ` <p> standards list</p>`
  for (i = 0; i < standards.length; i++) {
    editcontent += ` 
          <li>${standards[i]}<button onclick=delete_standard(${i})>delete</button></li>`
  }
  document.querySelector('.standards-list').innerHTML = editcontent
  let url = "https://schooltestproject.herokuapp.com/api/user-details/"
  if ((tr.querySelector('.userstandard').id).split(',').length) {
    standards = tr.querySelector('.userstandard').id.split(',');
    console.log(standards)
  } else {
    standards = []
    console.log(standards)
  }
  let content = ` <p> standards list</p>
  <div class='inner'>`
  for (i = 0; i < standards.length; i++) {
    content += ` 
        <li>${standards[i]}<button onclick=delete_standard(${i})>delete</button></li>`
  }
  document.querySelector('.standards-list').innerHTML = content + `</div>`
  let address = tr.querySelector('.useraddress').textContent;
  document.getElementById('email').value = email
  document.getElementById('phone').value = phone
  document.getElementById('reg').value = reg
  document.getElementById('dob').value = dob
  document.getElementById('ffname').value = fullname
  document.getElementById('lname').value = lastname
  document.getElementById('fname').value = firstname
  document.getElementById('address').value = address
  button.addEventListener('click', (e) => {
    if (!editbutton) {
      if (!standards.length) {
        std = document.getElementById('std').value
        sec = (document.getElementById('sec').value).toUpperCase()
        if (!std || !sec) {
          error_messages.innerHTML = 'Enter valid standard and section'
          return
        }
        standards.push(std + '-' + sec)
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
        })
      }).then(response => {
        if (response.status == 200) {
          console.log("Sucess response", response)
          document.querySelector('#SFormModal').classList.remove('show');
          document.querySelector('body').classList.remove('modal-open');
          const mdbackdrop = document.querySelector('.modal-backdrop');
          if (mdbackdrop) {
            mdbackdrop.classList.remove('modal-backdrop', 'show');
            messages.innerHTML = 'updated successfully'
            $('#messageModal-staff').modal('show')
            setTimeout(function () {
              $('#messageModal-staff').modal('hide')
              window.location.reload();
            }, 2000);
          }
          error_messages.innerHTML = ''
          return response.json();
        }


        else {
          error_messages.innerHTML = `<li>${(data.data.error)}</li>`
          messages.innerHTML = ''
        }
      })
    }
  })
}
document.getElementById('addstaff').addEventListener('click', () => {
  button = document.getElementById('userdetail-btn')
  button.addEventListener('click', () => {
    document.getElementById('reg-no-div').style.display = 'none'
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    var email = document.getElementById('email').value
    var phone = document.getElementById('phone').value
    var dob = document.getElementById('dob').value
    var standard = document.getElementById('std').value
    var section = document.getElementById('sec').value
    var type = 'is_staff'
    var firstname = document.getElementById('fname').value
    var lastname = document.getElementById('lname').value
    var fullname = document.getElementById('ffname').value
    var address = document.getElementById('address').value
    var is_dataentry = 'false'
    if (standard && section) {
      standards.push(standard + '-' + section)
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
        }
      }).then(response => {
        if (response.status == 201) {
          console.log("Sucess response", response)
          document.querySelector('#SFormModal').classList.remove('show');
          document.querySelector('body').classList.remove('modal-open');
          const mdbackdrop = document.querySelector('.modal-backdrop');
          if (mdbackdrop) {
            mdbackdrop.classList.remove('modal-backdrop', 'show');
            messages.innerHTML = 'created successfully'
            $('#messageModal-staff').modal('show')
          }
          error_messages.innerHTML = ''
        }
        return response.json();
      }).then(function (data) {
        console.log(data)
        if (data.status != 'Registered succesfull') {
          document.querySelector('#SFormModal').classList.remove('show');
          document.querySelector('body').classList.remove('modal-open');
          const mdbackdrop = document.querySelector('.modal-backdrop');
          if (mdbackdrop) {
            mdbackdrop.classList.remove('modal-backdrop', 'show');
            messages.innerHTML = 'created successfully'
            $('#messageModal-staff').modal('show')
          }
          error_messages.innerHTML = `<li>${(data.data.error[0])}</li>`
          messages.innerHTML = ''
        }
      })

  })

})

