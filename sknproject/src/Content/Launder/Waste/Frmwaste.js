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



export default function Frmwaste() {

    const [modal, setModal] = useState(false);
    const [myData, setmyData] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_id: '', t_fabricid: '', t_cupboard: '', t_num: '', t_other: '',
        t_fabricid2: '', t_cupboard2: '', t_num2: '', t_numin: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [listfabric, setlistfabric] = useState([]);
    const [strOut, setstrOut] = useState(true);
    const [strIn, setstrIn] = useState(true);

    useEffect(() => {

        Listfabric();
        Showdata();

    }, []);

    async function openModal(ID, str) {

        settxtvalue(inputData);

        if (str == 'Edit') {
            setstrOut(false);
            setstrIn(true);
        } else {
            setstrOut(true);
            setstrIn(false);
        }

        if (ID != '0') {
            Showdataedit(ID);
        }
        setModal(true);
    }

    async function closeModal() {
        settxtvalue(inputData);
        setModal(false);
    }

    const toFormData = (obj) => {
        const formData = new FormData();
        Object.entries(obj).forEach(([key, value]) => {
            formData.append(key, value ?? "");
        });
        return formData;
    };

    async function Listfabric() {
        try {
            const res = await fetch(`${API.dataSource.url}Waste/Showlistfabric`);
            if (!res.ok) throw new Error(`โหลดรายการผ้าไม่สำเร็จ (${res.status})`);
            const data = await res.json();
            setlistfabric(data);
        } catch (error) {
            console.error("[Listfabric Error]:", error);
        }
    }

    async function Showdata() {
        try {
            const res = await fetch(`${API.dataSource.url}Waste?officeID=${txtvalue.t_officeid}`);
            if (!res.ok) throw new Error(`โหลดข้อมูลไม่สำเร็จ (${res.status})`);
            const json = await res.json();

            const rows = json.map((row, key) => {
                const rowId = row.id || row.ID;
                const wasteNum = parseInt(row.wastenum ?? row.Wastenum ?? 0);
                const wasteNumIn = parseInt(row.wastenumin ?? row.Wastenumin ?? 0);

                return {
                    ...row,
                    FabricID: row.fabricID || row.FabricID,
                    FabricName: row.fabricName || row.FabricName,
                    Wastedate: row.wastedate || row.Wastedate,
                    Other: row.other || row.Other,
                    Edit: (
                        <MDBBadge
                            className='w-0'
                            searchvalue={key}
                            key={key}
                            style={{ float: 'right' }}
                        >
                            <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(rowId, 'Edit')}><i className="fa fa-pencil font-14" title='จัดการข้อมูลผ้า' /></button>
                            <button className="btn btn-default btn-xs" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Delete" onClick={() => openModal(rowId, 'Add')}><i className="fa fa-plus-square" /></button>
                        </MDBBadge>
                    ),
                    Num: wasteNum - wasteNumIn
                };
            });

            setmyData({
                columns: [
                    { label: 'รหัส', field: 'FabricID', sort: 'asc', width: 20 },
                    { label: 'รายการ', field: 'FabricName', sort: 'asc', width: 500 },
                    { label: 'จำนวน', field: 'Num', sort: 'asc', width: 200 },
                    { label: 'วันที่', field: 'Wastedate', sort: 'asc', width: 200 },
                    { label: 'หมายเหตุ', field: 'Other', sort: 'asc', width: 50 },
                    { label: '', field: 'Edit', sort: 'asc', width: 20 }
                ],
                rows
            });
        } catch (error) {
            console.error("[Showdata Error]:", error);
        }
    }

    async function Showdataedit(ID) {
        try {
            const res = await fetch(`${API.dataSource.url}Waste/${ID}`);
            if (!res.ok) throw new Error(`โหลดข้อมูลแก้ไขไม่สำเร็จ (${res.status})`);
            const data = await res.json();
            if (!data || data.length === 0) return;

            const item = Array.isArray(data) ? data[0] : data;
            const fabricId = item.fabricID || item.FabricID || "";
            const fabricNum = item.fabricNum ?? item.FabricNum ?? "";
            const wasteNum = parseInt(item.wastenum ?? item.Wastenum ?? 0);
            const wasteNumIn = parseInt(item.wastenumin ?? item.Wastenumin ?? 0);

            settxtvalue({
                ...txtvalue,
                t_id: ID,
                t_fabricid: fabricId,
                t_cupboard: fabricNum,
                t_num: wasteNum - wasteNumIn,
                t_other: item.other || item.Other || "",
                t_fabricid2: fabricId,
                t_cupboard2: fabricNum,
                t_num2: wasteNum,
            });
        } catch (error) {
            console.error("[Showdataedit Error]:", error);
        }
    }

    async function Onchangselect(even) {
        try {
            const res = await fetch(`${API.dataSource.url}Waste/Showstock/${even.value}`);
            if (!res.ok) throw new Error(`โหลดสต็อกไม่สำเร็จ (${res.status})`);
            const data = await res.json();
            const item = Array.isArray(data) ? data[0] : data;

            settxtvalue({
                ...txtvalue,
                t_fabricid: even.value,
                t_fabricname: even.label,
                t_cupboard: item ? (item.fabricNum ?? item.FabricNum ?? "") : ""
            });
        } catch (error) {
            console.error("[Onchangselect Error]:", error);
        }
    }

    async function Savedata() {
        if (txtvalue.t_fabricid == "") {
            alert("กรุณาเลือกรายการด้วยครับ !");
            return false;
        } else if (txtvalue.t_num == "") {
            alert("กรุณาใส่จำนวนผ้าด้วยครับ");
            return false;
        }

        try {
            const body = toFormData({
                tid: txtvalue.t_id || "0",
                tfabricid: txtvalue.t_fabricid,
                tcupboard: txtvalue.t_cupboard,
                tnum: txtvalue.t_num,
                tother: txtvalue.t_other,
                tfabricid2: txtvalue.t_fabricid2,
                tcupboard2: txtvalue.t_cupboard2,
                tnum2: txtvalue.t_num2,
                tnumin: txtvalue.t_numin,
            });

            const res = await fetch(`${API.dataSource.url}Waste`, {
                method: "POST",
                body
            });

            if (!res.ok) throw new Error(`บันทึกข้อมูลไม่สำเร็จ (${res.status})`);
            await res.json();

            alert("ระบบได้ทำการบันทึกข้อมูลเรียบร้อยแล้วครับ");
            Showdata();
            settxtvalue(inputData);
            setModal(false);
        } catch (error) {
            console.error("[Savedata Error]:", error);
            alert(`เกิดข้อผิดพลาดในการบันทึก: ${error.message}`);
        }
    }

    async function Adddata(ID) {
        if (!window.confirm("คุณต้องการรับเข้าข้อมูลรายการนี้ใช่หรือไม่ ?")) return;

        try {
            const res = await fetch(`${API.dataSource.url}Waste/Adddata/${ID}`, {
                method: "POST"
            });
            if (!res.ok) throw new Error(`นำเข้าข้อมูลไม่สำเร็จ (${res.status})`);
            await res.json();

            Showdata();
            settxtvalue(inputData);
            alert("ระบบได้ทำการนำเข้าข้อมูลเรียบร้อยแล้วครับ !");
        } catch (error) {
            console.error("[Adddata Error]:", error);
            alert(`เกิดข้อผิดพลาดในการนำเข้า: ${error.message}`);
        }
    }

    async function onchangenumin(even) {
        if (Number(even.target.value) > Number(txtvalue.t_num)) {
            alert("คุณใส่ข้อมูลไม่ถูกต้อง !");
            settxtvalue({ ...txtvalue, t_numin: '' });
            return false;
        } else {
            settxtvalue({ ...txtvalue, t_numin: even.target.value });
        }
    }


    return (
        <div>
            <div className="page-heading">
                <h1 className="page-title"> รายการผ้าชำรุด </h1>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="index.html"><i className="la la-home font-20" /></a>
                    </li>
                    <li className="breadcrumb-item"> Waste From </li>
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
                            sortRows={['id']}
                            data={myData}
                        />
                    </div>
                </div>

            </div>

            <sesion>
                {/* onClickAway */}
                <Modal visible={modal} width="60%" effect="fadeInUp" onClick={() => closeModal()}>
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

                                                <div className="col-md-12">
                                                    <div className="ibox">
                                                        <div className="ibox-head">
                                                            <div className="ibox-title"> ลงข้อมูลผ้าชำรุด </div>
                                                            <div className="ibox-tools">

                                                            </div>
                                                        </div>
                                                        <div className="ibox-body">
                                                            <form>
                                                                <div className="form-group">
                                                                    <label> รายการผ้า </label>
                                                                    <Select
                                                                        value={listfabric.find(obj => obj.value === txtvalue.t_fabricid) || null}
                                                                        options={listfabric}
                                                                        onChange={even => Onchangselect(even)}
                                                                    />
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-sm-6 form-group">
                                                                        <label> คงเหลือในตู้ </label>
                                                                        <input className="form-control" type="text" readOnly="true" placeholder="คงเหลือในตู้" value={txtvalue.t_cupboard} onChange={(even) => settxtvalue({ ...txtvalue, t_cupboard: even.target.value })} />
                                                                    </div>
                                                                    <div className="col-sm-3 form-group">
                                                                        <label> จำนวนผ้าชำรุด/ชิ่น </label>
                                                                        <input className="form-control" type="text" placeholder="จำนวน/ชิ่น" value={txtvalue.t_num} onChange={(even) => settxtvalue({ ...txtvalue, t_num: even.target.value })} disabled={strOut} />
                                                                    </div>
                                                                    <div className="col-sm-3 form-group">
                                                                        <label> จำนวนรับเข้า/ชิ่น </label>
                                                                        <input className="form-control" type="text" placeholder="จำนวน/ชิ่น" value={txtvalue.t_numin} onChange={(even) => onchangenumin(even)} disabled={strIn} />
                                                                    </div>
                                                                </div>

                                                                <div className="form-group">
                                                                    <label> หมายเหตุ </label>
                                                                    <input
                                                                        className="form-control" type="text" placeholder="หมายเหตุ" value={txtvalue.t_other} onChange={(even) => settxtvalue({ ...txtvalue, t_other: even.target.value })}/>
                                                                </div>

                                                                <div className="form-group">
                                                                    <button className="btn btn-default" type="button" style={{ cursor: 'pointer' }} onClick={() => Savedata()}> <i className="fa fa-floppy-o" style={{ fontSize: 18 }} /> เพิ่มรายการ </button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
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
