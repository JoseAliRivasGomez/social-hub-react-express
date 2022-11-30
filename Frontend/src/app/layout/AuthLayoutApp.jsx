import { Grid, Typography} from "@mui/material"

export const AuthLayoutApp = ({children, title = ''}) => {
  return (
    <Grid   
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{backgroundColor: 'white',paddingTop: 4, paddingBottom: 4}}
        className="mb-4 border-2 rounded-lg"
    >

        <Grid item
         className="border-2 rounded-lg mb-0 mt-0"
         xs={3}
         sx={{backgroundColor: 'white', padding: 3, borderRadius: 2, width: {sm: 500}}}>
            <Typography variant="h5" sx={{mb: 1}}>{title}</Typography>

            {children}

        </Grid>
    </Grid>
  )
}
