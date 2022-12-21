
    var token = localStorage.getItem('token')
    let messages = document.querySelector('.messages')
    let error_messages = document.querySelector('.error-messages')
    let head = document.querySelector('.header')
    var standard =localStorage.getItem('standard')
    let history=[]
    
    var  student_id=localStorage.getItem('id')
    let single_test = document.querySelector('.single-test')
    head.style.display = 'none'
    let test_list = []
    let set_id = false
    url = 'http://127.0.0.1:8000/api/test/'
    var container = document.querySelector('.test-list')

    $(document).ready(function(){ 
      var user = localStorage.getItem('user_type')
      if (user != 'is_student'){
       return window.location.href = '/404'; 
      }
      document.getElementById('nav-test').style.opacity = '0.5';
    })
    url1 = new URL('http://127.0.0.1:8000/api/test-history/');
    url1.searchParams.append('grade', standard[0]);
    url1.searchParams.append('studentid',student_id)

    fetch(url1,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'token' + ' ' + token,
                },
            }).then(function (response) {
                return response.json()
            }).then(data => {
                console.log(data)
                console.log(data.length)
                for (i = 0; i < data.length; i++) {
                  history.push(data[i])
                }

                if (data.status != 'success') {
                console.log(data)
                }
                get_test(standard)
            })
            console.log(history)
function get_test(standard){
    if(standard){
        head.style.display = 'block';
        document.getElementById('grade-head').textContent = `${standard}`
        let content = '';
        url2 = new URL('http://127.0.0.1:8000/api/test/');
        url2.searchParams.append('grade', standard[0]);
        fetch(url2, {
      method: 'GET',
      headers: {
        'content-Type': 'application/json',
        'Authorization': 'token' + ' ' + token,
      }
    }).then(res => {
      return res.json()
    }).then(data => {
let temp;
      for (i = 0; i < data.length; i++) {
          //   console.log(history[i].test_id,d.id,'as')
          //  if ( history[i].test_id == d.id ){
          //   flag=false
          //   console.log('hi')
          //  }
          flag = true
            for(j=0;j<history.length;j++){
              if ( history[j].test_id == data[i].id ){
                flag = false
            }
          }
          if(flag){
            test_list.push(data[i])
          }
        }

console.log(test_list.length)
if(test_list.length){
      temp = (data[0].subject)
      content += `<fieldset>
  <legend> ${data[0].subject_name} </legend>`
      }
        test_list.forEach((d, index) => {
    //    if(d.grade_name = standard){
      
          // let flag=true
          // console.log(history,'sa')
          // for (i = 0; i < history.length; i++) {
          //   console.log(history[i].test_id,d.id,'as')
          //  if ( history[i].test_id == d.id ){
          //   flag=false
          //   console.log('hi')
          //  }
          // }
          // if (flag==true){

        if(temp != d.subject){
         content += `</fieldset>`
         temp = d.subject
         content += `<fieldset>
  <legend> ${d.subject_name} </legend>`
        }
        content += `<div class="questions-paper-card" id='${d.id}'>` 
            content = content + `
<p> Subject : <span class="subject"> ${d.subject_name}<span></p>
<p > Remarks : <span class="remarks">${d.remarks}</span></p>

<p > Marks : <span class="marks">${d.marks}</span></p>

<p> Duration : ${d.duration} </p>

<p> Description : ${d.description} </p>
<p class='text-right'><button class='btn btn-primary btn-sm' onclick=take(${d.id})>take test</button></p> 
</div>`

//}

    })
    content += `</fieldset>`
    container.innerHTML = content;
    })
}
}



function take(id){
  console.log('sjfd')
  window.location.href = window.location.protocol + "//" + window.location.host + '/take-test/' + + id +'/';
}

function getrequiredtest(){
  test_id = document.getElementById('Test_id').value
  console.log(test_id)
  if(test_id){
  url2 = new URL('http://127.0.0.1:8000/api/test/');
  url2.searchParams.append('test_id', test_id);
  fetch(url2, {
    method: 'GET',
    headers: {
      'content-Type': 'application/json',
      'Authorization': 'token' + ' ' + token,
    }
  }).then(res => {
    return res.json()
  }).then(data => {
    console.log(data)
    console.log(data.grade_name)

    if(data.status != 'failure'){

      if(standard != data.grade_name){
      single_test.innerHTML = `<p class="text-center text-danger">your not allowed to take this test</p>`
      return
    }

    let  content2 = `<div class="single-test-div" id='${data.id}'>
  
      <p> Subject : <span class="subject"> ${data.subject_name}<span></p>
      <p > Remarks : <span class="remarks">${data.remarks}</span></p>
      
      <p > Marks : <span class="marks">${data.marks}</span></p>
      
      <p> Duration : ${data.duration} </p>
      
      <p> Description : ${data.description} </p>
      <p class='text-right'><button class='btn btn-primary btn-sm' onclick=take(${data.id})>take test</button></p> 
     </div>`
      single_test.innerHTML = content2
    }else{
      single_test.innerHTML = `<p class="text-center text-danger">${data.data}</p>`
    }
})
  }else{
    single_test.innerHTML = `<p class="text-center text-danger">Test id is required</p>`
  }
}