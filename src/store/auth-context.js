import React, {useState, useEffect, useCallback} from 'react';

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token, futureDate) => {},
    logout: () => {}
});

const getRemainingTime = futureDate => {
    const currentMilliseconds = new Date().getTime();
    const futureMilliseconds = new Date(futureDate).getTime();
    return futureMilliseconds - currentMilliseconds;
}

const getTokenInfo = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationTime = localStorage.getItem('expirationTime');
    if (storedToken && storedExpirationTime)
    {
        return {
            token: storedToken,
            remainingTime: getRemainingTime(storedExpirationTime)
        };
    }
    else
    {
        return null;
    }
}

let timeoutId;

export const AuthContextProvider = (props) => {
    // const localToken = localStorage.getItem('token');
    const tokenInfo = getTokenInfo();
    let initialToken = null;
    if (tokenInfo)
    {
        initialToken = tokenInfo.token
    }
    const [token, setToken] = useState(initialToken);
    const isLoggedIn = !!token;

    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        if (tokenInfo)
        {
            if (tokenInfo.remainingTime > 10000)
            {
                timeoutId = setTimeout(logoutHandler, tokenInfo.remainingTime);
            }
            else
            {
                localStorage.removeItem('token');
                localStorage.removeItem('expirationTime');
            }
        }
    }, [tokenInfo, logoutHandler]);

    const loginHandler = (token, futureDate) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', futureDate);
        const remainingTime = getRemainingTime(futureDate);
        timeoutId = setTimeout(logoutHandler, remainingTime);
    }

    const defaultValue = {
        token: token,
        isLoggedIn: isLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    };

    return <AuthContext.Provider value={defaultValue}>
        {props.children}
    </AuthContext.Provider>
}

export default AuthContext;