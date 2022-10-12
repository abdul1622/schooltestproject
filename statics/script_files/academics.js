
// check for user type
$(document).ready(function () {
    if (!token) {
        return window.location.href = '/login';
    }
    var user = localStorage.getItem('user_type')
    if (user == 'is_student') {
        return window.location.href = '/404';
    }
})
// variable
var token = localStorage.getItem('token')
let user_type = localStorage.getItem('user_type')
const subject_create = document.getElementById('subject-btn')
const grade_create = document.getElementById('grade-btn')
const chapter_create = document.getElementById('chapter-btn')
var form_all = document.querySelector('.form-all')
let messages = document.querySelector('.messages')
let error_messages = document.querySelector('.error-messages')
let container2 = document.querySelector('.cards')
var container = document.querySelector('.cards')
var container3 = document.querySelector('.chapter-cards')
var list = document.querySelector('.grade-list');
document.getElementById('nav-academics').style.opacity = '0.5';
let edit = null
let chapter_list = []
var subject_id;
var grade_val;
let current_grade;
var host = window.location.protocol + "//" + window.location.host;
let section_list = []

document.getElementById('back-btn-chapter').addEventListener('click', () => {
    getsubject(grade_val, grade_id);
    messages.innerHTML = ''
    error_messages.innerHTML = ''
})

function section_change() {
    document.querySelector('.section-list').innerHTML = ''
    section_list = []
}

// get grade
function get() {
    var content = ' <h2>Grades </h2> <hr> <div class="cards">'
    fetch('https://schooltestproject.herokuapp.com/api/grades/', {
        method: 'GET',
        headers: {
            // 'X-CSRFToken': csrftoken,
            'Authorization': 'token' + ' ' + token
        },
    }).then(res => {
        return res.json()
    }).then(data => {
        console.log(data.data)
        grade_list = data.data
        console.log(data.data)
        if (data.status == 'failure') {
            window.location.href = `${host}/404`
        }
        if (data.data) {
            document.getElementById('grade').style.display = 'block'
            document.getElementById('grade-container').style.display = 'block'
        }
        data.data.forEach((d, index) => {
            if (user_type == 'is_admin') {
                content = content + `  <div class="card container"  id=${d.id}> <button data-toggle="modal" data-target="#delete-box-Modal" onclick=deletegradesetup(${d.id}) class='delete-grade'>&#x2715; </button> <button id="edit" onclick=edit_grade(${d.id})><i class="fa fa-edit"></i></button>
    <p  onclick=getsubject(${d.grade},${d.id}) class="grade">${d.grade} </p>
    
</div>`
            } else {
                content = content + `  <div class="card container"  id=${d.id}> <button data-toggle="modal" data-target="#delete-box-Modal" onclick=deletegradesetup(${d.id}) class='delete-grade'>&#x2715; </button>
    <p  onclick=getsubject(${d.grade},${d.id}) class="grade">${d.grade} </p>
    
</div>`
            }
        })
        content += '</div>'
        list.innerHTML = content;
        container.innerHTML = ''
        document.getElementById('back-btn').style.display = "none"
        document.getElementById('back-btn-chapter').style.display = "none"
        document.getElementById('subject-btn').style.display = "none"
        document.getElementById('chapter-btn').style.display = "none"
        document.getElementById('grade-btn').style.display = "inline"
        document.getElementById('grade-list').style.display = "block"
        document.getElementById('chapterlist').style.display = "none"
        form_all.innerHTML = `<div class='grade-form-box'>
            <p><label for="id_grade">Grade:</label> <input type="number" name="grade" min="0" max="12" onchange=section_change() required="" id="id_grade"></p>
            <p class='section-btn'><span> <button onclick=add_section('create') id='add-section'>Add Section</button> </span> <span class='delete-section'></span> </p> </p>
            <p class='section-list'> </p>
            <p class='section-error'></p>
            </div>`
        document.getElementById('subjects-by-grade').style.display = "none"
        if (user_type != 'is_admin') {
            document.getElementById('grade').style.display = 'none'
        }
    })
};
// <p> <label for='id_section'>Section :</label>
// <input type="text" name="" maxlength="1" id="id_section">
get();

// delete grade 
function deletegradesetup(id) {
    let url = 'https://schooltestproject.herokuapp.com/api/grades/'
    let yes_button = document.getElementById('delete-btn-yes')
    let no_btn = document.getElementById('delete-btn-no')
    yes_button.setAttribute("onClick", `deletegrade(${id})`);
}

//  edit grade
function edit_grade(id) {
    edit = true
    for (i = 0; i < grade_list.length; i++) {
        if (grade_list[i].id == id) {
            current_grade = grade_list[i]
            section_list = grade_list[i].section
        }
    }
    form_all.innerHTML = `<div class='grade-form-box'>
        {% csrf_token %}
            <p><label for="id_grade">Grade:</label> <input type="number" disabled name="grade" min="0" max="12" onchange=section_change() required="" id="id_grade"></p>
            <p class='section-btn'><span> <button onclick=add_section('edit') id='add-section'>Add Section</button> </span> <span class='delete-section'></span> </p> </p>
            <p class='section-list'> </p>
            <p class='section-error'></p>
            <p> <button onclick=cancel()> cancel </button> </p>
            </div>`
    let section_content = ''
    for (i = 0; i < section_list.length; i++) {
        section_content += `<li>${section_list[i]}</li> `
    }
    if (section_list.length) {
        document.querySelector('.delete-section').innerHTML = ` <button onclick=remove_section() id='add-section'>remove_section</button>`
    }
    document.querySelector('.section-list').innerHTML = section_content
}

//  cancel section adding
function cancel() {
    form_all.innerHTML = `<div class='grade-form-box'>
        {% csrf_token %}
            <p><label for="id_grade">Grade:</label> <input type="number" name="grade" min="0" max="12" onchange=section_change() required="" id="id_grade"></p>
            <p class='section-btn'><span> <button onclick=add_section('create') id='add-section'>Add Section</button> </span> <span class='delete-section'></span> </p> </p>
            <p class='section-list'> </p>
            <p class='section-error'></p>
            </div>`
    edit = false
}

// add section 
function add_section(flag) {
    let standard
    if (flag == 'edit') {
        standard = current_grade.grade
    }
    else {
        standard = document.getElementById('id_grade').value
    }
    let section;

    if (!standard) {
        document.querySelector('.section-error').innerHTML = `<li>add standard</li>`
        return
    }
    if (section_list.length) {
        if (section_list[section_list.length - 1] == 'Z') {
            document.querySelector('.section-error').innerHTML = `<li>no more section</li>`
            return
        }
        as_sec = ((section_list[section_list.length - 1]).charCodeAt(0)) + 1
        section = String.fromCharCode(as_sec)
        section_list.push(section)
    } else {
        section_list.push('A')
    }
    document.querySelector('.section-error').innerHTML = ''

    let section_content = ''
    for (i = 0; i < section_list.length; i++) {
        section_content += `<li>${section_list[i]}</li> `
    }
    if (section_list.length) {
        document.querySelector('.delete-section').innerHTML = ` <button onclick=remove_section() id='add-section'>remove_section</button>`
    }
    document.querySelector('.section-list').innerHTML = section_content
}

// remove section
function remove_section() {
    section_list.pop()
    let section_content = ''
    for (i = 0; i < section_list.length; i++) {
        section_content += `<li>${section_list[i]}</li> `
    }
    document.querySelector('.section-list').innerHTML = section_content
    document.querySelector('.section-error').innerHTML = ''
}

// delete section
function deletegrade(id) {
    let url = 'https://schooltestproject.herokuapp.com/api/grades/'
    fetch(`${url}${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'token' + ' ' + token,
        },
    }).then(res => {
        console.log(res)
        return get();
    }
    )
}

// message popup close
document.getElementById('message-close-btn').addEventListener('click', () => {
    messages.innerHTML = ''
    error_messages.innerHTML = ''
})

// create grade 
grade_create.addEventListener('click', () => {
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let url_grade = 'https://schooltestproject.herokuapp.com/api/grades/'
    let id = current_grade.id
    if (edit) {
        fetch(`${url_grade}${id}/`, {
            method: 'PUT',
            headers: {
                'content-Type': 'application/json',
                'Authorization': 'token' + ' ' + token,
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                'section': section_list
            })
        }).then(function (response) {
            if (response.status == 200) {
                console.log("Sucess response", response)
                messages.innerHTML = 'Updated succesfully';
                error_messages.innerHTML = ''
                // get();
                get();
            } else {
                console.log(response);
            }
            return response.json()
        }).then(data => {
            console.log(data)
            if (data.status != 'success') {
                error_messages.innerHTML = `<li>${(data.data.error)}</li>`
                messages.innerHTML = ''
            }
            edit = false
            return
        })
    }
    else {
        console.log('nja')
        var grade = document.getElementById('id_grade').value
        let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        fetch(url_grade,
            {
                method: 'POST',
                body: JSON.stringify({ 'grade': grade, 'section': section_list }
                ),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'token' + ' ' + token,
                    'X-CSRFToken': csrftoken
                },
            }).then(response => {
                if (response.status == 201) {
                    console.log("Sucess response", response)
                    messages.innerHTML = 'created successfully'
                    error_messages.innerHTML = ''
                    get();
                }
                return response.json();
            }).then(function (data) {
                console.log(data)
                if (data.status != 'success') {
                    error_messages.innerHTML = `<li>${(data.data.error)}</li>`
                    messages.innerHTML = ''
                }
            })
        return true;
    }
})


// getting subjects

function getsubject(val1, val2) {
    grade_val = val1
    grade_id = val2
    document.getElementById('grade').style.display = 'block'
    console.log(grade_val);

    form_all.innerHTML = `<div class='subject-form-box'>{{subjectform.as_p}} </div>`
    list.innerHTML = ''
    document.getElementById('grade-title').textContent = `${grade_val}`
    document.getElementById('grade-btn').style.display = "none"
    document.getElementById('subject-btn').style.display = "inline"
    document.getElementById('chapter-btn').style.display = "none"
    document.getElementById('back-btn').style.display = "inline"
    document.getElementById('grade-list').style.display = "none"
    document.getElementById('chapterlist').style.display = "none"
    document.getElementById('subjects-by-grade').style.display = "block"
    // delete_box.style.display = 'none';
    let temp;
    // document.getElementById('grade').style.height = '26vh';
    url2 = new URL('https://schooltestproject.herokuapp.com/api/subject-list/');
    url2.searchParams.append('grade', grade_val);
    var content = ''
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
            temp = `${d.name}`
            temp = temp.replace(/\s/g, '_')
            console.log(temp)
            // <p><label> Grade </label> <span>: <span class="grade">${d.grade_name}</span></span></p>
            content = content + `<div class="subject-card"   id=${d.id}>
    <p><label> Subject </label> <span>: <span class="name">${d.name}</span></span></p>
    <p><label> Subject-code </label> <span>: <span class="code">${d.code}</span></span></p>
    <p class="text-center"> <a type="button" class="btn btn-sm btn-primary ch-btn" href=# onclick=getchapter(${d.grade_name},"${temp}",${d.id})>Chapters</a></p>
    <br>
    <p class="text-center"><i id="edit" class="fa fa-edit"></i><i id="delete" data-toggle="modal" data-target="#delete-box-Modal" class="fa fa-trash-o" ></i></p>
</div>`
        });
        container.innerHTML = content;

    })
}

console.log(subject_create)

// create subjects

subject_create.addEventListener('click', () => {
    var code = document.getElementById('id_code').value
    var name = document.getElementById('id_name').value
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    console.log(edit)
    if (!edit) {
        console.log(edit)
        fetch('https://schooltestproject.herokuapp.com/api/subjects/',
            {
                method: 'POST',
                body: JSON.stringify({ 'code': code, 'name': name, 'grade': grade_id }
                ),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'token' + ' ' + token,
                    'X-CSRFToken': csrftoken
                },
            }).then(function (response) {
                if (response.status == 201) {
                    console.log("Sucess response", response)
                    messages.innerHTML = `${name} is created succesfully`;
                    error_messages.innerHTML = ''
                    // get();
                    getsubject(grade_val, grade_id);
                } else {
                    console.log(response);
                }
                return response.json()
            }).then(data => {
                console.log(data)
                if (data.status != 'success') {
                    error_messages.innerHTML = `<li>${(data.data.error)}</li>`
                    messages.innerHTML = ''
                }
            })
    }
})


// edit subjects
function deletesubject(id) {
    let url = 'https://schooltestproject.herokuapp.com/api/subjects/'
    fetch(`${url}${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'token' + ' ' + token,
        },
    }).then(res => {
        console.log(res)
        getsubject(grade_val, grade_id);
    }
    )

}

container2.addEventListener('click', (e) => {
    //   form_grade = document.getElementById('id_grade')
    form_code = document.getElementById('id_code')
    form_name = document.getElementById('id_name')
    let url = 'https://schooltestproject.herokuapp.com/api/subjects/'
    subject_btn = document.getElementById('subject-btn')
    e.preventDefault();
    let delbutton = e.target.id == 'delete';
    let editbutton = e.target.id == 'edit';
    edit = editbutton
    let id = e.target.parentElement.parentElement.id;
    console.log(e.target.parentElement.parentElement.id)
    let yes_button = document.getElementById('delete-btn-yes')
    let no_btn = document.getElementById('delete-btn-no')
    if (delbutton) {
        console.log('RRR')
        yes_button.setAttribute("onClick", `deletesubject(${id})`);
        // const parent1 = e.target.parentElement.parentElement;
        // var name = parent1.querySelector('.name').textContent
        // no_btn.addEventListener('click',()=>{
        //     getsubject(grade_val,grade_id);
        // })

    }
    console.log(editbutton, 'dfg')

    if (editbutton) {
        window.location.href = '#grade';
        const parent = e.target.parentElement.parentElement;
        // var grade = parent.querySelector('.grade').textContent;
        var code = parent.querySelector('.code').textContent;
        var name = parent.querySelector('.name').textContent;
        form_code.value = code
        form_name.value = name
        let id = e.target.parentElement.parentElement.id;
        console.log(id)
        console.log(grade_val)
        let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        subject_btn.addEventListener('click', () => {
            if (edit) {
                fetch(`${url}${id}/`, {
                    method: 'PUT',
                    headers: {
                        'content-Type': 'application/json',
                        'Authorization': 'token' + ' ' + token,
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({
                        'grade': grade_id,
                        'code': form_code.value,
                        'name': form_name.value,
                    })
                }).then(function (response) {
                    if (response.status == 200) {
                        console.log("Sucess response", response)
                        messages.innerHTML = 'Updated succesfully';
                        error_messages.innerHTML = ''
                        // get();
                        getsubject(grade_val, grade_id);
                    } else {
                        console.log(response);
                    }
                    return response.json()
                }).then(data => {
                    console.log(data)
                    if (data.status != 'success') {
                        error_messages.innerHTML = `<li>${(data.data.error)}</li>`
                        messages.innerHTML = ''
                    }
                    edit = false
                    return
                })

            }
        })
    }
});

// get chapter

function getchapter(val1, val2, val3) {
    grade_val = val1
    val2 = val2.replace('_', ' ')
    subject_val = val2
    console.log(subject_val)
    subject_id = val3
    subject_val = (subject_val).toUpperCase()
    console.log(grade_val);
    console.log(subject_val)
    list.innerHTML = ''
    container.innerHTML = ''
    form_all.innerHTML = `<div class='chapter-form-box'> {{chapterform.as_p}} <div>`
    document.getElementById('grade-title-chapter').textContent = `${grade_val}`
    document.getElementById('subject-title').textContent = `${subject_val}`
    document.getElementById('grade-btn').style.display = "none"
    document.getElementById('subject-btn').style.display = "none"
    document.getElementById('chapter-btn').style.display = "inline"
    document.getElementById('back-btn').style.display = "none"
    document.getElementById('back-btn-chapter').style.display = "inline"
    document.getElementById('grade-list').style.display = "none"
    document.getElementById('chapterlist').style.display = "block"
    document.getElementById('subjects-by-grade').style.display = "none"
    // delete_box.style.display = 'none';

    // document.getElementById('grade').style.height = '30vh';
    url3 = ('https://schooltestproject.herokuapp.com/api/chapter-list/');
    var content = ''
    fetch(url3, {
        method: 'POST',
        body: JSON.stringify({ 'grade': grade_val, 'subject': subject_val }
        ),
        headers: {
            'content-Type': 'application/json',
            'Authorization': 'token' + ' ' + token,
        }
    }).then(res => {
        return res.json()
    }).then(data => {
        container3.innerHTML = ''
        if (data.status == 'success') {
            subject_id = data.data[0].subject_id
            console.log(data.data[0].subject_id)
            chapter_list = data.data
            console.log(chapter_list)
            data.data.forEach((d, index) => {
                // <p><label> Subject </label> <span>: <span id="${d.subject_id}" class="subject">${d.subject}</span></span></p>
                content = content + `<div class="chapter-card" id=${d.id}>
    <p><label> Chapter_no </label> <span>: <span class="chapter_no">${d.chapter_no}</span></span></p>
    <p><label> Chapter </label> <span>: <span class="name">${d.name}</span></span></p>
    <p><label> Description </label> <span>: <span class="description">${d.description}</span></span></p>
    <br>
    <p><i id="edit" class="fa fa-edit"></i><i id="delete" data-toggle="modal" data-target="#delete-box-Modal" class="fa fa-trash-o" ></i></p>
</div>`
                container3.innerHTML = content;

            });
        } else {
            container3.innerHTML = 'no chapter in this subject';

        }


        console.log(document.querySelector('.submit-btn').id)
    })
}

// chapter edit

function deletechapter(id) {
    fetch(`https://schooltestproject.herokuapp.com/api/chapters/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'token' + ' ' + token
        },
    }).then(() => {
        getchapter(grade_val, subject_val, subject_id);
    }
    )
}

container3.addEventListener('click', (e) => {
    //   form_subject = document.getElementById('id_subject')
    form_chapter_no = document.getElementById('id_chapter_no')
    form_name = document.getElementById('id_name')
    form_description = document.getElementById('id_description');
    chapter_btn = document.getElementById('chapter-btn')
    e.preventDefault();
    let delbutton = e.target.id == 'delete';
    let editbutton = e.target.id == 'edit';
    edit = editbutton
    let id = e.target.parentElement.parentElement.id;
    console.log(e.target.parentElement.parentElement)
    let yes_button = document.getElementById('delete-btn-yes')
    let no_btn = document.getElementById('delete-btn-no')
    if (delbutton) {
        // delete_box.style.display = 'block';
        const parent1 = e.target.parentElement.parentElement;
        var name = parent1.querySelector('.name').textContent
        // no_btn.addEventListener('click',()=>{
        //     getchapter(grade_val,subject_val,subject_id);
        // })

        yes_button.setAttribute("onClick", `deletechapter(${id})`);

    }

    if (editbutton) {
        window.location.href = '#grade';
        const parent = e.target.parentElement.parentElement;
        // var subject = parent.querySelector('.subject').id;
        var chapter_no = parent.querySelector('.chapter_no').textContent;
        var name = parent.querySelector('.name').textContent;
        var description = parent.querySelector('.description').textContent;
        // form_subject.value = subject
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
                        'subject': subject_id,
                        'chapter_no': form_chapter_no.value,
                        'name': form_name.value,
                        'description': form_description.value,
                    })
                }).then(function (response) {
                    if (response.status == 200) {
                        console.log("Sucess response", response)
                        messages.innerHTML = 'Updated succesfully';
                        error_messages.innerHTML = ''
                        getchapter(grade_val, subject_val, subject_id);
                    } else {
                        console.log(response);
                    }
                    return response.json()

                }).then(data => {
                    console.log(data)
                    if (data.status != 'success') {
                        error_messages.innerHTML = `<li>${(data.data.error)}</li>`
                        messages.innerHTML = ''
                    }
                    edit = false
                    return
                }
                )

            }
        })
    }
});

// create chapter

chapter_create.addEventListener('click', () => {
    var chapterno = document.getElementById('id_chapter_no').value
    var name = document.getElementById('id_name').value
    var description = document.getElementById('id_description').value
    console.log(subject_id)
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    if (!edit) {
        fetch('https://schooltestproject.herokuapp.com/api/chapters/',
            {
                method: 'POST',
                body: JSON.stringify({ 'chapter_no': chapterno, 'name': name, 'description': description, 'subject': subject_id }
                ),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
            }).then(function (response) {
                if (response.status == 201) {
                    console.log("Sucess response", response)
                    messages.innerHTML = `${name} is created succesfully`;
                    error_messages.innerHTML = ''
                    getchapter(grade_val, subject_val, subject_id);
                } else {
                    console.log(response);
                }
                return response.json()
            }).then(data => {
                console.log(data)
                if (data.status != 'success') {
                    error_messages.innerHTML = `<li>${(data.data.error)}</li>`
                    messages.innerHTML = ''
                }
            })
    }
})