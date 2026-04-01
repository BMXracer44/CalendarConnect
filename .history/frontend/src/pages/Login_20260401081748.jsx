import React from "react";

const Login = () => {
    return ( 
        <div className="login">
            <h1>Login</h1>
            <form>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
            </form>
        </div>
    );
};

export default Login;