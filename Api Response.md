# online_test_application

## API input and output

### Sign up

- **Url**
  /api/signup

- **Method**
  POST

* **Data params**
  **Required:**
  _ `email = [Email]`
  _ `phone = [Integer]`
  _ `register_number=[String]`
  _ `date_of_birth=[Date]`
  _ `first_name = [String]`
  _ `last_name = [String]`
  _ `full_name = [String]`
  _ `address = [Text]`

**Optional:**
_ `standard = [List]`
_ `user_type = [Choices] 1. is_admin 2. is_student 3. is_staff`
\_ `profile_picture = [file]`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:** `{{"status":"success","message":"User {'user first_name') Registered Successfully"} }`

- **Error Response:**

  - **Code:** 206 Partial content <br />
    **Content:** `{'status':'failure','data':{error}}`

  <!--

<!-- * **url params** --> -->

<!-- ## ADMIN CREDENTIAL
**phone** : 1234567890 <br>
**email** : admin@gmail.com


## STAFF CREDENTIAL
**phone** : 9894767939 <br>
**email** : staff1@gmail.com


## STUDENT   CREDENTIAL
**phone** : 9942945428 <br>
**email** : student1@gmail.com -->
