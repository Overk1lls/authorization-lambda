# authorization-lambda

## Usage
Perform a POST request to the ```/api/v1/sign-up``` endpoint with the following data in the body:
```
{
  "email": "example@gmail.com",
  "password": "12345"
}
```
to get a response with status code:
* ```201``` if user is created
* ```400``` if email is not appropriate or duplicate email

Perform a POST request to the ```/api/v1/login``` endpoint,\
with the same data as in previous point, to get a response with status code:
* ```200``` if everything is ok
* ```400``` if email is not appropriate or you entered bad credentials
* ```404``` if user is not found

Perform a GET request to the ```/api/v1/me/:num``` endpoint, with the parameter ```num``` (any number) to get a response with status code:
* ```200``` if user is found
* ```401``` if authentication or token scheme is bad
* ```403``` if authentication token is expired

Perform a GET request to the ```/api/v1/refresh``` endpoint to refresh the access token, and get a response with status code:
* ```201``` if everything is ok
* ```401``` if authentication or token scheme is bad
* ```403``` if authentication token is expired
