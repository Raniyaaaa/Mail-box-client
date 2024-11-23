import { useRef, useState } from "react"
import { Alert, Button } from "react-bootstrap";
import { Link,useNavigate  } from "react-router-dom";
import MainNavigation from "../MainNavigation/MainNavigation";

const Login=()=>{
    const [isLogin,setIsLogin]=useState(false)
    const emailInputRef=useRef();
    const passwordInputRef=useRef();
    const confirmPasswordInputRef=useRef();
    const navigate=useNavigate();

    function resetForm() {
        emailInputRef.current.value = '';
        passwordInputRef.current.value = '';
        if (confirmPasswordInputRef.current) {
            confirmPasswordInputRef.current.value = '';
        }
    }

    const submitHandler=(event)=>{
        event.preventDefault();
        const enteredEmail=emailInputRef.current.value;
        const enteredPassword=passwordInputRef.current.value;
        const enteredConfirmPassword=confirmPasswordInputRef.current ? confirmPasswordInputRef.current.value : '';
        
        if (!isLogin && enteredPassword !== enteredConfirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        let url;
        if(isLogin){
            url='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=API_KEY'
        }else{
            url="https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=API_KEY"
        }
        fetch(url,{
            method:'POST',
            body:JSON.stringify({
                email:enteredEmail,
                password:enteredPassword,
                returnSecureToken:true
            }),
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then((res)=>{
            if(res.ok){
                return res.json();
            } else{
                return res.json().then((data)=>{
                    let errorMessage="Authentication failed!"
                    if(data && data.error && data.error.message){
                        errorMessage=data.error.message;
                    }
                    throw new Error(errorMessage)
                })
            }
        })
        .then((data)=>{
            console.log("User has successfully Logged In")
            console.log(data)
            localStorage.setItem('token',data.idToken)
            localStorage.setItem('email',data.email)
            navigate("/home");
            resetForm();
        })
        .catch((err)=>{
            alert(err)
        })
    }

    const toggleAuthModeHandler=()=>{
        setIsLogin((prevstate)=> !prevstate)
    }

    return(
        <>
        <MainNavigation />
        <div style={{paddingTop:'10rem',paddingRight:'5rem',paddingLeft:'40rem'}}>
            <section>
                <h1>{isLogin? 'Login':'SignUp'}</h1>
                <form onSubmit={submitHandler}>
                    <div>
                        <label htmlFor="email">
                            <input 
                            type='email' 
                            id='email' 
                            ref={emailInputRef}
                            placeholder="Email"
                            required></input>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="Password">
                            <input 
                            type='Password' 
                            id='Password' 
                            ref={passwordInputRef}
                            placeholder="Password"
                            required></input>
                        </label>
                    </div>
                    {!isLogin && (<div>
                        <label htmlFor="ConfirmPassword">
                            <input 
                            type='Password' 
                            id='ConfirmPassword' 
                            ref={confirmPasswordInputRef}
                            placeholder="Confirm Password"
                            required></input>
                        </label>
                    </div>)}
                    <div>
                        <Button variant="primary" type="submit">{isLogin? 'Login':'Sign Up'}</Button>
                    </div>
                    {isLogin && (
                            <div className="mt-1">
                                <Link to="/forgetpassword">forgot password?</Link>
                            </div>
                    )}
                </form>
            </section>
            <section>
            <Alert variant='success' onClick={toggleAuthModeHandler}>{isLogin? 'Dont have an account? Sign up': 'Have an Account? Login'}</Alert>
            </section>
        </div>
        </>
    )
}
export default Login;