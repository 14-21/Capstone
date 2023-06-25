import './Login.css';
import { useState, useContext } from "react";
import { LoginContext } from '../App';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setIsLoggedIn} = useContext(LoginContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(username);

        try {
            const result = await loginUser();
            console.log(result) 

            // Fetching only key-value pair for the token for the login.
            localStorage.setItem("token", result.token); // Potentially needs to be changed.
            localStorage.setItem("id", result.id) // Can be deleted later - for testing purposes.
            
            setIsLoggedIn(true)  // Telling program login is true.

            navigate('/') //Navigates back to Homepage after login.
        } catch (error) {
            console.log(error);
        }
    }
    
    
  async function loginUser() {
    try {
        // MOCK API to see if function works, it does. URL will need to be changed once Our API is complete.
      const response = await fetch(`https://64986b389543ce0f49e20545.mockapi.io/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            username: username,
            password: password,
          },
        }),
      }); // Outside of fetch starting here.
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  }



    return (
        <div id="login-container">
        <h1 id="loginheader">LOGIN</h1>
        <form id="loginform" onSubmit={handleSubmit}>
          <label className="labels">
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => {
                console.log(e.target.value);
                setUsername(e.target.value);
              }}
            />
          </label>
  
          <label className="labels">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => {
                console.log(e.target.value);
                setPassword(e.target.value);
              }}
            />
          </label>
          <button id="loginbutton" type="submit">Submit</button>
        </form>
      </div>
    )

}

export default Login;