
url = 'http://127.0.0.1:8000/api/question/'

container2.addEventListener('click', (e) => {
    form_grade = document.getElementById('id_grade')
    console.log(form_grade)
    form_subject = document.getElementById('id_subject')
    form_chapter = document.getElementById('id_chapter')
    form_question = document.getElementById('id_question')
    form_question_type = document.getElementById('id_question_type')
    form_cognitive_level = document.getElementById('id_cognitive_level')
    form_difficulty_level = document.getElementById('id_difficulty_level')
    form_option_a = document.getElementById('id_option_a')
    form_option_b = document.getElementById('id_option_b')
    form_option_c = document.getElementById('id_option_c')
    form_option_d = document.getElementById('id_option_d')
    form_answer = document.getElementById('id_answer')
    form_duration = document.getElementById('id_duration')
    form_mark = document.getElementById('id_mark')
    question_btn = document.getElementById('question-btn')
    console.log(form_subject)
    e.preventDefault();
    let delbutton = e.target.id == 'delete';
    var editbutton = e.target.id == 'edit';
    edit = editbutton;
    let id = e.target.parentElement.parentElement.id;
    console.log(e.target.parentElement.parentElement)
    console.log(id)
    if (delbutton) {
      const parent1 = e.target.parentElement;
      yes_button.setAttribute("onClick", `deletequestion(${id})`);
    }
    if (editbutton) {
      const parent = e.target.parentElement.parentElement;
      var subject = parent.querySelector('.question_type').id;
      var grade = parent.querySelector('.cognitive_level').id
      console.log(subject)
      var chapter = parent.querySelector('.chapter-name').id;
      var question = parent.querySelector('.question').textContent;
      var question_type = parent.querySelector('.question_type').textContent;
      var cognitive_level = parent.querySelector('.cognitive_level').textContent;
      var difficulty_level = parent.querySelector('.difficulty_level').textContent;
      var option_a = parent.querySelector('.option_a').textContent;
      var option_b = parent.querySelector('.option_b').textContent;
      var option_c = parent.querySelector('.option_c').textContent;
      var option_d = parent.querySelector('.option_d').textContent;
      var answer = parent.querySelector('.answer').textContent;
      var mark = parent.querySelector('.mark').textContent;
      var duration = parent.querySelector('.duration').textContent;
      if (form_grade) {
        form_grade.value = grade
      }
      var url_for_change = 'http://127.0.0.1:8000/api/ajax/load-subject/';
      $.ajax({
        url: url_for_change,
        data: {
          'grade': grade
        },
        success: function (data) {
          $("#id_subject").html(data);
        }
      }).then(() => {
        form_subject.value = subject
        $.ajax({
          url: url_for_change,
          data: {
            'subject': subject
          },
          success: function (data) {
            $("#id_chapter").html(data)
          }
        }).then(() => {
          form_chapter.value = chapter
        });
      });
      form_question.value = question
      form_question_type.value = question_type
      form_cognitive_level.value = cognitive_level
      form_difficulty_level.value = difficulty_level
      form_option_a.value = option_a
      form_option_b.value = option_b
      form_option_c.value = option_c
      form_option_d.value = option_d
      form_answer.value = answer
      form_mark.value = mark
      form_duration.value = duration
      id = parent.id
      let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
      question_btn.addEventListener('click', () => {
        if (edit) {
          console.log('no')
          fetch(`${url}${id}/`, {
            method: 'PUT',
            headers: {
              'content-Type': 'application/json',
              'Authorization': 'token' + ' ' + token,
              'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
              'subject': form_subject.value,
              'chapter': form_chapter.value,
              'grade': form_grade.value,
              'question': form_question.value,
              'question_type': form_question_type.value,
              'cognitive_level': form_cognitive_level.value,
              'difficulty_level': form_difficulty_level.value,
              'duration': form_duration.value,
              'mark': form_mark.value,
              'answers': {
                'option_a': form_option_a.value,
                'option_b': form_option_b.value,
                'option_c': form_option_c.value,
                'option_d': form_option_d.value,
                'answer': form_answer.value
              }
            })
          }).then(res => res.json()).then(() =>
            location.reload()
          )
        }
      })
    }
  });


  const question_create = document.getElementById('question-btn')
  question_create.addEventListener('click', () => {
    var grade = document.getElementById('id_grade').value
    var subject = document.getElementById('id_subject').value
    var chapter = document.getElementById('id_chapter').value
    var question = document.getElementById('id_question').value
    var question_type = document.getElementById('id_question_type').value
    var cognitive_level = document.getElementById('id_cognitive_level').value
    var difficulty_level = document.getElementById('id_difficulty_level').value
    var duration = document.getElementById('id_duration').value
    var mark = document.getElementById('id_mark').value
    var option_a = document.getElementById('id_option_a').value
    var option_b = document.getElementById('id_option_b').value
    var option_c = document.getElementById('id_option_c').value
    var option_d = document.getElementById('id_option_d').value
    var answer = document.getElementById('id_answer').value
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    if (!edit) {
      fetch(url,
        {
          method: 'POST',
          body: JSON.stringify({
            'grade': grade,
            'subject': subject,
            'chapter': chapter,
            'grade': grade,
            'question': question,
            'question_type': question_type,
            'cognitive_level': cognitive_level,
            'difficulty_level': difficulty_level,
            'duration': duration,
            'mark': mark,
            'answers': {
              'option_a': option_a,
              'option_b': option_b,
              'option_c': option_c,
              'option_d': option_d,
              'answer': answer
            }
          }
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
            // document.getElementById('id_grade').value = ''
            // document.getElementById('id_subject').value = ''
            // document.getElementById('id_chapter').value = ''
            document.getElementById('id_question').value = ''
            document.getElementById('id_question_type').value = ''
            document.getElementById('id_cognitive_level').value = ''
            document.getElementById('id_difficulty_level').value = ''
            document.getElementById('id_option_a').value = ''
            document.getElementById('id_option_b').value = ''
            document.getElementById('id_option_c').value = ''
            document.getElementById('id_option_d').value = ''
            document.getElementById('id_answer').value = ''
            // get();
            return response.json();
          } else {
            console.log(response);
          }
        })
    function show() {
      document.getElementById('id_question').value = ''
      document.getElementById('id_question_type').value = ''
              document.getElementById('id_cognitive_level').value = ''
              document.getElementById('id_difficulty_level').value = ''
              document.getElementById('id_option_a').value = ''
              document.getElementById('id_option_b').value = ''
              document.getElementById('id_option_c').value = ''
              document.getElementById('id_option_d').value = ''
              document.getElementById('id_answer').value = ''
      document.getElementById('questionForm').style.display = 'grid'
      document.getElementById('question-box').style.display = 'none'
      document.getElementById('--question').style.display = 'none'
    }
  }
})
