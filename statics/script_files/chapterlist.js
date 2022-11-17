var token = localStorage.getItem("token")

// chack for a user type
$(document).ready(function () {
    if (!token) {
        return window.location.href = '/login';
    }
    var user = localStorage.getItem('user_type')
    if (user == 'is_student') {
        return window.location.href = '/404';
    }
    document.getElementById('nav-chapterlist-link').style.opacity = '0.5';
})

// variables

let grade_element = document.getElementById('id_grade')
let subject_element = document.getElementById('id_subject')
let standards = localStorage.getItem('standard')
let user_type = localStorage.getItem('user_type')
let container3 = document.querySelector('.chapter-table')
let error_messages = document.querySelector('.error-messages')
let messages = document.querySelector('.messages')

let flag = false
let edit = null;
var host = window.location.protocol + "//" + window.location.host;
var grade;
var subject;
let content = '';
let grade_list
var grade_name;
var subject_name;
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
        window.location.href = `${host}/404`
    }

    if (grade_list.length) {
        if (grade_list.length == 1) {
            // content += ` <option value="${grade_list[0].id}">${grade_list[0].grade}</option>`
            document.querySelector('.grade-p').innerHTML = `Grade -- ${grade_list[0].grade}`
            var url_for_change = 'https://schooltestproject.herokuapp.com/api/ajax/load-subject/';
            var gradeId = grade_list[0].id;
            grade_name = grade_list[0].grade
            $.ajax({
                url: url_for_change,
                data: {
                    'grade': gradeId
                },
                success: function (data) {
                    $("#id_subject").html(data);
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

    }

})

// get grade and subject details
function getgradename(element) {
    grade_name = element.options[element.selectedIndex].text;
    grade = element.options[element.selectedIndex].value
}
function getsubjectname(element) {
    subject = parseInt(element.options[element.selectedIndex].value)
    console.log(subject, 'da')
    if (!isNaN(subject)) {
        console.log(subject, 'da1')
        subject_name = element.options[element.selectedIndex].text;
    } else {
        subject_name = null;
    }
    getchapter();
}
// on grade input change
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

// message close function
document.getElementById('message-close-btn').addEventListener('click', () => {
    messages.innerHTML = '';
    error_messages.innerHTML = '';
})


function back() {
    document.querySelector('.chapter-table').innerHTML = ''
    document.querySelector('.form').style.display = 'none'
    flag = false
    document.querySelector('.box').style.display = 'block'
    if (document.getElementById('id_grade')) {
        document.getElementById('id_grade').value = '';
    }
    document.getElementById('id_subject').value = '';
}

// get chapter

function get(grade, subject) {
    document.getElementById('id_grade').value = grade;
    document.getElementById('id_subject').value = subject;
    console.log(grade, subject)
    getchapter();
}

function getchapter() {

    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // var grade = document.getElementById('id_grade').value
    // var subject = document.getElementById('id_subject').value
    // let grade_name = grade_element.options[grade_element.selectedIndex].text
    // let subject_name = subject_element.options[subject_element.selectedIndex].text
    console.log(grade, subject)
    console.log(grade_name + subject_name)
    if (!isNaN(subject)) {
        fetch('https://schooltestproject.herokuapp.com/api/chapter-list/', {
            method: 'POST',
            body: JSON.stringify({ 'grade': grade_name, 'subject': subject_name }
            ),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'token' + ' ' + token,
                'X-CSRFToken': csrftoken
            }
        }).then(response => response.json()).then(data => {
            if (data.status == 'success') {
                console.log(data.data[0])
                let content = `<div  class='chapterhead'>
                        <h4 class='chaptergrade'>Grade:${data.data[0]['grade']}</h4>
                        <h4 class="subjectname" id=${data.data[0]['subject_id']}>Subject : ${data.data[0]['subject']}</h4>
                    </div>`
                console.log(data);
                let table2 = ''
                table2 += `<i class=" fa fa-light fa-arrow-left-long" id="back-btn" onclick=back() ></i>`
                table2 += `<table class="table chapter-table"><thead class="thead"><th>Chapter No</th><th>Chapter Name</th><th>Description</th><th>Action</th></thead>`;
                data.data.map(d => {
                    table2 = table2 + `<tr id=${d.id}>`;
                    table2 = table2 + '<td scope="col" class="chapter_no">' + `${d.chapter_no}` + '</td>';
                    table2 = table2 + '<td scope="col" class="chapter_name">' + `${d.name}` + '</td>';
                    table2 = table2 + '<td scope="col" class="description">' + `${d.description}` + '</td>',
                        table2 = table2 + '<td>' + `<i id="edit" class="fa fa-edit" data-toggle='modal' data-target='#chapter-edit-popup'></i>` + `<i class="fa fa-trash-o" id="delete" btn btn-danger" data-toggle="modal" data-target="#delete-box-Modal-chapterlist"></i>` + '</td>',
                        // table2 = table2 + '<td>' + + '</td>',
                        table2 = table2 + `</tr>`;
                })
                table2 += "</table>";

                // console.log(path)
                let container = document.querySelector('.chapter-table');
                flag = true
                container.innerHTML = content + table2;
                document.querySelector('.box').style.display = "none"
                document.getElementById('id_chapter_no').value = ''
                document.getElementById('id_name').value = ''
                document.getElementById('id_description').value = ''
                edit = null
                document.querySelector('.error-message').innerHTML = ''
            }
            else {
                // error_messages.innerHTML = `${data.status}`
                document.querySelector('.error-message').innerHTML = `<li class='text-center'>${subject_name} don't have a chapters</li>`
            }
        })
    } else {
        document.querySelector('.error-message').innerHTML = `<li class='text-center'>select subject</li>`
    }
}

// delete chapter
function deletechapter(id, grade_name, subject_name) {
    // subject_name = subject_name.replace('_', ' ')
    fetch(`https://schooltestproject.herokuapp.com/api/chapters/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'token' + ' ' + token
        },
    }).then(() => {
        form.style.display = 'none'
        get(grade_name, subject_name)
    }
    )
}

// edit chapter 
container3.addEventListener('click', (e) => {

    if (flag) {
        form_chapter_no = document.getElementById('id_chapter_no')
        form_name = document.getElementById('id_name')
        form_description = document.getElementById('id_description');
        chapter_btn = document.getElementById('chapter-btn')
        var subject_name = document.querySelector('.subjectname').textContent;
        console.log(subject_name)
        var grade_name = document.querySelector('.chaptergrade').textContent;
        e.preventDefault();
        let delbutton = e.target.id == 'delete';
        let editbutton = e.target.id == 'edit';
        edit = editbutton
        let id = e.target.parentElement.parentElement.id;
        console.log(e.target.parentElement.parentElement)
        let yes_button = document.getElementById('delete-btn-yes')
        let no_btn = document.getElementById('delete-btn-no')
        const parent = e.target.parentElement.parentElement;
        var subject = document.querySelector('.subjectname').id;
        console.log(subject)
        if (delbutton) {
            yes_button.setAttribute("onClick", `deletechapter(${id},${grade_name},'${subject}')`)
        }
        if (editbutton) {
            window.location.href = '#grade';
            var chapter_no = parent.querySelector('.chapter_no').textContent;
            var name = parent.querySelector('.chapter_name').textContent;
            document.getElementById('exampleModalLabel').innerHTML=name
            console.log(name)
            var description = parent.querySelector('.description').textContent;
            console.log(chapter_no)
            form_chapter_no.value = chapter_no
            form_name.value = name
            form_description.value = description
            let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            url3 = 'https://schooltestproject.herokuapp.com/api/chapters/'
            chapter_btn.addEventListener('click', () => {
                if (edit) {
                    fetch(`${url3}${id}/`, {
                        method: 'PUT',
                        headers: {
                            'content-Type': 'application/json',
                            'Authorization': 'token' + ' ' + token,
                            'X-CSRFToken': csrftoken
                        },
                        body: JSON.stringify({
                            'subject': subject,
                            'chapter_no': form_chapter_no.value,
                            'name': form_name.value,
                            'description': form_description.value,
                        })
                    }).then(function (response) {
                        if (response.status == 200) {
                            console.log("Sucess response", response)
                            messages.innerHTML = `${name} is updated succesfully`;
                            error_messages.innerHTML = ''
                           
                            get(grade_name, subject)
                        } else {
                            console.log(response);
                        }
                        return response.json()

                    }).then(data => {
                        console.log(data)
                        if (data.status != 'success') {
                            error_messages.innerHTML = `<li>${(data.data.error)}</li>`
                            messages.innerHTML = ''
                            get(grade_name, subject)
                        }
                    }
                    )

                }
            })
        }
    } else {
        return
    }
});