
    var userId = localStorage.getItem('id')
  var grade_name;
  var token = localStorage.getItem('token')
  let head = document.querySelector('.header')
  head.style.display = 'none'
  let modal_body = document.querySelector('.modal-body-1')
  url = 'https://schooltestproject.herokuapp.com/api/question-paper-list/'
  var host = window.location.protocol + "//" + window.location.host;
  let error = true
  let set_id = false
  let subject_name,grade,subject;
  var user_id = localStorage.getItem('id')
  var user_type = localStorage.getItem('user_type')
  let messages = document.querySelector('.messages')
  let error_messages = document.querySelector('.error-messages')
  let container = document.querySelector('.question-papers-card')
  let content = '';
    let grade_list
   

    function getgradename(element){
    grade_name = element.options[element.selectedIndex].text;
    grade = element.options[element.selectedIndex].value;
    console.log(grade)
  }

    fetch('https://schooltestproject.herokuapp.com/api/grades/', {
            method: 'GET',
            headers: {
                // 'X-CSRFToken': csrftoken,
                'Authorization': 'token' + ' ' + token
            },
        }).then(res => {
            return res.json()
        }).then(data => {
          grade_list = data.data
            console.log(data.data)
           if(data.status == 'failure'){
            window.location.href = `${host}/404`
           } 
           if(grade_list.length == 1){
            grade = grade_list[0].id
            // document.querySelector('.grade-p').innerHTML = grade
                // content += ` <option value="${grade_list[0].id}">${grade_list[0].grade}</option>`
                document.querySelector('.grade-p').innerHTML = ` ${grade_list[0].grade}`
                // document.querySelector('.grade-p-get').innerHTML = ` ${grade_list[0].grade}`
                var url_for_change = 'https://schooltestproject.herokuapp.com/api/ajax/load-subject/'; 
            grade_name =   grade_list[0].grade
            $.ajax({                       
              url: url_for_change,                  
              data: {
                'grade': grade     
              },
              success: function (data) {
                $("#id_subject_2").html(data)
              }
            });

            }else{
                content += ` 
            <option value="" selected="">---------</option>`
        for(i=0;i<grade_list.length;i++){
            content += ` <option value="${grade_list[i].id}">${grade_list[i].grade}</option>`
        }
        document.querySelector('.grade-in-form').innerHTML = content
    }
        })

  $(document).ready(function(){ 
    var user = localStorage.getItem('user_type')
    if (user == 'is_student' || !token){
     return window.location.href = '/404'; 
    }
    document.getElementById('nav-questionpaperlist').style.opacity = '0.5';
  })

  function get() {
    // var grade = document.getElementById('get_grade').value
    subject = document.getElementById('id_subject_2').value
    error_messages.innerHTML = ''
    messages.innerHTML = ''
    url2 = new URL('https://schooltestproject.herokuapp.com/api/question-paper-list/');
    url2.searchParams.append('grade', grade_name);
    url2.searchParams.append('subject', subject_name)
    console.log(grade, subject)
  if(!grade || !subject){
      container.innerHTML = `Subject is not selected`;
      return
    }
    fetch(url2, {
      method: 'GET',
      headers: {
        'content-Type': 'application/json',
        'Authorization': 'token' + ' ' + token,
        // 'X-CSRFToken': csrftoken
      }
    }).then(res => res.json()).then(data => {
      console.log(data)
      let content = '';
      if (data.status == 'success') {
        data.data.forEach((d, index) => {

          error = false
          if (!set_id) {
            grade_id = d.grade
            subject_id = d.subject
            console.log(subject_id, grade_id)
            set_id = true
          }
          let new_date = new Date(d.created_at)
          console.log(new_date)
          content = content + `<div class="questions-paper-card" id='${d.id}'>
<p >created_by : <span class="created_by">${d.created_by}</span></p>

<p >created_at : <span class="created_at">${(new_date.toDateString())}</span></p>

<p> No of questions : ${(d.no_of_questions).length} </p>`
          if (d.test_id) {
            content += `Test ID : ${d.test_id}        
            <button onclick=edit_question_paper(${d.id},${d.timing},${d.overall_marks}) class="btn btn-warning btn-sm" data-toggle="modal" data-target="#editquestion-paper">Edit</button>
            `
          } else {
            content += `<button type="button" onclick=test_create(${d.id},${d.timing},${d.overall_marks}) class="btn btn-warning btn-sm" data-toggle="modal" data-target="#exampleModal">
  Create-Test
</button> <button onclick=edit_question_paper(${d.id},${d.timing},${d.overall_marks}) class="btn btn-warning btn-sm" data-toggle="modal" data-target="#editquestion-paper">Edit</button>`
          }
          content += `</div>`

        })
        container.innerHTML = content;

      }
      else {
        error_messages.innerHTML = 'invalid input'
      }
      if (error) {
        error_messages.innerHTML = 'invalid input'
      } else {
        document.getElementById('grade-head').textContent = `${grade_name}`
        document.getElementById('subject-head').textContent = `${subject_name}`
        head.style.display = 'block'
      }
    })
  }

  document.getElementById('get_grade').addEventListener('change',()=>{
    let e = document.getElementById('get_grade')
    grade_name = e.options[e.selectedIndex].text;
    grade = e.options[e.selectedIndex].value;
    console.log(grade_name)

  })

  $("#get_grade").change(function () {
    var url_for_change = 'https://schooltestproject.herokuapp.com/api/ajax/load-subject/';
    var gradeId = $(this).val();

    $.ajax({
      url: url_for_change,
      data: {
        'grade': gradeId
      },
      success: function (data) {
        $("#id_subject_2").html(data);
      }
    });

  });  
  function test_create(id,timing,overall_marks) {
    let create_btn_container = document.querySelector('.create-btn-container')
    modal_body.innerHTML = `         <input type="hidden" name="csrfmiddlewaretoken" value="KoFDB9Il5yZuuRnJZE4TsclCWZa1kX4j2UqN5ADQDHxGELrWWdy1E1mOMtEPH9uN">
          <p><label for="id_timing">Timing:</label> <input type="number" value=${timing} name="timing" placeholder="duration in seconds" min="0" required="" id="id_timing"></p>
<p><label for="id_overall_marks">Overall marks:</label> <input type="number" value=${overall_marks} name="overall_marks" min="0" required="" id="id_overall_marks"></p>
<p><label for="id_remarks">Remarks:</label> <input type="text" name="remarks" maxlength="25" required="" id="id_remarks"></p>
<p><label for="id_description">Description:</label> <input type="text" name="description" maxlength="50" required="" id="id_description"></p>
<p><label for="id_pass_percentage">Pass percentage:</label> <input type="number" name="pass_percentage" value="35" min="0" required="" id="id_pass_percentage"></p>`
    create_btn_container.innerHTML = `<button type="button" id="test-create-btn" onclick=create(${id}) class="btn btn-warning ">Create</button>`
    document.getElementById('test-create-btn').style.display = 'block'
  }

  // user_id, user_type = get_user_id();
  function create(question_id) {
    var grade = document.getElementById('get_grade').value
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // let form_duration = document.getElementById('id_duration').value
    //   let form_marks = document.getElementById('id_marks').value
    let form_remarks = document.getElementById('id_remarks').value
    let form_description = document.getElementById('id_description').value
    let form_percentage = document.getElementById('id_pass_percentage').value
    let marks = 0;
    let duration = 0;
    document.getElementById('nav-questionpaperlist').style.opacity = '0.5';
    url2 = new URL(`https://schooltestproject.herokuapp.com/api/test-questions/`);
    url2.searchParams.append('question_paper', question_id);
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
      data.forEach((d, index) => {
        marks += d.mark
        duration += d.duration
      })
      console.log(marks, duration)
    }).then(() => {
      console.log(marks, duration)
      fetch('https://schooltestproject.herokuapp.com/api/test/',
        {
          method: 'POST',
          body: JSON.stringify({ 'grade': grade_id, 'subject': subject_id, 'question_paper': question_id, 'created_staff_id': userId, 'marks': marks, 'duration': duration, 'remarks': form_remarks, 'pass_percentage': form_percentage, 'description': form_description }
          ),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token' + ' ' + token,
            'X-CSRFToken': csrftoken
          },
        }).then(response => {
          if (response.status == 201) {
            console.log("Sucess response", response);
            // test_messages.innerHTML = `<p class="text-success"> ${form_remarks} test created successfully</p>`;
            // test_errors.innerHTML = ''
            modal_body.innerHTML = `<p class='success' > ${form_remarks} test created successfully</p>`;
            document.getElementById('test-create-btn').style.display = 'none'
          }
          return response.json();
        }).then(function (data) {
          console.log(data)
          if (data.status != 'success') {
            test_errors.innerHTML = `<li class='test-warning'>${(data.data.error)}</li>`;
            test_messages.innerHTML = '';
          }
        })
    })
  }
  function getsubjectname(element){
    subject_name = element.options[element.selectedIndex].text;
    get();
  }
  function getgradename(element){
    grade_name = element.options[element.selectedIndex].text;
  }

  function edit_question_paper(id, timing, overall_marks) {

    document.querySelector('.modal-body-2').innerHTML = `<p><label for="id_timing">Timing <small>in sections</small>:</label> <input type="number" name="timing" 
 required min="0" value=${timing} id="id_timings"></p>
          <p><label for="id_overallmarks">Overallmarks:</label> <input type="number" name="overallmarks" min="0"
              required="" value=${overall_marks} id="id_overallmarks"></p>`
    // document.getElementById('id_timing').value = timing
    // document.getElementById('id_overallmarks').value = overall_marks
    document.querySelector('.question-edit-btn-container').innerHTML = `<button type="button" id="questionpaper-edit-btn"
              class="btn btn-warning" onclick=question_paper_update(${id})>Update</button>`
  }


  function question_paper_update(id) {
    console.log(document.getElementById('id_timings'))
    let timing = parseInt(document.getElementById('id_timings').value)
    let overall_marks = document.getElementById('id_overallmarks').value
    console.log(timing,overall_marks)
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let modal2 =   document.querySelector('.modal-body-2')
    fetch(`https://schooltestproject.herokuapp.com/api/question-paper/${id}/`,
      {
        method: 'PATCH',
        body: JSON.stringify({ 'timing': timing, 'overall_marks': overall_marks }
        ),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'token' + ' ' + token,
          'X-CSRFToken': csrftoken
        },
      }).then(response => {
        if (response.status == 200) {
          console.log("Sucess response", response);
         
        modal2.innerHTML = `<p class="text-success">  updated successfully</p>`;
          document.getElementById('questionpaper-edit-btn').style.display = 'none'
        }
        return response.json();
      }).then(function (data) {
        console.log(data)
        if (data.status != 'success') {
          modal2.innerHTML = `<li class='test-warning'>${(data.data.error)}</li>`;
         
        }
        get()
      }

      )
  }