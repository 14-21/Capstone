import './Profile.css';
import { useState, useEffect } from 'react';


function Profile() {
    const [username, setUsername] = useState("");

    //Fetching username so it can display on each user profile page.
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
          setUsername(user);
        }
      }, []);

    return(
        <>
            <h1>Profile Page</h1>
            <h1>Welcome, {username} !</h1>
        </>
    )
}


export default Profile;