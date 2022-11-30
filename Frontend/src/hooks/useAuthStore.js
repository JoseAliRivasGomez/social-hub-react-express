import { useSelector, useDispatch } from "react-redux"
import mainApi from "../api/mainApi";
import Swal from "sweetalert2";
import { clearErrorMessage, onChecking, onDeleteConnection, onLoadUser, onLogin, onLogout, onSetActiveConnection, onSetOpenModal2FA, onSetSecret2FA, onSetStatus, onUpdateUser } from "../store/auth/authSlice";
import { onLogoutSchedules } from "../store/app/scheduleSlice";
import { onLogoutChannels, onSetActiveChannel } from "../store/app/channelSlice";
import { onLogoutPostTypes } from "../store/app/postTypeSlice";
import { onLogoutPosts } from "../store/app/postSlice";
import { onLogoutConnections } from "../store/app/connectionSlice";

export const useAuthStore = () => {
  
    const dispatch = useDispatch();
  
    const {status, user, errorMessage, activeConnection, secret2FA, openModal2FA} = useSelector(state => state.auth);

    const setSecret2FA = (x) => {
        dispatch(onSetSecret2FA(x));
    }

    const setOpenModal2FA = (x) => {
        dispatch(onSetOpenModal2FA(x));
    }

    const startLogin = async ({email, password}) => {
        dispatch(onChecking());
        try {
        
            const {data} = await mainApi.post('/users/login', {email, password});

            // localStorage.setItem('token', data.token);
            // localStorage.setItem('token-init-date', new Date().getTime());

            //console.log(data);

            dispatch(onLogin({
                uid: data.uid,
                firstName: data.first_name, 
                lastName: data.last_name, 
                email: data.email, 
                state: data.state, 
                otp_enabled: data.otp_enabled,
                require2FA: data.require2FA,
                timeZone: data.timeZone,
                channels: data.channels}));

        } catch (error) {
            //console.log(error);
            dispatch(onLogout('Invalid Credentials'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }

    const startSignUp = async ({first_name, last_name, email, password}) => {
        dispatch(onChecking());
        try {
            
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Costa_Rica';

            const {data} = await mainApi.post('/users/signup', {first_name, last_name, email, password, timeZone});

            // localStorage.setItem('token', data.token);
            // localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(onLogin({
                uid: data.uid,
                firstName: data.first_name, 
                lastName: data.last_name, 
                email: data.email, 
                state: data.state, 
                otp_enabled: data.otp_enabled,
                require2FA: data.require2FA,
                timeZone: data.timeZone,
                channels: data.channels}));

        } catch (error) {
            //console.log(error);
            dispatch(onLogout(error.response.data?.message || 'Error'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }

    const checkAuthToken = async() => {

        try { //Si no ha expirado el token, crea otro

            const {data} = await mainApi.get('/users/renew');
            //console.log("renewed");
            //console.log(data);
            
            // localStorage.setItem('token', data.token);
            // localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(onLogin({
                uid: data.uid,
                firstName: data.first_name, 
                lastName: data.last_name, 
                email: data.email, 
                state: data.state, 
                otp_enabled: data.otp_enabled,
                require2FA: data.require2FA,
                timeZone: data.timeZone,
                channels: data.channels}));
            
        } catch (error) { //Si ya expiro el token, cierra sesion
            dispatch(onLogout());
        }
    }

    const startLogout = async () => {
        try { 

            const {data} = await mainApi.get('/users/logout');
            
        } catch (error) { 
            //console.log(error);
            Swal.fire('Error while logging out', error.response.data?.message, 'error');
        }
        //localStorage.removeItem("xyz");
        dispatch(onLogoutSchedules());
        dispatch(onLogoutChannels());
        dispatch(onLogoutPostTypes());
        dispatch(onLogoutPosts());
        dispatch(onLogoutConnections());
        dispatch(onLogout());
    }

    const startUpdatingUser = async(newUser) => {

        const {firstName, lastName, email} = newUser;

        try {

            await mainApi.put(`/users/${user.uid}`, {first_name: firstName, last_name: lastName, email});
            dispatch(onUpdateUser({...newUser, uid: user.uid}));
            //console.log(newUser);
            Swal.fire('User updated!', 'The user was updated successfully!', 'success');
            return;
            
        } catch (error) {
            //console.log(error);
            Swal.fire('Error while updating user', error.response.data?.message, 'error');
        }
        
    }

    const startUpdatingPassword = async(oldPassword, newPassword) => {

        try {

            try {
                await mainApi.post(`/users/checkpassword/${user.uid}`, {oldPassword});
            } catch (error) {
                //console.log(error);
                Swal.fire('Error while updating user password', error.response.data?.message, 'error');
                return false;
            }
 
            await mainApi.put(`/users/password/${user.uid}`, {newPassword});
            Swal.fire('User password updated!', 'The password was updated successfully!', 'success');
            return true;
            
        } catch (error) {
            //console.log(error);
            Swal.fire('Error while updating user password', error.response.data?.message, 'error');
            return false;
        }
        
    }

    const startForgotPassword = async (email) => {
        try {
        
            const {data} = await mainApi.post('/users/forgotpassword', {email});

            Swal.fire('New password sent!', 'Your new password was sent to your email successfully!', 'success');

        } catch (error) {
            //console.log(error);
            Swal.fire('Error while sending new user password', error.response.data?.message, 'error');
        }
    }

    const setActiveConnection = (connection) => {
        localStorage.setItem('activeConnection', connection.id);
        dispatch(onSetActiveConnection(connection));
    }

    const startSavingConnection = async() => { //ChannelId

        try {

            // Create
            // const newConnection = await mainApi.post('/connections', {ChannelId: connection.id.toString()});
            const {data} = await mainApi.get(`/users/user`);
            dispatch(onLoadUser({
                uid: data.uid,
                firstName: data.first_name, 
                lastName: data.last_name, 
                email: data.email, 
                state: data.state, 
                otp_enabled: data.otp_enabled,
                require2FA: data.require2FA,
                timeZone: data.timeZone,
                channels: data.channels}));
            dispatch(onSetActiveChannel(null));
            //Swal.fire('You are all set!', 'Your channel has been connected successfully!', 'success');
            
        } catch (error) {
            //console.log(error);
            //Swal.fire('Error while connecting channel', error.response.data?.message, 'error');
            //Swal.fire('You are all set!', 'Your channel has been connected successfully!', 'success');
        }
        
    }

    const startDeletingConnection = async(connection) => {

        try {

            await mainApi.delete(`/connections/${connection.id}`);

            dispatch(onDeleteConnection());

            Swal.fire('Channel removed!', 'Your channel has been removed successfully!', 'success');
            
        } catch (error) {
            //console.log(error);
            Swal.fire('Error while deleting channel', error.response.data?.message, 'error');
        }
        
    }

    const startGeneratingQrCode = async() => {

        try {

            const response = await mainApi.post('/users/otp/generate', {});

            //console.log(response);

            if (response.status === 200) {
                setOpenModal2FA(true);
                // console.log({
                //   base32: response.data.base32,
                //   otpauth_url: response.data.otpauth_url,
                // });
                setSecret2FA({
                  base32: response.data.base32,
                  otpauth_url: response.data.otpauth_url,
                });
            }
            
        } catch (error) {
            //console.log(error);
            Swal.fire('Error while Setting up 2FA', error.response.data?.message, 'error');
        }
        
    }

    const startVerifyingOTP = async(otp_token) => {

        try {

            const response = await mainApi.post('/users/otp/verify', {otp_token});

            if (response.status === 200) {
                dispatch(onLoadUser({
                    ...user,
                    otp_enabled: response.data.user.otp_enabled
                }));
            }

            Swal.fire('You are all set!', 'Two-Factor Authentication verified and activated successfully!', 'success');
            
        } catch (error) {
            //console.log(error);
            Swal.fire('Error while Verifying 2FA', error.response.data?.message, 'error');
        }
        
    }

    const startValidatingOTP = async(otp_token) => {

        try {

            const {data} = await mainApi.post('/users/otp/validate', {otp_token});

            // if(response.data.otp_valid){
            //     localStorage.setItem('xyz', "74hj342hj234jh2332hj33j6h23643jh4j63");
            // }

            dispatch(onLoadUser({
                uid: data.uid,
                firstName: data.first_name, 
                lastName: data.last_name, 
                email: data.email, 
                state: data.state, 
                otp_enabled: data.otp_enabled,
                require2FA: data.require2FA,
                timeZone: data.timeZone,
                channels: data.channels}));

            dispatch(onSetStatus('checking'));
            dispatch(onSetStatus('authenticated'));

            //Swal.fire('Welcome back!', 'Two-Factor Authentication validated successfully!', 'success');
            
        } catch (error) {
            //console.log(error);
            Swal.fire('Error while Authenticating', error.response.data?.message, 'error');
        }
        
    }

    const startDisablingOTP = async() => {

        try {

            const response = await mainApi.post('/users/otp/disable', {});

            if (response.status === 200) {
                dispatch(onLoadUser({
                    ...user,
                    otp_enabled: response.data.user.otp_enabled
                }));
            }

            Swal.fire('2FA Disabled!', 'Two-Factor Authentication disabled successfully!', 'success');
            
        } catch (error) {
            //console.log(error);
            Swal.fire('Error while Disabling 2FA', error.response.data?.message, 'error');
        }
        
    }

    return {
        status, 
        user, 
        errorMessage,
        secret2FA,
        setSecret2FA,
        openModal2FA,
        setOpenModal2FA,
        startLogin,
        startSignUp,
        checkAuthToken,
        startLogout,
        startUpdatingUser,
        startUpdatingPassword,
        startForgotPassword,
        activeConnection,
        setActiveConnection,
        startSavingConnection,
        startDeletingConnection,
        startGeneratingQrCode,
        startVerifyingOTP,
        startValidatingOTP,
        startDisablingOTP,
    }

}
