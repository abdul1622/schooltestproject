# online_test_application

## API input and output For Accounts App

---

## **Grade**

---

URL $~~$ : **$~$ /grade**

## Methods<br>

- `GET,POST,PATCH,DELETE`

### **GET**

- Responses<br>

  - **Success Response**<br>

    - ### if student user logged in
      `{"status" : "success" , "data:[grade of student]"}`
    - ### if staff user logged in

      `{"status" : "success" , "data:[<grades which allocated to the logged in staff>]"}`

    - ### if admin user logged in
      `{"status" : "success" , "data:[<all grades>]"}`

  * **Error Response**<br>

    - `{"status": "failure", 'data': 'Your not have access to view this page'}`

### **POST** <br>

- Data Params

        {
            "grade":<int>,"section":<array of sections>
        }

* Responses<br>

  - **Success Response $~$ (if user logged in)**<br>
    `{"status" : "success" , "message":"Grade Created"}`
  - **Error Response**<br>
    `Grade already exists`

### **PATCH**

- URL $~~$ : **$~$ /grade/id**

- Data Params

        {
            "grade":<int>,"section":<array of sections>
        }

* Responses<br>

  - **Success Response**<br>
    ` {"message": "Grade  Updated "}`
  - **Error Response**<br>
    `{"status": "failure", 'data': '<Exception error while updating>'}`

### **DELETE**

- URL $~~$ : `/grade/id`
- Responses<br>
  - **Success Response**<br>
    ` {"message": "Grade  Deleted "}`
  - **Error Response**<br>
    `{"status": "failure", 'data': '<Exception error while updating>'}`

---

## **Subjects**

---

#### URL $~~$ : **$~$ /subjects**

#### Methods<br>

- `GET,POST,PATCH,DELETE`

## **GET**

- query params

  - grade=grade id

- Responses<br>

  - **Success Response**<br>
    `{"status" : "success" , "data:[subjects in grade]"`

<!-- - **Failure Response**<br>
`{"status": "failure", 'data': 'No subjects in grade'}` -->

### **POST**

- Data Params

      {
        "name":<string>,"code":<int>,"grade":<grade id>
      }

- Responses<br>

  - **Success Response $~$ (if user logged in)**<br>
    `{"status" : "success" , "message":"Subject Created"}`
  - **Failure Response**<br>
    `Exception while process`

### **PATCH**

- #### URL $~~$ : **$~$ /subjects/id**

- Data Params <br>

        {
        "name":<string>,"code":<int>,"grade":<grade id>
        }

- Responses<br>

  - **Success Response**<br>

    ` {"message": "Subject Updated "}`

  - **Error Response**<br>
    `{"status": "failure", 'data': '<Exception error while updating>'}`

### **DELETE**

- #### URL $~~$ : /subjects/id

- Responses<br>

  - **Success Response**<br>
    ` {"message": "Subject Deleted "}`
  - **Failure Response**<br>
    `{"status": "failure", 'data': '<Exception error while delete>'}`

---

## **Chapters**

---

#### URL $~~$ : **$~$ /chapters**

#### Methods<br>

- `GET,POST,PATCH,DELETE`

### **GET**

- query params
  - grade=grade id
- Responses<br>

  - **Success Response**<br>
    `{"status" : "success" , "data:[subjects in grade]"`

### **POST**

- Data Params

        {
        "name":<string>,"chapter_no":<int>,"description":<string>,"subject":<subject id>
        }

- Responses<br>

  - **Success Response $~$ (if user logged in)**<br>
    `{"status" : "success" , "data":{created chapter data}}`
  - **Eroor Response**<br>
    `{"status" : "failure" , "data":{error}}`

### **PATCH**

- #### URL $~~$ : **$~$ /subjects/id**

- Data Params <br>

        {
        "name":<string>,"code":<int>,"grade":<grade id>
        }

- Responses<br>

  - **Success Response**<br>

    ` {"message": "Subject Updated "}`

  - **Error Response**<br>
    `{"status": "failure", 'data': '<Exception error while updating>'}`

### **DELETE**

- #### URL $~~$ : /subjects/id

- Responses<br>

  - **Success Response**<br>
    ` {"message": "Subject Deleted "}`
  - **Failure Response**<br>
    `{"status": "failure", 'data': '<Exception error while delete>'}`

        grade = self.request.query_params.get('grade')
        subject = self.request.query_params.get('subject')
        from_chapter_no = self.request.query_params.get('from_chapter_no')
        to_chapter_no = self.request.query_params.get('to_chapter_no')
        questions = Question.objects.all()
        data = self.paginate_queryset(questions)
        if grade and subject:
            try:
                if from_chapter_no and to_chapter_no:
                    questions = Question.objects.filter(grade_id=int(grade), subject_id=int(
                        subject), chapter_no__gte=from_chapter_no, chapter_no__lte=to_chapter_no)
                else:
                    questions = Question.objects.filter(
                        grade_id=int(grade), subject_id=int(subject))
            except:
                # questions = Question.objects.all()
                return Response({'status': Response.FAILURE, 'data': 'give a valid grade and subject'}, status=HTTP_206_PARTIAL_CONTENT)
        if len(questions):
            serializer = QuestionAnswerSerializer(data, many=True)
            return self.get_paginated_response(serializer.data)
        return Response({'status': ResponseChoices.FAILURE, 'data': "subject don't have a questions"}, status=HTTP_206_PARTIAL_CONTENT)

---

## **Questions**

---

#### URL $~~$ : **$~$ /questions**

#### Methods<br>

- `GET,POST,PATCH,DELETE`

### **GET**

- query params
  - grade=grade id
  - subject = subject id
  - from_chapter_no = integer
  - to_chapter_no = integer
- Responses<br>

  - **Success Response**<br>
    `{"status" : "success" , "data:{question objects}"`

  - **Error Response** <br>
    `{'status': "failure", 'data': 'give a valid grade and subject'}`

    OR

    `{'status': "failure", 'data': "subject don't have a questions"}`

### **POST**

- Data Params

        {
            'grade': grade_id,
            'subject': subject_id,
            'chapter': chapter_id,
            'question': <String>,
            'question_type': <choice> - "MCQ,Fill_in_blanks"
            'cognitive_level': <choice> - "application,knowledge,comprehention",
            'difficulty_level': <choices> - "easy,medium,difficult",
            'duration': <int>,
            'mark': <int>,
            'answers': {
              'option_a': <string>,
              'option_b': <string>,
              'option_c': <string>,
              'option_d': <string>,
              'answer': <choices> - "option_a,option_b,option_c,option_d"
        }

- Responses<br>

  - **Success Response $~$ (if user logged in)**<br>
    `{"status" : "success" , "data":{created question data}}`
  - **Eroor Response**<br>
    `{"status" : "failure" , "data":{error}}`

### **PATCH**

- #### URL $~~$ : **$~$ /questions/id**

- Data Params <br>

        {
                 'grade': grade_id,
            'subject': subject_id,
            'chapter': chapter_id,
            'question': <String>,
            'question_type': <choice> - "MCQ,Fill_in_blanks"
            'cognitive_level': <choice> - "application,knowledge,comprehention",
            'difficulty_level': <choices> - "easy,medium,difficult",
            'duration': <int>,
            'mark': <int>,
            'answers': {
              'option_a': <string>,
              'option_b': <string>,
              'option_c': <string>,
              'option_d': <string>,
              'answer': <choices> - "option_a,option_b,option_c,option_d"
        }

- Responses<br>

  - **Success Response**<br>

    ` {"message": "Subject Updated "}`

  - **Error Response**<br>
    `{"status": "failure", 'data': '<Exception error while updating>'}`

### **DELETE**

- #### URL $~~$ : /subjects/id

- Responses<br>

  - **Success Response**<br>
    ` {"message": "Question Deleted "}`
