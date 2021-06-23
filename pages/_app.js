import '../styles/globals.css'
import '../styles/admin.css'
import '../styles/login.css';
import '../styles/userManagement.css';
import '../styles/sidebar.css';
import '../styles/table.css';
import '../styles/staff.css';
import '../styles/supervisor.css';
import LayoutA from './component/LayoutA';
import { AuthContextProvider } from "./component/authContext";
import { useContext } from 'react';
import AuthContext from '../pages/component/authContext'

function MyApp({ Component, pageProps }) {
  const { user } = useContext(AuthContext)

  return (
    <AuthContextProvider>
      <LayoutA>
        <Component {...pageProps} />
      </LayoutA>
    </AuthContextProvider>
  )
}

export default MyApp
