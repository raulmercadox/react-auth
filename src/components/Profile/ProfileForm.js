import classes from './ProfileForm.module.css';
import {useRef, useContext} from "react";
import AuthContext from "../../store/auth-context";
import {useHistory} from 'react-router-dom';

const ProfileForm = () => {

    const authContext = useContext(AuthContext);
    const passwordRef = useRef();
    const history = useHistory();

    const changePasswordHandler = event => {
        event.preventDefault();
        const password = passwordRef.current.value;
        fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBjs1a6JZJRi0coZ6NhFaGKklQ-eVXYIMM', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idToken: authContext.token,
                password: password,
                returnSecureToken: false
            })
        }).then(response => {
            // Do something
            if (response.ok)
            {
                history.replace("/");
            }
        }).catch(error => {
            console.log("Error: ", error);
        });
    }

    return (
        <form className={classes.form} onSubmit={changePasswordHandler}>
            <div className={classes.control}>
                <label htmlFor='new-password'>New Password</label>
                <input type='password' id='new-password' ref={passwordRef}/>
            </div>
            <div className={classes.action}>
                <button>Change Password</button>
            </div>
        </form>
    );
}

export default ProfileForm;
