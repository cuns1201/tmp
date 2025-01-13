import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import '../index.css';

const LoginForm = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState("");
  
  const handleSubmitSignIn = async (e) => {
    e.preventDefault(); // Prevent default form submission

    let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    response = await response.json();
    console.log('res: ', response);
    if (!response) console.log("fetch khong duoc");
    else if (response.message) alert(response.message);
    else {
      if (!response.user.verification) {
        alert("You haven't verified your account yet. ");
        return;
      }
      alert("You have successfully logged in!");
      localStorage.setItem("userInfo", JSON.stringify(response));
      navigate("/");
      window.location.reload();
    }
  };

  const handleSubmitSignUp = async e => {
    e.preventDefault(); // Prevent default form submission

    let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        email,
        password,
        repassword,
      }),
    });

    response = await response.json();
    console.log('res: ', response);

    if (!response) alert("Registerd failed");
    else if (response.message) {
      alert(response.message);
    } else if (response.user && response.token) {
      alert("Please enter your otp code");
      window.localStorage.setItem("email", email);
      window.localStorage.setItem("userInfo", JSON.stringify(response));
      console.log('otp: ', email);
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          email,
        }),
      });
      navigate("/otp");
    }
  };

return (
  <>
    <div className='flex justify-center'>
      <div className={`container ${isSignUpMode ? 'right-panel-active' : ''}`} id="container">
        {/* Register */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubmitSignUp}>
            <h1 className=' font-bold m-0'>Create Account</h1>
            <div className="social-container">
              <a href="https://unsplash.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Vexere</span>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="Password"  value={password} onChange={(e) => setPassword(e.target.value)}/>
            <input type="password" placeholder="Re-enter password" value={repassword} onChange={(e) => setRepassword(e.target.value)}/>
            <button style={{
              borderRadius: '20px',
              border: '1px solid #ffffff',
              backgroundColor: '#FF4B2B',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 'bold',
              padding: '12px 45px',
              letterSpacing:'1px',
              textTransform: 'uppercase',
              transition: 'transform 80ms ease-in',}}
              type="submit">Sign Up</button>
          </form>
        </div>
        {/* Sign in */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSubmitSignIn}>
            <h1 className=' font-bold m-0'>Sign in</h1>
            <div className="social-container">
              <a href="https://unsplash.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Vexere</span>
              </a>
            </div>
            <span>or use your account</span>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <a href="#">Forgot your password?</a>
            <button style={{
              borderRadius: '20px',
              border: '1px solid #ffffff',
              backgroundColor: '#FF4B2B',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 'bold',
              padding: '12px 45px',
              letterSpacing:'1px',
              textTransform: 'uppercase',
              transition: 'transform 80ms ease-in',}}
              type="submit">Sign In</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            {/* Register */}
            <div className="overlay-panel overlay-left">
              <h1 className=' font-bold m-0'>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn" onClick={toggleMode} style={{
                borderRadius: '20px',
                border: '1px solid #ffffff',
                backgroundColor: '#FF4B2B',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '12px 45px',
                letterSpacing:'1px',
                textTransform: 'uppercase',
                transition: 'transform 80ms ease-in',}}>{isSignUpMode ? 'Sign In' : 'Sign Up' }</button>
            </div>
            {/* Sign in */}
            <div className="overlay-panel overlay-right">
              <h1 className=' font-bold m-0'>Hello, Friend!</h1>  
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" id="signUp" onClick={toggleMode} style={{
                borderRadius: '20px',
                border: '1px solid #ffffff',
                backgroundColor: '#FF4B2B',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '12px 45px',
                letterSpacing:'1px',
                textTransform: 'uppercase',
                transition: 'transform 80ms ease-in',}}>{isSignUpMode ? 'Sign In' : 'Sign Up'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
)
};

export default LoginForm;