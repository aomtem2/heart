import { Layout, Menu } from 'antd';
import { useRouter } from 'next/router'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import Cookies from 'js-cookie'
import callService from '../function/axiosCall'
import serViceUrl from '../function/serViceUrl'
import { useContext } from 'react';
import AuthContext from '../component/authContext'

const { Sider } = Layout;

const Sidebar = () => {
    const router = useRouter()
    const { logout, toggle, collapsed } = useContext(AuthContext)
    const Swal = require('sweetalert2')

    const Logout = async () => {
        const result = await Swal.fire({
            title: 'Do you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        })
        if (result.isConfirmed) {
            const res = await callService('POST', `${serViceUrl()}allUsers/logout`, { 'token': Cookies.get('cookie') }, {})
            Cookies.remove('cookie')
            Cookies.remove('role')
            Cookies.remove('pinStatus')
            console.log(res)
            logout()
            router.push('/login')
        }
    }

    const sidebarAdmin = () => {
        return (
            <Sider trigger={null} collapsible collapsed={collapsed} className="sidebarLayout" width={250} >
                <div className="logo"><span className='sidebarFont'>{collapsed == false ? 'Administrator' : ''}</span></div>
                <div className="borT" />
                <Menu className='menuSidebar' mode="inline" defaultSelectedKeys={[router.pathname]}>
                    <Menu.Item className='subMenuSidebar' key="/home" icon={<span className="iconify svgIcon" data-icon="fa-solid:home" data-inline="false"></span>} onClick={() => {
                        router.push('/home')
                    }}>
                        <span className="textMenu">Home</span>
                    </Menu.Item>
                    {/* <Menu.Item className='subMenuSidebar' key="/leaveManagement" icon={<span className="iconify svgIcon" data-icon="clarity:tasks-solid" data-inline="false"></span>} onClick={() => {
                    router.push('/leaveManagement')
                }}>
                    <span className="textMenu">Leavemanagement</span>
                </Menu.Item> */}
                    <Menu.Item className='subMenuSidebar' key="/userManagement" icon={<span className="iconify svgIcon" data-icon="ic:baseline-manage-accounts" data-inline="false"></span>} onClick={() => {
                        router.push('/userManagement')
                    }}>
                        <span className="textMenu">Usermanagement</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="/sendLeave" icon={<span className="iconify svgIcon" data-icon="mdi:email-newsletter" data-inline="false"></span>} onClick={() => {
                        router.push('/sendLeave')
                    }}>
                        <span className="textMenu">Sendleave</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="/activity" icon={<span className="iconify svgIcon" data-icon="tabler:report" data-inline="false"></span>} onClick={() => {
                        router.push('/activity')
                    }}>
                        <span className="textMenu">Activity</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="/profile" icon={<span className="iconify svgIcon" data-icon="carbon:user-avatar-filled" data-inline="false"></span>} onClick={() => {
                        router.push('/profile')
                    }}>
                        <span className="textMenu">Profile</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="" icon={<span className="iconify svgIcon" data-icon="ls:logout" data-inline="false"></span>} onClick={() => {
                        Logout()
                    }}>
                        <span className="textMenu">Logout</span>
                    </Menu.Item>
                </Menu>
            </Sider>
        )
    }

    const sidebarHr = () => {
        return (
            <Sider trigger={null} collapsible collapsed={collapsed} className="sidebarLayout" width={250} >
                <div className="logo" ><span className='sidebarFont'>{collapsed == false ? 'HRadministrator' : ''}</span></div>
                <div className="borT" />
                <Menu className='menuSidebar' mode="inline" defaultSelectedKeys={[router.pathname]}>
                    <Menu.Item className='subMenuSidebar' key="/home" icon={<span className="iconify svgIcon" data-icon="fa-solid:home" data-inline="false"></span>} onClick={() => {
                        router.push('/home')
                    }}>
                        <span className="textMenu">Home</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="/leaveManagement" icon={<span className="iconify svgIcon" data-icon="clarity:tasks-solid" data-inline="false"></span>} onClick={() => {
                        router.push('/leaveManagement')
                    }}>
                        <span className="textMenu">Leavemanagement</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="/addOldRecord" icon={<span className="iconify svgIcon" data-icon="fluent:clipboard-task-add-24-filled" data-inline="false"></span>} onClick={() => {
                        router.push('/addOldRecord')
                    }}>
                        <span className="textMenu">Addoldleave</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="/sendLeave" icon={<span className="iconify svgIcon" data-icon="mdi:email-newsletter" data-inline="false"></span>} onClick={() => {
                        router.push('/sendLeave')
                    }}>
                        <span className="textMenu">Sendleave</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="/activity" icon={<span className="iconify svgIcon" data-icon="tabler:report" data-inline="false"></span>} onClick={() => {
                        router.push('/activity')
                    }}>
                        <span className="textMenu">Activity</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="/profile" icon={<span className="iconify svgIcon" data-icon="carbon:user-avatar-filled" data-inline="false"></span>} onClick={() => {
                        router.push('/profile')
                    }}>
                        <span className="textMenu">Profile</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="" icon={<span className="iconify svgIcon" data-icon="ls:logout" data-inline="false"></span>} onClick={() => {
                        Logout()
                    }}>
                        <span className="textMenu">Logout</span>
                    </Menu.Item>
                </Menu>
            </Sider>
        )
    }

    const sidebarSupervisor = () => {
        return (
            <Sider trigger={null} collapsible collapsed={collapsed} className="sidebarLayout" width={250} >
                <div className="logo" ><span className='sidebarFont'>{collapsed == false ? 'Supervisor' : ''}</span></div>
                <div className="borT" />
                <Menu className='menuSidebar' mode="inline" defaultSelectedKeys={[router.pathname]}>
                    <Menu.Item className='subMenuSidebar' key="/home" icon={<span className="iconify svgIcon" data-icon="fa-solid:home" data-inline="false"></span>} onClick={() => {
                        router.push('/home')
                    }}>
                        <span className="textMenu">Home</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="/leaveManagement" icon={<span className="iconify svgIcon" data-icon="clarity:tasks-solid" data-inline="false"></span>} onClick={() => {
                        router.push('/leaveManagement')
                    }}>
                        <span className="textMenu">Leavemanagement</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="/sendLeave" icon={<span className="iconify svgIcon" data-icon="mdi:email-newsletter" data-inline="false"></span>} onClick={() => {
                        router.push('/sendLeave')
                    }}>
                        <span className="textMenu">Sendleave</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="/activity" icon={<span className="iconify svgIcon" data-icon="tabler:report" data-inline="false"></span>} onClick={() => {
                        router.push('/activity')
                    }}>
                        <span className="textMenu">Activity</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="/profile" icon={<span className="iconify svgIcon" data-icon="carbon:user-avatar-filled" data-inline="false"></span>} onClick={() => {
                        router.push('/profile')
                    }}>
                        <span className="textMenu">Profile</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="" icon={<span className="iconify svgIcon" data-icon="ls:logout" data-inline="false"></span>} onClick={() => {
                        Logout()
                    }}>
                        <span className="textMenu">Logout</span>
                    </Menu.Item>
                </Menu>
            </Sider>
        )
    }

    const sidebarStaff = () => {
        return (
            <Sider trigger={null} collapsible collapsed={collapsed} className="sidebarLayout" width={250} >
                <div className="logo"><span className='sidebarFont'>{collapsed == false ? 'Staff' : ''}</span></div>
                <div className="borT" />
                <Menu className='menuSidebar' mode="inline" defaultSelectedKeys={[router.pathname]}>
                    <Menu.Item className='subMenuSidebar' key="/home" icon={<span className="iconify svgIcon" data-icon="fa-solid:home" data-inline="false"></span>} onClick={() => {
                        router.push('/home')
                    }}>
                        <span className="textMenu">Home</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="/sendLeave" icon={<span className="iconify svgIcon" data-icon="mdi:email-newsletter" data-inline="false"></span>} onClick={() => {
                        router.push('/sendLeave')
                    }}>
                        <span className="textMenu">Sendleave</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="/activity" icon={<span className="iconify svgIcon" data-icon="tabler:report" data-inline="false"></span>} onClick={() => {
                        router.push('/activity')
                    }}>
                        <span className="textMenu">Activity</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="/profile" icon={<span className="iconify svgIcon" data-icon="carbon:user-avatar-filled" data-inline="false"></span>} onClick={() => {
                        router.push('/profile')
                    }}>
                        <span className="textMenu">Profile</span>
                    </Menu.Item>
                    <Menu.Item className='subMenuSidebar' key="" icon={<span className="iconify svgIcon" data-icon="ls:logout" data-inline="false"></span>} onClick={() => {
                        Logout()
                    }}>
                        <span className="textMenu">Logout</span>
                    </Menu.Item>
                </Menu>
            </Sider>
        )
    }
    // collapse col = new collapse()
    // console.log(collapse.getCollapse)
    return (
        <>
            {Cookies.get('role') == 'Administrator' ? sidebarAdmin() : Cookies.get('role') == 'HRadministrator' ? sidebarHr() : Cookies.get('role') == 'Supervisor' ? sidebarSupervisor() : Cookies.get('role') == 'Staff' ? sidebarStaff() : ''}
        </>
    )
}

export default Sidebar;