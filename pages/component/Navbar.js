import { Layout } from 'antd';
const { Header } = Layout;
import { useContext } from 'react';
import AuthContext from '../component/authContext'


const Navbar = () => {
    const { toggle } = useContext(AuthContext)
    return (
        <Header className="headerColor" >
            <a onClick={() => {
                toggle()
            }}><span className="iconify collapseIcon" data-icon="bytesize:menu" data-inline="false"></span></a>
        </Header>
    )
}

export default Navbar;