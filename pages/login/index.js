import React from 'react'
import 'antd/dist/antd.css';
import callService from '../../pages/function/axiosCall'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { useFormik, Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, } from 'formik-antd'
import { Layout, Button, Row, Col, Image, message } from 'antd';
import serViceUrl from '../function/serViceUrl'
import { LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useContext } from 'react';
import AuthContext from '../component/authContext'

const { Content } = Layout;

export default function index() {

    const router = useRouter()
    const { login } = useContext(AuthContext)
    const initialValueLogin = {
        email: '',
        password: ''
    }

    const loginSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('* email is required'),
        password: Yup.string().required('* password is required')
    });

    return (
        <Content >
            <Row className='page' >
                <Col className="loginLeft" span={12}>
                    <Image className='logoSize' src="/sinwattana-crowdfunding-logo.png" alt="Logo" />
                    <h1 className="systemName">On leave System
                        for Sinwattana
                        Crowdfunding</h1>
                </Col>
                <Col className="loginRight" span={12}>
                    <Formik
                        enableReinitialize
                        initialValues={initialValueLogin}
                        validationSchema={loginSchema}
                        onSubmit={async (values) => {
                            console.log(values);
                            // console.log(values);
                            const res = await callService('POST', `${serViceUrl()}allUsers/login`, {
                                email: values.email,
                                password: values.password,
                            })
                            console.log(res)
                            if (res.data.message == "Login Success") {
                                message.success('Login success!!');
                                Cookies.set('token', res.data.token, { expires: 7 });
                                Cookies.set('pinStatus', res.data.pinStatus, { expires: 7 });
                                Cookies.set('role', res.data.role, { expires: 7 });
                                login(Cookies.get('cookie'))
                                if (Cookies.get('pinStatus') == "False") {
                                    router.push('/setPin')
                                }
                                else {
                                    router.push('/home')
                                }
                            }
                            else {
                                message.error('User or password is wrong');
                            }
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form >
                                <h1 className='loginText center'>Login</h1>

                                <Input
                                    className='inputForm fontConcert'
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

                                <Input.Password
                                    className='inputForm fontConcert'
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

                                <Button type="primary" htmlType="submit" className="login-form-button loginBtn" style={{ background: 'rgba(0, 161, 155, 0.8)', borderColor: 'rgba(0, 161, 155, 0.8)' }} block>
                                    Log in
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Content >
    )
}
