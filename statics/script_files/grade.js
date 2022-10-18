
    // check for user type
    $(document).ready(function () {
        if (!token) {
            return window.location.href = '/login';
        }
        var user = localStorage.getItem('user_type')
        if (user == 'is_student') {
            return window.location.href = '/404';
            
        }
        document.getElementById('nav-academics').style.opacity = '0.5';
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
                    content = content + `  <div class="card container"  id=${d.id}>
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
