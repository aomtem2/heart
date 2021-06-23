import React from 'react'
import 'antd/dist/antd.css';
import callService from '../function/axiosCall'
import Cookies from 'js-cookie'
import { Form, Input, InputNumber, Checkbox, DatePicker, Select, Radio } from 'formik-antd'
import { Formik } from 'formik'
import * as Yup from 'yup';
import { Layout, Button, Row, Col, message, Modal, Menu, Skeleton } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import serViceUrl from '../function/serViceUrl'
import Iconify from '@iconify/iconify';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import moment from 'moment';
import { useRouter } from 'next/router'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const { Content } = Layout;
export default function index() {

    const [collapsed, toggleCollapsed] = useState(false);
    const [datatable, setDatatable] = useState();
    const [loading, setLoading] = useState(true);
    const [loadingModal, setLoadingModal] = useState(true);
    const [isSupervisorModalVisible, setIsModalSupervisorVisible] = useState(false);
    const [isHrModalVisible, setIsModalHrVisible] = useState(false);
    const [leaveDetail, setLeaveDetail] = useState([{}]);
    const [statusReload, setStatusReload] = useState(false);

    const initialValueLeaveDetail = {
        leaveId: leaveDetail.leaveId,
        name: leaveDetail.name,
        staffId: leaveDetail.staffId,
        position: leaveDetail.position,
        department: leaveDetail.department,
        location: leaveDetail.location,
        phone: leaveDetail.phone,
        typeLeave: leaveDetail.typeLeave,
        startDate: leaveDetail.startDate,
        endDate: leaveDetail.endDate,
        total: leaveDetail.total,
        reason: leaveDetail.reason,
        date: leaveDetail.date,
        status: leaveDetail.status,
        reasonSuper: leaveDetail.reasonSuper,
        approveDate: leaveDetail.approveDate,
        record: leaveDetail.record,
        comment: leaveDetail.comment,
        pin: ''
    }

    const approveSchema = Yup.object().shape({
        status: Yup.string().required('* Response is required'),
        reasonSuper: Yup.string().required('* Reason is required'),
        pin: Yup.string().required('* Pin is required')
    });

    const recordSchema = Yup.object().shape({
        record: Yup.string().required('* Record is required'),
        comment: Yup.string().required('* Comment is required'),
        pin: Yup.string().required('* Pin is required')
    });


    const columns = [
        {
            name: 'เลขคำร้อง',
            selector: 'leaveId',
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
            name: 'ประเภทการลา',
            selector: 'category',
            sortable: true,
            wrap: true

        },
        {
            name: 'จำนวนวันลา',
            selector: 'total',
            sortable: true,
            wrap: true
        },
        {
            name: 'สถานะคำร้อง',
            selector: Cookies.get('role') == 'HRadministrator' ? 'statusHR' : 'status',
            sortable: true,
            wrap: true,
            conditionalCellStyles: [{
                when: row => row.statusHR == "ลงบันทึกเรียบร้อย",
                style: {
                    color: '#539C40',
                }
            }, {
                when: row => row.statusHR == "รอลงบันทึก",
                style: {
                    color: '#FF7A00',
                }
            }]
        },
        {
            name: 'วันที่ปรับปรุงล่าสุด',
            selector: 'date',
            sortable: true,
            wrap: true
        },
        {
            key: "action",
            text: "Action",
            className: "action",
            width: '50px',
            sortable: false,
            cell: (record) => {
                return (
                    <a onClick={async () => {
                        console.log(record)
                        if (Cookies.get('role') == 'HRadministrator') {
                            const resData = await callService('POST', `${serViceUrl()}hr/getOneApprovedLeave`, { token: Cookies.get('cookie'), leaveId: record.leaveId.toString() })
                            console.log(resData.data.message)
                            setLeaveDetail({
                                leaveId: resData.data.message.leaveId,
                                name: resData.data.message.name,
                                staffId: resData.data.message.staffId,
                                position: resData.data.message.position,
                                department: resData.data.message.department,
                                location: resData.data.message.location,
                                phone: resData.data.message.phone,
                                typeLeave: resData.data.message.typeLeave,
                                startDate: resData.data.message.startDate,
                                endDate: resData.data.message.endDate,
                                total: resData.data.message.total,
                                reason: resData.data.message.reason,
                                date: resData.data.message.date,
                                status: resData.data.message.status,
                                reasonSuper: resData.data.message.reasonSuper,
                                approveDate: leaveDetail.approveDate,
                                statusHR: resData.data.message.statusHR,
                                record: resData.data.message.record,
                                comment: resData.data.message.comment,
                            })
                            showModalHr()
                        }
                        else {
                            const resData = await callService('POST', `${serViceUrl()}supervisor/getOneStaffLeave`, { token: Cookies.get('cookie'), leaveId: record.leaveId.toString() })
                            console.log(resData.data.message)
                            setLeaveDetail({
                                leaveId: resData.data.message.leaveId,
                                name: resData.data.message.name,
                                staffId: resData.data.message.staffId,
                                position: resData.data.message.position,
                                department: resData.data.message.department,
                                location: resData.data.message.location,
                                phone: resData.data.message.phone,
                                typeLeave: resData.data.message.typeLeave,
                                startDate: resData.data.message.startDate,
                                endDate: resData.data.message.endDate,
                                total: resData.data.message.total,
                                reason: resData.data.message.reason,
                                date: resData.data.message.date,
                                status: resData.data.message.status,
                                reasonSuper: resData.data.message.reasonSuper,
                            })
                            showModalSupervisor()
                        }
                    }
                    }
                    >
                        <span
                            className="iconify"
                            style={{ color: '#FF7A00' }}
                            data-icon="akar-icons:edit"
                            data-inline="false"
                            data-width="24" data-height="24">
                        </span>
                    </a >
                );
            },
        },
    ]

    const table = {
        columns: columns,
        data: datatable

    };

    const showModalSupervisor = () => {
        setIsModalSupervisorVisible(true);
    };

    const handleOkSupervisor = () => {
        setIsModalSupervisorVisible(false);
    };

    const handleCancelSupervisor = () => {
        setIsModalSupervisorVisible(false);
    };

    const showModalHr = () => {
        setIsModalHrVisible(true);
    };

    const handleOkHr = () => {
        setIsModalHrVisible(false);
    };

    const handleCancelHr = () => {
        setIsModalHrVisible(false);
    };

    useEffect(async () => {
        let url = Cookies.get('role') != 'Supervisor' ? 'hr/getApprovedLeave' : 'supervisor/getStaffLeave'
        console.log(url)
        const resData = await callService('POST', `${serViceUrl()}${url}`, { token: Cookies.get('cookie') })
        let i = 0;
        console.log(resData.data)
        resData.data.forEach(element => {
            var date = new Date(resData.data[i].date);
            resData.data[i].date = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0') + ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
            i++
        });
        setDatatable(resData.data)
        setLoading(false)
    }, [statusReload])

    return (
        <Content
            className="sectionLayout"
        >
            <Skeleton loading={loading} active>
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
            <Modal className='fontPromt' title="Details" centered width={1000} visible={isSupervisorModalVisible} footer={null} onCancel={handleCancelSupervisor}>
                <Formik
                    enableReinitialize
                    initialValues={initialValueLeaveDetail}
                    validationSchema={approveSchema}
                    onSubmit={async (values, { resetForm }) => {
                        console.log(values);
                        const resData = await callService('POST', `${serViceUrl()}supervisor/approveLeave`,
                            {
                                leaveId: values.leaveId.toString(),
                                status: values.status,
                                reasonSuper: values.reasonSuper,
                                pin: values.pin,
                                token: Cookies.get('cookie')
                            })
                        console.log(resData.data.message);
                        if (resData.data.message == 'Approve Success') {
                            await Swal.fire({
                                icon: 'success',
                                title: resData.data.message,
                                timer: 1500
                            })
                            setStatusReload(!statusReload)
                            handleCancelSupervisor()
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
                        <Form  >
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
                                    <Input
                                        className='longInputBox colorDetails'
                                        name="typeLeave"
                                        type="text"
                                        disabled
                                    />
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
                                                className='inputBox colorDetails'
                                                name="startDate"
                                                format="YYYY-MM-DD HH:mm"
                                                disabled
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
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label >ถึงวันที่/End date</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <DatePicker
                                                className='inputBox colorDetails'
                                                id="endDate"
                                                name="endDate"
                                                format="YYYY-MM-DD HH:mm"
                                                disabled
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
                                </div>
                            </Row>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >เหตุผล/Reason</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input
                                        className='longInputBox colorDetails'
                                        name="reason"
                                        type="text"
                                        disabled
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
                                        className='inputBox colorDetails'
                                        id='date'
                                        name='date'
                                        disabled
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
                                    <Radio.Group disabled={leaveDetail.status != 'รอการอนุมัติ' ? true : false} name='status'>
                                        <Radio name='status' value='อนุมัติเรียบร้อย'>อนุมัติ/Approved</Radio>
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
                                        className='longInputBox colorDetails'
                                        name="reasonSuper"
                                        type="text"
                                        disabled={leaveDetail.reasonSuper != '' ? true : false}

                                    />
                                    {touched.reasonAdmin && errors.reasonAdmin ? (
                                        <div className="errorMsg">{errors.reasonAdmin}</div>
                                    ) : null}
                                </div>
                            </div>

                            {leaveDetail.status != "รอการอนุมัติ" ? '' : <div className='ant-row ant-form-item formCustom row0' >
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
                            </div>}
                            <Row>
                                <Col span={6} offset={18}>
                                    <Button className='btnApprove ' disabled={leaveDetail.reasonSuper != '' ? true : false} htmlType="submit" type="primary" block>Submit</Button>
                                </Col>
                            </Row>

                        </Form>
                    )}
                </Formik>
                {/* </Skeleton> */}
            </Modal>

            <Modal className='fontPromt' title="Details" centered width={1000} visible={isHrModalVisible} footer={null} onCancel={handleCancelHr}>
                <Formik
                    enableReinitialize
                    initialValues={initialValueLeaveDetail}
                    validationSchema={recordSchema}
                    onSubmit={async (values, { resetForm }) => {
                        console.log(values);
                        const resData = await callService('POST', `${serViceUrl()}hr/recordLeave`,
                            {
                                leaveId: values.leaveId.toString(),
                                record: values.record,
                                comment: values.comment,
                                statusHR: "ลงบันทึกเรียบร้อย",
                                pin: values.pin,
                                token: Cookies.get('cookie')
                            })
                        console.log(resData.data.message);
                        if (resData.data.message == 'Record Success') {
                            await Swal.fire({
                                icon: 'success',
                                title: resData.data.message,
                                timer: 1500
                            })
                            setStatusReload(!statusReload)
                            handleCancelHr()
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
                        <Form  >
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
                                    <Input
                                        className='longInputBox colorDetails'
                                        name="typeLeave"
                                        type="text"
                                        disabled
                                    />
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
                                                className='inputBox colorDetails'
                                                name="startDate"
                                                format="YYYY-MM-DD HH:mm"
                                                disabled
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
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <div className='ant-row ant-form-item formCustom row0' >
                                        <div className="ant-col ant-form-item-label">
                                            <label >ถึงวันที่/End date</label>
                                        </div>
                                        <div className="ant-col ant-form-item-control">
                                            <DatePicker
                                                className='inputBox colorDetails'
                                                id="endDate"
                                                name="endDate"
                                                format="YYYY-MM-DD HH:mm"
                                                disabled
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
                                </div>
                            </Row>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >เหตุผล/Reason</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input
                                        className='longInputBox colorDetails'
                                        name="reason"
                                        type="text"
                                        disabled
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
                                        className='inputBox colorDetails'
                                        id='date'
                                        name='date'
                                        disabled
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
                                    <Radio.Group disabled={leaveDetail.status != 'รอการอนุมัติ' ? true : false} name='status'>
                                        <Radio name='status' value='อนุมัติเรียบร้อย'>อนุมัติ/Approved</Radio>
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
                                        className='longInputBox colorDetails'
                                        name="reasonSuper"
                                        type="text"
                                        disabled={leaveDetail.reasonSuper != '' ? true : false}

                                    />
                                    {touched.reasonAdmin && errors.reasonAdmin ? (
                                        <div className="errorMsg">{errors.reasonAdmin}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='ant-row ant-form-item formCustom row0' >
                                <div className="ant-col ant-form-item-label">
                                    <label >บันทึกการลา/Record</label>
                                </div>
                                <div className="ant-col ant-form-item-control">
                                    <Input
                                        className='longInputBox colorDetails'
                                        name="record"
                                        type="text"
                                        disabled={leaveDetail.statusHR != "รอลงบันทึก" ? true : false}

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
                                        className='longInputBox colorDetails'
                                        name="comment"
                                        type="text"
                                        disabled={leaveDetail.statusHR != "รอลงบันทึก" ? true : false}

                                    />
                                    {touched.comment && errors.comment ? (
                                        <div className="errorMsg">{errors.comment}</div>
                                    ) : null}
                                </div>
                            </div>

                            {leaveDetail.statusHR != "รอลงบันทึก" ? '' : <div className='ant-row ant-form-item formCustom row0' >
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
                            </div>}
                            <Row>
                                <Col span={6} offset={18}>
                                    <Button className='btnApprove ' disabled={leaveDetail.statusHR != "รอลงบันทึก" ? true : false} htmlType="submit" type="primary" block>Submit</Button>
                                </Col>
                            </Row>

                        </Form>
                    )}
                </Formik>
                {/* </Skeleton> */}
            </Modal>
        </Content >
    )
}
