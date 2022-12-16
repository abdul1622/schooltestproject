const container2 = document.querySelector('.container2');
let button = document.getElementById('userdetail-btn');
let editbutton=false
$('[data-dismiss=modal]').on('click', function (e) {
  var $t = $(this),
      
      target = $t[0].href || $t.data("target") || $t.parents('.modal') || [];
      console.log('hi')
$(target)
  .find("input,textarea,select")
     .val('')
     .end()
  if ( document.querySelector('.inner')){
    document.querySelector('.inner').innerHTML=''
  } 
  
})
function filter() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("student-filter");
    filter = input.value.toLowerCase();
    table = document.getElementById("usr");
    tr = table.getElementsByTagName("tr");
    
    for (i = 0; i < tr.length; i++) {
        // td = tr[i].getElementsByTagName("td")[0];
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
        function deletestudent(id) {
          url = "https://schooltestproject.herokuapp.com/api/user-details/"
          fetch(`${url}${id}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'token' + ' ' + localStorage.getItem('token')
            },
          }).then(res => {
            window.location.reload();
          })
        }
        container2.addEventListener('click', (e) => {
          document.getElementById('reg-no-div').style.display = 'block'
          form_email = document.getElementById('email');
          form_phone = document.getElementById('phone');
          form_reg = document.getElementById('reg');
          form_dob = document.getElementById('dob');
          form_fname = document.getElementById('fname');
          form_lname = document.getElementById('lname');
          form_fullname = document.getElementById('ffname');
          form_std = document.getElementById('std');
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
        if(sec_list.length){
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
                  console.log("Sucess response", response)
                  document.querySelector('#student-FormModal').classList.remove('show');
                  document.querySelector('body').classList.remove('modal-open');
                  const mdbackdrop = document.querySelector('.modal-backdrop');
                  if (mdbackdrop){
                    mdbackdrop.classList.remove('modal-backdrop', 'show');
                    messages.innerHTML = 'updated successfully'
                    $('#messageModal-student').modal('show')
                  //   setTimeout(function () {
                  //     $('#messageModal-student').modal('hide')
                  //     window.location.reload();
                  //  }, 2000);
                  }
                  error_messages.innerHTML = ''
                  return response.json();
                }
              })
            })
          }
        })
button.addEventListener('click', (e) => {
  if (!editbutton) {
    document.getElementById('reg-no-div').style.display = 'none'
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    var is_dataentry = 'false'
    var email = document.getElementById('email').value
    var phone = document.getElementById('phone').value
    var dob = document.getElementById('dob').value
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
          'email': email, 'phone': phone, 'date_of_birth': dob, 'user_type': type,
          'is_data_entry': is_dataentry, 'first_name': firstname, 'last_name': lastname, 'standard': standards, 'full_name': fullname, 'address': address
        }
        ),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
          // 'Content-Type': 'application/x-www-form-urlencoded',
        }
      }).then(response => {  console.log("Sucess response", response.status)
        if (response.status == 206) {
          console.log("Sucess response", response)
          document.querySelector('#FormModal').classList.remove('show');
          document.querySelector('body').classList.remove('modal-open');
          const mdbackdrop = document.querySelector('.modal-backdrop');
          if (mdbackdrop) {
            mdbackdrop.classList.remove('modal-backdrop', 'show');
            messages.innerHTML = 'created successfully'
            $('#messageModal-student').modal('show')
            setTimeout(function () {
              $('#messageModal-student').modal('hide')
              window.location.reload();
           }, 2000);
            return response.json()
          }
          error_messages.innerHTML = ''
        }
        return response.json();
      }).then(function (data) {
        if (data.status != 'Registered succesfull') {
          console.log(data)
          messages.innerHTML = ''
          error_messages.innerHTML = `<li>${(data.data.error)}</li>`
      
        }
        else{
          messages.innerHTML = 'Registered succesfull'
          $('#messageModal-student').modal('show')
          setTimeout(function () {
            window.location.reload();
         }, 2000);
        }    
      })
  }
})
      