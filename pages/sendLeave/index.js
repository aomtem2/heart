import React from 'react'
import 'antd/dist/antd.css';
import callService from '../function/axiosCall'
import Cookies from 'js-cookie'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, DatePicker, Radio } from 'formik-antd'
import { Layout, Button, Row, Col, Card, Skeleton } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import moment from 'moment';
import serViceUrl from '../function/serViceUrl'
import Iconify from '@iconify/iconify';
import AuthContext from '../component/authContext'

const { Content } = Layout;

export default function index() {

    const phone = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const router = useRouter()
    const token = Cookies.get('token')
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [optionStart, setOptionStart] = useState();
    const [optionEnd, setOptionEnd] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [startDateText, setStartDateText] = useState();
    const [typeLeave, setTypeLeave] = useState();
    const [endDateText, setEndDateText] = useState();
    const [date, setDate] = useState([{}]);


    useEffect(async () => {
        if (token) {
            const res = await callService('POST', `${serViceUrl()}allUsers/getUserProfile`,
                { token: token }
            )
            console.log(res)
            setUser(res.data.message)
            setLoading(false)
        }
        else {
            router.push('/login')
        }
    }, [])

    const setTotal = () => {
        var start = new Date(startDateText)
        var end = new Date(endDateText)
        var total
        var day
        console.log('start ' + start.getDate() + ' end ' + end.getDate())
        if (start.toDateString() == end.toDateString()) {
            if (optionStart == "ครึ่งเช้า" && optionEnd == "ครึ่งเช้า") {
                total = '0.5'
                setDate({
                    typeLeave: typeLeave,
                    startDate: startDateText,
                    endDate: endDateText,
                    startTime: '09:00',
                    endTime: '13:00',
                    startOption: optionStart,
                    endOption: optionEnd,
                    total: total
                })
            }


            else if (optionStart == "ครึ่งบ่าย" && optionEnd == "ครึ่งบ่าย") {
                total = '0.5'
                setDate({
                    typeLeave: typeLeave,
                    startDate: startDateText,
                    endDate: endDateText,
                    startTime: '14:00',
                    endTime: '18:00',
                    startOption: optionStart,
                    endOption: optionEnd,
                    total: total
                })
            }

            else if (optionStart == "ครึ่งเช้า" && optionEnd == "ครึ่งบ่าย") {
                total = '1'
                console.log('q')
                setDate({
                    typeLeave: typeLeave,
                    startDate: startDateText,
                    endDate: endDateText,
                    startTime: '09:00',
                    endTime: '18:00',
                    startOption: optionStart,
                    endOption: optionEnd,
                    total: total
                })
            }
        } else {
            if (optionStart == "ครึ่งเช้า" && optionEnd == "ครึ่งเช้า") {
                day = ((end.getTime() - start.getTime()) / 8.64e+7) + 0.5
                setDate({
                    typeLeave: typeLeave,
                    startDate: startDateText,
                    endDate: endDateText,
                    startTime: '09:00',
                    endTime: '13:00',
                    startOption: optionStart,
                    endOption: optionEnd,
                    total: day
                })
            }
            else if (optionStart == "ครึ่งเช้า" && optionEnd == "ครึ่งบ่าย") {
                day = ((end.getTime() - start.getTime()) / 8.64e+7) + 1
                setDate({
                    typeLeave: typeLeave,
                    startDate: startDateText,
                    endDate: endDateText,
                    startTime: '09:00',
                    endTime: '18:00',
                    startOption: optionStart,
                    endOption: optionEnd,
                    total: day
                })
            }

            else if (optionStart == "ครึ่งบ่าย" && optionEnd == "ครึ่งเช้า") {
                day = ((end.getTime() - start.getTime()) / 8.64e+7)
                setDate({
                    typeLeave: typeLeave,
                    startDate: startDateText,
                    endDate: endDateText,
                    startTime: '18:00',
                    endTime: '13:00',
                    startOption: optionStart,
                    endOption: optionEnd,
                    total: day
                })
            }

            else if (optionStart == "ครึ่งบ่าย" && optionEnd == "ครึ่งบ่าย") {
                day = ((end.getTime() - start.getTime()) / 8.64e+7) + 0.5
                setDate({
                    typeLeave: typeLeave,
                    startDate: startDateText,
                    endDate: endDateText,
                    startTime: '14:00',
                    endTime: '18:00',
                    startOption: optionStart,
                    endOption: optionEnd,
                    total: day
                })
            }
        }

    }


    const initialValueAddLeave = {
        name: user.name,
        staffId: user.staffId,
        position: user.position,
        department: user.department,
        location: 'สินวัฒนา คราวด์ฟันดิง',
        phone: user.phone,
        typeLeave: date.typeLeave,
        startDate: date.startDate,
        endDate: date.endDate,
        startTime: date.startTime,
        endTime: date.endTime,
        startOption: date.startOption,
        endOption: date.endOption,
        total: date.total,
        reason: '',
        status: "รอการอนุมัติ",
        pin: ''
    }

    const addLeaveSchema = Yup.object().shape({
        // name: Yup.string().required('* Name is required'),
        // staffId: Yup.string().required('* StaffId is required'),
        // position: Yup.string().required('* Position is required'),
        // department: Yup.string().required('* Department is required'),
        // location: Yup.string().required('* Location is required'),
        // phone: Yup.string().length(10, '* Must be exactly 10 digits').matches(phone, 'Phone number is not valid').required('* phonenumber is required'),
        typeLeave: Yup.string().required('* Type of Leave is required'),
        startDate: Yup.date().required('* Startdate is required'),
        endDate: Yup.date().required('* Enddate is required'),
        startOption: Yup.string().required('* Start option is required'),
        endOption: Yup.string().required('* End option is required'),
        reason: Yup.string().required('* Reason is required'),
        pin: Yup.string().required('* Pin is required'),
    });

    return (

        <Content className="sectionLayout fontPromt">
            {/* <span>{JSON.stringify(listUser[0].profileId)}</span> */}
            { }
            <Skeleton loading={loading} active>
                <Row >
                    <Col span={8} offset={16}>
                        <Card className='cardLayout'>
                            <p>คงเหลือ ลาพักร้อน {user.vacationLeave} วัน</p>
                            <p>ลากิจ       {user.personalLeave}  วัน</p>
                            <p>ลาป่วย     {user.sickLeave}  วัน</p>
                        </Card>
                    </Col>
                </Row>
                <Formik
                    enableReinitialize
                    initialValues={initialValueAddLeave}
                    validationSchema={addLeaveSchema}
                    onSubmit={async (values, { resetForm }) => {

                        console.log(values);
                        const res = await callService('POST', `${serViceUrl()}allUsers/sendLeaveStaff`, {
                            name: values.name,
                            staffId: values.staffId,
                            position: values.position,
                            department: values.department,
                            location: values.location,
                            phone: values.phone,
                            typeLeave: values.typeLeave,
                            startDate: values.startDate + " " + values.startTime,
                            endDate: values.endDate + " " + values.endTime,
                            reason: values.reason,
                            status: values.status,
                            total: values.total.toString(),
                            pin: values.pin
                        }, {})
                        console.log(res);
                        if (res.data.message == "Submit success") {
                            await Swal.fire({
                                icon: 'success',
                                title: res.data.message,
                                timer: 1500
                            })
                            setDate([{}])
                            // setOptionStart();
                            // setOptionEnd();
                            // setEndDate()
                            // setOptionEnd();
                            resetForm();
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
                            <Row>
                                <Col span={12}>
                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label>ชื่อ/Name</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <Input
                                                className='inputBox colorDetails'
                                                id="name"
                                                name="name"
                                                type="text"
                                                disabled>
                                            </Input>
                                            {touched.name && errors.name ? (
                                                <div className="errorMsg">{errors.name}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label>รหัสประจำตัว/StaffId</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <Input
                                                className='inputBox colorDetails'
                                                id="staffId"
                                                name="staffId"
                                                type="text"
                                                disabled />
                                            {touched.staffId && errors.staffId ? (
                                                <div className="errorMsg">{errors.staffId}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label >ตำแหน่ง/Position</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <Input
                                                className='inputBox colorDetails'
                                                id="position"
                                                name="position"
                                                type="text"
                                                disabled />
                                            {touched.position && errors.position ? (
                                                <div className="errorMsg">{errors.position}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label >ฝ่าย/Department</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <Input
                                                className='inputBox colorDetails'
                                                id="department"
                                                name="department"
                                                type="text"
                                                disabled />
                                            {touched.department && errors.department ? (
                                                <div className="errorMsg">{errors.department}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >หน่วยงาน/Location</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input
                                        className='longInputBox colorDetails'
                                        name="location"
                                        type="text"
                                        disabled />
                                    {touched.location && errors.location ? (
                                        <div className="errorMsg">{errors.location}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >หมายเลขติดต่อระหว่างการลา/Contact number during leave</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input
                                        className='longInputBox colorDetails'
                                        name="phone"
                                        type="text"
                                        disabled
                                    />
                                    {touched.phone && errors.phone ? (
                                        <div className="errorMsg">{errors.phone}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >ประเภทการลา/Type of leave</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    {/* <Checkbox.Group
                                    options={plainOptions}
                                    name="typeLeave"
                                /> */}
                                    <Radio.Group name='typeLeave' onChange={(e) => {
                                        console.log(e.target.value)
                                        setTypeLeave(e.target.value)
                                    }}>
                                        <Radio name='typeLeave' value='ลาป่วย'>ลาป่วย/Sick leave</Radio>
                                        <Radio name='typeLeave' value='ลาพักร้อน'>ลาพักร้อน/Annual leave</Radio>
                                        <Radio name='typeLeave' value='ลากิจ'>ลากิจ/Business leave</Radio>
                                        <Radio name='typeLeave' value='ลาโดยไม่รับค่าจ้าง'>ลาโดยไม่รับค่าจ้าง/Leave without pay</Radio>
                                        <Radio name='typeLeave' value='ลาหยุดทดแทน'>ลาหยุดทดแทน/Off in lieu</Radio>
                                    </Radio.Group>
                                    {touched.typeLeave && errors.typeLeave ? (
                                        <div className="errorMsg">{errors.typeLeave}</div>
                                    ) : null}
                                </div>
                            </div>

                            <Row>
                                <Col span={12}>
                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label >ตั้งแต่วันที่/Start date</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <DatePicker
                                                className='inputBox'
                                                name="startDate"
                                                format="YYYY-MM-DD"
                                                onChange={(val, date) => {
                                                    console.log(date)
                                                    console.log(val)
                                                    setStartDateText(date)
                                                    setStartDate(val)
                                                }}
                                            />
                                            {touched.startDate && errors.startDate ? (
                                                <div className="errorMsg">{errors.startDate}</div>
                                            ) : null}
                                        </div>
                                    </div>

                                </Col>
                                <Col span={12}>
                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <Radio.Group
                                                onChange={(e) => {
                                                    console.log(e.target.value)
                                                    setOptionStart(e.target.value)
                                                }}
                                                name='startOption'>
                                                <Radio name='startOption' value='ครึ่งเช้า'>ครึ่งเช้า</Radio>
                                                <Radio name='startOption' value='ครึ่งบ่าย'>ครึ่งบ่าย</Radio>
                                            </Radio.Group>

                                            {touched.startOption && errors.startOption ? (
                                                <div className="errorMsg">{errors.startOption}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label >ถึงวันที่/End date</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <DatePicker
                                                className='inputBox'
                                                id="endDate"
                                                name="endDate"
                                                format="YYYY-MM-DD"
                                                onChange={(val, date) => {
                                                    setEndDateText(date)
                                                    setEndDate(val)
                                                }}
                                                disabledDate={(current) => {
                                                    return startDate ? current < moment(startDate) : current
                                                }}
                                            />
                                            {touched.endDate && errors.endDate ? (
                                                <div className="errorMsg">{errors.endDate}</div>
                                            ) : null}
                                        </div>
                                    </div>

                                </Col>
                                <Col span={12}>
                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                        </div>
                                        <div onChange={(e) => {
                                            console.log(e.target.value)
                                            setOptionEnd(e.target.value)
                                        }} className="ant-col ant-form-item-control">
                                            <Radio.Group name='endOption'>
                                                <Radio name='endOption' value='ครึ่งเช้า'>ครึ่งเช้า</Radio>
                                                <Radio name='endOption' value='ครึ่งบ่าย'>ครึ่งบ่าย</Radio>
                                            </Radio.Group>

                                            {touched.endOption && errors.endOption ? (
                                                <div className="errorMsg">{errors.endOption}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <div className='ant-row ant-form-item formCustom row0' >
                                    <div className="ant-col ant-form-item-label">
                                        <label >รวม/Total</label>
                                    </div>
                                    <div className="ant-col ant-form-item-control">
                                        <Input className='inputBox colorDetails' name="total" disabled />
                                        {/* {touched.dateLeave && errors.dateLeave ? (
                                            <div className="errorMsg">{errors.dateLeave}</div>
                                        ) : null} */}
                                    </div>
                                    <div onClick={() => {
                                        setTotal()
                                    }}>
                                        <span
                                            className="iconify"
                                            data-icon="heroicons-solid:refresh"
                                            data-inline="false" data-width="20"
                                            data-height="20">
                                        </span>
                                    </div>
                                </div>
                            </Row>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >เหตุผล/Reason</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input
                                        className='longInputBox'
                                        name="reason"
                                        type="text"
                                    />
                                    {touched.reason && errors.reason ? (
                                        <div className="errorMsg">{errors.reason}</div>
                                    ) : null}
                                </div>
                            </div>


                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >รหัสลับ/PIN</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input.Password
                                        className='inputBox'
                                        name="pin"
                                        type="password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        autoComplete="on"
                                    />
                                    {touched.pin && errors.pin ? (
                                        <div className="errorMsg">{errors.pin}</div>
                                    ) : null}
                                </div>
                            </div>

                            <Row>
                                <Col span={6} offset={18}>
                                    <Button className='btnApprove' htmlType="submit" type="primary" block>Submit</Button>
                                </Col>
                            </Row>

                        </Form>
                    )}
                </Formik>
            </Skeleton>
        </Content >
    )
}
