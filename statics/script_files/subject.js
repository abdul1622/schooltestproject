    // getting subjects

    function getsubject(val1, val2) {
        grade_val = val1
        grade_id = val2
        document.getElementById('grade').style.display = 'block'
        console.log(grade_val);

        form_all.innerHTML = `<button class=' btn btn-warning 'data-toggle='modal' data-target='#subjectmodal'> Add subject</button>`
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
        <p class="text-center"> <button  class=" btn btn-warning btn-sm  ch-btn"  onclick=getchapter(${d.grade_name},"${temp}",${d.id})>Chapters</button></p>
        <br>
        <div class="d-flex  justify-content-around"><i id="edit" class="fa fa-edit"data-toggle='modal' data-target='#subjectmodal'></i>
        <i id="delete" data-toggle="modal" data-target="#delete-box-Modal" class="fa fa-trash-o" ></i></div>
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