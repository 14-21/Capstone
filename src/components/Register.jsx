import './Register.css';
import { useState, useContext } from 'react';
import { LoginContext } from '../App';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setIsLoggedIn} = useContext(LoginContext);
    const navigate = useNavigate();

    // submit function passed in OnSubmit in form below.
    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log(username)
        try {
            const result = await registerUser(); // Passing async function in from below.
            console.log(result)

            //Need to verfiy token is being stored once we have our API.
            localStorage.setItem("token", result.token) // Storing only key-value pair for token.
            localStorage.setItem("user", result.user.username) // Can delete later - for testing purposes.
            setIsLoggedIn(true)  // Telling program login is true.
            
            navigate('/'); //Navigates back to Homepage after register.
        } catch (error) {
            console.log(error)
        }

    }

    async function registerUser() {
        try {
            // MOCK API to see if function works, it does. URL will need to be changed once Our API is complete.
            const response = await fetch(`https://64986b389543ce0f49e20545.mockapi.io/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: {
                        username: username,
                        password: password,
                       
                    }
                })
            });  // Outside of fetch starting here.
            const result = await response.json()
            return result;
        } catch (error) {
            console.log(error)
        }
    }


    return(
        <div id="register-container"> 
            <h1 id="registerheader">REGISTER</h1>
            <form id="registerform" onSubmit={handleSubmit}>
                <label className="labels">Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                            console.log(e.target.value);
                            setUsername(e.target.value);
                        }}
                    />
                </label>

                <label className="labels">Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            console.log(e.target.value);
                            setPassword(e.target.value);
                        }}
                    />
                </label>
                <button id="registerbutton"type="submit">Submit</button>

            </form>
        </div>
    )
}


export default Register;