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
import Frmprint from './FrmsendwashPrint'

export default function Frmsendwash() {

    const [modal, setModal] = useState(false);
    const [modalPrint, setmodalPrint] = useState(false);
    const [myData, setmyData] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_fabricid: '', t_fabricname: '', t_sennum: '', t_other: '', t_orderID: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [listfabric, setlistfabric] = useState([]);
    const [listOrder, setlistOrder] = useState([]);
    const [orderPrint, setorderPrint] = useState([]);
    const [componentRef, setcomponentRef] = useState(true);


    useEffect(() => {

        Listfabric();
        Showdata();

    }, []);

    async function Listfabric() {
        fetch(API.dataSource.url + "Sendwash/Showlistfabric?officeID=" + txtvalue.t_officeid)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                setlistfabric(data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    async function openModal(ID) {

        setlistOrder([]);
        if (ID != "0") {
            Showdataedit(ID);
        } else {
            settxtvalue(inputData);
            Checkordernumber('0');
        }

        setModal(true);

    }

    async function Onchangselect(even) {
        fetch(API.dataSource.url + "Sendwash/Showstock/" + even.value + "?officeID=" + txtvalue.t_officeid)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                const item = Array.isArray(data) ? data[0] : data;
                settxtvalue({ 
                    ...txtvalue, 
                    t_fabricid: even.value, 
                    t_fabricname: even.label, 
                    t_cupboard: item.stocknum || item.Stocknum 
                })
            })
            .catch(error => {
                console.log(error);
            });

        document.getElementById("t_sendnum").focus();
    }

    //เช็ครายการส่ง
    async function Checkordernumber(str) {
        fetch(API.dataSource.url + "Sendwash/Checkordernumber?officeID=" + txtvalue.t_officeid)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                if (!data || data === "" || data.length === 0) {
                    if (str == "0") {
                    } else {
                        Createnumber();
                    }
                } else {
                    const item = Array.isArray(data) ? data[0] : data;
                    const countID = item.countID || item.CountID;
                    const sendStatus = item.sendstatus || item.Sendstatus;
                    const sendOrderId = item.sendorderid || item.Sendorderid;

                    if (countID == "0" || countID === 0) {
                        if (str == "0") {
                        } else {
                        }
                        settxtvalue({ ...txtvalue, t_orderID: sendOrderId })
                    } else if (countID > "0" && sendStatus == "0") {
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    //เสร้างเลขที่นำส่ง
    async function Createnumber() {
        const method = "POST";
        fetch(API.dataSource.url + "Sendwash/Createnumber?officeID=" + txtvalue.t_officeid + "&userID=" + txtvalue.t_userid, { method })
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.text(); 
            })
            .then(data => {
                settxtvalue({ ...txtvalue, t_orderID: data.replace(/['"]+/g, '') })
            })
            .catch(error => {
                console.log(error);
            });
    }

    async function Showprint(ID) {
        setorderPrint([]);
        fetch(API.dataSource.url + "Sendwash/Showprint/" + ID)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                const mappedData = data.map(item => ({
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

                setorderPrint(mappedData);
                settxtvalue({ ...txtvalue, t_orderID: ID })
                setmodalPrint(true);
            })
            .catch(error => {
                console.log(error);
            });
    }

    async function Showdata() {
        fetch(API.dataSource.url + "Sendwash?officeID=" + txtvalue.t_officeid)
            .then(res => res.json())
            .then(json => {
                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    Sendorderid: row.sendorderid || row.Sendorderid,
                    Senddate: row.senddate || row.Senddate,
                    Sendtime: row.sendtime || row.Sendtime,
                    fullname: row.fullname || row.Fullname,
                    Edit: (
                        <MDBBadge className='w-0' searchvalue={key} key={key} style={{ float: 'right' }}>
                            {
                                (row.sendstatus || row.Sendstatus) == '0' ? (
                                    <>
                                        <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => Showprint(row.sendorderid || row.Sendorderid)}><i className="fa fa-print font-14" /></button>
                                        <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(row.sendorderid || row.Sendorderid)}><i className="fa fa-pencil font-14" /></button>
                                        <button className="btn btn-default btn-xs" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Delete" onClick={() => Deletedata(row.sendorderid || row.Sendorderid)}><i className="fa fa-trash font-14" /></button>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => Showprint(row.sendorderid || row.Sendorderid)}><i className="fa fa-print font-14" /></button>
                                        <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" title="รับเข้าระบบแล้ว"><i className="fa fa-pencil font-14" /></button>
                                        <button className="btn btn-default btn-xs" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Delete" title="รับเข้าระบบแล้ว"><i className="fa fa-trash font-14" /></button>
                                    </>
                                )
                            }


                       </MDBBadge>
                    ),
                    status: (
                        <>
                            {
                                (row.sendstatus || row.Sendstatus) == "0" ? (
                                    <span className="badge badge-warning">รอยืนยันรับเข้า</span>
                                ) : (
                                    <span className="badge badge-success">รับเข้าแล้ว</span>
                                )
                            }
                        </>
                    ),
                }));

                Mydata = {
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

    async function Showdataedit(ID) {
        setlistOrder([]);

        fetch(API.dataSource.url + "Sendwash/Edit/" + ID)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                if (!data || data.length === 0) return;

                settxtvalue({
                    ...txtvalue,
                    t_id: ID,
                    t_orderID: data[0].sendorderid || data[0].Sendorderid,
                })

                const newOrders = data.map((item, index) => ({
                    ID: index,
                    itemfabricid: item.fabricID || item.FabricID,
                    itemfabricname: item.fabricName || item.FabricName,
                    itemsendnum: item.sendnum || item.Sendnum,
                    itemother: item.sendother || item.Sendother,
                }));
                setlistOrder(newOrders);
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Helper แปลง Object เป็น FormData (กันค่า null/undefined)
    const toFormData = (obj) => {
        const formData = new FormData();
        Object.entries(obj).forEach(([key, value]) => {
            formData.append(key, value ?? "");
        });
        return formData;
    };

    async function Savedata() {
        if (!listOrder?.length) {
            alert("กรุณาทำการเพิ่มรายการผ้าด้วยครับ !");
            return;
        }
        if (!txtvalue.t_orderID?.trim()) {
            alert("กรุณาทำการสร้างเลขที่ใบนำส่งด้วยครับ !");
            return;
        }

        try {
            const headerPayload = toFormData({
                tid: txtvalue.t_id || "0",
                torderid: txtvalue.t_orderID,
                tofficeid: txtvalue.t_officeid,
                tuserid: txtvalue.t_userid,
            });

            const headerRes = await fetch(`${API.dataSource.url}Sendwash`, {
                method: "POST",
                body: headerPayload,
            });

            if (!headerRes.ok) {
                throw new Error(`บันทึกข้อมูลหลักไม่สำเร็จ (${headerRes.status})`);
            }

            const headerData = await headerRes.json();
            const orderId = headerData && headerData !== "0" ? headerData : txtvalue.t_orderID;

            await Promise.all(
                listOrder.map(async (item) => {
                    const detailPayload = toFormData({
                        torderid: orderId,
                        tfabricID: item.itemfabricid,
                        tordernum: item.itemsendnum || "0",
                        tother: item.itemother,
                        tofficeid: txtvalue.t_officeid,
                    });

                    const detailRes = await fetch(`${API.dataSource.url}Sendwash/Detail`, {
                        method: "POST",
                        body: detailPayload,
                    });

                    if (!detailRes.ok) {
                        throw new Error(`บันทึกรายการผ้า ${item.itemfabricid} ไม่สำเร็จ`);
                    }
                    return detailRes.json();
                })
            );

            alert("ระบบได้ทำการบันทึกใบนำส่งเรียบร้อยแล้วครับ");
            Showdata();
            settxtvalue(inputData);
            setlistOrder([]);
            setModal(false);

        } catch (error) {
            console.error("[Savedata Error]:", error);
            alert(`เกิดข้อผิดพลาดในการบันทึก: ${error.message}`);
        }
    }


    async function Deletedata(ID) {
        if (!window.confirm("คุณต้องการยกเลิกรายการนี้ใช่หรือไม่ ?")) return;

        if (!ID) {
            alert("ไม่พบรายการที่คุณต้องการยกเลิกใบนำส่ง !");
            return;
        }

        try {
            const res = await fetch(
                `${API.dataSource.url}Sendwash/${ID}?tofficeid=${txtvalue.t_officeid}`,
                { method: "DELETE" }
            );

            if (!res.ok) {
                throw new Error(`ยกเลิกรายการไม่สำเร็จ (${res.status})`);
            }

            const data = await res.json();
            if (data == "0" || data === 0) {
                Showdata();
                setModal(false);
            } else {
                alert("ไม่สามารถทำการยกเลิกรายการนี้ได้เนื่องจากได้มีการรับเข้าระบบเรียบร้อยแล้วครับ !");
            }
        } catch (error) {
            console.error("[Deletedata Error]:", error);
            alert(`เกิดข้อผิดพลาดในการยกเลิก: ${error.message}`);
        }
    }
    async function Addlistorder() {
        if (txtvalue.t_orderID == "") {
            alert("กรุณาทำการสร้างเลขที่ใบนำส่งด้วยครับ !");
            return false;
        } else if (txtvalue.t_sennum == "") {
            alert("กรุณาใส่จำนวนส่งซักด้วยครับ !");
            document.getElementById("t_sendnum").focus();
            return false;
        } else if (Checkaddlistorder(txtvalue.t_fabricid) == '1') {
            alert("รายการนี้มีการเลือกไปแล้วครับ !")
            return false;
        } else {

            setlistOrder(prevItems => [...prevItems,
            {
                ID: prevItems.length,
                itemfabricid: txtvalue.t_fabricid,
                itemfabricname: txtvalue.t_fabricname,
                itemsendnum: txtvalue.t_sennum,
                itemother: txtvalue.t_other,
            }]);

        }
    }

    function Checkaddlistorder(fabricid) {

        var result = '';
        for (var i = 0; i < listOrder.length; i++) {

            if (fabricid == listOrder[i].itemfabricid) {
                result = '1'
            }

        }

        return result;

    }

    async function Removeorder(val) {
        const people = [...listOrder]
        const newList = people.filter((item) => item.itemfabricid !== val);
        setlistOrder(newList);
    }

    async function closeModal() {
        settxtvalue(inputData);
        setlistOrder([]);
    }

    async function closeModalPrint() {
        setorderPrint([])
        setmodalPrint(false);
    }

    async function Checknumber(even) {

        if (isNaN(even.target.value) == true) {
            alert("กรุณาใส่จำนวนเป็นตัวเลขด้วยครับ !");
            document.getElementById("t_sendnum").value = "";
            return false;
        } else {
            settxtvalue({ ...txtvalue, t_sennum: even.target.value });
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
                        <div className="ibox-title"> รายการส่งซัก</div>
                        <div> <button className="btn btn-info" style={{ cursor: 'pointer' }} onClick={() => openModal('0')}> <i className="fa ti-write" style={{ fontSize: 18 }} /> ส่งซักฟอก </button> </div>
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
                                                <div className="ibox-title">
                                                    <button className="btn btn-success" type="button" style={{ cursor: 'pointer' }} onClick={() => Checkordernumber('1')}> <i className="fa ti-pencil-alt" style={{ fontSize: 18 }} /> สร้างเลขที่ใบนำส่ง </button>
                                                </div>
                                                <div className="ibox-tools">
                                                    <a onClick={() => setModal(false)}><i className="fa ti-close" /></a>
                                                </div>
                                            </div>
                                            <div>

                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="ibox">
                                                            <div className="ibox-head">
                                                                <div className="ibox-title"> <i className="fa ti-server" style={{ fontSize: 20 }} /> รายการส่งซัก <span>[ {txtvalue.t_orderID} ]</span></div>
                                                                <div className="ibox-tools">
                                                                    <span>จำนวนทั้งหมด {listOrder.length} รายการ</span>
                                                                </div>
                                                            </div>
                                                            <div className="ibox-body">
                                                                <form>
                                                                    <div className="form-group">

                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-sm-6 form-group">
                                                                            <label> รายการผ้า </label>
                                                                            <Select
                                                                                value={listfabric.find(obj => obj.value === txtvalue.t_fabricid)}
                                                                                options={listfabric}
                                                                                onChange={even => Onchangselect(even)}
                                                                            />
                                                                        </div>
                                                                        <div className="col-sm-6 form-group">
                                                                            <label> จำนวน </label>
                                                                            <input className="form-control" id="t_sendnum" type="text" placeholder="จำนวน" onChange={(even) => Checknumber(even)} />
                                                                        </div>
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <label> หมายเหตุ </label>
                                                                        <input className="form-control" type="text" placeholder="หมายเหตุ" onChange={(even) => settxtvalue({ ...txtvalue, t_other: even.target.value })} />
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <button className="btn btn-default" type="button" style={{ cursor: 'pointer' }} onClick={() => Addlistorder()}> <i className="fa ti-plus" style={{ fontSize: 18 }} /> เพิ่มรายการ </button>
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <table className="table table-striped">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th> # </th>
                                                                                    <th> รายการผ้า </th>
                                                                                    <th> จำนวน </th>
                                                                                    <th> หมายเหตุ </th>
                                                                                    <th> ลบ </th>
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
                                                                                            <td>
                                                                                                <button type="button" className="btn btn-outline-danger btn-icon-text" onClick={() => Removeorder(item.itemfabricid)}>
                                                                                                    <i className="mdi mdi-close-circle"></i>
                                                                                                    ยกเลิก
                                                                                                </button>
                                                                                            </td>
                                                                                        </tr>

                                                                                    )
                                                                                }

                                                                            </tbody>
                                                                        </table>
                                                                    </div>

                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-7">
                                                        <div className="ibox">

                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="ml-sm-auto" style={{ textAlign: 'center' }}>

                                                    <button className="btn btn-info" type="button" style={{ cursor: 'pointer' }} onClick={() => Savedata()}> <i className="fa ti-save" style={{ fontSize: 18 }} /> บันทึกส่งซัก </button>&nbsp;
                                                    <button className="btn btn-danger" type="button" style={{ cursor: 'pointer' }} onClick={() => Deletedata(txtvalue.t_orderID)}> <i className="fa ti-trash" style={{ fontSize: 18 }} /> ยกเลิกใบนำส่ง </button>

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

            <sesion>
                <Modal visible={modalPrint} width="90%" effect="fadeInUp" onClick={() => closeModalPrint()}>
                    <div className="Modelbody">
                        <div className="Modelheader">

                        </div>

                        <div className="cssModelbody" style={{ overflow: 'scroll', height: '90vh' }}>

                            <div className="panel-body">
                                <div className='row'>
                                    <div className="col-md-12">
                                        <div className="ibox">
                                            <div className="ibox-head">
                                                <div className="ibox-title">
                                                    รายการส่งซัก
                                                </div>
                                                <div className="ibox-tools">
                                                    <a onClick={() => closeModalPrint(false)}><i className="fa ti-close" /></a>
                                                </div>
                                            </div>
                                            <div>

                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="ibox">
                                                            <div className="ibox-head">
                                                                <div className="ibox-title"> <i className="fa ti-server" style={{ fontSize: 20 }} /> เลขที่ใบส่งซัก <span>[ {txtvalue.t_orderID} ]</span></div>
                                                                <div className="ibox-tools">
                                                                    <span>จำนวนทั้งหมด {orderPrint.length} รายการ</span>
                                                                </div>
                                                            </div>
                                                            <div className="ibox-body">
                                                                <table width="100%" border={0} cellPadding={0} cellSpacing={0}>
                                                                    <tbody><tr>
                                                                        <td width="6%" align="center">ลำดับ</td>
                                                                        <td width="17%" align="center">รหัส</td>
                                                                        <td width="34%" align="center">รายการผ้า</td>
                                                                        <td width="9%" align="center">จำนวน</td>
                                                                        <td width="34%" align="center">หมายเหตุ</td>
                                                                    </tr>
                                                                        {
                                                                            orderPrint.map((item, row) =>
                                                                                <tr>
                                                                                    <td align="center">{row+1}</td>
                                                                                    <td align="center">{item.FabricID}</td>
                                                                                    <td>&nbsp;{item.FabricName}</td>
                                                                                    <td align="center">{item.Sendnum}</td>
                                                                                    <td>&nbsp;{item.Sendother}</td>
                                                                                </tr>
                                                                            )
                                                                        }
                                                                    </tbody>
                                                                </table>

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-7">
                                                        <div className="ibox">

                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="ml-sm-auto" style={{ textAlign: 'center' }}>

                                                    <ReactToPrint
                                                        trigger={() => <button className="btn btn-warning" type="button" style={{ cursor: 'pointer' }}> <i className="fa ti-printer" style={{ fontSize: 18 }} /> พิมพ์ใบส่งซัก </button>}
                                                        content={() => componentRef}
                                                    />
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
        </>
    )
}
