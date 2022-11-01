  

  //  user check
  let flag=false
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
 
function deleteuser(id) {
  console.log('hi')
  yes = document.getElementById('yes')
  yes.setAttribute("onClick", `deletestaff(${id})`);
}
function deletestaff(id) {
  url = "https://schooltestproject.herokuapp.com/api/user-details/"
  fetch(`${url}${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'token' + ' ' + localStorage.getItem('token') 
    },
  }).then(res => {

  })
}


function filter() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("student-filter");
  filter = input.value.toLowerCase();
  table = document.getElementById("usr");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    alltags = tr[i].getElementsByTagName("td");
    isFound = false;
    for (j = 0; j < alltags.length; j++) {
      td = alltags[j];
      console.log(td)
      if (td) {
        txtValue = td.textContent || td.innerText;
        console.log(txtValue)
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          j = alltags.length;
          isFound = true;
        }

      }
    }
    if (!isFound && tr[i].className !== "header") {
      tr[i].style.display = "none";
    }
  }
}
function addstandard() {
  let std = document.getElementById('std').value
  let section = document.getElementById('sec').value.toUpperCase()
  if (!std) {
    error_messages.innerHTML = '<li class="text-danger">give a valid standard</li>'
    return
  }
  if (!section.match(/[a-z]/i)) {
    error_messages.innerHTML = 'give a valid section'
    return
  }
  if (!standards.includes(std + '-' + section)) {
    standards.push(std + '-' + section)
  } else {
    messages.innerHTML = ''
    error_messages.innerHTML = ''
    error_messages.innerHTML = 'standard and section already added'
    return
  }
  let content = ''
  content += `    <p> standards list</p>`
  for (i = 0; i < standards.length; i++) {
    content += `
    <div class='inner'><li>${standards[i]} <button onclick=delete_standard(${i})>delete</button></li></div>`
  }
  document.getElementById('std').value=''
  document.getElementById('sec').value=''
  document.querySelector('.standards-list').innerHTML = content
}
function delete_standard(index) {
  console.log(standards)
  standards.splice(index, 1);
  let content = ''
  content += `    <p> standards list</p>`
  for (i = 0; i < standards.length; i++) {
    content += `<div class='inner'><li>${standards[i]} <button onclick=delete_standard(${i})>delete</button></li></div>`
  }
  document.querySelector('.standards-list').innerHTML = content
}
var stdl = document.getElementById('stdl')
stdl.addEventListener('click', (e) => {
  console.log(e.target.id)
  if (stdl.querySelector('.inner').style.display == 'block') {
    stdl.querySelector('.inner').style.display = 'none'
  }
  else {
    stdl.querySelector('.inner').style.display = 'block'
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