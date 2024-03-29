
  $(document).ready(function(){ 
    var user = localStorage.getItem('user_type')
    if (user != 'is_student' || !token){
     return window.location.href = '/404'; 
    }
 document.getElementById('nav-testhistory').style.opacity = '0.5';

  })
  var student_id = localStorage.getItem('id')
  var token = localStorage.getItem('token')
  var standard = localStorage.getItem('standard')
  let temp;
  let current_details;
  let content = ''
  let result = [],test_content= ''
  let list;
  url = new URL('https://schooltestproject.herokuapp.com/api/test-history/');
  url.searchParams.append('grade', standard[0]);
  url.searchParams.append('student_id', student_id)
  fetch(url,
    {
      method: 'GET',

      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'token' + ' ' + token,
      },
    }).then(function (response) {
      return response.json()
    }).then(data => {
      list = data
      data.forEach((d, index) => {
        let test_id = d.test_id
        
        result.push({ index: { 'subject': d.subject, 'result': d.result, 'correct': d.correct_answer, 'wrong': d.wrong_answer, 'unanswered': d.unanswered_questions, 'create': d.created_at }, 'remarks': null })
        fetch(`https://schooltestproject.herokuapp.com/api/test/${test_id}/`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'token' + ' ' + token,
            },
          }).then(response => {
            if (response.status == 200) {
              console.log("Sucess response", response);
              // test_messages.innerHTML = `<p class="text-success"> ${form_remarks} test created successfully</p>`;
              // test_errors.innerHTML = ''

            }
            return response.json();
          }).then(function (test_data) {
            console.log(test_data)
            console.log(d)
            if (!temp) {
              temp = data[0].subject
              console.log(temp)
              content += `<fieldset>
              <legend> ${data[0].subject_name} </legend>`
            }

            if (temp != d.subject) {
              content += `</fieldset>
            <fieldset>
              <legend> ${d.subject_name} </legend>`
              temp = d.subject
            }
            if (d.result != 'fail') {
              content += `<div style="background-color:#adeead;">`
            } else {
              content += '<div>'
            }
            result[index]['remarks'] = test_data.remarks
            content += `<p class="text-center">${test_data.remarks}</p>`
            content += `<p> Correct Answer : ${d.correct_answer}</p>
              <p>Wrong Answers : ${d.wrong_answer}</p>
              <p>Un Answered : ${d.unanswered_questions}</p>
              <p>Result : ${d.result}</p>
              <p>Score : ${d.score} %</p>
              <p>Date : ${d.created_at.slice(0, 10)} </p>
              <p>Time : ${d.created_at.slice(11, 16)} </p>
              <button class='details-btn' onclick=details(${d.id}) data-toggle="modal" data-target="#TestModal">details</button>
          </div>  `
            // console.log(result)
            let flag = false
            for (i = 0; i < result.length; i++) {
              if (result[i]['remarks']) {
                flag = true
              }
              else {
                flag = false
                break
              }
            }
            if (flag) {
              content += `</fieldset>`
              // content += `<p class='inst'> <span class='pass'>.</span> pass <span class='fail'>.</span>fail</p>`

              document.querySelector('.history').innerHTML = content
            }

          }).then(() => {
            // document.querySelector('.history').innerHTML=content
          })


      })
    })

 function back(){
  document.querySelector('.test-details').innerHTML = ''
  current_details = null
 }


    function details(index){
      console.log(list)
      for(i=0;i<list.length;i++){
        if(list[i].id == index){
          current_details = JSON.parse(list[i].test_detail)
          current_details = JSON.parse(current_details)
          console.log(typeof((current_details)))
          break
        }
      }
      let table2 = ' <div class= "test-details"> <table >';
                        table2 += `<thead class="thead"><th>Sl.no</th><th>Question</th><th>correct answer</th><th>given answer</th></thead>`;
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
                        table2 += "</table></div>";
                    
              document.querySelector('.modal-body').innerHTML  = table2
    }