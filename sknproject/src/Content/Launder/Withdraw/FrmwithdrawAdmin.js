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
import Frmprint from './Frmwithdrawprint'

export default function FrmwithdrawAdmin() {

    const [modal, setModal] = useState(false);
    const [myData, setmyData] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_fabricid: '', t_fabricname: '', t_cupboard: '', t_bed: '', t_borrow: '', t_patientnum: '', t_other: '',
        t_orderID: '', t_orderstr: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [listOrder, setlistOrder] = useState([]);
    const [componentRef, setcomponentRef] = useState(true);
    const [dataprint, setdataprint] = useState([]);
    const [loanding, setloanding] = useState(true);

    useEffect(() => {

        Showdata();

    }, []);

    async function openModal(ID) {

        setlistOrder([]);
        if (ID != "0") {
            Showdataedit(ID);
            Showdataprint(ID);
        } else {
            settxtvalue(inputData);
            //Checkordernumber('0');
        }

        setModal(true);
        //setopenmodal(true);
    }

    async function closeModal() {
        settxtvalue(inputData);
        setlistOrder([]);
        setModal(false);
        document.getElementById("t_str1").checked = false;
        document.getElementById("t_str2").checked = false;
    }

    async function Showdata() {

        setloanding(false);
        setmyData([]);

        //fetch(API.dataSource.code + "WithdrawadminAPI.php?module=Showdata&officeID=" + txtvalue.t_officeid)
        fetch(API.dataSource.url + "Withdrawadmin?datestart=&datestop=&officeID=" + txtvalue.t_officeid)
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(json => {
                let Mydata = json;
                let { rows } = json;
                
                rows = Mydata.map((row, key) => ({
                    ...row,
                    orderid: row.orderid || row.Orderid,
                    officename: row.officename || row.Officename,
                    orderdate: row.orderdate || row.Orderdate,
                    ordertime: row.ordertime || row.Ordertime,
                    fullname: row.fullname || row.Fullname,
                    Edit: (
                        <>
                            <button className="btn btn-default btn-xs m-r-5" title="รับเข้า" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(row.orderid || row.Orderid)}><i className="ti-hand-open font-14" /></button>
                        </>
                    ),
                    typestr: (
                        <>
                            {
                                (row.orderseason || row.Orderseason) == "1" ? (
                                    <span style={{ color: '#23B7E5' }}>เช้า</span>
                                ) : (
                                    <span style={{ color: '#23B7E5' }}>บ่าย</span>
                                )
                            }
                        </>
                    )
                }));

                Mydata = {
                    columns: [
                        { label: 'เลขที่ใบเบิก', field: 'orderid', sort: 'asc', width: 20 },
                        { label: 'หน่วยงาน', field: 'officename', sort: 'asc', width: 500 },
                        { label: 'วันที่เบิก', field: 'orderdate', sort: 'asc', width: 500 },
                        { label: 'เวลา', field: 'ordertime', sort: 'asc', width: 200 },
                        { label: 'เจ้าหน้าที่', field: 'fullname', sort: 'asc', width: 50 },
                        { label: 'ช่วงเวลา', field: 'typestr', sort: 'asc', width: 50 },
                        { label: '', field: 'Edit', sort: 'asc', width: 20 }
                    ],
                    rows
                };
                setmyData(Mydata);
                setloanding(true);
            })
            .catch(error => {
                console.log("Error Showdata:", error);
                setloanding(true);
            });
    }

    async function Showdataedit(ID) {

        setlistOrder([]);

        fetch(API.dataSource.url + "Withdrawadmin/Edit/" + ID)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                if (!data || data.length === 0) return;

                settxtvalue({
                    ...txtvalue,
                    t_id: ID,
                    t_orderID: data[0].orderid || data[0].Orderid,
                    t_orderstr: data[0].orderseason || data[0].Orderseason
                })

                if ((data[0].orderseason || data[0].Orderseason) == "1") {
                    document.getElementById("t_str1").checked = true;
                } else {
                    document.getElementById("t_str2").checked = true;
                }

                const newOrders = data.map((item, index) => ({
                    ID: index,
                    itemfabricid: item.fabricID || item.FabricID,
                    itemfabricname: item.fabricName || item.FabricName,
                    itemcupboard: item.cupboard || item.Cupboard,
                    itembed: item.bed || item.Bed,
                    itemborrow: item.borrow || item.Borrow,
                    itempatientum: item.patientnum || item.Patientnum,
                    itemother: item.other || item.Other,
                }));

                setlistOrder(newOrders);

            })
            .catch(error => {
                console.log("Error Showdataedit:", error);
            });
    }

    async function Savedata() {

        if (listOrder.length <= '0') {
            alert("กรุณาทำการเพิ่มรายการผ้าด้วยครับ !");
            return false;
        } else if (txtvalue.t_name == "") {
            alert("กรุณาใส่ชื่อรายการผ้าด้วยครับ !");
            document.getElementById("t_name").focus();
            return false;
        } else if (txtvalue.t_orderstr == '') {
            alert("กรุณาเลือกช่วงเวลาขอเบิกผ้าด้วยครับ !");
            return false;
        } else {
            const method = "POST";
            const body = new FormData();
            body.append("tid", txtvalue.t_id);
            body.append("torderid", txtvalue.t_orderID);
            body.append("torderstatus", txtvalue.t_orderstr);
            body.append("tofficeid", txtvalue.t_officeid);
            body.append("tuserid", txtvalue.t_userid);
            fetch(API.dataSource.url + "Withdrawadmin", { method, body })
                .then(res => res.json())
                .then(data => {

                    alert("ระบบได้ทำการบันทึกรับเข้าเรียบร้อยแล้วครับ");

                    Showdata();
                    //settxtvalue(inputData);
                    //setlistOrder([]);
                    //setModal(false);

                });
        }

    }

    async function Showdataprint(ID) {

        fetch(API.dataSource.url + "Withdrawadmin/Print/" + ID + "?tofficeid=" + txtvalue.t_officeid)
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

   async function Deletedata(ID) {

        var conF = window.confirm("คุณต้องการยกเลิกรายการนี้ใช่หรือไม่ ?");
        if (conF == true) {

            if (ID == "") {
                alert("ไม่พบรายการที่คุณต้องการยกเลิกใบเบิก !");
                return false;
            } else {
                const method = "DELETE";

               fetch(API.dataSource.url + "Withdrawadmin/" + ID + "?tuserid=" + txtvalue.t_userid, { method })
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {

                        Showdata();
                        setModal(false);

                    })
                    .catch(error => {
                        console.log(error);
                    });

            }

        }

    }



    return (
        <div>
            <div className="page-heading">
                <h1 className="page-title"> รายการขอเบิกผ้า </h1>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="index.html"><i className="la la-home font-20" /></a>
                    </li>
                    <li className="breadcrumb-item"> Withdraw From </li>
                </ol>
            </div>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <div className="ibox-head">
                        <div className="ibox-title"> รายการเบิก</div>
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
                                                    <a onClick={() => closeModal()}><i className="fa ti-close" /></a>
                                                </div>
                                            </div>
                                            <div>

                                                <div className="row">

                                                    <div className="col-md-12">
                                                        <div className="ibox">
                                                            <div className="ibox-head">
                                                                <div className="ibox-title"> รายการเบิกผ้า <span>[ {txtvalue.t_orderID} ]</span></div>
                                                                <div className="ibox-tools">
                                                                    <span>จำนวนทั้งหมด {listOrder.length} รายการ</span>
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
                                                                                    <td> {item.itemother} </td>
                                                                                </tr>

                                                                            )
                                                                        }

                                                                    </tbody>
                                                                </table>

                                                            </div>

                                                            <div style={{ padding: 25 }}>
                                                                <label className="ui-radio ui-radio-primary">
                                                                    <input type="radio" id="t_str1" name="t_str" onClick={(even) => settxtvalue({ ...txtvalue, t_orderstr: '1' })} />
                                                                    <span className="input-span" /> เช้า </label> &nbsp;&nbsp;
                                                                <label className="ui-radio ui-radio-warning">
                                                                    <input type="radio" id="t_str2" name="t_str" onClick={(even) => settxtvalue({ ...txtvalue, t_orderstr: '2' })} />
                                                                    <span className="input-span" /> บ่าย </label>
                                                            </div>

                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="ml-sm-auto" style={{ textAlign: 'center' }}>

                                                    <button className="btn btn-info" type="button" style={{ cursor: 'pointer' }} onClick={() => Savedata()}> <i className="fa ti-save" style={{ fontSize: 18 }} /> รับเข้า </button>&nbsp;
                                                    <ReactToPrint
                                                        trigger={() => <button className="btn btn-warning" type="button" style={{ cursor: 'pointer' }}> <i className="fa ti-printer" style={{ fontSize: 18 }} /> พิมพ์ใบเบิก </button>}
                                                        content={() => componentRef}
                                                    />
                                                    &nbsp;
                                                    <button className="btn btn-danger" type="button" style={{ cursor: 'pointer' }} onClick={() => Deletedata(txtvalue.t_orderID)}> <i className="fa ti-trash" style={{ fontSize: 18 }} /> ยกเลิกใบเบิก </button>

                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div hidden="true">
                            <Frmprint key={dataprint} row={dataprint} ref={(el) => (setcomponentRef(el))} />
                        </div>

                    </div>
                </Modal>

            </sesion>

            <span className="loader" hidden={loanding} />

        </div>
    )
}
