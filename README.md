# Email Application Interface

A basic application that like any other email application allows users to:

* Send emails,
* Reply on sent emails
* Archive emails. 

It also gives users access to their :

* Inbox folder
* Sent mail folder
* Archive folder.
 
Users can also, **Register** for an account where they can **Login** and **Logout** from it. 
The backend API is prebuilt, and I created the frontend Interface that handles the communication with the API.

# Build process
1. You should create a virtual environment, in which you will install Django with the following command:
```
pip install Django
```
2. Create a SQLite3 Database by writing :
```
python manage.py migrate
```
3. Run the application locally with:
```
python manage.py runserver
```
To view the application, enter to you browser's url input 
```
127.0.0.1:8000
```
the local adress on which the application runs on. 

# Extra
You can create an admin user account that gives you the admin interface, a very useful tool that allows you to manipulate your application's data in an intuitive way.

To create such an account you need to write the command
```
python manage.py createsuperuser
```
fill in the inputs and you have successfuly created an admin account!

To access the admin interface while running the application locally, type in the browser url page
```
127.0.0.1:8000
```
fill in the credentials you added previously and that's it.
