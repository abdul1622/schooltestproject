  let stdsec;
  let user, standards = [];
  let staffs=[];
  let grade_list;
  let content = ''
  let token = localStorage.getItem("token")
  let button=document.getElementById('userdetail-btn')
  document.getElementById('nav-staffs').style.opacity = '0.5';
  let messages = document.querySelector('.messages')
  let error_messages = document.querySelector('.error-messages')
  add = document.getElementById('addstaff')
  button = document.getElementById('userdetail-btn');
  var host = window.location.protocol + "//" + window.location.host;
  let form = document.getElementById('userDetails')
  const container2 = document.querySelector('.container2');

  //  user check
  $(document).ready(function(){ 
    if(!token){
      return window.location.href = '/login';
    }
    var user = localStorage.getItem('user_type')
    if (user != 'is_admin'){
     return window.location.href = '/404'; 
    }
  })
  $('[data-dismiss=modal]').on('click', function (e) {
    var $t = $(this),
        target = $t[0].href || $t.data("target") || $t.parents('.modal') || [];

  $(target)
    .find("input,textarea,select")
       .val('')
       .end()
    standards=[]
    if ( document.querySelector('.inner')){
      document.querySelector('.inner').innerHTML=''
    }
    
    
})
 
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


  // section dropdown
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

  // user details update
    button.addEventListener('click', () => {
      console.log('hi')
      let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
      var email = document.getElementById('email').value
      var phone = document.getElementById('phone').value
      var dob = document.getElementById('dob').value
      var reg = document.getElementById('reg').value
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
            'email': email, 'phone': phone, 'date_of_birth': dob, 'register_number': reg, 'user_type': type,
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
            messages.innerHTML = 'created successfully'
            error_messages.innerHTML = ''
          }
          return response.json();
        }).then(function (data) {
          console.log(data)
          if (data.status != 'success') {
            error_messages.innerHTML = `<li>${(data.data.error[0])}</li>`
            messages.innerHTML = ''
          }
        })
    })
  
  // details
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
         console.log(staffs.length)
         staffs.forEach((d, index) => {

          let std=new Array
          for(let standard of d.profile?.standard){
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
            table2 = table2 + `<td class="userstandard" onclick="std('${std}',${index},${false})" id=${std}>` +`${std[0]} (${std.length})`+ '</td>';
            table2 = table2 + '<td>' + ` <i id="edit" data-toggle="modal" data-target="#SFormModal"  class="fa fa-edit" onclick="edit(${index},${d.id})"></i><i id="delete" data-toggle="modal" data-target="#delete-staff-Modal" class="fa fa-trash-o" onclick="deleteuser(${d.id})" ></i>` + '</td></tbody>',
              table2 = table2 + `</tr>`;
            })
        table2 += "</table>";
        container2.innerHTML = table2;
})  