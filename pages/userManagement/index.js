import React from 'react'
import 'antd/dist/antd.css';
import callService from '../function/axiosCall'
import Cookies from 'js-cookie'
import { useFormik, Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, InputNumber, Checkbox, DatePicker, Select } from 'formik-antd'
import { Layout, Button, Row, Col, message, Modal, Menu, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import {
    LockOutlined, MailOutlined, IdcardOutlined,
    UserOutlined, PhoneOutlined, EyeInvisibleOutlined,
    EyeTwoTone
} from '@ant-design/icons';
import serViceUrl from '../function/serViceUrl'
import Iconify from '@iconify/iconify';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const { Header, Sider, Content } = Layout;


export default function index() {
    const Swal = require('sweetalert2')

    const phone = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const [isModalAddUserVisible, setisModalAddUserVisible] = useState(false);
    const [isModalEditUserVisible, setisModalEditUserVisible] = useState(false);
    const [listDepartment, setDepartment] = useState([]);
    const [listPosition, setPosition] = useState([]);
    const [list, setList] = useState([{}]);
    const [collapsed, toggleCollapsed] = useState(false);
    const [datatable, setDatatable] = useState([{}]);

    const [loading, setLoading] = useState(true);
    const [editUserId, setEditUserId] = useState('');

    const [statusReload, setStatusReload] = useState(false);

    const columns = [
        {
            name: 'รหัสประจำตัว',
            selector: 'staffId',
            sortable: true,
            wrap: true
        },
        {
            name: 'ชื่อ-สกุล',
            selector: 'name',
            sortable: true,
            wrap: true

        },
        {
            name: 'ฝ่าย',
            selector: 'department',
            sortable: true,
            wrap: true

        },
        {
            name: 'ตำแหน่ง',
            selector: 'position',
            sortable: true,
            wrap: true
        },
        {
            name: 'หมายเลขติดต่อ',
            selector: 'phone',
            wrap: true
        },
        {
            key: "action",
            text: "Action",
            className: "action",
            width: '100px',
            sortable: false,
            cell: (record) => {
                return (
                    <div>
                        <a onClick={() => {
                            // console.log(record)
                            editUser(record)
                            // console.log(initialValueEditUser)
                            showModalEditUser()

                        }}><span className="iconify" data-icon="akar-icons:edit" data-inline="false" style={{ color: '#FF7A00', marginRight: '10px' }} data-width="24" data-height="24"></span></a >
                        <a onClick={() => { deleteUser(record) }}><span className="iconify" data-icon="fluent:delete-20-filled" data-inline="false" style={{ color: '#D80A0A' }} data-width="24" data-height="24"></span></a >
                    </div >
                );
            },
        },
    ];

    const table = {
        columns: columns,
        data: list

    };

    useEffect(async () => {
        const res = await callService('GET', `${serViceUrl()}admin/lookup`)
        // console.log(res.data)
        setDepartment(res.data.Department)
        setPosition(res.data.Position)
        const resData = await callService('GET', `${serViceUrl()}admin/getAllUserProfile`)

        console.log(resData.data.message)
        setList(resData.data.message)
        setLoading(false)

    }, [statusReload])

    const showModalAddUser = () => {
        setisModalAddUserVisible(true);
    };

    const handleAddUserOk = () => {
        setisModalAddUserVisible(false);
    };

    const handleAddUserCancel = () => {
        setisModalAddUserVisible(false);
    };

    const showModalEditUser = () => {
        setisModalEditUserVisible(true);
    };

    const handleEditUserOk = () => {
        setisModalEditUserVisible(false);
    };

    const handleEditUserCancel = () => {
        setisModalEditUserVisible(false);
    };

    const deleteUser = async (user) => {
        console.log(user)
        const result = await Swal.fire({
            title: 'Do you want to delete?',
            text: `Name : ${user.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })
        if (result.isConfirmed) {
            const res = await callService('POST', `${serViceUrl()}admin/deleteUser`, {
                token: Cookies.get('cookie'),
                userId: user.userId.toString()
            })
            console.log(res)
            if (res.data.message == "Delete Success") {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'User has been deleted.',
                    icon: 'success',
                    timer: 1000
                })
                setStatusReload(!statusReload)
            }
            else {
                Swal.fire({
                    title: res.data.message,
                    icon: 'error',
                    timer: 1000
                })
            }
        }
    }

    const initialValueAddUser = {
        firstName: '',
        lastName: '',
        email: '',
        staffId: '',
        phone: '',
        password: '',
        confirm: '',
        position: '',
        department: '',
        startingDate: ''
    }

    const editUser = (val) => {
        console.log(val)
        setEditUserId(val.userId)
        setDatatable({
            number: val.number,
            staffId: val.staffId,
            name: val.name,
            firstName: val.firstName,
            lastName: val.lastName,
            department: val.department,
            position: val.position,
            phone: val.phone
        })
        // console.log(val)
    }

    const initialValueEditUser = {
        firstName: datatable.firstName,
        lastName: datatable.lastName,
        // email: '',
        staffId: datatable.staffId,
        phone: datatable.phone,
        department: datatable.department,
        position: datatable.position,
    }

    const editUserSchema = Yup.object().shape({
        firstName: Yup.string().required('* firstname is required'),
        lastName: Yup.string().required('* Lastname is required'),
        // email: Yup.string().email('Invalid email').required('* Email is required'),
        staffId: Yup.string().required('* StaffId is required'),
        phone: Yup.string().length(10, '* Must be exactly 10 digits').matches(phone, 'Phone number is not valid').required('* Phone number is required'),
        department: Yup.string().required('* Department is required'),
        position: Yup.string().required('* Position is required'),
    });

    const addUserSchema = Yup.object().shape({
        firstName: Yup.string().required('* firstname is required'),
        lastName: Yup.string().required('* Lastname is required'),
        email: Yup.string().email('Invalid email').required('* Email is required'),
        staffId: Yup.string().required('* StaffId is required'),
        phone: Yup.string().length(10, '* Must be exactly 10 digits').matches(phone, 'Phone number is not valid').required('* Phone number is required'),
        password: Yup.string().matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        ).min(8, '* Must be more than 8 character').required('* Password is required'),
        confirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').min(8, '* Must be more than 8 character').required('* Confirm password is required'),
        position: Yup.string().required('* Position is required'),
        department: Yup.string().required('* Department is required'),
        startingDate: Yup.date().required('* StartingDate is required')
    });

    return (

        <Content
            className="sectionLayout"
        >
            <Skeleton loading={loading} active>
                <Button className='btnAdd' type="primary" onClick={showModalAddUser}><span className="iconify iconAdd" data-icon="ant-design:plus-circle-filled" data-inline="false"></span>Add User</Button>
                {/* <span>{JSON.stringify(list)}</span> */}
                <DataTableExtensions
                    {...table}
                >
                    <DataTable
                        className='dataTables_wrapper'
                        pagination
                        responsive
                        sortIcon={<span className="iconify" data-icon="akar-icons:arrow-up-down" data-inline="false"></span>}
                        noHeader
                        persistTableHead
                    // Selected={handleChange}
                    />
                </DataTableExtensions>
            </Skeleton>
            <Modal
                id="modalAddUser"
                className="fontConcert"
                style={{ fontSize: 30 }}
                bodyStyle={{ background: 'rgba(0, 161, 155, 0.2)' }}
                centered
                title="Create User"
                visible={isModalAddUserVisible}
                onOk={handleAddUserOk}
                onCancel={handleAddUserCancel}
                footer={null}>

                <Formik
                    initialValues={initialValueAddUser}
                    validationSchema={addUserSchema}
                    onSubmit={async (values, { resetForm }) => {
                        // console.log(Cookies.get('cookie'));
                        // values.startingDate = values.startingDate.toString()
                        const res = await callService('POST', `${serViceUrl()}admin/createUser`, {
                            firstName: values.firstName,
                            lastName: values.lastName,
                            email: values.email,
                            password: values.password,
                            staffId: values.staffId,
                            phone: values.phone,
                            position: values.position,
                            department: values.department,
                            startingDate: values.startingDate,
                            token: Cookies.get('cookie')
                        }, {})
                        if (res.data.message == "Add User Success") {
                            await Swal.fire({
                                icon: 'success',
                                title: 'Add User Success',
                                timer: 1500
                            })
                            resetForm();
                            setStatusReload(!statusReload)
                            console.log(statusReload);
                            handleAddUserCancel()
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: res.data.message,
                                timer: 1500
                            })
                        }
                        // console.log(res.data.message);
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Input
                                className='inputForm'
                                id="firstName"
                                name="firstName"
                                type="text"
                                prefix={<UserOutlined className="site-form-item-icon"
                                    style={{ fontSize: '16px', color: '#c1c1c1' }} />}
                                placeholder="Firstname"
                            />
                            {touched.firstName && errors.firstName ? (
                                <div className="errorMsg">{errors.firstName}</div>
                            ) : null}

                            <Input
                                className='inputForm'
                                id="lastName"
                                name="lastName"
                                type="text"
                                prefix={<UserOutlined className="site-form-item-icon"
                                    style={{ fontSize: '16px', color: '#c1c1c1' }} />}
                                placeholder="Lastname"
                            />
                            {touched.lastName && errors.lastName ? (
                                <div className="errorMsg">{errors.lastName}</div>
                            ) : null}

                            <Input
                                className='inputForm'
                                id="email"
                                name="email"
                                type="email"
                                prefix={<MailOutlined className="site-form-item-icon"
                                    style={{ fontSize: '16px', color: '#c1c1c1' }} />}
                                placeholder="Email"
                            />
                            {touched.email && errors.email ? (
                                <div className="errorMsg">{errors.email}</div>
                            ) : null}

                            <Input
                                className='inputForm'
                                id="staffId"
                                name="staffId"
                                type="text"
                                prefix={<IdcardOutlined className="site-form-item-icon"
                                    style={{ fontSize: '16px', color: '#c1c1c1' }} />}
                                placeholder="Staff id"
                            />
                            {touched.staffId && errors.staffId ? (
                                <div className="errorMsg">{errors.staffId}</div>
                            ) : null}

                            <Input
                                className='inputForm'
                                id="phone"
                                name="phone"
                                type="text"
                                prefix={<PhoneOutlined className="site-form-item-icon"
                                    style={{ fontSize: '16px', color: '#c1c1c1', transform: 'rotate(90deg)' }} />}
                                placeholder="Phonenumber"
                            />
                            {touched.phone && errors.phone ? (
                                <div className="errorMsg">{errors.phone}</div>
                            ) : null}
                            <Input.Password
                                className='inputForm'
                                id="password"
                                name="password"
                                type="password"
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                prefix={<LockOutlined className="site-form-item-icon"
                                    style={{ fontSize: '16px', color: '#c1c1c1' }} />}
                                placeholder="Password"
                                autoComplete="on"
                            />
                            {touched.password && errors.password ? (
                                <div className="errorMsg">{errors.password}</div>
                            ) : null}

                            <Input.Password
                                className='inputForm'
                                id="confirm"
                                name="confirm"
                                type="password"
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                prefix={<LockOutlined className="site-form-item-icon"
                                    style={{ fontSize: '16px', color: '#c1c1c1' }} />}
                                placeholder="Confirm Password"
                                autoComplete="on"
                            />
                            {touched.confirm && errors.confirm ? (
                                <div className="errorMsg">{errors.confirm}</div>
                            ) : null}

                            <Select
                                showSearch
                                className='inputForm'
                                id="department"
                                name="department"
                                style={{ fontSize: '16px', marginTop: '15px' }}
                                placeholder="Select department">
                                {listDepartment.map(value => <Select.Option key={value} value={value}>{value}</Select.Option>)}
                            </Select>
                            {touched.department && errors.department ? (
                                <div className="errorMsg">{errors.department}</div>
                            ) : null}

                            <Select
                                showSearch
                                className='inputForm'
                                id="position"
                                name="position"
                                style={{ fontSize: '16px', marginTop: '15px' }}
                                placeholder="Select position">
                                {listPosition.map(value => <Select.Option key={value} value={value}>{value}</Select.Option>)}
                            </Select>
                            {touched.position && errors.position ? (
                                <div className="errorMsg">{errors.position}</div>
                            ) : null}

                            <DatePicker
                                className='inputForm'
                                id="startingDate"
                                name="startingDate"
                                format="YYYY-MM-DD"
                                style={{ fontSize: '16px', marginTop: '15px' }}
                                placeholder="Select Starting date" />

                            {touched.startingDate && errors.startingDate ? (
                                <div className="errorMsg">{errors.startingDate}</div>
                            ) : null}

                            <Button type="primary" htmlType="submit" className="login-form-button loginBtn" style={{ background: 'rgba(0, 161, 155, 0.8)', borderColor: 'rgba(0, 161, 155, 0.8)' }} block>
                                Create User
                            </Button>

                        </Form>
                    )}


                </Formik>
            </Modal >


            <Modal
                id="modalEditUser"
                className="fontConcert"
                style={{ fontSize: 30 }}
                bodyStyle={{ background: 'rgba(0, 161, 155, 0.2)' }}
                centered
                title="Edit User"
                visible={isModalEditUserVisible}
                onOk={handleEditUserOk}
                onCancel={handleEditUserCancel}
                footer={null}>
                <Formik
                    enableReinitialize
                    initialValues={initialValueEditUser}
                    validationSchema={editUserSchema}
                    onSubmit={async (values, { resetForm }) => {
                        const result = await Swal.fire({
                            title: 'Do you want to Edit?',
                            text: `Name : ${values.firstName + ' ' + values.lastName}`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes'
                        })
                        if (result.isConfirmed) {
                            const res = await callService('POST', `${serViceUrl()}admin/editUser`, {
                                userId: editUserId.toString(),
                                firstName: values.firstName,
                                lastName: values.lastName,
                                staffId: values.staffId,
                                phone: values.phone,
                                position: values.position,
                                department: values.department,
                                // token: Cookies.get('cookie')
                            }, {})
                            if (res.data.message == "Edit profile Success") {
                                Swal.fire({
                                    title: 'Edited!',
                                    text: 'User has been edited.',
                                    icon: 'success',
                                    timer: 1000
                                })
                                setStatusReload(!statusReload)
                                handleEditUserCancel()
                                resetForm()
                            }
                            else {
                                Swal.fire({
                                    title: res.data.message,
                                    icon: 'error',
                                    timer: 1000
                                })
                            }
                        }
                        // console.log(editUserId.toString());

                    }}
                >
                    {({ errors, touched }) => (
                        <Form >
                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >Firstname</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input
                                        className='inputForm'
                                        id="firstNameEdit"
                                        name="firstName"
                                        // value={values.firstName}
                                        type="text"
                                        placeholder="Firstname"
                                    />
                                    {touched.firstName && errors.firstName ? (
                                        <div className="errorMsg">{errors.firstName}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label  >Lastname</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input
                                        className='inputForm'
                                        id="lastNameEdit"
                                        name="lastName"
                                        type="text"
                                        placeholder="Lastname"
                                    />
                                    {touched.lastName && errors.lastName ? (
                                        <div className="errorMsg">{errors.lastName}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label  >Staffid</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input
                                        className='inputForm'
                                        id="staffIdEdit"
                                        name="staffId"
                                        type="text"
                                        placeholder="Staff id"
                                    />
                                    {touched.staffId && errors.staffId ? (
                                        <div className="errorMsg">{errors.staffId}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label  >Phonenumber</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input
                                        className='inputForm'
                                        id="phoneEdit"
                                        name="phone"
                                        type="text"
                                        placeholder="Phonenumber"
                                    />
                                    {touched.phone && errors.phone ? (
                                        <div className="errorMsg">{errors.phone}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label  >Position</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Select
                                        showSearch
                                        className='inputForm'
                                        id="departmentEdit"
                                        name="department"
                                        placeholder="Select department">
                                        {listDepartment.map(value => <Select.Option key={value} value={value}>{value}</Select.Option>)}
                                    </Select>
                                    {touched.department && errors.department ? (
                                        <div className="errorMsg">{errors.department}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >Department</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Select
                                        showSearch
                                        className='inputForm'
                                        id="positionEdit"
                                        name="position"
                                        placeholder="Select position">
                                        {listPosition.map(value => <Select.Option key={value} value={value}>{value}</Select.Option>)}
                                    </Select>
                                    {touched.position && errors.position ? (
                                        <div className="errorMsg">{errors.position}</div>
                                    ) : null}
                                </div>
                            </div>
                            <Button type="primary" htmlType="submit" className="login-form-button loginBtn" style={{ background: 'rgba(0, 161, 155, 0.8)', borderColor: 'rgba(0, 161, 155, 0.8)' }} block>
                                Save
                            </Button>
                        </Form>
                    )}


                </Formik>

            </Modal >
        </Content>

    )
}
