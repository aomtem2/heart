import { Layout } from 'antd';
import Navbar from './Navbar';
import { useRouter } from 'next/router'
import { useEffect } from 'react';
import Sidebar from './Sidebar';

const LayoutA = ({ children }) => {
    const router = useRouter()
    const noSide = ["/login", "/setPin"]
    const list = ["/home", "/leaveManagement", "/userManagement", "/addOldRecord", "/activity", "/sendLeave", "/home", "/login", "/setPin", "/sendLeave", "/activity", "/leaveManagement", "/profile"]

    return (
        <Layout className="fontConcert">
            <link href="http://fonts.cdnfonts.com/css/concert-one" rel="stylesheet" />

            {!noSide.includes(router.pathname) && list.includes(router.pathname) ? <Sidebar></Sidebar> : ''}
            <Layout>
                {!noSide.includes(router.pathname) && list.indexOf(router.pathname) > -1 ? <Navbar></Navbar> : ''}
                {children}
            </Layout>
        </Layout>
    )
}

export default LayoutA;