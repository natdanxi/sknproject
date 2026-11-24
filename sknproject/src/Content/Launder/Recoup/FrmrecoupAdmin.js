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

export default function FrmrecoupAdmin() {

    const [modal, setModal] = useState(false);
    const [myData, setmyData] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_fabricid: '', t_fabricname: '', t_cupboard: '', t_bed: '', t_borrow: '', t_patientnum: '', t_other: '',
        t_orderstr: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [listOrder, setlistOrder] = useState([]);
    const [officeid, setofficeid] = useState('');
    const [dataprint, setdataprint] = useState([]);
    const [componentRef, setcomponentRef] = useState(true);
    const [orderID, setorderID] = useState(0);
    const [recoupID, setRecoupID] = useState(0);
    const [loanding, setloanding] = useState(true);

    useEffect(() => {

        Showdata();

    }, []);

    async function openModal(orderID, officeID) {

        setlistOrder([]);
        setorderID(0);
        setRecoupID(0);
        setofficeid(officeID);
        settxtvalue(inputData);
        Showdatadetail(orderID);
        Showdataprint(orderID, officeID);

        setModal(true);
        //setopenmodal(true);
    }

    async function closeModal() {
        settxtvalue(inputData);
        setlistOrder([]);
        document.getElementById("t_str1").checked = false;
        document.getElementById("t_str2").checked = false;
    }

    //เช็ครายการจ่าย
    async function Checkordernumber(str, orderid) {

        fetch(API.dataSource.code + "RecoupadminAPI.php?module=Checkordernumber&orderID=" + orderid)
            .then(response => {
                return response.json();
            })
            .then(data => {
                
                if (data == "") {
                    //settxtvalue({ ...txtvalue, t_orderID: orderid, t_recoupid: '' })
                    setorderID(orderid);
                    if (str == "0") {

                    } else {
                        Createnumber();
                    }

                } else if (data[0].CountID == "0") {

                    //settxtvalue({ ...txtvalue, t_orderID: orderid, t_recoupid: data[0].Recoupid })
                    setRecoupID(data[0].Recoupid);
                    setorderID(orderid);

                } else if (data[0].CountID > "0") {
                    //settxtvalue({ ...txtvalue, t_orderID: orderid, t_recoupid: '' })
                    setRecoupID(0);
                    setorderID(orderid);
                }

            })
            .catch(error => {
                console.log(error);
            });

    }

    //เสร้างเลขที่ใบจ่าย
    async function Createnumber() {

        if (orderID == "" || orderID == "undefined") {
            alert("มีข้อผิดพลาดกรุณาเลือกรายการใหม่อีกครั้ง !")
            window.location.reload();
        } else {

            fetch(API.dataSource.code + "RecoupadminAPI.php?module=Createnumber&orderid=" + orderID + "&userID=" + txtvalue.t_userid + "&tofficeid=" + officeid)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    //settxtvalue({ ...txtvalue, t_recoupid: data })
                    setRecoupID(data);

                })
                .catch(error => {
                    console.log(error);
                });

        }

    }

    async function Showdata() {

        setloanding(false);
        setmyData([]);
        
        fetch(API.dataSource.code + "RecoupadminAPI.php?module=Showdata")
            .then(res => res.json())
            .then(json => {
                //alert(json);
                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    Edit: (
                        <>
                            <button className="btn btn-default btn-xs m-r-5" title="จ่ายผ้า" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(row.Orderid, row.Officeid)}><i className="ti-hand-open font-14" /></button>
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
                                    <span></span>
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
                            label: 'หน่วยงาน',
                            field: 'Officename',
                            sort: 'asc',
                            width: 500
                        },
                        {
                            label: 'วันที่เบิก',
                            field: 'Orderdate',
                            sort: 'asc',
                            width: 500
                        },
                        {
                            label: 'เวลา',
                            field: 'Ordertime',
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

    async function Showdatadetail(orderID) {

        setlistOrder([]);
        //alert(API.dataSource.code + "RecoupadminAPI.php?module=Showdataedit&idEdit=" + orderID)
        fetch(API.dataSource.code + "RecoupadminAPI.php?module=Showdataedit&idEdit=" + orderID)
            .then(response => {
                return response.json();
            })
            .then(data => {

                settxtvalue({
                    ...txtvalue,
                    t_id: orderID,
                    t_orderstr: data[0].Orderseason,
                })
                setorderID(orderID);
                Checkordernumber('0', orderID);

                for (var i = 0; i < data.length; i++) {

                    setlistOrder(prevItems => [...prevItems,
                    {
                        ID: prevItems.length,
                        itemfabricid: data[i].FabricID,
                        itemfabricname: data[i].FabricName,
                        itemstocknum: data[i].Stocknum,
                        itembed: data[i].Bed,
                        itemborrow: parseInt(data[i].Borrow),
                        itemrecoupnum: parseInt(data[i].Borrow) - parseInt(data[i].Recoupnum),
                        itempatientum: data[i].Patientnum,
                        itemother: data[i].Other,
                    }]);

                }

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Savedata() {

        if (txtvalue.t_recoupid == '') {
            alert("กรุณาสร้างเลขที่จ่ายด้วยครับ !");
            return false;
        } else if (listOrder.length <= '0') {
            alert("กรุณาทำการเพิ่มรายการผ้าด้วยครับ !");
            return false;
        } else {

            var conF = window.confirm("คุณต้องการสั่งจ่ายรายการนี้ใช่หรือไม่ ?");
            if (conF == true) {

                listOrder.map((item, row) =>

                    fetch(API.dataSource.code + "RecoupadminAPI.php?module=Inputdatadetail&orderid=" + orderID + "&recoupid=" + txtvalue.t_recoupid
                        + "&fabricID=" + item.itemfabricid + "&recoupnum=" + document.getElementById("t_num" + row).value
                    )
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {

                            settxtvalue(inputData);
                            setorderID(0);
                            setRecoupID(0);
                            setModal(false);
                            Showdata();

                        })
                        .catch(error => {
                            console.log(error);
                        })

                )

            }

        }

    }

    async function Deletedata(ID) {

        var conF = window.confirm("คุณต้องการยกเลิกรายการนี้ใช่หรือไม่ ?");
        if (conF == true) {

            if (ID == "") {
                alert("ไม่พบรายการที่คุณต้องการยกเลิกใบเบิก !");
                return false;
            } else {

                fetch(API.dataSource.code + "RecoupadminAPI.php?module=Deletedata&idDel=" + ID + "&tuserid=" + txtvalue.t_userid)
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

    async function onchangenumber(val, row, total) {
        const t_num = document.getElementById("t_num" + row).value;
        if (parseInt(t_num) > total) {
            alert("คุณใส่ข้อมูลไม่ถูกต้องครับ !");
            document.getElementById("t_num" + row).value = "";
            return false;
        } else if (parseInt(val) < 0) {
            alert("คุณใส่ข้อมูลไม่ถูกต้องครับ !");
            document.getElementById("t_num" + row).value = "";
            return false;
        }
    }

    async function Showdataprint(ID, officeID) {

        fetch(API.dataSource.code + "RecoupadminAPI.php?module=Showdataprint&id=" + ID + "&officeid=" + officeID)
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
                                                    <a onClick={() => setModal(false)}><i className="fa ti-close" /></a>
                                                </div>
                                            </div>
                                            <div>

                                                <div className="row">

                                                    <div className="col-md-12">
                                                        <div className="ibox">
                                                            <div className="ibox-head">
                                                                <div className="ibox-title">
                                                                    รายการจ่ายผ้า <span style={{ color: 'green' }}>[ ใบเบิกเลขที่ : {orderID} ]</span> &nbsp;<span style={{ color: 'orange' }}>[ ใบจ่ายเลขที่ : {recoupID}]</span>&nbsp;

                                                                </div>
                                                                <div className="ibox-tools">
                                                                    <button className="btn btn-success" type="button" style={{ cursor: 'pointer' }} onClick={() => Checkordernumber('1', orderID)}> <i className="fa ti-pencil-alt" style={{ fontSize: 18 }} /> สร้างเลขที่ใบจ่าย </button>
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
                                                                            <th> หมายเหตุ </th>
                                                                            <th> จ่าย </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            listOrder.map((item, row) =>

                                                                                <tr>
                                                                                    <td className="py-1">{row + 1}</td>
                                                                                    <td> {item.itemfabricname} </td>
                                                                                    <td> {item.itemstocknum} </td>
                                                                                    <td> {item.itembed} </td>
                                                                                    <td> {item.itemborrow} </td>
                                                                                    <td> {item.itempatientum} </td>
                                                                                    <td> {item.itemrecoupnum} </td>
                                                                                    <td> {item.itemother} </td>
                                                                                    <td> <input type="text" id={"t_num" + row} style={{ width: 50 }} onChange={(even) => onchangenumber(even.target.value, row, item.itemrecoupnum)} /> </td>
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

                                                    <button className="btn btn-info" type="button" style={{ cursor: 'pointer' }} onClick={() => Savedata()}> <i className="fa ti-save" style={{ fontSize: 18 }} /> บันทึกจ่ายออก </button>&nbsp;
                                                    <ReactToPrint
                                                        trigger={() => <button className="btn btn-warning" type="button" style={{ cursor: 'pointer' }}> <i className="fa ti-printer" style={{ fontSize: 18 }} /> พิมพ์ใบเบิก </button>}
                                                        content={() => componentRef}
                                                    />&nbsp;
                                                    <button className="btn btn-danger" type="button" style={{ cursor: 'pointer' }} onClick={() => Deletedata(orderID)}> <i className="fa ti-trash" style={{ fontSize: 18 }} /> ยกเลิกจ่ายออก </button>

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
