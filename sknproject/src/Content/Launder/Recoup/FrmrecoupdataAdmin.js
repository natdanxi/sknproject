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
        Showdataprint(Recoupid);

        setModal(true);
        //setopenmodal(true);
    }

    async function closeModal() {
        settxtvalue(inputData);
        setlistOrder([]);
        document.getElementById("t_str1").checked = false;
        document.getElementById("t_str2").checked = false;
    }

    async function Showdata() {

        setloanding(false);
        setmyData([]);

        fetch(API.dataSource.code + "RecoupdataadminAPI.php?module=Showdata")
            .then(res => res.json())
            .then(json => {
                //alert(json);
                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    Edit: (
                        <>
                            <button className="btn btn-default btn-xs m-r-5" title="จ่ายผ้า" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(row.Orderid, row.Officeid, row.Recoupid)}><i className="ti-hand-open font-14" /></button>
                        </>
                    ),
                    typestr: (
                        <>
                            {
                                row.Orderseason == "1" ? (
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
                                row.Orderstatus == '0' ? (
                                    <span style={{ color: '#CCCC66' }}>รอรับเข้า</span>
                                ) : row.Orderstatus == '1' ? (
                                    <span style={{ color: '#009900' }}>รอจ่าย</span>
                                ) : row.Orderstatus == '2' ? (
                                    <span style={{ color: '#CC0000' }}>ค่างจ่าย</span>
                                ) : (
                                    <span style={{ color: '#009900' }}>จ่ายครบแล้ว</span>
                                )
                            }
                        </>
                    )

                }));

                Mydata = {
                    columns: [
                        {
                            label: 'เลขที่ใบเบิก',
                            field: 'Orderid',
                            sort: 'asc',
                            width: 20
                        },
                        {
                            label: 'เลขที่จ่าย',
                            field: 'Recoupid',
                            sort: 'asc',
                            width: 500
                        },
                        {
                            label: 'หน่วยงาน',
                            field: 'Officename',
                            sort: 'asc',
                            width: 500
                        },
                        {
                            label: 'วันที่จ่าย',
                            field: 'Recoupdate',
                            sort: 'asc',
                            width: 500
                        },
                        {
                            label: 'เวลา',
                            field: 'Recouptime',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'เจ้าหน้าที่',
                            field: 'fullname',
                            sort: 'asc',
                            width: 50
                        },
                        {
                            label: 'ช่วงเวลา',
                            field: 'typestr',
                            sort: 'asc',
                            width: 50
                        },
                        {
                            label: 'สถานะ',
                            field: 'Status',
                            sort: 'asc',
                            width: 50
                        },
                        {
                            label: '',
                            field: 'Edit',
                            sort: 'asc',
                            width: 20
                        }
                    ],
                    rows
                };
                setmyData(Mydata);
                setloanding(true);
            });

    }

    async function Showdatadetail(orderID, recoupid) {

        setlistOrder([]);

        fetch(API.dataSource.code + "RecoupdataadminAPI.php?module=Showdatadetail&orderid=" + orderID)
            .then(response => {
                return response.json();
            })
            .then(data => {

                settxtvalue({
                    ...txtvalue,
                    t_id: orderID,
                    t_orderID: orderID,
                    t_recoupid: recoupid,
                    t_orderstr: data[0].Orderseason,
                })

                for (var i = 0; i < data.length; i++) {

                    setlistOrder(prevItems => [...prevItems,
                    {
                        ID: prevItems.length,
                        itemfabricid: data[i].FabricID,
                        itemfabricname: data[i].FabricName,
                        itemcupboard: data[i].Stocknum,
                        itembed: data[i].Bed,
                        itemborrow: parseInt(data[i].Borrow),
                        itemrecoupnum: parseInt(data[i].Borrow) - parseInt(data[i].Recoupnum),
                        itemrecoup: parseInt(data[i].Recoupnum),
                        itempatientum: data[i].Patientnum,
                        itemother: data[i].Other,
                    }]);

                }

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Showdataprint(ID) {

        fetch(API.dataSource.code + "RecoupdataadminAPI.php?module=Showdataprint&id=" + ID + "&officeid=" + officeid)
            .then(response => {
                return response.json();
            })
            .then(data => {

                setdataprint(data);
                //alert(data)

            })
            .catch(error => {
                console.log(error);
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
                                                                                    <td> </td>
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

                        <di hidden="true">
                            <Frmprint key={dataprint} row={dataprint} ref={(el) => (setcomponentRef(el))} />
                        </di>

                    </div>
                </Modal>

            </sesion>

            <span className="loader" hidden={loanding} />
            
        </div>
    )
}
