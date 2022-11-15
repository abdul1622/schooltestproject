

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "-head")) {
          // if present, the header is where you move the DIV from:
          document.getElementById(elmnt.id + "-head").onmousedown = dragMouseDown;
        } else {
          // otherwise, move the DIV from anywhere inside the DIV:
          elmnt.onmousedown = dragMouseDown;
        }
      
        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }
      
        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
      
        function closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;
        }
      }


    function get_customize() {
        document.getElementById('q-form').style.display = 'none'
        customize = true
        document.getElementById('q-form-4').style.display = 'block';
         document.getElementById('q-form-5').style.display = 'block';
        console.log('back', subject_id)
        var url_for_change = 'https://schooltestproject.herokuapp.com/api/ajax/load-subject/';
        $.ajax({
            url: url_for_change,
            data: {
                'subject': subject_id
            },
            success: function (data) {
                $("#id_chapter_get").html(data)
            }
        });
        // document.querySelector('.more-btn').innerHTML = `<button id="next-btn" class="submit-btn btn btn-primary" onclick=add()>Add More</button>`
        // document.querySelector('.more-btn').innerHTML = `<button id="next-btn" class="submit-btn btn btn-primary" onclick=add()>Add More</button>`
        document.querySelector('.next-btn').innerHTML = `<button id="next-btn" class="submit-btn btn btn-warning" onclick=with_customize()>Review</button>`
        document.querySelector('.back-btn').innerHTML = `<button id="next-btn" class="submit-btn btn btn-warning" onclick=getnext()>Back</button>`
        console.log(result)
        dragElement(document.getElementById("q-form-4"));
    }
    function with_customize() {
        document.getElementById('q-form').style.display = 'block'
        custom_end = true
        question_list = []
        let chap_list = []
        let content = []
        // add
        let list = []
        for (let i = 0; i < question_per_chapter.length; i++) {
            console.log(document.getElementById(`question_${question_per_chapter[i]}`))
            if (document.getElementById(`question_${question_per_chapter[i]}`)) {
                if (document.getElementById(`question_${question_per_chapter[i]}`).checked) {
                    list.push(question_per_chapter[i])
                }
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
        // 
        // 
        for (i = 0; i < question_per_chapter_get.length; i++) {
            let current_list = question_per_chapter_get[i].value
            console.log(current_list)
            if (current_list.length) {
                content += `<li>${chapters_list[i]['name']}</li>`
                for (j = 0; j < current_list.length; j++) {
                    question_list.push(current_list[j])
                }
            }
        }
        document.getElementById('grade_value').innerHTML = grade
        document.getElementById('subject_value').innerHTML = subject_name
        document.getElementById('chapter_value').innerHTML = content
        document.querySelector('.back-btn-review').innerHTML = `<button class="btn btn-warning" onclick=get_customize()>Back</button>`
        document.querySelector('.next-btn-woc').innerHTML = '  <button  class="submit-btn btn btn-sm btn-warning" disabled onclick=submit_woc()>Create test</button>'
        review();
        document.getElementById('No_of_questions').innerHTML = question_list.length
        document.getElementById('q-form-4').style.display = 'none';
        document.querySelector('.q-form-6').innerHTML = '';
    }

    function without_customize() {
        chapters = chapters_list
        from_chapter_no = parseInt(document.getElementById('id_from_chapter').value)
        to_chapter_no = parseInt(document.getElementById('id_to_chapter').value)
        all_chapter = document.getElementById('id_allChapter').checked;
        if (!all_chapter && !from_chapter_no && !to_chapter_no) {
            document.querySelector('.error-form-2').innerHTML = `<li style='color:white;'>fill any one of the above field</li>`;
            return
        }
        document.querySelector('.error-form-2').innerHTML = ''
        new_list = []

        if (all_chapter) {
            // print(chapters)
            from_chapter_no = chapters[0]['chapter_no']
            to_chapter_no = chapters[chapters.length - 1]['chapter_no']
            console.log(from_chapter_no, to_chapter_no, 'c')
        } else if (isNaN(from_chapter_no)) {
            from_chapter_no = chapters[0]['chapter_no']
        } else if (isNaN(to_chapter_no)) {
            to_chapter_no = chapter[chapters.length - 1][['chapter_no']]
        }
        // console.log(from)

        url_for_question = new URL('https://schooltestproject.herokuapp.com/api/question/');
        url_for_question.searchParams.append('grade', grade_id);
        url_for_question.searchParams.append('subject', subject_id);
        url_for_question.searchParams.append('from_chapter_no', from_chapter_no)
        url_for_question.searchParams.append('to_chapter_no', to_chapter_no)
        fetch(url_for_question, {
            method: 'GET',
            headers: {
                'content-Type': 'application/json',
                'Authorization': 'token' + ' ' + token,
            }
        }).then(res => {
            return res.json()
        }).then(data => {
            console.log(data, 'question-list')
            if (data.status == 'success') {
                question_content = ''
                question_id_list = []
                let i = 0
                question_content += `<div class='question-list-container'>
                <p>`
                console.log(data.data.length, 'len')
                if (no_of_questions < data.data.length) {
                    question_content += `<span>no of questions : ${no_of_questions} </span> <button onclick="get_random()" class="btn btn-warning btn-sm">select random questions</button>`
                } else {
                    question_content += `<span>no of questions : ${no_of_questions} </span> <button onclick="get_random()" class="btn btn-warning btn-sm" disabled>select random questions</button>`
                }
        var url_for_change = 'https://schooltestproject.herokuapp.com/api/ajax/load-subject/';
        $.ajax({
            url: url_for_change,
            data: {
                'subject': subject_id
            },
            success: function (data) {
                $("#id_chapter_get").html(data)
            }
        });
//                 question_content += `<span><label for="id_chapter_get">Chapters :</label> <select name="chapters" onchange="filter_question()" required="" id="id_chapter_get"><option value="">---------</option>
// </select>
//     </span>`
//     question_content += `<span><label>	Question Type :</label> <select name="chapters" onchange="filter_question()" required="" id="q_type_get">
//         <option value="">---------</option>
//         <option value="MCQ">MCQ</option>
//         <option value="Fill_in_the_blanks">Fill_in_the_blanks</option>
// </select>
//     </span>`
//     question_content += `<span><label>Cognitive Level :</label> <select name="chapters" onchange="filter_question()" required="" id="cognitive_get">
//         <option value="">---------</option><option value="Knowledge">Knowledge</option>
//         <option value="Comprehension">Comprehension</option>
//         <option value="Application">Application</option>
// </select>
//     </span>`
//     question_content += `<span><label>Difficulty Level :</label> <select name="chapters" onchange="filter_question()" required="" id="difficulty_get">
//         <option value="">---------</option><option value="Easy">Easy</option>
//         <option value="Medium">Medium</option>
//         <option value="Hard">Hard</option>
// </select>
//     </span>`
                question_content += `<div class='question-container-table'>`
                question_content += `<table> <tr class='table-heading'><th>sl.no</th><th>select</th><th>question</th><th>question type</th><th>cognitive level</th><th>difficulty level</th><th>marks</th></tr>`

                data.data.forEach((d, index) => {
                    i += 1
                    question_id_list.push(d.id)
                    question_content += `<tr onClick="selectitem(${d.id})"><td><input type="checkbox" id="question_${d.id}" name="vehicle1" value="${d.id}"></td><td>${i}</td>
                 <td><label for="vehicle1">${d.question}</label></td><td>${d.question_type}</td>
                 <td>${d.cognitive_level}</td><td>${d.difficulty_level}</td><td>${d.mark}</td></tr>
`
                })
                question_content += `</table>
            </div>
            <p class='quespaper-btns'>
            <button class='btn btn-sm btn-warning' onclick=getnext()>Back</button>
            <button class='btn btn-sm btn-warning' onclick=review_woc() >Next</button>
            </p>
            </div>`
                document.getElementById('q-form').style.display = 'none'
                document.querySelector('.q-form-6').innerHTML = question_content
                if (question_list.length) {
                    for (i = 0; i < question_list.length; i++) {
                        document.getElementById(`question_${question_list[i]}`).checked = true
                    }
                }
            } else {
                document.querySelector('.error-form-2').innerHTML = `<li style='color:white;'>Chapters selected is not in correct order</li>`
            }
        })
    }
   function selectitem(id){
    if(document.getElementById(`question_${id}`).checked){
        document.getElementById(`question_${id}`).checked = false
    }else{
    document.getElementById(`question_${id}`).checked = true
    }
   }
    // function filter_question(){

    //     let chapter = document.getElementById('id_chapter_get').value
    //     let cognitive = document.getElementById('cognitive_get').value
    //     let q_type = document.getElementById('q_type_get').value
    //     let difficulty = document.getElementById('difficulty_get').value
    //     for(i=0;i<overall_question_list.length;i++){
    //         if(question_id_list.includes(overall_question_list[i].id)){

    //         }
    //     }
        
    // }

    function get_random() {
        for (i = 0; i < question_id_list.length; i++) {
            document.getElementById(`question_${question_id_list[i]}`).checked = false
        }
        let ran_numbers = []
        ran_numbers = (question_id_list.sort(() => Math.random() - 0.5)).slice(0, no_of_questions);
        console.log(ran_numbers)
        for (i = 0; i < ran_numbers.length; i++) {
            document.getElementById(`question_${ran_numbers[i]}`).checked = true
        }

    }

    function review_woc() {
        question_list = []
        question_details_list = []
        let j = 0
        for (i = 0; i < question_id_list.length; i++) {
            console.log(document.getElementById(`question_${question_id_list[i]}`).checked)
            if (document.getElementById(`question_${question_id_list[i]}`).checked) {
                question_list.push(question_id_list[i])
                j += 1
            }
        }
        for (i = 0; i < overall_question_list.length; i++) {
            if (question_list.includes(overall_question_list[i].id)) {
                question_details_list.push(overall_question_list[i])
            }
        }
        // }
        no_of_questions = j
        console.log(question_list, 'final')
        document.querySelector('.q-form-6').innerHTML = ''
        document.querySelector('.next-btn-woc').innerHTML = ''
        document.getElementById('q-form').style.display = 'block'
        console.log(chapters)
        document.getElementById('grade_value').innerHTML = grade
        document.getElementById('subject_value').innerHTML = subject_name
        document.getElementById('No_of_questions').innerHTML = no_of_questions
        let content = ''
        for (i = 0; i < chapters.length; i++) {
            console.log(chapters[i]['name'])
            content += `<li>${chapters[i]['name']}</li>`
        }
        document.getElementById('chapter_value').innerHTML = content
        console.log(chapters)
        document.querySelector('.back-btn-review').innerHTML = `<button class="btn btn-sm btn-warning" onclick=without_customize()>Back</button>`
        document.querySelector('.next-btn-woc').innerHTML = '  <button  class="submit-btn btn btn-sm btn-warning" disabled onclick=submit_woc()>Create test</button>'
        review();
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

