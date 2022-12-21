
var host = window.location.protocol + "//" + window.location.host;
var url = window.location.href;
var text = url.split('/')
var token = localStorage.getItem("token")
var user_type = localStorage.getItem("user_type")
var student_id = localStorage.getItem("id")
var id = text.at(-2)
let subject;
let grade;
let question_no = 0;
let question_list = [];
let answer_details = []
let question_paper_id;
let grade_name;
let subject_name;
let remarks;
let total_marks;
let duration;
let pass_percentage;
let testdetails_list = [];
let interval;
let counter_container = document.querySelector('#counter');
var list = document.querySelector('.instruction');
//    get function
$(document).ready(function () {
    var user = localStorage.getItem('user_type')
    if (user != 'is_student' || !token) {
        return window.location.href = '/404';
    }
})
function get() {
    if (user_type != 'is_student') {
        return
    }
    var content = ''
    fetch('http://127.0.0.1:8000/api/instructions/', {
        method: 'GET',
        headers: {
            'Authorization': 'token' + ' ' + token
        },
    }).then(res => {
        return res.json()
    })
        .then(data => {
            console.log(data.results)
            data.results.forEach((d, index) => {
                console.log(d.note)
                content += `<li>${d.note}</li>`
            })
            list.innerHTML = content;
        })


}
get();

//store test details

function test_details() {

    fetch(`http://127.0.0.1:8000/api/test/${id}/`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json',
            'Authorization': 'token' + ' ' + token,
        }
    }).then(res => {
        return res.json()
    }).then(data => {
        console.log(data)
        document.querySelector('.test-title').innerHTML = `${data.remarks}`
        question_paper_id = data.question_paper
        grade_name = data.grade_name;
        subject_name = data.subject_name;
        remarks = data.remarks;
        total_marks = data.marks;
        duration = data.duration;
        pass_percentage = data.pass_percentage;
    })
}
test_details();

// start test function
document.getElementById('start-test-btn').addEventListener('click', () => {
    document.querySelector('.instructions').innerHTML = ''
    fetch(`http://127.0.0.1:8000/api/question-paper/${question_paper_id}/`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json',
            'Authorization': 'token' + ' ' + token,
        }
    }).then(res => {
        return res.json()
    }).then(data => {
        console.log(data)

        if (data.status == 'success') {
            grade = data.data.grade
            subject = data.data.subject
            for (let i = 0; i < data.data.no_of_questions.length; i++) {
                answer_details.push(null)
            }
            console.log(answer_details)
            for (let i = 0; i < data.data.no_of_questions.length; i++) {
                question_list.push(data.data.no_of_questions[i])
            }
            if (data.status == 'success') {
                //   data.data.no_of_questions.forEach((d, index) => {
                url2 = new URL(`http://127.0.0.1:8000/api/test-questions/`);
                url2.searchParams.append('question_paper', question_paper_id);
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
                        question_no = index
                        answer_details[question_no] = {
                            'id': d.id,
                            'question': d.question,
                            'question_type': d.question_type,
                            'correct_answer': d.answers.answer,
                            'option_a': d.answers.option_a,
                            'option_b': d.answers.option_b,
                            'option_c': d.answers.option_c,
                            'option_d': d.answers.option_d,
                            'answer': null,
                            'seen': false,
                            'mark': d.mark,
                        }
                        if (d.question_type != 'MCQ') {
                            answer_details[question_no].correct_answer = answer_details[question_no][(answer_details[question_no].correct_answer)]
                            console.log(answer_details[question_no].correct_answer, answer_details[question_no][(answer_details[question_no].correct_answer)])
                        }
                        // console.log(answer_details)
                        question_no += 1
                        let question_details = answer_details[0]
                        answer_details[0].seen = true;
                        if (question_no == 1) {
                            let question_content;
                            if (question_details.question_type == 'MCQ') {
                                question_content = `<div> 
               <hr class="hr1"> <p> ${question_no}). ${d.question}</p> 
                <ol type="a">
                   <li> <input type="radio" class='option_a_${question_details.id}' id="option_a_${question_details.id}" name="answer_${question_details.id}" value='option_a'> ${question_details.option_a}</li>

                    <li>
                        <input type="radio" class='option_b_${question_details.id}' id="option_b_${question_details.id}" name="answer_${question_details.id}" value='option_b'> ${question_details.option_b}</li>

                    <li><input type="radio" class='option_c_${question_details.id}' id="option_c_${question_details.id}" name="answer_${question_details.id}" value='option_c'> ${question_details.option_c}</li>
                    <li><input type="radio" class='option_d_${question_details.id}' id="option_d_${question_details.id}" name="answer_${question_details.id}" value='option_d'> ${question_details.option_d}</li>
                <hr class="hr2"><ol>
                    </div>

                <p class='text-end'><button class="btn btn-primary btn-sm" onclick=clear_answer(0)>Clear </button> <button class="btn btn-primary btn-sm" onclick=next(0,1)> Next </button> </p> <button  class="btn btn-success btn-sm" id='submit' data-bs-toggle="modal" data-bs-target="#take-test-Modal">submit</button> </p> `
                                // console.log()
                                // console.log(document.querySelector(`input[name="answer_${data.data.id}"]`));
                                document.querySelector('.question-container').innerHTML = question_content
                            }
                            else {
                                question_content = `<div>   <p> ${question_no}). ${d.question} <input type="text" name="answer_${question_details.id}" id="" class="fib fib_${question_details.id}"> <p>
                                        <p class='text-end'> <button class="btn btn-primary btn-sm" onclick=clear_answer(0)>Clear </button>  <button class="btn btn-primary btn-sm" onclick=next(0,1)> Next </button> </p> <button  class="btn btn-success btn-sm" id='submit' data-bs-toggle="modal" data-bs-target="#take-test-Modal" >submit</button> </p> 
                                        </div>`
                                document.querySelector('.question-container').innerHTML = question_content
                            }
                        }
                    })

                })
            }
            first_question(0);
            d = duration
            // counter
            function counter() {

                let h = Math.floor(d / 3600)
                let m = Math.floor((d - (Math.floor(d / 3600))) / 60)
                let s = d - (h * 3600) - (m * 60)
                h = (h.toString()).padStart(2, '0')
                m = (m.toString()).padStart(2, '0')
                s = (s.toString()).padStart(2, '0')
                if (d == 0) {
                    clearInterval(interval)
                    submit()
                    counter_container.innerHTML = `timeout`
                } else {
                    d -= 1
                    counter_container.innerHTML = `${h}:${m}:${s}`
                }

            }

            //65
            interval = setInterval(counter, 1000)
            //  console.log(interval,'int')
        }
    })
})