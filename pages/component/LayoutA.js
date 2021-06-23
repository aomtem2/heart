import { Layout } from 'antd';
import Navbar from './Navbar';
import { useRouter } from 'next/router'
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Cookies from 'js-cookie'

const LayoutA = ({ children }) => {
    const router = useRouter()
    const cookie = Cookies.get('cookie')
    Cookies.set('cookie', '1', { expires: 7 });
    Cookies.set('pinStatus', '1', { expires: 7 });
    Cookies.set('role', '1', { expires: 7 });
    const noSide = ["/login", "/setPin"]
    const list = ["/home", "/leaveManagement", "/userManagement", "/addOldRecord", "/activity", "/sendLeave", "/home", "/login", "/setPin", "/sendLeave", "/activity", "/leaveManagement", "/profile"]

    useEffect(() => {
        if (cookie) {

        }
        else {
            router.push('/login')
        }

    }, [])

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