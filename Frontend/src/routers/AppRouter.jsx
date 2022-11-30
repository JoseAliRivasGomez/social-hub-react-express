import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ForgotPasswordPage } from "../auth/pages/ForgotPasswordPage";
import { LoginPage } from "../auth/pages/LoginPage";
import { SignUpPage } from "../auth/pages/SignUpPage";
import { Validate2faPage } from "../auth/pages/Validate2faPage";
import { useAuthStore } from "../hooks/useAuthStore";
import { CheckingAuth } from "../ui/components/CheckingAuth";
import { OtherRoutes } from "./OtherRoutes";

export const AppRouter = () => {

    //const status = 'not-authenticated';
    const {status, user, checkAuthToken} = useAuthStore();
    
    useEffect(() => {
      checkAuthToken();
    }, [])
    

    if (status === 'checking'){
      return <CheckingAuth />
    }

  return (
    <Routes>

        {
            (status === 'not-authenticated')
            ? (
              <>
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/signup" element={<SignUpPage />} />
                <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/*" element={<Navigate to='/auth/login' />} />
              </>
            ) : 
            (status === 'authenticated' && user?.otp_enabled && user?.require2FA)
            ? (
              <>
                <Route path="/*" element={<Validate2faPage />} />
              </>
            ) : (
              <>
                <Route path="/*" element={<OtherRoutes />} />
              </>
            )
        }
        
    </Routes>
  )
}
