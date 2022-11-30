import reactLogo from './assets/react.svg'
import { AppRouter } from "./routers/AppRouter"
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AppTheme } from "./theme/AppTheme"

export const App = () => {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
            <AppTheme>
              <AppRouter />
            </AppTheme>
        </BrowserRouter>
      </Provider>
    </>
  )
}
