import React, { useEffect, useState } from 'react'
import {
    MDBDataTable, MDBDataTableV5, MDBBtn, MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBBadge,
} from 'mdbreact';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
} from '@coreui/react'

import Modal from 'react-awesome-modal';
import API from '../../../Config/config'
import Select from 'react-select'

export default function Frmtake() {

    const [modal, setModal] = useState(false);
    const [myData, setmyData] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),

    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [listOrder, setlistOrder] = useState([]);


    useEffect(() => {

        Showdata();

    }, []);

    async function openModal(ID) {

        setModal(true);
        Showdatadetail(ID);

    }

    async function closeModal() {
        setModal(false);
    }

    async function Showdata() {

        fetch(API.dataSource.code + "TakedownAPI.php?module=Showdata&officeID=" + txtvalue.t_officeid)
            .then(res => res.json())
            .then(json => {
                //alert(json);
                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    Edit: (
                        <>
                            <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(row.Recoupid)}><i className="ti-hand-open font-14" /></button>
                        </>
                    ),
                    status: (
                        <>
                            {
                                row.Orderstatus == "0" ? (
                                    <span style={{ backgroundColor: '#CC9900', color: '#FFFFFF', fontSize: 10, padding: 4, borderRadius: 2 }}>รอยืนยันรับเข้า</span>
                                ) : row.Orderstatus == "1" ? (
                                    <span style={{ backgroundColor: '#009900', color: '#FFFFFF', fontSize: 10, padding: 4, borderRadius: 2 }}>รับเข้าแล้ว</span>
                                ) : row.Orderstatus == "2" ? (
                                    <span style={{ backgroundColor: '#CC0000', color: '#FFFFFF', fontSize: 10, padding: 4, borderRadius: 2 }}>ค้างจ่าย</span>
                                ) : (
                                    <span style={{ backgroundColor: '#666666', color: '#FFFFFF', fontSize: 10, padding: 4, borderRadius: 2 }}>จ่ายครบแล้ว</span>
                                )
                            }
                        </>
                    ),

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
                            label: 'วันที่จ่าย',
                            field: 'Recoupdate',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'เวลา',
                            field: 'Recouptime',
                            sort: 'asc',
                            width: 50
                        },
                        {
                            label: 'เจ้าหน้าที่',
                            field: 'fullname',
                            sort: 'asc',
                            width: 50
                        },
                        {
                            label: 'สถานะ',
                            field: 'status',
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
            });

    }

    async function Showdatadetail(ID) {

        setlistOrder([]);

        fetch(API.dataSource.code + "TakedownAPI.php?module=Showdatadetail&id=" + ID + "&officeid=" + txtvalue.t_officeid)
            .then(response => {
                return response.json();
            })
            .then(data => {

                settxtvalue({
                    ...txtvalue,
                    t_id: ID,
                    t_orderID: ID,
                    t_orderstr: data[0].Orderseason,
                })

                for (var i = 0; i < data.length; i++) {

                    var Borrow = 0
                    var Recoupnum = 0
                    var Arrearsnum = 0

                    if (data[i].Borrow != '') {
                        var Borrow = parseInt(data[i].Borrow)
                    } else {
                        var Borrow = 0
                    }

                    if (data[i].Recoupnum != '') {
                        var Recoupnum = parseInt(data[i].Recoupnum)
                    } else {
                        var Recoupnum = 0
                    }

                    if (data[i].Arrearsnum != '') {
                        Arrearsnum = parseInt(data[i].Arrearsnum)
                    } else {
                        Arrearsnum = 0;
                    }

                    setlistOrder(prevItems => [...prevItems,
                    {
                        ID: prevItems.length,
                        itemrecoupid: data[i].Recoupid,
                        itemorderid: data[i].Orderid,
                        itemfabricid: data[i].FabricID,
                        itemfabricname: data[i].FabricName,
                        itemborrownum: Borrow,
                        itemrecoupnum: Recoupnum,
                        itembarrearsnum: data[i].Arrearsnum,
                        itemborrow: parseInt(Borrow) - (parseInt(Recoupnum) + parseInt(Arrearsnum)),
                        itemother: data[i].Other,
                    }]);

                }

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Savedata() {

        var conF = window.confirm("คุณต้องการรับเข้ารายการนี้ใช่หรือไม่ ?");
        if (conF == true) {

            listOrder.map((item, row) =>

                fetch(API.dataSource.code + "TakedownAPI.php?module=Inputdata&recoupid=" + item.itemrecoupid
                    + "&tuserid=" + txtvalue.t_userid + "&orderid=" + item.itemorderid + "&fabricid=" + item.itemfabricid
                    + "&recoupnum=" + item.itemrecoupnum + "&officeid=" + txtvalue.t_officeid
                )
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {

                        Showdata();
                        setModal(false);

                    })
                    .catch(error => {
                        console.log(error);
                    })

            )

        }

    }


    return (
        <>
            <div className="page-heading">
                <h1 className="page-title"> รายการจ่ายผ้า </h1>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="index.html"><i className="la la-home font-20" /></a>
                    </li>
                    <li className="breadcrumb-item"> Takedown From </li>
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
                            sortRows={['id']}
                            data={myData}
                        />
                    </div>
                </div>

            </div>

            <sesion>
                <Modal visible={modal} width="70%" effect="fadeInUp" onClick={() => closeModal()}>
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
                                                                <div className="ibox-title"> รายการจ่ายผ้า <span style={{ color: 'green' }}>[ ใบเบิกเลขที่ : {txtvalue.t_orderID} ]</span></div>
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
                                                                            <th> ยอดเบิก </th>
                                                                            <th> ยอดจ่าย </th>
                                                                            <th> จ่ายแล้ว </th>
                                                                            <th> ค้างจ่าย </th>
                                                                            <th> หมายเหตุ </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            listOrder.map((item, row) =>

                                                                                <tr>
                                                                                    <td className="py-1">{row + 1}</td>
                                                                                    <td> {item.itemfabricname} </td>
                                                                                    <td> {item.itemborrownum} </td>
                                                                                    <td> {item.itemrecoupnum} </td>
                                                                                    <td> {item.itembarrearsnum} </td>
                                                                                    <td> {item.itemborrow} </td>
                                                                                    <td> {item.itemother} </td>
                                                                                </tr>

                                                                            )
                                                                        }

                                                                    </tbody>
                                                                </table>

                                                            </div>

                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="ml-sm-auto" style={{ textAlign: 'center' }}>

                                                    <button className="btn btn-info" type="button" style={{ cursor: 'pointer' }} onClick={() => Savedata()}> <i className="fa ti-save" style={{ fontSize: 18 }} /> บันทึกรับเข้า </button>&nbsp;

                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>
                </Modal>
            </sesion>
        </>
    )
}
