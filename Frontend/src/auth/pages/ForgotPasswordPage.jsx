import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useForm } from '../../hooks/useForm';
import {Link as RouterLink} from 'react-router-dom'
import { Grid, Typography, TextField, Button, Link, Alert } from "@mui/material"
import { AuthLayout } from '../layout/AuthLayout';

const formFields = {
    email: '',
}

export const ForgotPasswordPage = () => {

    const {startForgotPassword} = useAuthStore();

    const {email, onInputChange} = useForm(formFields);

    const onSubmit = (e) => {
        e.preventDefault();

        startForgotPassword(email);
    }

    return (
        <AuthLayout title="">

            <form onSubmit={onSubmit} className="animate__animated animate__fadeIn animate__faster">
                <Grid container>
                    <Typography sx={{mr: 1}}>Forgot your password? No problem. Just let us know your email address and we will email you a new password.</Typography>
                    <Grid item xs={12} sx={{mt: 2}}>
                        <TextField variant="filled" label="Email" type="text" placeholder="Your email" fullWidth name="email" value={email} onChange={onInputChange} />
                    </Grid>
                    <Grid container spacing={2} sx={{mb: 2, mt: 1}}>
                        <Grid item xs={12} sm={12}>
                            <Button variant="contained" fullWidth type="submit" >
                                Email New Password
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" justifyContent="end">
                        <Link component={RouterLink} color="inherit" to="/auth/login">
                            Go Back to Login
                        </Link>
                    </Grid>

                </Grid>
            </form>

        </AuthLayout>
    )
}
