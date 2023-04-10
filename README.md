# Project-2 - Social Media App

### Description:
This project was completed as part of a team project during a software engineering course. The project is a backend server application that is built with Node.js and Express.js and uses MongoDB and Mongoose for database storage. The goal of the project is to provide a social platform for users to create and manage their posts and connect with friends.

### Deployment Link
he deployed project can be found at https://stellar-pavlova-831e00.netlify.app

### Getting Started/Code Installation
To access the code for this project, follow these steps:
* Clone the repository onto your local machine using the command git clone https://github.com/3ddy1985/project3-backend.git
* Install the necessary dependencies by running the command npm install
* Start the server by running the command npm start
 
### Timeframe & Working Team
This project was completed as a group project over a period of 8 days. The team consisted of three members: [TheCaliforniaCoder, tfairclough, maljabouri]
 
### Technologies Used
The following technologies were used to complete this project:
* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* ReactJS
 
### Brief
* Have at least 2 models (more if it makes sense)
* Auth is a requirement
* Have full CRUD on at least one of your models
* Be able to Add/Delete on any remaining models
* Have high quality code:
* Commit often and use meaningful commit messages
* Document your code well.
* Follow accepted naming conventions
* Consistent indentation
* Well-structured and readable code
* Semantic naming of variables, functions, CSS classes, etc.
* Short and clear functions that do one thing
* Efficient code - if you have your MVP, refactor
* DRY (Don't Repeat Yourself) code
* Be deployed on Heroku or a similar platform
 
### Planning
During the planning stage of this project, we took the following steps:
* Discussed the requirements and goals of the project as a team
* Created user stories and user personas
* Created a wireframe of the user interface
* Designed the data schema and ERD for the database
* Created a project management board using Trello to plan and track our progress throughout the development process

Wireframes:
![alt text](https://github.com/3ddy1985/project3-frontend/blob/master/wireframe1.png?raw=true)

![alt text](https://github.com/3ddy1985/project3-frontend/blob/master/wireframe2.png?raw=true)

Trello:
![alt text](https://github.com/3ddy1985/project3-frontend/blob/master/trello.png?raw=true)

### Build/Code Process
During the build/code process, I worked with a team to develop the server-side and frontend functionality of the project. My key contributions included:
* Implementing the authentication routes for sign up, login, and logout
* Implementing JWT for user authentication and authorization
* Implementing bcrypt for password encryption

Here are some code snippets highlighting my contributions:

Registration:  
In this code snippet, I implemented the registration route that receives the user's details and stores them in the database. First, I checked if the user's provided data is valid, including a username, password, first name, and last name. Then, I used the bcrypt library to hash the user's password and stored the hashed password in the database using Mongoose. Finally, I generated a JSON Web Token (JWT) with the user's id as the payload, which would be used for user authentication and authorization.  

```js
app.post('/api/register', (req, res) => {
  // Checks if userName and password have values
  if (!req.body.user.userName || req.body.user.userName.trim() === '') {
    return res.status(400).json({ message: 'Username is required' });
  } else if (!req.body.user.password) {
    return res.status(400).json({ message: 'Password is required' });
  } else if (!req.body.user.firstName) {
    return res.status(400).json({ message: 'First name is required' });
  } else if (!req.body.user.lastName) {
    return res.status(400).json({ message: 'Last name is required' });
  } else {
    // Check if username is unique
    User.findOne({ userName: req.body.user.userName })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password using bcrypt
        bcrypt.hash(req.body.user.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ message: 'Internal server error' });
          }
          // Create a new user object with hashed password
          const newUser = new User({
            firstName: req.body.user.firstName,
            lastName: req.body.user.lastName,
            userName: req.body.user.userName,
            password: hash,
          });

          // Save the new user in the database
          newUser.save()
            .then((user) => {
              // adds users id to payload
              const payload = { id: user.id };
              // generates token to include payload, secretKey
              const token = jwt.sign(payload, jwtOptions.secretOrKey);
              // returns a response that includes the created token and the current user details
              return res.status(200).json({ token: token, userDetails: user });
            })
            .catch((error) => {
              return res.status(500).json({ message: 'Internal server error' });
            });
        });
      })
      .catch((error) => {
        return res.status(500).json({ message: 'Internal server error' });
      });
```

Login:  
In this code snippet, I implemented the login route that verifies the user's credentials and returns a JWT if the credentials are valid. First, I checked if the user's provided data is valid, including a username and password. Then, I used Mongoose to retrieve the user's details from the database based on the provided username. If the user was found, I used the bcrypt library to compare the provided password with the stored hashed password. If the passwords match, I generated a JWT with the user's id as the payload, which would be used for user authentication and authorization.  
```js
app.post('/api/login', (req, res) => {
  // Checks if userName and password have values
  if (req.body.user.userName && req.body.user.password) {
    // finds one user that matches the userName sent
    User.findOne({userName: req.body.user.userName})
      .then((user) => {
        // if no match the following message is returned
        if (!user) {
          return res.status(401).json({ success: false, message: 'user not found' });
        }
        
        // the password being sent is then compared with the password for that user in the db
        return bcrypt.compare(req.body.user.password, user.password)
          .then((isMatch) => {
            if (isMatch) {
              // adds users id to payload
              const payload = { id: user.id };
              // generates token to include payload, secretKey
              const token = jwt.sign(payload, jwtOptions.secretOrKey);
              // returns a response that includes the created token and the current user details
              return res.status(200).json({ token: token, userDetails: user });
            }
            // error message if the passwords do not match
            return res.status(401).json({ success: false, message: 'passwords do not match' });
          })
          .catch((error) => {
            return res.status(500).json({ message: 'error' });
          });
      })
      .catch((error) => {
        return res.status(500).json({ message: 'error' });
      });
  } else {
    // error message if username and password do not match or not filled out
    return res.status(400).json({ error: 'Username & Password Required' });
  }
});
```


Register and Login Frontend:  
In these code snippets, I implemented the front-end functionality for user registration and login. When a user enters their details and submits the registration form, the handleRegisterSubmit function is called. This function creates a user object from the form data and sends a POST request to the server to create the user in the database. If the registration is successful, the handleLoginSubmit function is called, which logs the user in by sending a POST request to the server with the user's credentials. If the credentials are valid, the server responds with a JWT that is stored in the app's state and used for subsequent requests.  
```js
/ register method
  handleRegisterSubmit = (e) => {
    e.preventDefault();
    // forms the body to send to backend
    const newUser = {
      user: {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        userName: this.state.userName,
        password: this.state.password,
        email: this.state.email,
        location: this.state.location
      }
    };
    console.log('sending new user:', newUser);
    // calls the createnewuser api from api.js
    createNewUser(newUser)
    .then((res) => {
      console.log(res)
      // once the user has been registered it calls the login method
      this.handleLoginSubmit(e)
    })
    .catch((error) => {
      console.log(error);
      this.setState({ registerErrorMessage: error.response.data.message})
    })
  }

  // Login method
  handleLoginSubmit = (e) => {
    e.preventDefault();
    // forms the body to send to backend
    const credentials = {
      user: {
        userName: this.state.userName,
        password: this.state.password
      }
    };
    console.log('Sending credentials:', (credentials));
    loginUser(credentials)
    .then((response) => {
      console.log(response)
      // sets token and updates URL after login
      const token = response.data.token;
      const firstName = response.data.userDetails.firstName;
      const lastName = response.data.userDetails.lastName;
      const userName = response.data.userDetails.userName;
      const location = response.data.userDetails.location;
      const friends = response.data.userDetails.friends;
      const posts = response.data.userDetails.posts;
      const id = response.data.userDetails._id;
      const currentUser = {
          id,
          firstName,
          lastName,
          userName,
          location,
          friends,
          posts,
        }
      this.props.setToken(token);
      this.props.setCurrentUser(currentUser)
      window.history.pushState({}, 'Feed', '/feed');
    })
    .catch((error) => {
      console.error(error);
      this.setState({ loginErrorMessage: error.response.data.message})
    });
  };
 ```  
 
Overall, my contributions focused on implementing the back-end functionality for user authentication and authorization using Express, MongoDB, bcrypt, and JWT. On the front-end, I implemented the logic for user registration and login using React and Axios.
 
### Challenges
During this project, I encountered a number of challenges that required me to learn new skills and approaches to problem-solving. My main challenge was related to differences in opinion within the group regarding our coding approach. Some members of the group wanted everyone to code together so they could better understand the code. However, my opinion was that having four people spend two days just setting up part of the backend was a bad use of time and resources.

In addition, I faced technical challenges related to integrating MongoDB and Mongoose into our project for the first time. This required me to spend time learning the best practices for working with these technologies and troubleshooting issues as they arose.

Another major challenge was learning how to properly use JWT for user authentication and authorization. This was a new concept for me, so I spent time researching and testing different approaches to ensure that our implementation was secure and functional.

Finally, I also had to implement error handling for each endpoint to ensure proper feedback to the user. This required careful consideration of the different types of errors that could occur and how to handle them in a way that was informative and user-friendly.

Overall, these challenges pushed me to expand my skills and knowledge in new areas, and I feel that I gained valuable experience in back-end web development as a result.
 
### Wins
The aspects of this project that we are most proud of include:
* Successfully integrating MongoDB and Mongoose into our project
* Implementing user authentication and authorization using JWT
* Creating clear and concise documentation for each endpoint and function
 
### Key Learnings/Takeaways
In addition to the technical skills gained, working on this project as part of a group taught me valuable lessons about collaboration and communication. One key takeaway was the importance of clear communication and the need for everyone to be on the same page regarding project goals and expectations. Through regular check-ins and open communication, we were able to work effectively as a team and ensure that everyone's contributions were aligned with the project vision.

Another key learning was the importance of delegating tasks and trusting team members to take ownership of their assigned responsibilities. This allowed us to work more efficiently and effectively, and ensured that everyone had the opportunity to contribute their unique skills and perspectives to the project.

Finally, working in a group also highlighted the importance of being flexible and adaptable in the face of challenges and unexpected obstacles. By remaining open to feedback and willing to pivot our approach when needed, we were able to overcome challenges and complete the project successfully. Overall, these experiences have enhanced my collaboration and communication skills and have prepared me for working on future projects in a team environment.
 
### Bugs
There are currently no known bugs in this project. However, the project was not as fully completed as we would have liked.
 
### Future Improvements
While I'm proud of what we accomplished during this project, there are several improvements that could be made to enhance the functionality and user experience of the app. Some potential improvements include:
* Adding chat functionality to allow users to communicate with each other in real-time
* Improving the CSS styling to create a more visually appealing and cohesive design
* Implementing a feature to allow users to upload profile images to customize their profile pages
* Adding the ability to include images in posts to make them more engaging and visually appealing

These improvements would require additional development time and resources, but could help to make the app more useful and appealing to users. Overall, I believe that there is significant potential to expand upon the existing functionality of the app and create a more engaging and feature-rich platform for users to connect and share content.

