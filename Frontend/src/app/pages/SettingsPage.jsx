import { Grid, Typography, TextField, Button, Link, Alert, Select, MenuItem, FormControl, InputLabel, FormHelperText } from "@mui/material"
import { useEffect, useState } from "react";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useForm } from "../../hooks/useForm";
import { AuthLayoutApp } from "../layout/AuthLayoutApp";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.js';
import { TwoFactorAuth } from "../../auth/components/TwoFactorAuth";

const userFormFields = {
    firstName: '',
    lastName: '',
    email: '',
}

const passwordFormFields = {
    oldPassword: '',
    newPassword: '',
    newPassword2: '',
}

const formValidationsUser = {
    firstName: [ (value) => value.length >= 1, 'The first name is required'],
    lastName: [ (value) => value.length >= 1, 'The last name is required'],
    email: [ (value) => value.includes('@'), 'The email must have a @'],
}

const formValidationsPassword = {
    oldPassword: [ (value) => value.length >= 1, 'You must enter the old password'],
    newPassword: [ (value) => value.length >= 8, 'The new password must be at least 8 characters long'],
    newPassword2: [ (value) => value.length >= 1, 'You must enter the new password again'],
}

export const SettingsPage = () => {

    const {user, startUpdatingUser, startUpdatingPassword, secret2FA, openModal2FA, setSecret2FA, setOpenModal2FA, startGeneratingQrCode, startDisablingOTP} = useAuthStore();

    const [formSubmitted1, setFormSubmitted1] = useState(false);
    const [formSubmitted2, setFormSubmitted2] = useState(false);

    const {formState: formStateUser, firstName, lastName, email, onInputChange: onUserInputChange,
        isFormValid: isFormValidUser, firstNameValid, lastNameValid, emailValid, setFormState} = useForm(userFormFields, formValidationsUser);

    const {formState: formStatePassword, oldPassword, newPassword, newPassword2, onInputChange: onPasswordInputChange,
        isFormValid: isFormValidPassword, oldPasswordValid, newPasswordValid, newPassword2Valid, onResetForm} = useForm(passwordFormFields, formValidationsPassword);

    useEffect(() => {
      
        setFormState({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        })

    }, [])
            

    const onSubmitUser = (e) => {
        e.preventDefault();
        setFormSubmitted1(true);

        if (!isFormValidUser) return;

        startUpdatingUser({firstName, lastName, email});
    }

    const onSubmitPassword = async(e) => {
        e.preventDefault();
        setFormSubmitted2(true);

        if (!isFormValidPassword) return;

        if (newPassword !== newPassword2) {
            Swal.fire('Update Error', 'The new passwords do not match', 'error');
            return;
        }

        const result = await startUpdatingPassword(oldPassword, newPassword);
        if(result){
            onResetForm();
            setFormSubmitted2(false);
        }
        
    }

    const generateQrCode = () => {
        startGeneratingQrCode();
    }

    const disableTwoFactorAuth = () => {
        startDisablingOTP();
    }

    const onConfirmDisableTwoFactorAuth = () => {

        Swal.fire({
          title: 'Are you sure you want to disable Two-Factor Authentication?',
          text: "Two-Factor Authentication is very important to protect your account!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete!',
          cancelButtonText: 'No, cancel'
        }).then(async (result) => {
          if (result.isConfirmed) {
    
              try {
    
                disableTwoFactorAuth();
                  
              } catch (error) {
                  console.log(error);
                  Swal.fire(
                      'Error',
                      'Error while disabling Two-Factor Authentication',
                      'error'
                    )
              }
    
          }
        });
    
      }

    return (
        <div className=" mt-4">

            <AuthLayoutApp title="Two-Factor Authentication">
                
            <section className="bg-ct-blue-600 pt-2">
                <div>
                    <p className="mb-4">
                    Secure your account with TOTP two-factor authentication.
                    </p>
                    {user?.otp_enabled ? (
                    <button
                        type="button"
                        className="focus:outline-none text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                        onClick={() => onConfirmDisableTwoFactorAuth()}
                    >
                        Disable 2FA
                    </button>
                    ) : (
                    <button
                        type="button"
                        className="text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
                        onClick={() => generateQrCode()}
                    >
                        Setup 2FA
                    </button>
                    )}
                </div>
            </section>
            {openModal2FA && (
                <TwoFactorAuth
                base32={secret2FA.base32}
                otpauth_url={secret2FA.otpauth_url}
                closeModal={() => setOpenModal2FA(false)}
                />
            )}

            </AuthLayoutApp>

            <AuthLayoutApp title="Update User">
                {/* <h1>{formStateUser ? 'Valido' : 'Incorrecto'}</h1> */}

                <form onSubmit={onSubmitUser}>
                    <Grid container>
                        <Grid item xs={12} sx={{mt: 2}}>
                            <TextField variant="filled" label="First name" type="text" placeholder="Your first name" fullWidth 
                            name="firstName" value={firstName} onChange={onUserInputChange} 
                            error={!!firstNameValid && formSubmitted1} helperText={formSubmitted1 && firstNameValid} />
                        </Grid>
                        <Grid item xs={12} sx={{mt: 2}}>
                            <TextField variant="filled" label="Last name" type="text" placeholder="Your last name" fullWidth 
                            name="lastName" value={lastName} onChange={onUserInputChange} 
                            error={!!lastNameValid && formSubmitted1} helperText={formSubmitted1 && lastNameValid} />
                        </Grid>
                        <Grid item xs={12} sx={{mt: 2}}>
                            <TextField variant="filled" label="Email" type="email" placeholder="email@email.com" fullWidth 
                            name="email" value={email} onChange={onUserInputChange} 
                            error={!!emailValid && formSubmitted1} helperText={formSubmitted1 && emailValid} />
                        </Grid>
                        <Grid container spacing={2} sx={{mb: 2, mt: 1}}>
                            <Grid item xs={12}>
                                <Button variant="contained" fullWidth type="submit">
                                    Update user
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>

            </AuthLayoutApp>

            <AuthLayoutApp title="Update Password">
                {/* <h1>{formStatePassword ? 'Valido' : 'Incorrecto'}</h1> */}

                <form onSubmit={onSubmitPassword}>
                    <Grid container>
                        <Grid item xs={12} sx={{mt: 2}}>
                            <TextField variant="filled" label="Old Password" type="password" placeholder="Your old password" fullWidth 
                            name="oldPassword" value={oldPassword} onChange={onPasswordInputChange} 
                            error={!!oldPasswordValid && formSubmitted2} helperText={formSubmitted2 && oldPasswordValid} />
                        </Grid>
                        <Grid item xs={12} sx={{mt: 2}}>
                            <TextField variant="filled" label="New Password" type="password" placeholder="Your new password" fullWidth 
                            name="newPassword" value={newPassword} onChange={onPasswordInputChange} 
                            error={!!newPasswordValid && formSubmitted2} helperText={formSubmitted2 && newPasswordValid} />
                        </Grid>
                        <Grid item xs={12} sx={{mt: 2}}>
                            <TextField variant="filled" label="Repeat New Password" type="password" placeholder="Your new password again" fullWidth 
                            name="newPassword2" value={newPassword2} onChange={onPasswordInputChange} 
                            error={!!newPassword2Valid && formSubmitted2} helperText={formSubmitted2 && newPassword2Valid} />
                        </Grid>
                        <Grid container spacing={2} sx={{mb: 2, mt: 1}}>
                            <Grid item xs={12}>
                                <Button variant="contained" fullWidth type="submit">
                                    Update password
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>

            </AuthLayoutApp>
        </div>
    )
}
