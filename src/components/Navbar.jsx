import './Navbar.css';
import { FaBars } from 'react-icons/fa';
import { useContext } from 'react';
import { LoginContext } from '../App';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';



function Navbar() {
    const {setIsLoggedIn} = useContext(LoginContext);
    const {isLoggedIn} = useContext(LoginContext);
    const navigate = useNavigate();

    return (
      <>
        <div id="websitename">
            <h1>Website Name</h1>
        </div>
        
      <nav>
        {/* <FaBars /> */}
        {isLoggedIn ? (
          <>
            {/* // This link is only showed when user is logged in. */}
            <Link className="links" to="/">Home</Link>
            <Link className="links" to="/profile">My Profile</Link>
            <button id="logout-button"
              onClick={() => {
                setIsLoggedIn(false);
                localStorage.removeItem("token"); //Removes token from local storage when logout is clicked.
                localStorage.removeItem("user"); //Removes user from local storage when logout is clicked.
                navigate("/")
            }}>Logout
            </button>
          </>
        ) : (
          <>
            {/* // These links are showed when the user is logged out. */}
            <Link className="links" to="/">
              Home
            </Link>
            <Link className="links" to="/login">
              Login
            </Link>
            <Link className="links" to="/register">
              Register
            </Link>
          </>
        )}
    
      </nav>
    </>  
    );
  }  



export default Navbar;