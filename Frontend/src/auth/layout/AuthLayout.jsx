import { Grid, Typography} from "@mui/material"
import logo from '/vite.svg' // relative path to image 

export const AuthLayout = ({children, title = ''}) => {
  return (
    <Grid   
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{minHeight: '100vh', backgroundColor: 'primary.main', padding: 4}}
    >

          <img
            src={logo}
            className="m-4 h-14"
            alt="Social Hub Manager Logo"
          />

        <Grid item
         className="box-shadow"
         xs={3}
         sx={{backgroundColor: 'white', padding: 3, borderRadius: 2, width: {sm: 450}}}>
            <Typography variant="h5" sx={{mb: 1}}>{title}</Typography>

            {children}

        </Grid>
    </Grid>
  )
}
