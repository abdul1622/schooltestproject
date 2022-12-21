// prev next

function next(current, n) {
    let action_number = current
    let question_details = answer_details[n]
    // saving answer

    get_ans_id = answer_details[action_number].id
    var get_ans_fib = document.getElementsByName(`answer_${get_ans_id}`);
    // answer_details[n].answer = get_ans_fib.value
    var get_ans = document.getElementsByName(`answer_${get_ans_id}`);
    let fib_answer = document.querySelector(`.fib_${get_ans_id}`)
    if (fib_answer) {
        console.log(fib_answer.value)
        answer_details[action_number].answer = fib_answer.value
    }

    let question_content = '';
    for (i = 0; i < get_ans.length; i++) {
        if (get_ans[i].checked) {
            answer_details[action_number].answer = get_ans[i].value;
        }
    }

    if (question_details.question_type != 'MCQ' && question_details.answer) {
        console.log(`.fib_${question_details.id}`)

    }
    let options = ['option_a', 'option_b', 'option_c', 'option_d']

    if (question_details.question_type == 'MCQ') {
        question_content += `<div><p> ${n + 1}). ${question_details.question}</p> 
                <ol type="a">`
        for (i = 0; i < options.length; i++) {
            console.log(question_details['option_a'])
            if (question_details.answer == options[i]) {
                question_content += `<li><input checked type="radio" id="${options[i]}_${question_details.id}" name="answer_${question_details.id}" value='${options[i]}'> ${question_details[options[i]]}</li>`
            } else {
                question_content += `<li><input type="radio" id="${options[i]}_${question_details.id}" name="answer_${question_details.id}" value='${options[i]}'> ${question_details[options[i]]}</li>`
            }
        }
        question_content += `<ol>
                    </div>
                `
    } else {
        if (question_details.answer) {
            question_content = `<div>   <p> ${n + 1}). ${question_details.question}<span class=''> <input type="text" name="answer_${question_details.id}" id="" class="fib fib_${question_details.id}" value='${question_details.answer}'> </span></p> </div>`
        } else {
            question_content = `<div>   <p> ${n + 1}). ${question_details.question}<span class=''> <input type="text" name="answer_${question_details.id}" id="" class="fib fib_${question_details.id}"> </span></p> </div>`
        }
    }

    if (n == (answer_details.length) - 1) {
        question_content += ` <p class='d-flex justify-content-between mb-3'> <span><button  class="btn btn-primary btn-sm" onclick=next(${n},${n - 1})> Prev </button><button class="btn btn-primary btn-sm" onclick=clear_answer(${n})>Clear </button> </span> <button  class="btn btn-success btn-sm" id='popup' data-bs-toggle="modal" data-bs-target="#take-test-Modal" >submit</button> </p> `
    }
    else if (n == 0) {
        question_content += ` <p class='text-end'><button class="btn btn-primary btn-sm" onclick=clear_answer(${n})>Clear </button>  <button class="btn btn-primary btn-sm" onclick=next(${n},${n + 1})> Next </button> </p>  <button  class="btn btn-success btn-sm" id='submit' data-bs-toggle="modal" data-bs-target="#take-test-Modal" >submit</button> </p> `
    } else {
        question_content += ` <p class='d-flex justify-content-between mb-3'> <span><button class="btn btn-primary btn-sm" onclick=clear_answer(${n})>Clear </button></span> <span ><button class="btn btn-primary btn-sm" onclick=next(${n},${n - 1}) > Prev </button><button class="btn btn-primary btn-sm" onclick=next(${n},${n + 1})  style='margin-left:5px;'> Next </button> </p></span>  <button  class="btn testsubmit btn-success btn-sm" id='submit' data-bs-toggle="modal" data-bs-target="#take-test-Modal" >submit</button> </p> `
    }
    //c16e6e2b-5b79-4a



    document.querySelector('.question-container').innerHTML = question_content


    var choosed_id = question_details.id

    question_details.seen = true;

    // }
    path(n);
}


function first_question(current) {
    let content = '';
    for (i = 0; i < answer_details.length; i++) {
        if (i == 0) {
            content += `<div class="red" onclick=next(${current},${i})> ${i + 1} </div>`
        } else {
            content += `<div class="grey" onclick=next(${current},${i})> ${i + 1} </div>`
        }
    }
    document.querySelector('.question-path').innerHTML = content
    document.querySelector('.answer-data').innerHTML = `<p> Unvisited questions - ${answer_details.length - 1}</p>
    <p> Answered questions - 0 </p>
    <p> Unanswered questions - 0</p> 
    <div class="color-description"> 
    <div class="answer"><p>Answered</p></div>
    <div class="un-answer"><p>UnAnswered</p></div>
    <div class="un-visited"><p>UnVisited</p></div></div>`
}
function path(current) {
    console.log(answer_details.length)
    let content = '';
    let unvisited = 0;
    let unanswered = 0;
    let answered = 0;
    for (i = 0; i < answer_details.length; i++) {
        temp = answer_details[i]
        if (!temp.seen) {
            content += `<div class="grey" onclick=next(${current},${i})> ${i + 1} </div>`
            unvisited += 1
        }
        else if (!answer_details[i].answer) {
            content += `<div class="red" onclick=next(${current},${i})> ${i + 1} </div>`
            unanswered += 1
        } else {
            content += `<div class="green" onclick=next(${current},${i})> ${i + 1} </div>`
            answered += 1
        }
    }
    document.querySelector('.question-path').innerHTML = content
    document.querySelector('.answer-data').innerHTML = `<p> Unvisited  questions - ${unvisited}</p>
    <p> Answered questions - ${answered} </p>
    <p> Unanswered questions - ${unanswered - 1} </p> 
    <div class="answer"><p>Answered</p></div>
    <div class="un-answer"><p>UnAnswered</p></div>
    <div class="un-visited"><p>UnVisited</p></div></div>    
    `
    if (answered === answer_details.length) {
        document.getElementById("submit").style.display = 'block'
    }
}
function submit() {
    testdetails_list = []
    counter_container.style.display = 'none'
    console.log(answer_details)
    answer_details.length - 1
    get_ans_id = answer_details[(answer_details.length) - 1].id

    var get_ans_fib = document.getElementsByName(`answer_${get_ans_id}`);
    var get_ans = document.getElementsByName(`answer_${get_ans_id}`);
    let fib_answer = document.querySelector(`.fib_${get_ans_id}`)
    if (fib_answer) {
        console.log(fib_answer.value)
        answer_details[(answer_details.length) - 1].answer = fib_answer.value
    }

    let question_content = '';
    for (i = 0; i < get_ans.length; i++) {
        if (get_ans[i].checked) {
            answer_details[(answer_details.length) - 1].answer = get_ans[i].value;
        }
    }
    let wrong_answer = 0;
    let correct_answer = 0;
    let unanswered = 0;
    let marks = 0
    console.log('total-mark', total_marks)
    var weight = total_marks / (answer_details.length)

    for (i = 0; i < answer_details.length; i++) {
        if (answer_details[i].answer == answer_details[i].correct_answer) {
            correct_answer += 1;
            marks += ((answer_details[i].mark) * weight)
        } else if (answer_details[i].answer) {
            wrong_answer += 1
        } else {
            unanswered += 1
        }

    }
    console.log('your marks', marks)


    var score = (marks / total_marks) * 100

    console.log(score)
    score = parseInt(score)
    console.log(score)
    var result;
    if (score < pass_percentage) {
        result = 'fail'
    } else {
        result = 'pass'
    }
    let overallreview = ''
    // testdetails=[]
    console.log(answer_details)
    for (i = 0; i < answer_details.length; i++) {
        if (answer_details[i].question_type != 'MCQ') {
            testdetails_list.push({ 'question': answer_details[i].question, 'correct_answer': answer_details[i].correct_answer, 'answer': answer_details[i].answer })
        } else {
            testdetails_list.push({ 'question': answer_details[i].question, 'correct_answer': answer_details[i][`${answer_details[i].correct_answer}`], 'answer': answer_details[i][`${answer_details[i].answer}`] })
        }
    }
    testdetails_list = JSON.stringify(testdetails_list)
    console.log('c', correct_answer, 'u', unanswered, 'w', wrong_answer, score)
    fetch('http://127.0.0.1:8000/api/test-history/',
        {
            method: 'POST',
            body: JSON.stringify({ 'grade': grade, 'subject': subject, 'student_id': student_id, 'test_id': id, 'question_paper': question_paper_id, 'result': result, 'score': score, 'correct_answer': correct_answer, 'wrong_answer': wrong_answer, 'unanswered_questions': unanswered, 'test_detail': testdetails_list }
            ),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'token' + ' ' + token,
            },
        }).then(function (response) {
            if (response.status == 201) {
                console.log("Sucess response", response)
                // get();
            } else {
                console.log(response);
            }
            return response.json()
        }).then(data => {
            console.log(data)
            document.querySelector('.question-container').innerHTML = `<p class='text-success text-center '>Test submitted successfully<button class='btn btn-primary btn-sm ' onclick=redirect()>close</button></p>
            <p> Result : ${result} </p>
            <p> Score : ${score} </p>
            
            `
            document.querySelector('.question-direction').innerHTML = ''
            if (data.status != 'success') {
                console.log(data)
            } else {
                overallreview += `<table class='overallreview'>
                    <tr>
                        <th >Question</th>
                        <th >Correct Answer</th>
                        <th>Given Answer</th>
                    </tr>`
                for (i = 0; i < answer_details.length; i++) {
    
                    if (answer_details[i].question_type != 'MCQ') {
                        if (answer_details[i][`${answer_details[i].correct_answer}`] == answer_details[i].answer) {
                            overallreview += `<tr><td>${answer_details[i].question}</td>` + `<td>${answer_details[i][`${answer_details[i].correct_answer}`]}</td>` + `<td>${answer_details[i].answer}</td></tr>`
                        }
                        else {
                            overallreview += `<tr><td>${answer_details[i].question}</td>` + `<td>${answer_details[i][`${answer_details[i].correct_answer}`]}</td>` + `<td>${answer_details[i].answer}</td></tr>`
                        }
                    }
                    else {
                        if (answer_details[i][`${answer_details[i].correct_answer}`] == answer_details[i][`${answer_details[i].answer}`]) {
                            overallreview += `<tr ><td>${answer_details[i].question}</td>` + `<td>${answer_details[i][`${answer_details[i].correct_answer}`]}</td>` + `<td>${answer_details[i][`${answer_details[i].answer}`]}</td>`
                        }
                        else {
                            overallreview += `<tr><td>${answer_details[i].question}</td>` + `<td>${answer_details[i][`${answer_details[i].correct_answer}`]}</td>` + `<td>${answer_details[i][`${answer_details[i].answer}`]}</td>`
                        }

                    }
                }
            }
            clearInterval(interval)
            // counter_container.innerHTML = ''
            document.querySelector('.testreview').innerHTML = overallreview + `</table>`
        })
}


function clear_answer(index) {
    let question_details = answer_details[index]
    console.log(index)
    get_ans_id = answer_details[index].id
    var get_ans_fib = document.getElementsByName(`answer_${get_ans_id}`);
    var get_ans = document.getElementsByName(`answer_${get_ans_id}`);
    if (question_details.question_type == 'MCQ') {
        for (i = 0; i < get_ans.length; i++) {
            if (get_ans[i].checked) {
                answer_details[index].answer = null;
                get_ans[i].checked = false;
            }

        }
    }
    else {
        document.querySelector(`.fib_${question_details.id}`).value = ''
    }

}
function redirect() {
    window.location.href = `${host}/test-history`
}
