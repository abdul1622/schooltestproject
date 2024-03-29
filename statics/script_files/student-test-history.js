var token = localStorage.getItem("token")
var subjectId,gradeId,testId,content='',data2;
let container = document.querySelector('.history-container')
let current_details,student_details;
let grade_name;

$(document).ready(function(){ 
 if(!token){
return window.location.href = '/login';
}
 var user = localStorage.getItem('user_type')
 if (user == 'is_student'){
  return window.location.href = '/404'; 
 }
 document.getElementById('nav-studenttesthistory').style.opacity = '0.5';
})
let element = document.getElementById('id_test')
 let grade_element = document.getElementById('id_grade')
 let subject_element = document.getElementById('id_subject')

 let grade_list;
var host = window.location.protocol + "//" + window.location.host;


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
    if(data.status == 'failure'){
     window.location.href = `${host}/404`
    } 
    if(grade_list.length == 1){
     grade = grade_list[0].id
         document.querySelector('.grade-p').innerHTML = ` ${grade_list[0]['grade']}`
         var url_for_change = 'http://127.0.0.1:8000/api/ajax/load-subject/'; 
     grade_name =   grade_list[0]['grade']
     console.log(grade_name)
     $.ajax({                       
       url: url_for_change,                  
       data: {
         'grade': grade     
       },
       success: function (data) {
         $("#id_subject").html(data)
       }
     });

     }else{
         content += ` 
     <option value="" selected="">---------</option>`
 for(i=0;i<grade_list.length;i++){
     content += ` <option value="${grade_list[i].id}">${grade_list[i].grade}</option>`
 }
 document.querySelector('.grade-in-form').innerHTML = content
}

})







$("#id_grade").change(function () {
var url_for_change = 'http://127.0.0.1:8000/api/ajax/load-subject/';
gradeId = $(this).val();

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



$("#id_subject").change(function () {
var url_for_change = 'http://127.0.0.1:8000/api/ajax/load-test/';
subjectId = $(this).val();

$.ajax({
 url: url_for_change,
 data: {
   'subject': subjectId
 },
 success: function (data) {
   $("#id_test").html(data);
 }
});

});


function get(){
testId = document.getElementById('id_test').value
container.innerHTML = ''
if(!testId){
document.querySelector('.error-messages').innerHTML ='give a valid test details'
return
}
test_name = element.options[element.selectedIndex].text;
subject_name = subject_element.options[subject_element.selectedIndex].text
console.log(subject_name)
url = new URL('http://127.0.0.1:8000/api/test-history/');
url.searchParams.append('test_id',testId)
container.innerHTML = ''
content = ''
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
     data2 = data
     let i = 0;
if(data.length){
document.querySelector('.error-messages').innerHTML =''

content +=             `<div class='history-container-head'> <button onclick=back() class='btn btn-sm btn-primary'>Back</button>
     <p  class='heading'> <span>Grade : ${grade_list[0]['grade']}</span> <span class='test-heading'>${test_name}</span> <span>Subject : ${subject_name}</span></p>
    </div> `
     content += `<div class='history-container-div'><table  class="text-nowrap table text-white" >`

     content += '<tr class="table-heading"><th>Sl.no</th><th>Name</th><th>Register_number</th><th>Result</th><th>Score</th><th>Correct <br> answer</th><th>Wrong <br> answer</th><th>Unanswered <br> questions</th><th>Details</th></tr>'
         data.forEach((d, index) => {
             i += 1
         content += `<tr><td>${i}</td><td>${d.student_name}</td><td>${d.register_number}</td><td>${d.result}</td><td>${d.score}</td><td>${d.correct_answer}</td><td>${d.wrong_answer}</td><td>${d.unanswered_questions
}</td><td><button data-toggle="modal" class="btn btn-light" data-target="#test-details-model"  onclick=details(${d.id})>details</td></tr>`
 })
content += `</table></div>`
 container.innerHTML = content
 document.querySelector('.test-details').innerHTML = ''
 document.getElementById('history-container-form').style.display = 'none'
}
else{
document.querySelector('.error-messages').innerHTML = `<li>Till now no one attended this test</li>`
}
})
}

function back(){
document.getElementById('history-container-form').style.display = 'block'
document.querySelector('.test-details').innerHTML = ''
container.innerHTML = ''
}

function details(index){
for(i=0;i<data2.length;i++){
 if(data2[i].id == index){
  student_details = data2[i]
   current_details = JSON.parse(data2[i].test_detail)
   current_details = JSON.parse(current_details)
   console.log(typeof((current_details)))
   break
 }
}


let table2 = ` <div class= "test-details-div"> <p> <span>${student_details.student_name}</span> </p> <table>`;
                 table2 += `<thead class="thead"><th>sl no</th><th>Question</th><th>correct answer</th><th>given answer</th></thead>`;
                 for(i=0;i<current_details.length;i++){
                                     if(current_details[i].answer == current_details[i].correct_answer){
                       table2 = table2 + `<tr>`;
                     }else{
                       table2 = table2 + `<tr class='text-danger'>`;
                     }
                     table2 = table2 + `<td>` + `${i+1}` +`</td>`
                     table2 = table2 + `<td>` + `${current_details[i].question}` + `</td>`,
                         table2 = table2 + `<td>` + `${current_details[i].correct_answer}` + '</td>';
                     if(current_details[i].answer){
                     table2 = table2 + '<td>' + `${current_details[i].answer}` + '</td>';
                     }else{
                       table2 = table2 + '<td>' + `` + '</td>';
                     }
                     table2 = table2 + `</tr>`;
                     }
                 table2 += "</table> </div>";
       document.querySelector('.test-details').innerHTML  = table2
}


function back_details(){
document.querySelector('.test-details').innerHTML  =''
current_details = null
}