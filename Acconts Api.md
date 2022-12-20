# online_test_application

## API input and output For Accounts App

### Sign up

---

- **Url** <br>
  `/api/signup`

- **Method** <br>
  `POST`

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

Login api without otp validations

- **Url** <br>
  `/api/simple-login`

- **Method** <br>
  `POST`

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

### Login

---

Login api with otp validations

- **Url** <br>
  `/api/login`

- **Method** <br>
  `POST`

* **Data params** <br>
  **Required:** <br>

  - `email = [Email]`
  - `phone = [Integer]`

- **Success Response:**

  - **Code:** 200 <br/>
    **Content:** `{"status":"otp generated successfully"}`

- **Error Response:**

  - **Code:** 204 No Content <br />
    **Content:** `{'status':'user dosn't exists}`

  OR

  - **Code:** 203 Non Authoritative information <br />
    **Content:** `{status : "failed" }`

### Login verify

---

otp verification

- **Url** <br>
  `/api/login-verify`

- **Method** <br>
  `POST`

* **URL Params**

  **Required:** <br>

  - `email=[Email]`
  - `phone = [Integer]`

* **Data params** <br>
  **Required:** <br>

  - `otp = [Integer]`

- **Success Response:**

  - **Code:** 200 <br/>
    **Content:** `{"status":"success","data":{user data in json},"token":{token_id}}`

- **Error Response:**

  - **Code:** 203 Non Auth <br />
    **Content:** `{status : "failed" }`

### Logout

---

- **Url** <br>
  `/api/logout`

- **Method** <br>
  `GET`

- **Success Response:**

  - **Code:** 200 <br/>
    **Content:** `{"status":"logged out successfully"}`

- **Error Response:**

  - **Code:** 203 Non Authoritative_Information <br />
    **Content:** `{status : "user doesn't logged in" }`

### Profile Edit

---

Login api without otp validations

- **Url** <br>
  `/api/student-profile/<int:pk>/`

- **Method** <br>
  `GET` `UPDATE`

* **Data params** <br>
  **Required:** <br>

  - `first_name = [String]`
  - `last_name = [String]`
  - `full_name = [String]`
  - `address = [Text]`
  - `standard = [List]`
  - `profile_picture = [file]`

1.  GET

    - **Success Response:** <br>

      - **Code:** 200 <br/>
        **Content:** `{{user object in json}}`

    - **Error Response:**

      - **Code:**203 Non Authoritative information <br />
        **Content:** `"status": "failure", "message": "you don't have a permissions"`

2.  UPDATE

    - **Success Response:** <br>

      - **Code:** 200 <br/>
        **Content:** `{{user object in json}}`

    - **Error Response:**

      - **Code:**204 No content <br />
        **Content:** `"'status': 'failure', 'data': {error}"`

### User Details

---

- **Url** <br>
  `/api/user-details/`

- **Method** <br>
  `GET`

* **URL Params**

  **Required:** <br>

  - `standard=[Integer]`
  - `user_type = [choices] - ['is_admin','is_staff','is_student']`

- **Success Response:**

  - **Code:** 200 <br/>
    **Content:** `{data}`

- **Error Response:**

  - **Code:** 203 Non Authoritative information <br />
    **Content:** `{status : "failed" ,data ={error}}`

### Single User Details Get

---

- **Url** <br>
  `api/user-details/<int:pk>/`

- **Method** <br>
  ` GET` `UPDATE`

- **Success Response:**

  - **Code:** 200 <br/>
    **Content:** `{data}`

- **Error Response:**

  - **Code:** 203 Non Authoritative information <br />
    **Content:** `{"status": "User doesn't exits or you don't have a permissions"}`

<!-- profile/ -->

### Profile

---

- **Url** <br>
  `api/profile`

- **Method** <br>
  `GET`

- **Success Response:**

  - **Code:** 200 <br/>
    **Content:** `status:success,data:{profile data}`

### Check User

---

check for user email and phone number in signup

- **Url** <br>
  `api/profile`

- **Method** <br>
  `GET`

* **URL Params**

  **Required:** <br>

  - `email=[Email]`
  - `phone = [Integer]`

- **Success Response:**

  - **Code:** 200 <br/>

- **Error Response:**

  - **Code:** 206 Partial Content
