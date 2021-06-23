import React from 'react'
import 'antd/dist/antd.css';
import callService from '../function/axiosCall'
import Cookies from 'js-cookie'
import * as Yup from 'yup';
import { Form, Input, InputNumber, Checkbox, DatePicker, Select, Radio } from 'formik-antd'
import { Layout, Button, Row, Col, message, Modal, Menu, Skeleton, Steps } from 'antd';
import { useState, useEffect } from 'react';
import { useFormik, Formik } from 'formik';
import { useRouter } from 'next/router'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Iconify from '@iconify/iconify';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import serViceUrl from '../function/serViceUrl'

const { Content } = Layout;

export default function index() {

    const [loading, setLoading] = useState(true);
    const [isEditPasswordModalVisible, setIsModalEditPasswordVisible] = useState(false);
    const [isEditPinModalVisible, setIsModalEditPinVisible] = useState(false);
    const [userData, setUserData] = useState({});
    const [userProfile, setUserProfile] = useState([{}]);
    const [statusReload, setStatusReload] = useState(false);
    const [onEdit, setOnEdit] = useState(false);

    useEffect(async () => {
        const res = await callService('POST', `${serViceUrl()}allUsers/getProfile`, { token: Cookies.get('cookie') })
        console.log(res.data.message)
        setUserData(res.data.message)
        setLoading(false)
    }, [statusReload])

    const initialValueUserDetail = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        staffId: userData.staffId,
        position: userData.position,
        department: userData.department,
        location: userData.location,
        phone: userData.phone,
        location: "Sinwattana CrowdFunding"

    }

    const editUserSchema = Yup.object().shape({
    });


    const initialValueChangePassword = {
        oldPassword: '',
        newPassword: '',
        confirm: ''

    }

    const initialValueChangePin = {
        oldPin: '',
        newPin: '',
        confirm: ''

    }

    const changePasswordSchema = Yup.object().shape({
        oldPassword: Yup.string().required('* old password is required'),
        newPassword: Yup.string().matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        ).min(8, '* Must be more than 8 character').required('* Password is required'),
        confirm: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match').min(8, '* Must be more than 8 character').required('* Confirm password is required')
    });

    const changePinSchema = Yup.object().shape({
        oldPin: Yup.string().required('* old password is required'),
        newPin: Yup.string().length(6, '* Must be exactly 6 digits').required('* Pin is required'),
        confirm: Yup.string().oneOf([Yup.ref('newPin'), null], 'Pin must match').required('* Confirm pin is required'),
    });

    const showModalEditPin = () => {
        setIsModalEditPinVisible(true);
    };

    const editPinHandleOk = () => {
        setIsModalEditPinVisible(false);
    };

    const editPinHandleCancel = () => {
        setIsModalEditPinVisible(false);
    };

    const showModalEditPassword = () => {
        setIsModalEditPasswordVisible(true);
    };

    const editPasswordHandleOk = () => {
        setIsModalEditPasswordVisible(false);
    };

    const editPasswordHandleCancel = () => {
        setIsModalEditPasswordVisible(false);
    };

    const cancleEdit = () => {
        setOnEdit(!onEdit)

    }

    return (
        <Content className="sectionLayout">
            <Skeleton loading={loading} active>
                <Formik
                    enableReinitialize
                    initialValues={initialValueUserDetail}
                    validationSchema={editUserSchema}
                    onSubmit={async (values) => {
                        console.log(values);
                        const resData = await callService('POST', `${serViceUrl()}allUsers/editProfile`,
                            {
                                firstName: values.firstName,
                                lastName: values.lastName,
                                phone: values.phone,
                                token: Cookies.get('cookie')
                            })
                        console.log(resData.data.message);
                        if (resData.data.message == 'Edit profile success') {
                            await Swal.fire({
                                icon: 'success',
                                title: resData.data.message,
                                timer: 1500
                            })
                            setStatusReload(!statusReload)
                            cancleEdit()
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: resData.data.message,
                                timer: 1500
                            })
                        }
                    }}
                >
                    {({ errors, touched }) => (
                        <Form >
                            <Row>
                                <Col span={10} offset={7} >
                                    <div className='imgCenter'>
                                        <span className="iconify" data-icon="carbon:user-avatar-filled-alt" data-inline="false" data-width="120" data-height="120"></span>
                                    </div>

                                    <Row>
                                        <Col span={3} offset={21}>
                                            <a onClick={cancleEdit}><span className="iconify" data-icon="akar-icons:edit" data-inline="false" data-width="25" data-height="25"></span>Edit</a>
                                        </Col>
                                    </Row>
                                    <br />

                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label >Email</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <Input
                                                className='longInputBox  colorDetails box'
                                                name="email"
                                                type="text"
                                                disabled>
                                            </Input>
                                            {touched.email && errors.email ? (
                                                <div className="errorMsg">{errors.email}</div>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label >Staffid</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <Input
                                                className='longInputBox  colorDetails box'
                                                name="staffId"
                                                type="text"
                                                disabled>
                                            </Input>
                                            {touched.staffId && errors.staffId ? (
                                                <div className="errorMsg">{errors.staffId}</div>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label >Firstname</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <Input
                                                className='longInputBox  colorDetails box'
                                                name="firstName"
                                                type="text"
                                                disabled={onEdit == true ? false : true}>
                                            </Input>
                                        </div>
                                        {touched.firstName && errors.firstName ? (
                                            <div className="errorMsg">{errors.firstName}</div>
                                        ) : null}
                                    </div>
                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label >Lastname</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <Input
                                                className='longInputBox  colorDetails box'
                                                name="lastName"
                                                type="text"
                                                disabled={onEdit == true ? false : true}>
                                            </Input>
                                        </div>
                                        {touched.lastName && errors.lastName ? (
                                            <div className="errorMsg">{errors.lastName}</div>
                                        ) : null}
                                    </div>

                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label >Phonenumber</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <Input
                                                className='longInputBox  colorDetails box'
                                                name="phone"
                                                type="text"
                                                disabled={onEdit == true ? false : true}>
                                            </Input>
                                            {touched.phone && errors.phone ? (
                                                <div className="errorMsg">{errors.phone}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label >Position</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <Input
                                                className='longInputBox  colorDetails box'
                                                name="position"
                                                type="text"
                                                disabled>
                                            </Input>
                                            {touched.position && errors.position ? (
                                                <div className="errorMsg">{errors.position}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label >Department</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <Input
                                                className='longInputBox  colorDetails box'
                                                name="department"
                                                type="text"
                                                disabled>
                                            </Input>
                                            {touched.department && errors.department ? (
                                                <div className="errorMsg">{errors.department}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label >Location</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <Input
                                                className='longInputBox  colorDetails box'
                                                name="location"
                                                type="text"
                                                disabled>
                                            </Input>
                                            {touched.location && errors.location ? (
                                                <div className="errorMsg">{errors.location}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                    {/* <div className='ant-row ant-form-item formCustom row0' >
                                    <div className="ant-col ant-form-item-label">
                                        <label >Address</label>
                                    </div>
                                    <div className="ant-col ant-form-item-control">
                                        <Input
                                            className='inputBox colorDetails box'
                                            name="location"
                                            type="text"
                                            disabled>
                                        </Input>
                                        {touched.location && errors.location ? (
                                            <div className="errorMsg">{errors.location}</div>
                                        ) : null}
                                    </div>
                                </div> */}
                                    {onEdit == false ? <Row>
                                        <Col span={6} offset={18}>
                                            <a onClick={showModalEditPassword}>Change password</a>
                                        </Col>
                                        <Col span={6} offset={18}>
                                            <a onClick={showModalEditPin}>Change pin</a>
                                        </Col>
                                    </Row> :
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Button htmlType="submit" type="primary">Save</Button>
                                            </Col>
                                            <Col span={12}>
                                                <Button danger type="primary" onClick={cancleEdit}>cancel</Button>
                                            </Col>
                                        </Row>
                                    }
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
            </Skeleton>

            <Modal
                title="Change Password"
                className="fontConcert"
                visible={isEditPasswordModalVisible}
                onOk={editPasswordHandleOk}
                onCancel={editPasswordHandleCancel}
                centered
                footer={null}
            >
                <Formik
                    initialValues={initialValueChangePassword}
                    validationSchema={changePasswordSchema}
                    onSubmit={async (values, { resetForm }) => {
                        console.log(values)
                        const res = await callService('POST', `${serViceUrl()}allUsers/changePassword`,
                            {
                                oldPassword: values.oldPassword,
                                newPassword: values.newPassword,
                                token: Cookies.get('cookie')
                            }
                        )
                        console.log(res)
                        if (res.data.message == "Successful password change") {
                            await Swal.fire({
                                icon: 'success',
                                title: res.data.message,
                                timer: 1500
                            })
                            resetForm();
                            editPasswordHandleCancel()
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: res.data.message,
                                timer: 1500
                            })
                        }
                    }}
                >

                    {({ errors, touched }) => (
                        <Form>
                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >Old Password</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input.Password
                                        className='longInputBox  colorDetails'
                                        name="oldPassword"
                                        type="password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        autoComplete="on"
                                    >
                                    </Input.Password>
                                    {touched.oldPassword && errors.oldPassword ? (
                                        <div className="errorMsg">{errors.oldPassword}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >New Password</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input.Password
                                        className='longInputBox  colorDetails'
                                        name="newPassword"
                                        type="password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        autoComplete="on"
                                    >
                                    </Input.Password>
                                    {touched.newPassword && errors.newPassword ? (
                                        <div className="errorMsg">{errors.newPassword}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >Confirm Password</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input.Password
                                        className='longInputBox  colorDetails'
                                        name="confirm"
                                        type="password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        autoComplete="on"
                                    >
                                    </Input.Password>
                                    {touched.confirm && errors.confirm ? (
                                        <div className="errorMsg">{errors.confirm}</div>
                                    ) : null}
                                </div>
                            </div>
                            <Button type="primary" htmlType="submit" className="login-form-button loginBtn" style={{ background: 'rgba(0, 161, 155, 0.8)', borderColor: 'rgba(0, 161, 155, 0.8)' }} block>
                                Save
                            </Button>
                        </Form>

                    )}
                </Formik>
            </Modal>
            <Modal
                title="Change Pin"
                className="fontConcert"
                visible={isEditPinModalVisible}
                onOk={editPinHandleOk}
                onCancel={editPinHandleCancel}
                centered
                footer={null}
            >
                <Formik
                    initialValues={initialValueChangePin}
                    validationSchema={changePinSchema}
                    onSubmit={async (values, { resetForm }) => {
                        console.log(values)
                        const res = await callService('POST', `${serViceUrl()}allUsers/changePin`,
                            {
                                oldPin: values.oldPin,
                                newPin: values.newPin,
                                token: Cookies.get('cookie')
                            }
                        )
                        console.log(res)
                        if (res.data.message == "Successful pin change") {
                            await Swal.fire({
                                icon: 'success',
                                title: res.data.message,
                                timer: 1500
                            })
                            resetForm();
                            editPinHandleCancel()
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: res.data.message,
                                timer: 1500
                            })
                        }
                    }}
                >

                    {({ errors, touched }) => (
                        <Form>
                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >Old Pin</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input.Password
                                        className='longInputBox  colorDetails'
                                        name="oldPin"
                                        type="password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        autoComplete="on"
                                    >
                                    </Input.Password>
                                    {touched.oldPin && errors.oldPin ? (
                                        <div className="errorMsg">{errors.oldPin}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >New Pin</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input.Password
                                        className='longInputBox  colorDetails'
                                        name="newPin"
                                        type="password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        autoComplete="on"
                                    >
                                    </Input.Password>
                                    {touched.newPin && errors.newPin ? (
                                        <div className="errorMsg">{errors.newPin}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >Confirm Pin</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input.Password
                                        className='longInputBox  colorDetails'
                                        name="confirm"
                                        type="password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        autoComplete="on"
                                    >
                                    </Input.Password>
                                    {touched.confirm && errors.confirm ? (
                                        <div className="errorMsg">{errors.confirm}</div>
                                    ) : null}
                                </div>
                            </div>
                            <Button type="primary" htmlType="submit" className="login-form-button loginBtn" style={{ background: 'rgba(0, 161, 155, 0.8)', borderColor: 'rgba(0, 161, 155, 0.8)' }} block>
                                Save
                            </Button>
                        </Form>

                    )}
                </Formik>
            </Modal>
        </Content>
    )
}
