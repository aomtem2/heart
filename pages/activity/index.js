import React from 'react'
import 'antd/dist/antd.css';
import callService from '../function/axiosCall'
import Cookies, { get } from 'js-cookie'
import { Layout, Button, Row, Col, message, Modal, Menu, Card, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import Iconify from '@iconify/iconify';
import serViceUrl from '../function/serViceUrl'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const { Content } = Layout;

export default function index() {


    const [datatable, setDatatable] = useState();
    const [loading, setLoading] = useState(true);

    const columns = Cookies.get('role') != 'Administrator' ? [
        {
            name: 'ลำดับที่',
            selector: 'logId',
            sortable: true,
            wrap: true
        },
        {
            name: 'ประเภท',
            selector: 'category',
            sortable: true,
            wrap: true
        },
        {
            name: 'เลขที่คำร้อง',
            selector: 'leaveId',
            sortable: true,
            wrap: true
        },
        {
            name: 'สถานะ',
            selector: 'comment',
            sortable: true,
            wrap: true,
            conditionalCellStyles: [{
                when: row => row.comment == "สำเร็จ",
                style: {
                    color: '#539C40',
                }
            }, {
                when: row => row.comment == "ไม่สำเร็จ",
                style: {
                    color: '#FF0000',
                }
            }]
        },
        {
            name: 'วันที่',
            selector: 'date',
            wrap: true
        },
    ] : [
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
            name: 'ประเภท',
            selector: 'category',
            sortable: true,
            wrap: true
        },
        {
            name: 'เลขที่คำร้อง',
            selector: 'leaveId',
            sortable: true,
            wrap: true
        },
        {
            name: 'สถานะ',
            selector: 'status',
            sortable: true,
            wrap: true,
            conditionalCellStyles: [{
                when: row => row.status == "สำเร็จ",
                style: {
                    color: '#539C40',
                }
            }, {
                when: row => row.status == "ไม่สำเร็จ",
                style: {
                    color: '#FF0000',
                }
            }]
        },
        {
            name: 'วันที่',
            selector: 'date',
            wrap: true
        },
    ]

    const table = {
        columns: columns,
        data: datatable

    };

    useEffect(async () => {
        const resData = Cookies.get('role') != 'Administrator' ? await callService('POST', `${serViceUrl()}allUsers/getLog`, { token: Cookies.get('cookie'), }) : await callService('POST', `${serViceUrl()}admin/getAllLog`, { token: Cookies.get('cookie'), })
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
        </Content>
    )
}
