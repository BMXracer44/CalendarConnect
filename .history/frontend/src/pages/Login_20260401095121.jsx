import React from "react";
import { Link } from "react-router-dom";


const Login = () => {
    return ( 
        <div className="login">
            <h1>Login</h1>
            <Link to="/home">Go to Home</Link>
            <form>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
            </form>
        </div>
    );
};

export default Login;