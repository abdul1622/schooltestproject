
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
        form_all.innerHTML = `<div class="chapter-form-box"> 
        <p><label for="id_chapter_no">Chapter no:</label> 
        <input class='form-control' type="number" name="chapter_no" min="0" required="" id="id_chapter_no"></p>
        <p><label for="id_name">Name:</label> 
        <input class='form-control' type="text" name="name" maxlength="30" required="" id="id_name"></p>
        <p><label for="id_description">Description:</label> 
        <input class='form-control' type="text" name="description" maxlength="50" required="" id="id_description"></p></div>`
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

        //  document.getElementById('grade').style.height = '30vh';
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
                    content = content + `<div class="chapter-card " id=${d.id}>
        <p><label> Chapter no </label> <span>: <span class="chapter_no">${d.chapter_no}</span></span></p>
        <p><label> Chapter </label> <span>: <span class="name">${d.name}</span></span></p>
        <p><label> Description </label> <span>: <span class="description">${d.description}</span></span></p>
        <br>
        <div class ='d-flex justify-content-around'><i id="edit" class="fa fa-edit"></i><i id="delete" data-toggle="modal" data-target="#delete-box-Modal" class="fa fa-trash-o" ></i></div>
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
