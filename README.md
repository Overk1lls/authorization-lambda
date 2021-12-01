# authorization-lambda

## Usage
Perform a POST request to the ```/api/signup``` endpoint with the following data in the body:
```
{
  "email": "example@gmail.com",
  "password": "12345"
}
```
to get a response with status code:
* ```201``` if user is created
* ```400``` if invalid request or user already exists

Perform a POST request to the ```/api/login?email=example@gmail.com&password=password``` endpoint,\
with the parameters ```email``` and ```password``` in the query, to get a response with status code:
* ```201``` if user is found and token is returned
* ```400``` if invalid request
* ```404``` if user is not found

Perform a GET request to the ```/api/me/:num``` endpoint, with the parameter ```num``` (any number) to get a response with status code:
* ```200``` if user is found and data is returned
* ```400``` if invalid request or authorization token is expired
* ```401``` if user is not authorized
* ```404``` if user is not found

Perform a POST request to the ```/api/refresh``` endpoint to get a response with status code:
* ```201``` new token is created
* ```400``` invalid request (token is expired)
* ```401``` user is not authorized
