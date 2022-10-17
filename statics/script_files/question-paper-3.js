

    function remove_question(id) {
        for (var i = 0; i < question_list.length; i++) {
            if (question_list[i] == id) {
                question_list.splice(i, 1);
            }
        }
        for (var i = 0; i < question_details_list.length; i++) {
            if (question_details_list[i].id == id) {
                question_details_list.splice(i, 1);
            }
        }
        document.getElementById('No_of_questions').innerHTML = question_list.length
        let content2 = '<div class="question-details">';
        question_details_list.forEach((d, index) => {
            content2 += `<p> Question : ${d.question} </p>
                <p>Answer : ${d.answers.answer}</p>
                <button onclick=remove_question(${d.id})>remove</button>
                `
        })
        content2 += '</div>'
        document.querySelector('.question_paper_div').innerHTML = content2
    }

    // submit without customize

    function submit_woc() {
        userId = localStorage.getItem('id')
        let form_remarks = document.getElementById('id_remarks').value
        let form_description = document.getElementById('id_description').value
        let form_percentage = document.getElementById('id_pass_percentage').value
        fetch('https://schooltestproject.herokuapp.com/api/test/',
            {
                method: 'POST',
                body: JSON.stringify({
                    'grade': grade_id, 'subject': subject_id, 'question_paper': question_paper_id,
                    'created_staff_id': userId, 'marks': overall_marks, 'duration': timing,
                    'remarks': form_remarks, 'pass_percentage': form_percentage, 'description': form_description
                }
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

                }
                return response.json();
            }).then(function (data) {
                console.log(data)
                document.getElementById('q-form-5').style.display = 'block'
                document.getElementById('q-form-3').style.display = 'none'
                let content4 = ''
                if (data.status != 'success') {
                    messages.innerHTML = ''
                    error_messages.innerHTML = `<li class='test-warning'>${(data.data)}</li>`;
                }
                else {
                    content4 += `<p class="success"> ${form_remarks} test created successfully</p>
<p class="success">Test ID :  ${data.data.test_id}</p>
<p> Grade : ${grade}</p>
<p> subject : ${subject_name}</p>
<div> <p class='heading'> list of questions </p>
`;
                    for (i = 0; i < question_name.length; i++) {
                        content4 += `<p>${i + 1}. ${question_name[i]}</p>`
                    }
                    content4 += `<p><button class='btn btn-sm btn-primary' onclick=refresh()>Ok</button></p>`
                    content4 += `</div>`
                    document.querySelector('.q-form-5').innerHTML = content4
                    error_messages.innerHTML = ''
                    document.getElementById('q-form-4').style.display = 'none';
                }
            })
    }



    // review

    function review() {
        document.getElementById('q-form-1').style.display = 'none';
        document.getElementById('q-form-2').style.display = 'none';
        document.getElementById('q-form-3').style.display = 'block';
        document.getElementById('q-form-4').style.display = 'none';
        document.querySelector('.question-paper-details-btn').innerHTML = '<button class="btn btn-sm btn-primary"   data-toggle="modal" data-target="#question-paper-details">details</button>'
    }


    // submit with customize
    function submit() {
        console.log(questions_total)
        console.log(customize)
        if (!questions_total) {
            result = 'null';
        } else {
            console.log(result)
            result = JSON.stringify(result)
            from_chapter_id = null
            to_chapter_id = null
            no_of_questions = questions_total
            console.log(no_of_questions)
            console.log(result)
        }
        let url1 = new URL('https://schooltestproject.herokuapp.com/api/question-paper/')
        url1.searchParams.append('type', 'save');
        fetch(url1,
            {
                method: 'POST',
                body: JSON.stringify({
                    'grade': grade, 'subject': subject_id, 'timing': timing, 'overall_marks': overall_marks, 'customize': result
                }
                ),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'token' + ' ' + token,
                    'X-CSRFToken': csrftoken
                },
            }).then(function (response) {
                return response.json()
            }).then(data => {
                console.log(data)
                console.log(data.status)
                if (data.status != 'success') {
                    document.getElementById('q-form-5').style.display = 'block'
                    error_messages.innerHTML = `<li class='test-warning'>${(data.data)}</li>`;
                }
                else {
                    question_paper_id = data.data.id
                    timing = data.data.timing
                    overall_marks = data.data.overall_marks
                    question_name = data.questions
                    userId = localStorage.getItem('id')
                    let form_remarks = document.getElementById('id_remarks').value
                    let form_description = document.getElementById('id_description').value
                    let form_percentage = document.getElementById('id_pass_percentage').value
                    fetch('https://schooltestproject.herokuapp.com/api/test/',
                        {
                            method: 'POST',
                            body: JSON.stringify({
                                'grade': grade, 'subject': subject_id, 'question_paper': question_paper_id,
                                'created_staff_id': userId, 'marks': overall_marks, 'duration': timing, 'remarks': form_remarks,
                                'pass_percentage': form_percentage, 'description': form_description
                            }
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

                            }
                            return response.json();
                        }).then(function (data) {
                            console.log(data)

                            document.getElementById('q-form-5').style.display = 'block'
                            document.getElementById('q-form-3').style.display = 'none'
                            if (data.status != 'success') {
                                error_messages.innerHTML = `<li class='test-warning'>${(data.data)}</li>`;
                                messages.innerHTML = '';
                            }
                            else {
                                content4 += `<p class="success"> ${form_remarks} test created successfully</p>
                <p class="success">Test ID :  ${data.data.test_id}</p>
                <p> Grade : ${grade}</p>
                <p> subject : ${subject_name}</p>
                <div> <p class='heading'> list of questions </p>
                `;
                                for (i = 0; i < question_name.length; i++) {
                                    content4 += `<p>${i + 1}. ${question_name[i]}</p>`
                                }
                                content4 += `<p><button class='btn btn-sm btn-primary' onclick=refresh()>Ok</button></p>`
                                content4 += `</div>`
                                document.querySelector('.q-form-5').innerHTML = content4
                                error_messages.innerHTML = ''
                                document.getElementById('q-form-4').style.display = 'none';
                            }
                        })
                }

            })
    }

    function refresh() {
        location.reload();
    }

    function question_paper_create() {
        let url1 = new URL('https://schooltestproject.herokuapp.com/api/question-paper/')
        url1.searchParams.append('type', 'save');
        from_chapter_id = null
        to_chapter_id = null
        all_chapter = false
        fetch(url1,
            {
                method: 'POST',
                body: JSON.stringify({
                    'grade': grade_id, 'subject': subject_id, 'timing': timing, 'overall_marks': overall_marks, 'customize': null
                    , 'list_of_questions': question_list,
                }
                ),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'token' + ' ' + token,
                    'X-CSRFToken': csrftoken
                },
            }).then(function (response) {
                return response.json()
            }).then(data => {
                console.log(data)
                console.log(data.status)
                if (data.status != 'success') {
                    document.getElementById('q-form-5').style.display = 'block'
                    error_messages.innerHTML = `<li class='test-warning'>${(data.data)}</li>`;
                }
                else {
                    question_paper_id = data.data.id
                    timing = data.data.timing
                    overall_marks = data.data.overall_marks
                    question_name = data.questions
                    console.log('ut', data.question_details)
                    console.log(question_name)
                    document.querySelector('.create-test-modal-btn').innerHTML = `<button class='btn btn-sm btn-primary' data-toggle="modal" data-target="#test-create-details">Create Test</button>`
                    $("#test-create-details").modal("show")
                    document.querySelector('.next-btn-woc').innerHTML = '<button  class="submit-btn btn btn-sm btn-primary" onclick=submit_woc()>Create test</button>'
                    document.getElementById('id_overall_marks').value = overall_marks
                    document.getElementById('id_timing').value = timing
                }
            })
    }

    function question_paper_pdf() {
        if(question_list.length){
        let url1 = new URL('https://schooltestproject.herokuapp.com/api/question-paper/')
        from_chapter_id = null
        to_chapter_id = null
        all_chapter = false
        fetch(url1,
            {
                method: 'POST',
                body: JSON.stringify({
                    'grade': grade_id, 'subject': subject_id, 'timing': timing, 'overall_marks': overall_marks, 'customize': null
                    , 'list_of_questions': question_list,
                }
                ),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'token' + ' ' + token,
                    'X-CSRFToken': csrftoken
                },
            }).then(function (response) {
                return response.json()
            }).then(data => {
                console.log(data)
                console.log(data.status)
                if (data.status != 'success') {
                    document.getElementById('q-form-5').style.display = 'block'
                    error_messages.innerHTML = `<li class='test-warning'>${(data.data)}</li>`;
                }
                else {
                    var link = document.createElement('a');
                    link.href = `https://schooltestproject.herokuapp.com${data.question_path}`;
                    link.download = 'file.pdf';
                    link.dispatchEvent(new MouseEvent('click'));
                }
            })
    }
}
