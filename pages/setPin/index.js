import React from 'react'
import 'antd/dist/antd.css';
import callService from '../function/axiosCall'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { useFormik, Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, } from 'formik-antd'
import { Layout, Button, Row, Col, Image, message } from 'antd';
import serViceUrl from '../function/serViceUrl'
import { useState, useEffect } from 'react';
import { LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const { Content } = Layout;

export default function index() {

    const router = useRouter()
    const token = Cookies.get('token')
    const initialValueSetPin = {
        pin: '',
        confirm: ''
    }

    useEffect(async () => {
        if (token) {
        }
        else {
            router.push('/login')
        }

    }, [])

    const setPinSchema = Yup.object().shape({
        pin: Yup.string().length(6, '* Must be exactly 6 digits').required('* Pin is required'),
        confirm: Yup.string().oneOf([Yup.ref('pin'), null], 'Pin must match').required('* Confirm pin is required'),
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
                        initialValues={initialValueSetPin}
                        validationSchema={setPinSchema}
                        onSubmit={async (values) => {
                            console.log(values);


                            // console.log(values);
                            const res = await callService('POST', `${serViceUrl()}allUsers/setPin`, {
                                pin: values.pin,
                                token: token,
                            })

                            Cookies.set('pinStatus', "True", { expires: 7, path: '' });
                            console.log(Cookies.get('pinStatus'))
                            router.push('/home')
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form >
                                <h1 className='loginText center'>Setpin</h1>

                                <Input.Password
                                    className='inputForm fontConcert'
                                    name="pin"
                                    type="password"
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    prefix={<LockOutlined className="site-form-item-icon"
                                        style={{ fontSize: '16px', color: '#c1c1c1' }} />}
                                    placeholder="Pin"
                                    autoComplete="on"
                                />
                                {touched.pin && errors.pin ? (
                                    <div className="errorMsg">{errors.pin}</div>
                                ) : null}

                                <Input.Password
                                    className='inputForm fontConcert'
                                    name="confirm"
                                    type="password"
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    prefix={<LockOutlined className="site-form-item-icon"
                                        style={{ fontSize: '16px', color: '#c1c1c1' }} />}
                                    type="password"
                                    placeholder="Confirm pin"
                                    autoComplete="on"
                                />
                                {touched.confirm && errors.confirm ? (
                                    <div className="errorMsg">{errors.confirm}</div>
                                ) : null}

                                <Button type="primary" htmlType="submit" className="login-form-button loginBtn" style={{ background: 'rgba(0, 161, 155, 0.8)', borderColor: 'rgba(0, 161, 155, 0.8)' }} block>
                                    Save
                                </Button>
                            </Form>
                        )}

                    </Formik>
                </Col>
            </Row>
        </Content>
    )
}
