import React from 'react'
import 'antd/dist/antd.css';
import callService from '../function/axiosCall'
import Cookies from 'js-cookie'
import { useFormik, Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, InputNumber, Checkbox, DatePicker, Select, Radio } from 'formik-antd'
import { Layout, Button, Row, Col, message, Modal, Menu, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import Iconify from '@iconify/iconify';
import serViceUrl from '../function/serViceUrl'

const { Content } = Layout;

export default function index() {
    const phone = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const [user, setUser] = useState([{}]);
    const [loading, setLoading] = useState(true);
    const [optionStart, setOptionStart] = useState();
    const [optionEnd, setOptionEnd] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [startDateText, setStartDateText] = useState();
    const [typeLeave, setTypeLeave] = useState();
    const [endDateText, setEndDateText] = useState();
    const [date, setDate] = useState([{}]);
    const [list, setList] = useState([]);


    useEffect(async () => {
        const res = await callService('GET', `${serViceUrl()}hr/getAllUserProfile`)
        // res

        console.log(res.data.message)
        setList(res.data.message)
        setLoading(false)
    }, [])

    const handleChange = (key, e) => {
        console.log(list[key])
        setUser({
            name: list[key].name,
            staffId: list[key].staffId,
            position: list[key].position,
            department: list[key].department,
            phone: list[key].phone
        })
        // console.log(user)
        // console.log('test')
        // console.log(initialValueAddLeave)
    }

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
        status: '',
        reasonSuper: '',
        dateApproved: '',
        record: '',
        dateRecord: '',
        comment: '',
        pin: ''
    }

    const addLeaveSchema = Yup.object().shape({
        // name: Yup.string().required('* Name is required'),
        // staffId: Yup.string().required('* StaffId is required'),
        // position: Yup.string().required('* Position is required'),
        // department: Yup.string().required('* Department is required'),
        // location: Yup.string().required('* Location is required'),
        // phone: Yup.string().length(10, '* Must be exactly 10 digits').matches(phone, 'Phone number is not valid').required('* phonenumber is required'),
        // typeLeave: Yup.string().required('* Type of Leave is required'),
        typeLeave: Yup.string().required('* Type of Leave is required'),
        startDate: Yup.date().required('* Startdate is required'),
        endDate: Yup.date().required('* Enddate is required'),
        startOption: Yup.string().required('* Start option is required'),
        endOption: Yup.string().required('* End option is required'),
        reason: Yup.string().required('* Reason is required'),
        date: Yup.date().required('* Date is required'),
        status: Yup.string().required('* Response is required'),
        reasonSuper: Yup.string().required('* Reason is required'),
        dateApproved: Yup.date().required('* Date is required'),
        record: Yup.string().required('* Record is required'),
        dateRecord: Yup.date().required('* Date is required'),
        comment: Yup.string().required('* Comment is required'),
        pin: Yup.string().required('* Pin is required'),
    });

    return (

        <Content className="sectionLayout fontPromt">
            {/* <span>{JSON.stringify(user[0].profileId)}</span> */}
            <Skeleton loading={loading} active>
                <Formik
                    enableReinitialize
                    initialValues={initialValueAddLeave}
                    validationSchema={addLeaveSchema}
                    onSubmit={async (values, { resetForm }) => {
                        console.log(values);
                        const res = await callService('POST', `${serViceUrl()}hr/addLeave`, {
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
                            date: values.date.toString(),
                            status: values.status,
                            reasonSuper: values.reasonSuper,
                            dateApproved: values.dateApproved.toString(),
                            record: values.record,
                            dateRecord: values.dateRecord.toString(),
                            comment: values.comment,
                            total: values.total.toString(),
                            pin: values.pin,
                            token: Cookies.get('cookie')
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
                                            <Select
                                                showSearch
                                                className='inputBox'
                                                id="name"
                                                name="name"
                                                type="text"
                                                onSelect={(key, event) => handleChange(key, event)}
                                                style={{ fontSize: '16px' }}
                                                placeholder="Select Name">
                                                {list.map(value => <Select.Option key={value.number} value={value.number}>{value.name}</Select.Option>)}
                                            </Select>
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
                                                className='inputBox'
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
                                                className='inputBox'
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
                                                className='inputBox'
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
                                        className='longInputBox'
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
                                        className='longInputBox'
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
                                    <Radio.Group name='typeLeave'>
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
                                    <label >เหตุผล Reason</label>
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
                                    <label >วันที่/Date</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <DatePicker
                                        className='inputBox'
                                        id='date'
                                        name='date'
                                    />
                                    {touched.date && errors.date ? (
                                        <div className="errorMsg">{errors.date}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >การตอบรับ/response</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    {/* <Checkbox.Group
                                    options={approve}
                                    name="status"
                                /> */}
                                    <Radio.Group name='status'>
                                        <Radio name='status' value='อนุมัติ'>อนุมัติ/Approved</Radio>
                                        <Radio name='status' value='ไม่อนุมัติ'>ไม่อนุมัติ/Not approved</Radio>
                                    </Radio.Group>
                                    {touched.status && errors.status ? (
                                        <div className="errorMsg">{errors.status}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >เหตุผล/Reason</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input
                                        className='longInputBox'
                                        name="reasonSuper"
                                        type="text"
                                    />
                                    {touched.reasonSuper && errors.reasonSuper ? (
                                        <div className="errorMsg">{errors.reasonSuper}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >วันที่/Date</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <DatePicker
                                        className='inputBox'
                                        name='dateApproved'
                                    />
                                    {touched.dateApproved && errors.dateApproved ? (
                                        <div className="errorMsg">{errors.dateApproved}</div>
                                    ) : null}
                                </div>
                            </div>


                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >บันทึกการลา/Record</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input
                                        className='longInputBox'
                                        name="record"
                                        type="text"
                                    />
                                    {touched.record && errors.record ? (
                                        <div className="errorMsg">{errors.record}</div>
                                    ) : null}
                                </div>
                            </div>



                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >ข้อคิดเห็น/Comment</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input
                                        className='longInputBox'
                                        name="comment"
                                        type="text"
                                    />
                                    {touched.comment && errors.comment ? (
                                        <div className="errorMsg">{errors.comment}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >วันที่/Date</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <DatePicker
                                        className='inputBox'
                                        name='dateRecord'
                                    />
                                    {touched.dateRecord && errors.dateRecord ? (
                                        <div className="errorMsg">{errors.dateRecord}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >รหัสลับ/PIN</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input
                                        className='inputBox'
                                        name="pin"
                                        type="text"
                                    />
                                    {touched.pin && errors.pin ? (
                                        <div className="errorMsg">{errors.pin}</div>
                                    ) : null}
                                </div>
                            </div>

                            <Button htmlType="submit" className='submitBtn' type="primary" block>Submit</Button>
                        </Form>
                    )}
                </Formik>
            </Skeleton>
        </Content>
    )
}
