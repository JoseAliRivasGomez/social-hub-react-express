
export const getEnvVariables = () => {
    
    //import.meta.env;

    return {
        //...import.meta.env
        VITE_API_URL: import.meta.env.VITE_API_URL,
        VITE_CLOUD_NAME: import.meta.env.VITE_CLOUD_NAME,
        VITE_API_KEY: import.meta.env.VITE_API_KEY,
        VITE_UPLOAD_PRESET: import.meta.env.VITE_UPLOAD_PRESET,
    }

}