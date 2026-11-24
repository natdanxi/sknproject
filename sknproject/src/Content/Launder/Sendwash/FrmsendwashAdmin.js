import React, { useEffect, useState } from 'react';
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
import ReactToPrint from 'react-to-print'
import Frmprint from './FrmsendwashPrint'


export default function FrmsendwashAdmin() {

    const [modal, setModal] = useState(false);
    const [myData, setmyData] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_id: '', t_orderID: '', officeID: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [listOrder, setlistOrder] = useState([]);
    const [orderPrint, setorderPrint] = useState([]);
    const [componentRef, setcomponentRef] = useState(true);
    const [loanding, setloanding] = useState(true);


    useEffect(() => {

        Showdata();

    }, []);

    async function openModal(ID) {

        setlistOrder([]);
        if (ID != "0") {
            Showdataedit(ID);
        } else {
            settxtvalue(inputData);
        }

        setModal(true);

    }

    async function closeModal() {
        settxtvalue(inputData);
        setlistOrder([]);
    }

    async function Showdata() {
        setloanding(false);
        setmyData([]);

        try {
            const res = await fetch(`${API.dataSource.url}Sendwash/Showdataadmin`);
            if (!res.ok) throw new Error(`โหลดข้อมูลไม่สำเร็จ (${res.status})`);

            const json = await res.json();
            const rows = json.map((row, key) => {
                const orderId = row.sendorderid || row.Sendorderid;
                const status = row.sendstatus ?? row.Sendstatus;

                return {
                    ...row,
                    Sendorderid: orderId,
                    Senddate: row.senddate || row.Senddate,
                    Sendtime: row.sendtime || row.Sendtime,
                    Officename: row.officename || row.Officename,
                    fullname: row.fullname || row.Fullname,
                    Edit: (
                        <MDBBadge
                            className='w-0'
                            searchvalue={key}
                            key={key}
                            style={{ float: 'right' }}
                        >

                            <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer', color: 'green' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(orderId)}><i className="ti-hand-open font-14" /></button>
                            <button className="btn btn-default btn-xs" style={{ cursor: 'pointer', color: 'red' }} data-toggle="tooltip" data-original-title="Delete" onClick={() => Deletedata(orderId)}><i className="fa fa-trash font-14" /></button>

                        </MDBBadge>
                    ),
                    status: (
                        <>
                            {
                                status == "0" ? (
                                    <span className="badge badge-warning">รอยืนยันรับเข้า</span>
                                ) : (
                                    <span className="badge badge-success">รับเข้าแล้ว</span>
                                )
                            }
                        </>
                    ),
                };
            });

            const Mydata = {
                columns: [
                    {
                        label: 'เลขที่ใบเบิก',
                        field: 'Sendorderid',
                        sort: 'asc',
                        width: 20
                    },
                    {
                        label: 'วันที่เบิก',
                        field: 'Senddate',
                        sort: 'asc',
                        width: 500
                    },
                    {
                        label: 'เวลา',
                        field: 'Sendtime',
                        sort: 'asc',
                        width: 200
                    },
                    {
                        label: 'หน่วยงาน',
                        field: 'Officename',
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
        } catch (error) {
            console.error("[Showdata Error]:", error);
        } finally {
            setloanding(true);
        }
    }

    async function Showdataedit(ID) {
        setlistOrder([]);

        try {
            const res = await fetch(`${API.dataSource.url}Sendwash/Edit/${ID}`);
            if (!res.ok) throw new Error(`โหลดข้อมูลแก้ไขไม่สำเร็จ (${res.status})`);

            const data = await res.json();
            if (!data || data.length === 0) return;

            Showprint(ID);

            settxtvalue({
                ...txtvalue,
                t_id: ID,
                t_orderID: data[0].sendorderid || data[0].Sendorderid,
                officeID: data[0].sendofficeid || data[0].Sendofficeid
            });

            const newOrders = data.map((item, index) => ({
                ID: index,
                itemfabricid: item.fabricID || item.FabricID,
                itemfabricname: item.fabricName || item.FabricName,
                itemsendnum: item.sendnum || item.Sendnum,
                itemother: item.sendother || item.Sendother,
            }));

            setlistOrder(newOrders);
        } catch (error) {
            console.error("[Showdataedit Error]:", error);
        }
    }

    async function Savedata(ID) {
        if (!window.confirm("คุณต้องการยืนยันรับเข้าใช่หรือไม่ ?")) return;

        if (!ID) {
            alert("ไม่พบรายการที่คุณต้องการยืนยันรับเข้า !");
            return;
        }

        try {
            const res = await fetch(
                `${API.dataSource.url}Sendwash/Inputdataadmin/${ID}?officeid=${txtvalue.officeID}`,
                { method: "POST" }
            );

            if (!res.ok) throw new Error(`ยืนยันรับเข้าไม่สำเร็จ (${res.status})`);

            await res.json();
            Showdata();
            setModal(false);
        } catch (error) {
            console.error("[Savedata Error]:", error);
            alert(`เกิดข้อผิดพลาดในการยืนยันรับเข้า: ${error.message}`);
        }
    }

    async function Deletedata(ID) {
        if (!window.confirm("คุณต้องการยกเลิกรายการนี้ใช่หรือไม่ ?")) return;

        if (!ID) {
            alert("ไม่พบรายการที่คุณต้องการยกเลิกใบนำส่ง !");
            return;
        }

        try {
            const res = await fetch(`${API.dataSource.url}Sendwash/${ID}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error(`ยกเลิกรายการไม่สำเร็จ (${res.status})`);

            await res.json();
            Showdata();
            setModal(false);
        } catch (error) {
            console.error("[Deletedata Error]:", error);
            alert(`เกิดข้อผิดพลาดในการยกเลิก: ${error.message}`);
        }
    }

  async function Showprint(ID) {
        setorderPrint([]);

        try {
            const res = await fetch(`${API.dataSource.url}Sendwash/Showprint/${ID}`);
            if (!res.ok) throw new Error(`โหลดข้อมูลพิมพ์ไม่สำเร็จ (${res.status})`);

            const data = await res.json();
            const mappedPrintData = data.map(item => ({
                ...item,
                Orderusersend: item.orderusersend || item.Orderusersend,
                PositionSend: item.positionSend || item.PositionSend,
                Receiveuserid: item.receiveuserid || item.Receiveuserid,
                Receiveuserposition: item.receiveuserposition || item.Receiveuserposition,
                Officename: item.officename || item.Officename,
                Senddate: item.senddate || item.Senddate,
                Sendtime: item.sendtime || item.Sendtime,
                fullname: item.fullname || item.Fullname,
                Position: item.position || item.Position,
                FabricID: item.fabricID || item.FabricID,
                FabricName: item.fabricName || item.FabricName,
                Sendnum: item.sendnum || item.Sendnum,
                Sendother: item.sendother || item.Sendother
            }));

            setorderPrint(mappedPrintData);
        } catch (error) {
            console.error("[Showprint Error]:", error);
        }
    }


    return (
        <>
            <div className="page-heading">
                <h1 className="page-title"> รายการส่งซัก </h1>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="index.html"><i className="la la-home font-20" /></a>
                    </li>
                    <li className="breadcrumb-item"> Wash From </li>
                </ol>
            </div>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <div className="ibox-head">
                        <div className="ibox-title"> รายการส่งซัก </div>
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
                                                                            <th> จำนวน </th>
                                                                            <th> หมายเหตุ </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            listOrder.map((item, row) =>

                                                                                <tr>
                                                                                    <td className="py-1">{row + 1}</td>
                                                                                    <td> {item.itemfabricname} </td>
                                                                                    <td> {item.itemsendnum} </td>
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

                                                    <ReactToPrint
                                                        trigger={() => <button className="btn btn-warning" type="button" style={{ cursor: 'pointer' }}> <i className="fa ti-printer" style={{ fontSize: 18 }} /> พิมพ์ใบส่งซัก </button>}
                                                        content={() => componentRef}
                                                    />
                                                    &nbsp;
                                                    <button className="btn btn-info" type="button" style={{ cursor: 'pointer' }} onClick={() => Savedata(txtvalue.t_orderID)}> <i className="fa ti-save" style={{ fontSize: 18 }} /> รับเข้า </button>&nbsp;
                                                    &nbsp;
                                                    <button className="btn btn-danger" type="button" style={{ cursor: 'pointer' }} onClick={() => Deletedata(txtvalue.t_orderID)}> <i className="fa ti-trash" style={{ fontSize: 18 }} /> ยกเลิกใบเบิก </button>

                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <di hidden="true">
                            <Frmprint key={orderPrint} row={orderPrint} ref={(el) => (setcomponentRef(el))} />
                        </di>

                    </div>
                </Modal>

            </sesion>

            <span className="loader" hidden={loanding} />

        </>
    )
}
