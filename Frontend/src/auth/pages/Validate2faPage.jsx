import { useEffect } from "react";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useForm } from "../../hooks/useForm";
import { AuthLayout } from "../layout/AuthLayout";

const styles = {
  buttonGroup: `flex items-center py-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600`,
  buttonBlue: `block w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`,
  inputField: `form-control block w-full px-4 py-4 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none`,
};

const formFields = {
    authCode: '',
}

export const Validate2faPage = () => {
  
  const {startValidatingOTP} = useAuthStore();

  const {authCode, onInputChange} = useForm(formFields);

  const onSubmit = (e) => {
      e.preventDefault();

      startValidatingOTP(authCode);
      
  }

  return (
    <AuthLayout title="">
    <section className="bg-ct-blue-600 grid place-items-center">
      <div className="w-full">
        <form
          onSubmit={onSubmit}
          className="max-w-md w-full mx-auto overflow-hidden bg-ct-dark-200 rounded-2xl p-8 space-y-5"
        >
          <h2 className="text-center text-3xl font-semibold text-[#142149]">
            Two-Factor Authentication
          </h2>
          <p className="text-center text-sm">
            Open the two-step verification app on your mobile device to get your
            verification code.
          </p>
          <input
            name="authCode" value={authCode} onChange={onInputChange}
            className={styles.inputField}
            placeholder="Authentication Code"
          />
          {/* <p className="mt-2 text-xs text-red-600">
            {errors.token ? errors.token.message : null}
          </p> */}

            <div className={styles.buttonGroup}>
                <button type="submit" className={styles.buttonBlue}>
                    Authenticate
                </button>
            </div>
        </form>
      </div>
    </section>
    </AuthLayout>
  );
};

