import React from 'react'
import { getAllUsers } from './api'
import { createNewUser } from './api'
import { userSeedData } from '../../seedData'
import { registerAllUsers } from './api'
import { loginUser } from './api'
import './../../loginRegister.css'

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dummyUsers: userSeedData,
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      userName: '',
      password: '',
      location: '',
      isLoginForm: true,
      loginErrorMessage: '',
      registerErrorMessage: [],
      showPassword: false,
    };
  } 

  // method to add dummy users from seedData
  addDummyUsers = (e) => {
    e.preventDefault()
    console.log('button working')
    // call the create a users api that we imported from api.js and pass the createUser state
    registerAllUsers(this.state.dummyUsers)
    .then(() => {
      console.log('user created')
    })
    .catch((err) => {
        console.log(err)
    })
  }

  // Switches between login and register forms and updates the URL
  handleFormToggle = () => {
    this.setState(prevState => ({
      isLoginForm: !prevState.isLoginForm
    }), () => {
      const pageTitle = this.state.isLoginForm ? 'Login' : 'Register';
      window.history.pushState({}, pageTitle, `/${pageTitle.toLowerCase()}`);
    });
  }

  // register method
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

  handleToggleViewPassword = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }))
  }

  render() {
    return (
      <>
        {/* login/register page header section */}
        <header className='hero-image'>
          <h1 className="hero-h1">Naptser Social</h1>
          <button onClick={this.addDummyUsers} className="tmp-add-users">add seed users</button>

        </header>
        <div className='login-wrapper'>
          {/* If state isLoginForm = true then login form is displayed */}
          {this.state.isLoginForm ? (
            <>
              <div className='signup-signin'>
                <p className='not-member'>Not a member? <button className='signup-signin-button' onClick={this.handleFormToggle}>Sign up now</button></p>
              </div>
              <form className='login-form' onSubmit={this.handleLoginSubmit}>
                {this.state.loginErrorMessage && <div className='error-message'>* {this.state.loginErrorMessage} *</div>}
                <input className='login-register-input'
                  type="text"
                  placeholder="Username..."
                  onChange={e => this.setState({userName: e.target.value})} required/><br />
                  <input className='login-register-input'
                    type={this.state.showPassword ? 'text' : 'password'}
                    placeholder="Password..."
                    onChange={e =>  this.setState({password: e.target.value})} required/>
                <br />
                <button className='login-register-buttons' type='submit'>Login</button>
              </form>
            </>
            // if state isLoginForm = false then register form is displayed
          ) : (
            <>
              <div className='signup-signin'>
                <p className='not-member'>Already a member? <button className='signup-signin-button' onClick={this.handleFormToggle}>Sign in</button></p>
              </div>
              <div className='register-wrapper'>
                <form onSubmit={this.handleRegisterSubmit}>
                {this.state.registerErrorMessage && <div className='error-message'>* {this.state.registerErrorMessage} *</div>}
                  <input className='login-register-input' 
                         type="text" 
                         placeholder="First name..."
                         onChange={e => this.setState({firstName: e.target.value})} required/>
                  <input className='login-register-input' 
                         type="text" 
                         placeholder="Last name..."
                         onChange={e => this.setState({lastName: e.target.value})} required/><br />
                  <input className='login-register-input' 
                         type="text" 
                         placeholder="Location..."
                         onChange={e => this.setState({location: e.target.value})} />
                  <input className='login-register-input' 
                         type="email" 
                         placeholder="Email..."
                         onChange={e => this.setState({email: e.target.value})} /><br />
                  <input className='login-register-input' 
                         type="text" 
                         placeholder="Username..."
                         onChange={e => this.setState({userName: e.target.value})} required/>
                  <input className='login-register-input' 
                         type="password" 
                         placeholder="Password..."
                         onChange={e => this.setState({password: e.target.value})} /><br />
                  <button type='submit' className='login-register-buttons' >Register</button>
                </form>
              </div>
            </>
          )}
        </div>
      </>
    )
  }
}



// belowe is the function version

// import React, { useState } from 'react'
// import { getAllUsers } from './api'
// import { createNewUser } from './api'
// import { userSeedData } from '../../seedData'
// import { registerAllUsers } from './api'
// import { PropTypes } from 'prop-types'
// import { loginUser } from './api'

// export default function Login({ setToken }) {
//   const [userName, setUserName] = useState();
//   const [password, setPassword] = useState();


//   const handleLoginSubmit = (e) => {
//     e.preventDefault();
//     const credentials = {
//       user: {
//       userName,
//       password
//     }
//     };
//     console.log('Sending credentials:', (credentials));
//     loginUser(credentials)
//     .then((response) => {
//       const token = response.data.token;
//       setToken(token);
//           console.log(token)
//     })
    
//   };
  
//   return(
//     <>
//       <header className='hero-image'>
//          <h1 className="hero-h1">App Name</h1>
//        </header>
//       <div className='login-wrapper'>
// {/* //         <button onClick={this.addDummyUsers}>add seed users</button> */}
//          <p className='not-member'>Not a member? <a href='/'>Sign up now</a></p>
//          <form className='login-form' onSubmit={handleLoginSubmit}>
//             <input 
//                   type="text" 
//                   placeholder="Username..." 
//                   onChange={e => setUserName(e.target.value)}/>
//              <input 
//                   type="password" 
//                   placeholder="Password..."
//                   onChange={e => setPassword(e.target.value)} />
//             <button type='submit'>Login</button>
//         </form>
//       </div>
//        <div className='register-wrapper hidden'>
//         <form>
//              <input type="text" placeholder="First name..." />
//             <input type="text" placeholder="Last name..." />
//             <input type="text" placeholder="Username..." />
//              <input type="email" placeholder="Email..." />
//             <input type="password" placeholder="Password..." />
//              <input type="password" placeholder="Confirm password..." />
// {/* //             <button onClick={this.createUser}>Register</button> */}
//         </form>
//       </div>
//        </>
//   )
// }

// Login.ReactPropTypes = {
//   setToken: PropTypes.func.isRequired
// }
 // used with the function version
// // Specify that setToken is a function
// Login.propTypes = {
// setToken: PropTypes.func.isRequired
// }