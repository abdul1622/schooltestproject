
// user delete function
function deleteuser(id){
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

// user edit
function edit(index,id){
  let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
      tr=document.querySelectorAll('.list')[index]
      let email =tr.querySelector(".useremail").textContent;
      let phone = tr.querySelector('.userphone').textContent;
      let reg = tr.querySelector('.userreg').textContent;
      let dob = tr.querySelector('.userDOB').textContent;
      let fullname = tr.querySelector('.userfullname').textContent;
      let lastname = tr.querySelector('.userlastname').textContent;
      let firstname = tr.querySelector('.userfirstname').textContent;
      console.log(email)
      document.getElementById('exampleModalLabel').innerHTML=fullname
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
      button = document.getElementById('userdetail-btn');
      if((tr.querySelector('.userstandard').id).split(',').length){
        standards = tr.querySelector('.userstandard').id.split(',');
        console.log(standards)
        }else{
          standards = []
          console.log(standards)
        }
        let editcontent = ` <p> standards list</p>`
        for (i = 0; i < standards.length; i++) {
         editcontent += ` 
            <li>${standards[i]}<button onclick=delete_standard(${i})>delete</button></li>`
        }
        document.querySelector('.standards-list').innerHTML = editcontent
      url = "https://schooltestproject.herokuapp.com/api/user-details/"
      if((tr.querySelector('.userstandard').id).split(',').length){
      standards = tr.querySelector('.userstandard').id.split(',');
      console.log(standards)
      }else{
        standards = []
        console.log(standards)
      }
      let content = ` <p> standards list</p>
    <div class='inner'>`
      for (i = 0; i < standards.length; i++) {
        content += ` 
          <li>${standards[i]}<button onclick=delete_standard(${i})>delete</button></li>`
      }
      document.querySelector('.standards-list').innerHTML = content+`</div>`
      let address = tr.querySelector('.useraddress').textContent;
      document.getElementById('email').value = email
      document.getElementById('phone').value = phone
      document.getElementById('reg').value = reg
      document.getElementById('dob').value = dob
      document.getElementById('ffname').value = fullname
      document.getElementById('lname').value = lastname
      document.getElementById('fname').value = firstname
      document.getElementById('address').value = address
      button.addEventListener('click', () => {
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
            'Authorization': 'token'+' '+localStorage.getItem('token'),
            'X-CSRFToken': csrftoken
          },
          body: JSON.stringify({
            'email': form_email.value, 'phone': form_phone.value, 'date_of_birth': form_dob.value, 'register_number': form_reg.value,
            'profile': { 'first_name': form_fname.value, 'last_name': form_lname.value, 'standard': standards, 'full_name': form_fullname.value, 'address': form_ad.value }
          } )
        }).then(response => {
          if (response.status == 200) {
            error_messages.innerHTML = ''
            console.log(messages)
            console.log("Sucess response", response)
            messages.innerHTML = 'updated successfully'
          }
          else {
            error_messages.innerHTML = `<li>${(data.data.error)}</li>`
            messages.innerHTML = ''
          } 
        })
      })
    }

// standard 
    function std (id,index,flag){
  var td=document.querySelectorAll('.userstandard')
  ar=id.split(',')
  console.log(ar.length,ar)
if(!flag){
  if (ar.length > 1){
    content=''
    for( let i of ar){
      content+= `<li>${i}</li>`
    }
    td[index].innerHTML=content
  }
  console.log(document.getElementById(`${id}`))
  document.getElementById(`${id}`).setAttribute("onclick", `std('${id}',${index},${true})`);
}else{
    td[index].innerHTML = `${ar[0]} (${ar.length})`
    document.getElementById(`${id}`).setAttribute("onclick", `std('${id}',${index},${false})`);
}

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
        for(j=0; j< alltags.length; j++) {
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
          if(!isFound && tr[i].className !== "header") {
            tr[i].style.display = "none";
          }
        }
    }
 
//  standard add function
    function addstandard() {
    let std = document.getElementById('std').value
    let section = (document.getElementById('sec').value).toUpperCase()
    if(!std){
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
      error_messages.innerHTML=''
      error_messages.innerHTML = 'standard and section already added'
      return
    }
    let content = ''
    content += `    <p> standards list</p>`
    for (i = 0; i < standards.length; i++) {
      content += `
      <div class='inner'><li>${standards[i]} <button onclick=delete_standard(${i})>delete</button></li></div>`
    }
    document.querySelector('.standards-list').innerHTML = content
  }

// remove  standard function
  function delete_standard(index) {
    console.log(standards)
    standards.splice(index, 1);
    let content = ''
    content += `    <p> standards list</p>`
    for (i = 0; i < standards.length; i++) {
      content += `<li>${standards[i]} <button onclick=delete_standard(${i})>delete</button></li>`
    }
    document.querySelector('.standards-list').innerHTML = content
  }
  
  var stdl=document.getElementById('stdl')

  stdl.addEventListener('click',(e) =>{
    console.log(e.target.id)
    if (stdl.querySelector('.inner').style.display == 'block'){
          stdl.querySelector('.inner').style.display='none'
    }
    else{
       stdl.querySelector('.inner').style.display='block'
    }
  })
