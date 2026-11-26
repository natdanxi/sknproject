import React, { useEffect, useState } from 'react'
import {
    MDBDataTable, MDBDataTableV5, MDBBtn, MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBBadge,
} from 'mdbreact';

import Modal from 'react-awesome-modal';
import API from '../../../Config/config'
import Select from 'react-select'
import ReactToPrint from 'react-to-print'
import Frmprint from './FrmrecoupAdminprint'

export default function FrmrecoupdataAdmin() {

    const [modal, setModal] = useState(false);
    const [myData, setmyData] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_fabricid: '', t_fabricname: '', t_cupboard: '', t_bed: '', t_borrow: '', t_patientnum: '', t_other: '',
        t_recoupid: '', t_orderID: '', t_orderstr: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [listOrder, setlistOrder] = useState([]);
    const [officeid, setofficeid] = useState('');
    const [dataprint, setdataprint] = useState([]);
    const [componentRef, setcomponentRef] = useState(true);
    const [loanding, setloanding] = useState(true);

    useEffect(() => {

        Showdata();

    }, []);

    async function openModal(orderID, officeID, Recoupid) {

        setlistOrder([]);
        settxtvalue(inputData);
        setofficeid(officeID);
        Showdatadetail(orderID, Recoupid);
        Showdataprint(Recoupid, officeID);
        setModal(true);
        //setopenmodal(true);
    }

    async function closeModal() {
        settxtvalue(inputData);
        setlistOrder([]);
        setModal(false);
    }

    async function Showdata() {
        setloanding(false);
        setmyData([]);

        fetch(API.dataSource.url + "RecoupDataAdmin")
            .then(res => {
                if (!res.ok) throw new Error(`โหลดข้อมูลไม่สำเร็จ (${res.status})`);
                return res.json();
            })
            .then(json => {
                const rows = json.map((row, key) => {
                    const orderId = row.orderid || row.Orderid;
                    const officeId = row.officeid || row.Officeid;
                    const recoupId = row.recoupid || row.Recoupid;
                    const season = row.orderseason ?? row.Orderseason;
                    const status = row.orderstatus ?? row.Orderstatus;

                    return {
                        ...row,
                        Orderid: orderId,
                        Recoupid: recoupId,
                        Officename: row.officename || row.Officename,
                        Recoupdate: row.recoupdate || row.Recoupdate,
                        Recouptime: row.recouptime || row.Recouptime,
                        fullname: row.fullname || row.Fullname,
                        Edit: (
                            <>
                                <button className="btn btn-default btn-xs m-r-5" title="จ่ายผ้า" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(orderId, officeId, recoupId)}><i className="ti-hand-open font-14" /></button>
                            </>
                        ),
                        typestr: (
                            <>
                                {
                                    season == "1" ? (
                                        <span style={{ color: '#23B7E5' }}>เช้า</span>
                                    ) : (
                                        <span style={{ color: '#23B7E5' }}>บ่าย</span>
                                    )
                                }
                            </>
                        ),
                        Status: (
                            <>
                                {
                                    status == '0' ? (
                                        <span style={{ color: '#CCCC66' }}>รอรับเข้า</span>
                                    ) : status == '1' ? (
                                        <span style={{ color: '#009900' }}>รอจ่าย</span>
                                    ) : status == '2' ? (
                                        <span style={{ color: '#CC0000' }}>ค้างจ่าย</span>
                                    ) : (
                                        <span style={{ color: '#009900' }}>จ่ายครบแล้ว</span>
                                    )
                                }
                            </>
                        )
                    };
                });

                const Mydata = {
                    columns: [
                        { label: 'เลขที่ใบเบิก', field: 'Orderid', sort: 'asc', width: 20 },
                        { label: 'เลขที่จ่าย', field: 'Recoupid', sort: 'asc', width: 500 },
                        { label: 'หน่วยงาน', field: 'Officename', sort: 'asc', width: 500 },
                        { label: 'วันที่จ่าย', field: 'Recoupdate', sort: 'asc', width: 500 },
                        { label: 'เวลา', field: 'Recouptime', sort: 'asc', width: 200 },
                        { label: 'เจ้าหน้าที่', field: 'fullname', sort: 'asc', width: 50 },
                        { label: 'ช่วงเวลา', field: 'typestr', sort: 'asc', width: 50 },
                        { label: 'สถานะ', field: 'Status', sort: 'asc', width: 50 },
                        { label: '', field: 'Edit', sort: 'asc', width: 20 }
                    ],
                    rows
                };
                setmyData(Mydata);
                setloanding(true);
            })
            .catch(error => {
                console.error("Showdata Error:", error);
                setloanding(true);
            });
    }

    async function Showdatadetail(orderID, recoupid) {
        setlistOrder([]);

        fetch(API.dataSource.url + "RecoupDataAdmin/" + orderID)
            .then(response => {
                if (!response.ok) throw new Error(`โหลดรายละเอียดไม่สำเร็จ (${response.status})`);
                return response.json();
            })
            .then(data => {
                if (!data || data.length === 0) return;

                settxtvalue(prev => ({
                    ...prev,
                    t_id: orderID,
                    t_orderID: orderID,
                    t_recoupid: recoupid,
                    t_orderstr: data[0].orderseason ?? data[0].Orderseason ?? '',
                }));

                const newOrders = data.map((item, i) => {
                    const borrow = parseInt(item.borrow ?? item.Borrow ?? 0, 10);
                    const recoup = parseInt(item.recoupnum ?? item.Recoupnum ?? 0, 10);

                    return {
                        ID: i,
                        itemfabricid: item.fabricID || item.FabricID,
                        itemfabricname: item.fabricName || item.FabricName,
                        itemcupboard: item.stocknum ?? item.Stocknum,
                        itembed: item.bed ?? item.Bed,
                        itemborrow: borrow,
                        itemrecoupnum: borrow - recoup,
                        itemrecoup: recoup,
                        itempatientum: item.patientnum ?? item.Patientnum,
                        itemother: item.other || item.Other,
                    };
                });

                setlistOrder(newOrders);
            })
            .catch(error => {
                console.error("Showdatadetail Error:", error);
            });
    }

    async function Showdataprint(ID, offID = officeid) {
        setdataprint([]);

        fetch(API.dataSource.url + "RecoupDataAdmin/Print/" + ID + "?officeid=" + offID)
            .then(response => {
                if (!response.ok) throw new Error(`โหลดข้อมูลพิมพ์ไม่สำเร็จ (${response.status})`);
                return response.json();
            })
            .then(data => {
                setdataprint(data);
            })
            .catch(error => {
                console.error("Showdataprint Error:", error);
            });
    }

    return (
        <div>
            <div className="page-heading">
                <h1 className="page-title"> รายการจ่ายผ้า </h1>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="index.html"><i className="la la-home font-20" /></a>
                    </li>
                    <li className="breadcrumb-item"> Recoup From </li>
                </ol>
            </div>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <div className="ibox-head">
                        <div className="ibox-title"> รายการจ่าย</div>
                        <div>  </div>
                    </div>
                    <div className="ibox-body">
                        <MDBDataTable
                            striped
                            bordered
                            hover
                            data={myData}
                        />
                    </div>
                </div>

            </div>

            <sesion>
                {/* onClickAway */}
                <Modal visible={modal} width="90%" effect="fadeInUp" onClick={() => closeModal()}>
                    <div className="Modelbody">
                        <div className="Modelheader">

                        </div>

                        <div className="cssModelbody" style={{ overflow: 'scroll', height: '90vh' }}>

                            <div className="panel-body">
                                <div className='row'>
                                    <div className="col-md-12">
                                        <div className="ibox">
                                            <div className="ibox-head">
                                                <div className="ibox-title"> <span> <i className="fa ti-server" style={{ fontSize: 20 }} /> ข้อมูลรายการผ้า </span> </div>
                                                <div className="ibox-tools">
                                                    <a onClick={() => setModal(false)}><i className="fa ti-close" /></a>
                                                </div>
                                            </div>
                                            <div>

                                                <div className="row">

                                                    <div className="col-md-12">
                                                        <div className="ibox">
                                                            <div className="ibox-head">
                                                                <div className="ibox-title">
                                                                    รายการจ่ายผ้า <span style={{ color: 'green' }}>[ ใบเบิกเลขที่ : {txtvalue.t_orderID} ]</span> &nbsp;<span style={{ color: 'orange' }}>[ ใบจ่ายเลขที่ : {txtvalue.t_recoupid}]</span>&nbsp;

                                                                </div>
                                                                <div className="ibox-tools">

                                                                </div>
                                                            </div>
                                                            <div className="ibox-body">
                                                                <table className="table table-striped">
                                                                    <thead>
                                                                        <tr>
                                                                            <th> # </th>
                                                                            <th> รายการผ้า </th>
                                                                            <th> คงเหลือในตู้ </th>
                                                                            <th> คงเหลือในเตียง </th>
                                                                            <th> จำนวนยืมผ้า </th>
                                                                            <th> จำนวนผู้ป่วย </th>
                                                                            <th> ค้างจ่าย </th>
                                                                            <th> จ่าย </th>
                                                                            <th> หมายเหตุ </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            listOrder.map((item, row) =>

                                                                                <tr>
                                                                                    <td className="py-1">{row + 1}</td>
                                                                                    <td> {item.itemfabricname} </td>
                                                                                    <td> {item.itemcupboard} </td>
                                                                                    <td> {item.itembed} </td>
                                                                                    <td> {item.itemborrow} </td>
                                                                                    <td> {item.itempatientum} </td>
                                                                                    <td> {item.itemrecoupnum} </td>
                                                                                    <td> {item.itemrecoup} </td>
                                                                                    <td> {item.itemother} </td>
                                                                                </tr>

                                                                            )
                                                                        }

                                                                    </tbody>
                                                                </table>
                                                                <span>จำนวนทั้งหมด {listOrder.length} รายการ</span>
                                                            </div>

                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="ml-sm-auto" style={{ textAlign: 'center' }}>

                                                    &nbsp;
                                                    <ReactToPrint
                                                        trigger={() => <button className="btn btn-warning" type="button" style={{ cursor: 'pointer' }}> <i className="fa ti-printer" style={{ fontSize: 18 }} /> พิมพ์ใบเบิก </button>}
                                                        content={() => componentRef}
                                                    />&nbsp;

                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div style={{ display: 'none' }}>
                            <Frmprint key={JSON.stringify(dataprint)} row={dataprint} ref={(el) => (setcomponentRef(el))} />
                        </div>

                    </div>
                </Modal>

            </sesion>

            <span className="loader" hidden={loanding} />

        </div>
    )
}
