var messages = document.querySelector('.messages')
var token = localStorage.getItem('token')
let error_messages = document.querySelector('.error-messages')
let grade_id, subject_id, grade, subject_name, no_of_questions, overall_marks = null;
let timing = null, chapters, from_chapter, to_chapter, from_chapter_id = null, to_chapter_id = null;
let all_chapter, result = [], questions_total = 0, customize = false;
let chapter_id = null;
let custom_end = false;
let question_paper_id, userId, user_type, chapters_list = [];
var content = '';
da = null
let data_entry = localStorage.getItem('data_entry')
data_entry = (data_entry === 'true')
let customize_details = document.querySelector('.customize-details')
let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
let question_details_list = [], question_name
let question_content = '';
let chapter_name_list = []
let overall_question_list;
let question_per_chapter = [];
let question_per_chapter_get = []
let question_per_chapter_res = [];
let question_id_list = [], question_list = []
document.getElementById('q-form-2').style.display = 'none';
document.getElementById('q-form-3').style.display = 'none';
document.getElementById('q-form-4').style.display = 'none';

// document.getElementById('id_grade').setAttribute("onchange", getgradename());
$(document).ready(function () {
    if (!token) {
        return window.location.href = '/login';
    }
    var user = localStorage.getItem('user_type')
    if (!data_entry && user != 'is_admin') {
        return window.location.href = '/404';
    }
    document.getElementById('nav-questionpaper').style.opacity = '0.5';
})

let grade_list;
var host = window.location.protocol + "//" + window.location.host;


//  get grade
fetch('http://127.0.0.1:8000/api/grades/', {
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
        window.location.href = `${host}/404`
    }
    content += ` 
       <option value="" selected="">---------</option>`
    if (grade_list.length) {
        for (i = 0; i < grade_list.length; i++) {
            content += ` <option value="${grade_list[i].id}">${grade_list[i].grade}</option>`
        }
    }
    document.querySelector('.grade-in-form').innerHTML = content
})

function get() {
    document.getElementById('q-form-1').style.display = 'block';
    document.getElementById('q-form-2').style.display = 'none';
    document.getElementById('q-form-3').style.display = 'none';
    document.getElementById('q-form-4').style.display = 'none';
}

$("#id_grade").change(function () {
    var url_for_change = 'http://127.0.0.1:8000/api/ajax/load-subject/';
    grade_id = $(this).val();
    // grade_name = $(this).options[this.selectedIndex].text
    getgradename(this)

    $.ajax({
        url: url_for_change,
        data: {
            'grade': grade_id
        },
        success: function (data) {
            $("#id_subject").html(data);
        }
    });

});

$('#id_subject').change(function () {
    var url_for_change = 'http://127.0.0.1:8000/api/ajax/load-subject/';
    subject_id = $(this).val();
    $.ajax({
        url: 'http://127.0.0.1:8000/api/ajax/load-chapter-no/',
        data: {
            'subject': subject_id
        },
        success: function (data) {
            $("#id_to_chapter").html(data),
                $("#id_from_chapter").html(data)
        }
    });
});


function getsubjectname(sel) {
    subject_name = sel.options[sel.selectedIndex].text;
    console.log(subject_name);
}

function getgradename(sel) {
    grade = sel.options[sel.selectedIndex].text;
    console.log(grade);
}
// for chapter selection

function getnext() {
    document.querySelector('.q-form-6').innerHTML = ''
    question_per_chapter_get = []
    question_per_chapter = []
    no_of_questions = parseInt(document.getElementById('id_no_of_questions').value);
    grade_id = parseInt(document.getElementById('id_grade').value);
    subject_id = parseInt(document.getElementById('id_subject').value)
    console.log('isgrade', grade_id, subject_id)

    if (isNaN(grade_id) || isNaN(subject_id)) {
        if (!isNaN(grade_id)) {
            document.querySelector('.error-form-1').innerHTML = "<li style='color:white'>subject is a required field </li>"
        }
        else if (!isNaN(subject_id)) {
            document.querySelector('.error-form-1').innerHTML = "<li style='color:white;'>grade is a required field</li>"
        }
        else {
            document.querySelector('.error-form-1').innerHTML = "<li style='color:white;'>grade and subject are required field</li>"
        }
        return
    }

    // if(!isNaN(no_of_questions)){
    url = new URL('http://127.0.0.1:8000/api/question/');
    url.searchParams.append('grade', grade_id);
    url.searchParams.append('subject', subject_id)
    fetch(url, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json',
            'Authorization': 'token' + ' ' + token,
        }
    }).then(res => {
        return res.json()
    }).then(data => {
        console.log(data)
        da = data
        overall_question_list = data.results
        console.log(overall_question_list, 'list')
        // console.log(data['data'].length)
        data = data.results
        if (no_of_questions > data.length) {
            document.querySelector('.error-form-1').innerHTML = `<li style='color:white;'>given number 
                of questions is higher than the actual number of question - ${data['data'].length}</li>`
            return
        }

        customize = false
        document.getElementById('q-form-1').style.display = 'none';
        document.getElementById('q-form-3').style.display = 'none';
        document.getElementById('q-form-4').style.display = 'none';
        document.getElementById('q-form-2').style.display = 'block';
        document.getElementById('q-form').style.display = 'block'
        result = []

    })
    document.querySelector('.error-form-1').innerHTML = '';
    url3 = ('http://127.0.0.1:8000/api/chapter-list/');
    fetch(url3, {
        method: 'POST',
        body: JSON.stringify({ 'grade': grade, 'subject': subject_name }
        ),
        headers: {
            'content-Type': 'application/json',
            'Authorization': 'token' + ' ' + token,
        }
    }).then(res => {
        return res.json()
    }).then(data => {
        chapters_list = data.data
        console.log(chapters_list);
        for (i = 0; i < chapters_list.length; i++) {
            question_per_chapter_get.push({
                key: `${chapters_list[i].id}`,
                value: []
            });
        }
        console.log(question_per_chapter_get)
    })
}

// for customize
function getcustomize_details() {
    // add
    let list = []
    if (!custom_end) {
        for (let i = 0; i < question_per_chapter.length; i++) {
            console.log(document.getElementById(`question_${question_per_chapter[i]}`))
            if (document.getElementById(`question_${question_per_chapter[i]}`).checked) {
                list.push(question_per_chapter[i])
            }
        }
        console.log(list)
        for (let i = 0; i < question_per_chapter_get.length; i++) {
            if (chapter_id && question_per_chapter_get[i].key == chapter_id) {
                question_per_chapter_get[i].value = list
            }
        }
        // question_per_chapter_get[`${chapter_id}`] = list
        console.log(question_per_chapter_res)
    }
    // 
    custom_end = false
    chapter_id = parseInt(document.getElementById('id_chapter_get').value)
    question_content = ''
    question_content += `<div class='question-list-container-customize'>
            <p>`
    question_content += `<div class='question-container-table '>`
    question_content += `<table class="table mt-5"> <tr class='table-heading '><th>sl.no</th>
                    <th>select</th>
                    <th>question</th>
                    <th>question type</th>
                    <th>cognitive level</th>
                    <th>difficulty level</th>
                    <th>marks</th></tr>`
    let i = 0
    question_per_chapter = []
    overall_question_list.forEach((d, index) => {
        // console.log(d)
        question_id_list.push(d.id)
        if (d.chapter == chapter_id) {
            i += 1
            question_per_chapter.push(d.id)
            question_content += `<tr  onClick="selectitem(${d.id})"  ><td><input type="checkbox" id="question_${d.id}" value="${d.id}"></td>
                <td>${i}</td>
             <td><label for="question_${d.id}">${d.question}</label></td>
             <td>${d.question_type}</td>
             <td>${d.cognitive_level}</td>
             <td>${d.difficulty_level}</td>
             <td>${d.mark}</td>
             </tr>
`}
    })
    question_content += `</table></div>`

    // <span class="more-btn"><button id="next-btn" class="submit-btn btn btn-sm btn-primary" onclick=add()>Add More</button> </span>

    document.querySelector('.q-form-6').innerHTML = question_content
    for (i = 0; i < question_per_chapter_get.length; i++) {
        if (question_per_chapter_get[i].key == chapter_id) {
            let current_list = question_per_chapter_get[i].value
            for (j = 0; j < current_list.length; j++) {
                console.log(current_list[j], 'li')
                document.getElementById(`question_${current_list[j]}`).checked = true
            }
        }
    }
    document.getElementById('q-form').style.display = 'none'
}
