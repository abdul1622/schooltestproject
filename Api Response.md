# online_test_application

## API input and output

### Sign up

---

- **Url** <br>
  /api/signup

- **Method** <br>
  POST

* **Data params** <br>
  **Required:** <br>

  - `email = [Email]`
  - `phone = [Integer]`
  - `register_number=[String]`
  - `date_of_birth=[Date]`
  - `first_name = [String]`
  - `last_name = [String]`
  - `full_name = [String]`
  - `address = [Text]`

  **Optional:** <br>

  - `standard = [List]`
  - `user_type = [Choices] 1. is_admin 2. is_student 3. is_staff`
  - `profile_picture = [file]`

- **Success Response:**

  - **Code:** 201 <br/>
    **Content:** `{"status":"success","message":"User {'user first_name') Registered Successfully"}`

- **Error Response:**

  - **Code:** 206 Partial content <br />
    **Content:** `{'status':'failure','data':{error}}`

### Simple Login

---

- **Url** <br>
  /api/simple-login

- **Method** <br>
  POST

* **Data params** <br>
  **Required:** <br>

  - `email = [Email]`
  - `phone = [Integer]`

- **Success Response:**

  - **Code:** 200 <br/>
    **Content:** `{"status":"success","data":{
    "id": user.id,
    "token": token.key,
    "email": user.email,
    "phone": user.phone,
    "user_type": user.user_type,
    "data_entry": user.is_data_entry,
    "register_number": user.register_number
}}`

- **Error Response:**

  - **Code:** 204 No Content <br />
    **Content:** `{'status':{error}}`

  OR

  - **Code:** 203 Non AUTHORITATIVE_INFORMATION <br />
  **Content:** `{status : "failed" }`
  <!--

<!-- * **url params** -->

<!-- ## ADMIN CREDENTIAL
**phone** : 1234567890 <br>
**email** : admin@gmail.com


## STAFF CREDENTIAL
**phone** : 9894767939 <br>
**email** : staff1@gmail.com


## STUDENT   CREDENTIAL
**phone** : 9942945428 <br>
**email** : student1@gmail.com -->
