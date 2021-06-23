import { React, useContext } from 'react'
import 'antd/dist/antd.css';
import callService from '../function/axiosCall'
import Cookies from 'js-cookie'
import * as Yup from 'yup';
import { Form, Input, InputNumber, Checkbox, DatePicker, Select, Radio } from 'formik-antd'
import { Layout, Button, Row, Col, message, Modal, Menu, Skeleton, Steps } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import { useFormik, Formik } from 'formik';
import { useRouter } from 'next/router'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Iconify from '@iconify/iconify';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import serViceUrl from '../function/serViceUrl'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import AuthContext from '../component/authContext'


const { Content } = Layout;
const { Step } = Steps;

export default function index({ data }) {

    const router = useRouter()

    const { user } = useContext(AuthContext)
    const [datatable, setDatatable] = useState([{}]);
    const [leaveDetail, setLeaveDetail] = useState([{}]);
    const [loading, setLoading] = useState(true);
    const [loadingModal, setLoadingModal] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

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
        statusHR: leaveDetail.statusHR,
        reasonAdmin: leaveDetail.reasonAdmin,
        dateApproved: leaveDetail.dateApproved,
        record: leaveDetail.record,
        comment: leaveDetail.comment,
        pin: leaveDetail.pin
    }

    const columns = Cookies.get('role') != 'Administrator' ? [
        {
            name: 'เลขที่คำร้อง',
            selector: 'leaveId',
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
            selector: 'status',
            sortable: true,
            wrap: true,
            conditionalCellStyles: [{
                when: row => row.status == "อนุมัติเรียบร้อย",
                style: {
                    color: '#539C40',
                }
            }, {
                when: row => row.status == "รอการอนุมัติ",
                style: {
                    color: '#FF7A00',
                }
            }, {
                when: row => row.status == "ไม่อนุมัติ",
                style: {
                    color: '#FF0000',
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
            width: '100px',
            sortable: false,
            cell: (record) => {
                return (
                    <a onClick={async () => {
                        console.log(record)
                        const resData = await callService('POST', `${serViceUrl()}allUsers/getOneLeave`, { token: Cookies.get('cookie'), leaveId: record.leaveId.toString() })
                        console.log(resData.data)
                        setLeaveDetail({
                            leaveId: resData.data.leaveId,
                            name: resData.data.name,
                            staffId: resData.data.staffId,
                            position: resData.data.position,
                            department: resData.data.department,
                            location: resData.data.location,
                            phone: resData.data.phone,
                            typeLeave: resData.data.typeLeave,
                            startDate: resData.data.startDate,
                            endDate: resData.data.endDate,
                            total: resData.data.total,
                            reason: resData.data.reason,
                            date: resData.data.date,
                            status: resData.data.status,
                            statusHR: resData.data.statusHR,
                            reasonAdmin: resData.data.reasonAdmin,
                            dateApproved: resData.data.dateApproved,
                            record: resData.data.record,
                            comment: resData.data.comment,
                            pin: resData.data.pin
                        })
                        showModal()
                        // setLoadingModal(!loadingModal)
                        // router.push(`/home/leaveDetail/${record.leaveId}`)
                    }
                    }
                    >
                        <span
                            className="iconify"
                            data-icon="ion:search-circle"
                            data-inline="false"
                            data-width="30" data-height="30">
                        </span>
                    </a >
                );
            },
        },
    ] : [

        {
            name: 'เลขที่คำร้อง',
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
            name: 'ฝ่าย',
            selector: 'department',
            sortable: true,
            wrap: true
        },
        {
            name: 'สถานะคำร้อง',
            selector: 'status',
            sortable: true,
            wrap: true,
            conditionalCellStyles: [{
                when: row => row.status == "อนุมัติเรียบร้อย",
                style: {
                    color: '#539C40',
                }
            }, {
                when: row => row.status == "รอการอนุมัติ",
                style: {
                    color: '#FF7A00',
                }
            }, {
                when: row => row.status == "ไม่อนุมัติ",
                style: {
                    color: '#FF0000',
                }
            }]
        },
        {
            name: 'วันที่ปรับปรุงล่าสุด',
            selector: 'date',
            sortable: true,
        },
        {
            key: "action",
            text: "Action",
            className: "action",
            width: '100px',
            sortable: false,
            cell: (record) => {
                return (
                    <a onClick={async () => {
                        console.log(record)
                        const resData = await callService('POST', `${serViceUrl()}allUsers/getOneLeave`, { token: Cookies.get('cookie'), leaveId: record.leaveId.toString() })
                        console.log(resData)
                        setLeaveDetail({
                            leaveId: resData.data.leaveId,
                            name: resData.data.name,
                            staffId: resData.data.staffId,
                            position: resData.data.position,
                            department: resData.data.department,
                            location: resData.data.location,
                            phone: resData.data.phone,
                            typeLeave: resData.data.typeLeave,
                            startDate: resData.data.startDate,
                            endDate: resData.data.endDate,
                            total: resData.data.total,
                            reason: resData.data.reason,
                            date: resData.data.date,
                            status: resData.data.status,
                            statusHR: resData.data.statusHR,
                            reasonAdmin: resData.data.reasonAdmin,
                            dateApproved: resData.data.dateApproved,
                            record: resData.data.record,
                            comment: resData.data.comment,
                            pin: resData.data.pin
                        })
                        showModal()
                        // setLoadingModal(!loadingModal)
                        // router.push(`/home/leaveDetail/${record.leaveId}`)
                    }
                    }
                    >
                        <span
                            className="iconify"
                            data-icon="ion:search-circle"
                            data-inline="false"
                            data-width="30" data-height="30">
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


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(async () => {
        const resData = Cookies.get('role') != 'Administrator' ? await callService('POST', `${serViceUrl()}allUsers/getUserLeave`, { token: Cookies.get('cookie') }) : await callService('GET', `${serViceUrl()}admin/getAllUserLeave`)
        console.log(resData.data.message)
        let i = 0;
        resData.data.message.forEach(element => {
            var date = new Date(resData.data.message[i].date);
            resData.data.message[i].date = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0') + ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
            i++
        });
        setDatatable(resData.data.message)
        setLoading(false)

    }, [])

    // const subHeaderComponentMemo = useMemo(() => {
    //     return <FilterComponent onFilter={e => setFilterText(e.target.value)} filterText={filterText} />;
    // }, [filterText]);

    return (
        <Content
            className="sectionLayout"
        >
            <Skeleton loading={loading} active>
                {/* <br /><br /><br /> */}
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
            <Modal className='fontPromt' title="Details" width={1000} visible={isModalVisible} footer={null} onCancel={handleCancel}>
                {/* <Skeleton loading={loadingModal} active> */}
                <Steps current={(leaveDetail.status == 'รอการอนุมัติ') || (leaveDetail.status == 'ไม่อนุมัติ' && leaveDetail.statusHR == 'รอลงบันทึก') ? 1 : (leaveDetail.status == 'อนุมัติเรียบร้อย' && leaveDetail.statusHR == 'รอลงบันทึก') ? 2 : 3} status={leaveDetail.status == 'ไม่อนุมัติ' ? "error" : "process"}>
                    <Step title="สำเร็จ" description="บันทึกคำร้อง" />
                    <Step title={leaveDetail.status == 'อนุมัติเรียบร้อย' ? "สำเร็จ" : leaveDetail.status == 'ไม่อนุมัติ' ? "ปฎิเสธ" : "ดำเนินการอยู่"} description="เซ็นอนุมัติ" />
                    <Step title={leaveDetail.statusHR == 'ลงบันทึกเรียบร้อย' ? "สำเร็จ" : leaveDetail.status == 'ไม่อนุมัติ' || leaveDetail.status == 'อนุมัติเรียบร้อย' ? "ดำเนินการอยู่" : "กำลังรอดำเนินการ"} description="ลงบันทึกการลา" />
                </Steps>
                <br /><br /><br />
                <Formik
                    enableReinitialize
                    initialValues={initialValueLeaveDetail}
                    onSubmit={async (values, { resetForm }) => {
                        console.log(values);

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

                        </Form>
                    )}
                </Formik>
                {/* </Skeleton> */}
            </Modal>
        </Content >
    )
}