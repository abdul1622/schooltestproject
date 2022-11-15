let head = document.querySelector('.header')
var token = localStorage.getItem('token')
head.style.display = 'none'
let messages = document.querySelector('.messages')
let error_messages = document.querySelector('.error-messages')
var host = window.location.protocol + "//" + window.location.host;
let content = '';
let subject_name;
let grade_list
let grade_name;
let grade;
let subject;


$('[data-dismiss=modal]').on('click', function (e) {
  var $t = $(this),
      target = $t[0].href || $t.data("target") || $t.parents('.modal') || [];

$(target)
  .find("input,textarea,select")
     .val('')
     .end()
})
function get_subject_name(element) {
  subject_name = element.options[element.selectedIndex].text;
  subject = element.options[element.selectedIndex].value
}

function getgradename(element) {
  grade_name = element.options[element.selectedIndex].text;
  grade = element.options[element.selectedIndex].value
}

$(document).ready(function () {
  
  if (!token) {
    return window.location.href = '/login';
   
  }
  var user = localStorage.getItem('user_type')
  if (user == 'is_student') {
    return window.location.href = '/404';
  }
document.getElementById('nav-question').style.opacity = '0.5';

})
function back() {
  document.getElementById('questionForm').style.display = 'none'
  document.getElementById('question-box').style.display = 'block'
  document.getElementById('--question').style.display = 'block'
  // document.getElementById('questionForm').reset();
}

let yes_button = document.getElementById('delete-btn-yes')
let no_btn = document.getElementById('delete-btn-no')
var host = window.location.protocol + "//" + window.location.host;


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
  if (data.status == 'failure') {
  }
  if (grade_list.length == 1) {
    grade = grade_list[0].id
    // document.querySelector('.grade-p').innerHTML = grade
    // content += ` <option value="${grade_list[0].id}">${grade_list[0].grade}</option>`
    document.querySelector('.grade-p').innerHTML = ` ${grade_list[0].grade}`
    document.querySelector('.grade-p-get').innerHTML = ` ${grade_list[0].grade}`
    var url_for_change = 'https://schooltestproject.herokuapp.com/api/ajax/load-subject/';
    grade_name = grade_list[0].grade
    $.ajax({
      url: url_for_change,
      data: {
        'grade': grade
      },
      success: function (data) {
        $("#id_subject_2").html(data);
        $("#id_subject").html(data)
      }
    });

  } else {
    content += ` 
          <option value="" selected="">---------</option>`
    for (i = 0; i < grade_list.length; i++) {
      content += ` <option value="${grade_list[i].id}">${grade_list[i].grade}</option>`
    }
    document.querySelector('.grade-in-form').innerHTML = content
  }

})



document.getElementById('message-close-btn').addEventListener('click', () => {
  messages.innerHTML = '';
  error_messages.innerHTML = '';
})

// var url_for_change = 'https://schooltestproject.herokuapp.com/api/ajax/load-grade/'; 
//   $.ajax({                       
//     url: url_for_change,                  
//     success: function (data) {
//       $("#id_grade").html(data); 
//     }
//   });

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
const container2 = document.querySelector('.question-list');
url = 'https://schooltestproject.herokuapp.com/api/question/'


function get() {
  // let grade=document.getElementById('get_grade').value
  // let subject=document.getElementById('id_subject_2').value
  console.log(grade, subject)
  if (grade && subject) {
    let url1 = new URL('https://schooltestproject.herokuapp.com/api/question/')
    url1.searchParams.append('grade', grade);
    url1.searchParams.append('subject', subject)
    fetch(url1, {
      method: 'GET',
      headers: {
        'content-Type': 'application/json',
        'Authorization': 'token' + ' ' + token,
      }
    }).then(res => {
      return res.json()
    }).then(data => {
      console.log(data)
      let content = '';
      // console.log(data.name[0])
      // console.log(data.status)
      if (data.status == 'success') {
        if (data.data.length) {
          temp = (data.data[0].chapter)
          content += `<fieldset class="card-group justify-content-start">
<legend> ${data.data[0].chapter_name} </legend>`
        }


        data.data.forEach((d, index) => {
          if (temp != d.chapter) {
            content += `</fieldset >`
            temp = d.chapter
            content += `<fieldset class="card-group justify-content-center" >
<legend> ${d.chapter_name} </legend>`
          }
          // name_value = data.name[index]
          content = content + `<div class="question-card col-md-5 col-lg-3" id='${d.id}'>
    <div class='question-card-details'>
    <p >Chapter : <span id='${d.chapter}' class="chapter-name">${d.chapter_name}</span></p>
    <p >Question Type : <span class="question_type" id=${d.subject}>${d.question_type}</span></p>
    <p >Cognitive Level : <span class="cognitive_level" id=${d.grade}>${d.cognitive_level}</span></p>
    <p >Difficulty Level : <span class="difficulty_level">${d.difficulty_level}</span></p>
    <p class="w-75" >Question : <span class="question">${d.question}</span></p>
    <p >Marks : <span class="mark">${d.mark}<span></p>
      <p >Duration : <span class="duration">${d.duration}<span></p>
    </div>
    <div class="d-flex justify-content-around question-edit-btn"><i id="edit"  data-toggle="modal" data-target="#QFormModal" class="fa fa-edit"></i>&nbsp <i class="fa fa-trash-o" data-toggle="modal" data-target="#delete-box-Modal-question" href="#" id="delete"></i></div>
    <div style="display: none;"> 
    <p >Option A : <span class="option_a">${d.answers.option_a}</span></p>
    <p >Option B : <span class="option_b">${d.answers.option_b}</span></p>
    <p >Option C : <span class="option_c">${d.answers.option_c}</span></p>
    <p >Option D : <span class="option_d">${d.answers.option_d}</span></p> 
    <p >answer : <span class="answer">${d.answers.answer}</span></p> </div>
    </div>
    `

        })
        content += `</fieldset>`
        head.style.display = 'block'
        document.getElementById('grade-head-question').textContent = grade
        document.getElementById('subject-head-question').textContent = data.data[0]['subject_name']
        document.querySelector('.question-error').innerHTML = ''
        container2.innerHTML = content;
      } else {
        head.style.display = 'none'
        container2.innerHTML = ''
        document.querySelector('.question-error').innerHTML = `<li>subject - ${subject_name} has no questions</li>`
      }
      edit = false
    })
  } else {
    head.style.display = 'none'
    container2.innerHTML = ``
    edit = false
  }
};
var edit = null;

$("#id_grade").change(function () {
  var url_for_change = 'https://schooltestproject.herokuapp.com/api/ajax/load-subject/';
  var gradeId = $(this).val();

  $.ajax({
    url: url_for_change,
    data: {
      'grade': gradeId
    },
    success: function (data) {
      $("#id_subject").html(data);
    }
  });

});

$('#id_subject').change(function () {
  var url_for_change = 'https://schooltestproject.herokuapp.com/api/ajax/load-subject/';
  var subjectId = $(this).val();

  $.ajax({
    url: url_for_change,
    data: {
      'subject': subjectId
    },
    success: function (data) {
      $("#id_chapter").html(data)
    }
  });
});

function deletequestion(id) {

  fetch(`${url}${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'token' + ' ' + token,
    },
  }).then(res => {
    console.log(res)
    get();
  }
  )

}

