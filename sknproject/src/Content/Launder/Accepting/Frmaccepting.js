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

export default function Frmaccepting() {

    const [modal, setModal] = useState(false);
    const [myData, setmyData] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_id: '', t_fabricid: '', t_fabricname: '', t_num: '', t_cupboard: '', t_other: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [listfabric, setlistfabric] = useState([]);
    const [listOrder, setlistOrder] = useState([]);

    useEffect(() => {

        Listfabric();
        Showdata();

    }, []);

    async function openModal(ID, str) {

        settxtvalue(inputData);

        if (ID != '0') {
            Showdataedit(ID);
        }
        setModal(true);
    }

    async function closeModal() {
        settxtvalue(inputData);
        setlistOrder([]);
        setModal(false);
    }

    async function Listfabric() {
        fetch(API.dataSource.url + "Accepting/Showlistfabric")
            .then(response => {
                if (!response.ok) throw new Error("Network error");
                return response.json();
            })
            .then(data => {
                setlistfabric(data);
            })
            .catch(error => {
                console.log(error);
            });
    }

   async function Onchangselect(even) {
        fetch(API.dataSource.url + "Accepting/Showstock/" + even.value)
            .then(response => {
                if (!response.ok) throw new Error(`โหลดสต็อกไม่สำเร็จ (${response.status})`);
                return response.json();
            })
            .then(data => {
                const item = Array.isArray(data) ? data[0] : data;
                settxtvalue({
                    ...txtvalue,
                    t_fabricid: even.value,
                    t_fabricname: even.label,
                    t_cupboard: item ? (item.fabricNum ?? item.FabricNum ?? "") : ""
                });
            })
            .catch(error => {
                console.error("[Onchangselect Error]:", error);
            });
    }

    async function Showdata() {
        fetch(API.dataSource.url + "Accepting")
            .then(res => {
                if (!res.ok) throw new Error(`โหลดข้อมูลไม่สำเร็จ (${res.status})`);
                return res.json();
            })
            .then(json => {
                let rowsData = json.map((row, key) => ({
                    ...row,
                    Acceptingid: row.acceptingid || row.Acceptingid,
                    Acceptingdate: row.acceptingdate || row.Acceptingdate,
                    Acceptingtime: row.acceptingtime || row.Acceptingtime,
                    Total: row.total || row.Total,
                    fullname: row.fullname || row.Fullname,

                    Edit: (
                        <MDBBadge className='w-0' searchvalue={key} key={key} style={{ float: 'right' }}>
                            <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(row.acceptingid || row.Acceptingid, 'Edit')}>
                                <i className="fa fa-pencil font-14" title='จัดการข้อมูลผ้า' />
                            </button>
                        </MDBBadge>
                    ),
                    Num: (
                        parseInt(row.wastenum || row.Wastenum) - parseInt(row.wastenumin || row.Wastenumin)
                    )
                }));

                const Mydata = {
                    columns: [
                        { label: 'เลขที่รับ', field: 'Acceptingid', sort: 'asc', width: 20 },
                        { label: 'วันที่', field: 'Acceptingdate', sort: 'asc', width: 500 },
                        { label: 'เวลา', field: 'Acceptingtime', sort: 'asc', width: 200 },
                        { label: 'จำนวน/รายการ', field: 'Total', sort: 'asc', width: 200 },
                        { label: 'เจ้าหน้าที่', field: 'fullname', sort: 'asc', width: 50 },
                        { label: '', field: 'Edit', sort: 'asc', width: 20 }
                    ],
                    rows: rowsData
                };
                setmyData(Mydata);
            })
            .catch(error => {
                console.error("[Showdata Error]:", error);
            });
    }
    async function Showdataedit(ID) {

        setlistOrder([]);

        fetch(API.dataSource.url + "Accepting/" + ID)
            .then(response => {
                if (!response.ok) throw new Error("Network error");
                return response.json();
            })
            .then(data => {
                if (!data || data.length === 0) return;

                settxtvalue({ 
                    ...txtvalue, 
                    t_id: data[0].acceptingid || data[0].Acceptingid 
                });

                const newOrders = data.map((item, index) => ({
                    ID: index, 
                    itemid: item.idEdit || item.IdEdit,
                    itemfabricid: item.fabricID || item.FabricID,
                    itemfabricname: item.fabricName || item.FabricName,
                    itemcupboard: item.acceptingnum || item.Acceptingnum,
                    itemother: item.other || item.Other,
                }));

                setlistOrder(newOrders);

            })
            .catch(error => {
                console.log("Error Showdataedit:", error);
            });

    }
    async function Addlistorder() {

        setlistOrder(prevItems => [...prevItems,
        {
            ID: prevItems.length,
            itemid: '',
            itemfabricid: txtvalue.t_fabricid,
            itemfabricname: txtvalue.t_fabricname,
            itemcupboard: txtvalue.t_num,
            itemother: txtvalue.t_other,
        }]);

    }

    async function Removeorder(val) {
        const people = [...listOrder]
        const newList = people.filter((item) => item.itemfabricid !== val);
        setlistOrder(newList);
    }

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

        try {
            // 1. บันทึกหัวบิล
            const headerPayload = toFormData({
                tid: txtvalue.t_id || "0",
                tuserid: txtvalue.t_userid,
            });

            const headerRes = await fetch(`${API.dataSource.url}Accepting`, {
                method: "POST",
                body: headerPayload,
            });

            if (!headerRes.ok) throw new Error(`บันทึกข้อมูลหลักไม่สำเร็จ (${headerRes.status})`);
            const orderId = await headerRes.json();

            // 2. บันทึกรายการผ้าย่อยทั้งหมด
            await Promise.all(
                listOrder.map(async (item) => {
                    const detailPayload = toFormData({
                        orderid: orderId,
                        tuser: txtvalue.t_userid,
                        fabricid: item.itemfabricid,
                        tnum: item.itemcupboard || "0",
                        tother: item.itemother,
                    });

                    const detailRes = await fetch(`${API.dataSource.url}Accepting/Detail`, {
                        method: "POST",
                        body: detailPayload,
                    });

                    if (!detailRes.ok) throw new Error(`บันทึกรายการผ้า ${item.itemfabricid} ไม่สำเร็จ`);
                    return detailRes.json();
                })
            );

            alert("ระบบได้ทำการบันทึกรายการรับเข้าเรียบร้อยแล้วครับ");
            Showdata();
            settxtvalue(inputData);
            setlistOrder([]);
            setModal(false);

        } catch (error) {
            console.error("[Savedata Error]:", error);
            alert(`เกิดข้อผิดพลาดในการบันทึก: ${error.message}`);
        }
    }

    return (
        <div>
            <div className="page-heading">
                <h1 className="page-title"> รายการผ้ารับเข้า </h1>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="index.html"><i className="la la-home font-20" /></a>
                    </li>
                    <li className="breadcrumb-item"> Accepting From </li>
                </ol>
            </div>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <div className="ibox-head">
                        <div className="ibox-title"> รายการ</div>
                        <div> <button className="btn btn-info" style={{ cursor: 'pointer' }} onClick={() => openModal('0', 'Edit')}> <i className="fa fa-plus-circle" style={{ fontSize: 18 }} /> เพิ่มรายการ </button> </div>
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

                        <div className="cssModelbody" style={{ overflow: 'scroll', height: '80vh' }}>

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
                                            <div className='row'>

                                                <div className="col-md-5">
                                                    <div className="ibox">
                                                        <div className="ibox-head">
                                                            <div className="ibox-title"> ลงข้อมูลการรับเข้า </div>
                                                            <div className="ibox-tools">

                                                            </div>
                                                        </div>
                                                        <div className="ibox-body">
                                                            <form>
                                                                <div className="form-group">
                                                                    <label> รายการผ้า </label>
                                                                    <Select
                                                                        value={listfabric.find(obj => obj.value === txtvalue.t_fabricid)}
                                                                        options={listfabric}
                                                                        onChange={even => Onchangselect(even)}
                                                                    />
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-sm-6 form-group">
                                                                        <label> คงเหลือในตู้ </label>
                                                                        <input className="form-control" type="text" readOnly="true" placeholder="คงเหลือในตู้" value={txtvalue.t_cupboard} onChange={(even) => settxtvalue({ ...txtvalue, t_cupboard: even.target.value })} />
                                                                    </div>
                                                                    <div className="col-sm-6 form-group">
                                                                        <label> จำนวนรับเข้า/ชิ่น </label>
                                                                        <input className="form-control" type="text" placeholder="จำนวน/ชิ่น" value={txtvalue.t_num} onChange={(even) => settxtvalue({ ...txtvalue, t_num: even.target.value })} />
                                                                    </div>
                                                                </div>

                                                                <div className="form-group">
                                                                    <label> หมายเหตุ </label>
                                                                    <input className="form-control" type="text" placeholder="หมายเหตุ" value={txtvalue.t_other} onChange={(even) => settxtvalue({ ...txtvalue, t_other: even.target.value })} />
                                                                </div>

                                                                <div className="form-group">
                                                                    <button className="btn btn-default" type="button" style={{ cursor: 'pointer' }} onClick={() => Addlistorder()}> <i className="fa fa-floppy-o" style={{ fontSize: 18 }} /> เพิ่มรายการ </button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='col-md-7'>
                                                    <div className="ibox">
                                                        <div className="ibox-head">
                                                            <div className="ibox-title"> รายการเบิกผ้า <span></span></div>
                                                            <div className="ibox-tools">
                                                                <span>จำนวนทั้งหมด {listOrder.length} รายการ</span>
                                                            </div>
                                                        </div>
                                                        <div className="ibox-body">
                                                            <table className="table table-striped">
                                                                <thead>
                                                                    <tr>
                                                                        <th> # </th>
                                                                        <th> รหัส </th>
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
                                                                                <td> {item.itemfabricid} </td>
                                                                                <td> {item.itemfabricname} </td>
                                                                                <td> {item.itemcupboard} </td>
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

                                                    </div>
                                                </div>

                                                <div className="ml-sm-auto" style={{ textAlign: 'center' }}>

                                                    <button className="btn btn-info" type="button" style={{ cursor: 'pointer' }} onClick={() => Savedata()}> <i className="fa ti-save" style={{ fontSize: 18 }} /> บันทึกส่งเบิก </button>&nbsp;
                                                    <button className="btn btn-danger" type="button" style={{ cursor: 'pointer' }} onClick={() => closeModal()}> <i className="fa ti-trash" style={{ fontSize: 18 }} /> ยกเลิกใบเบิก </button>

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

        </div>
    )
}
