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

export default function Frmlost() {

    const [modal, setModal] = useState(false);
    const [myData, setmyData] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_id: '', t_fabricid: '', t_cupboard: '', t_num: '', t_other: '',
        t_fabricid2: '', t_cupboard2: '', t_num2: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [listfabric, setlistfabric] = useState([]);

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

    }

    async function Listfabric() {
        fetch(API.dataSource.url + "Losts/Showlistfabric")
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                setlistfabric(data);
            })
            .catch(error => {
                console.log("Error Listfabric:", error);
            });
    }

    async function Showdata() {
        fetch(API.dataSource.url + "Losts")
            .then(res => res.json())
            .then(json => {
                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    FabricID: row.fabricID || row.FabricID,
                    FabricName: row.fabricName || row.FabricName,
                    Lostnum: row.lostnum || row.Lostnum,
                    Lostdate: row.lostdate || row.Lostdate,
                    Lostother: row.lostother || row.Lostother,
                    Edit: (
                        <MDBBadge
                            className='w-0'
                            searchvalue={key}
                            key={key}
                            style={{ float: 'right' }}
                        >
                            <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(row.id || row.ID)}><i className="fa fa-pencil font-14" /></button>
                            <button className="btn btn-default btn-xs" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Delete" onClick={() => Adddata(row.id || row.ID)}><i className="fa fa-plus-square" /></button>
                        </MDBBadge>
                    )
                }));

                Mydata = {
                    columns: [
                        { label: 'รหัส', field: 'FabricID', sort: 'asc', width: 20 },
                        { label: 'รายการ', field: 'FabricName', sort: 'asc', width: 500 },
                        { label: 'จำนวน', field: 'Lostnum', sort: 'asc', width: 200 },
                        { label: 'วันที่', field: 'Lostdate', sort: 'asc', width: 200 },
                        { label: 'หมายเหตุ', field: 'Lostother', sort: 'asc', width: 50 },
                        { label: '', field: 'Edit', sort: 'asc', width: 20 }
                    ],
                    rows
                };
                setmyData(Mydata);
            })
            .catch(error => console.log("Error Showdata:", error));
    }

    async function Showdataedit(ID) {
        fetch(API.dataSource.url + "Losts/" + ID)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                if (!data || data.length === 0) return;
                const item = Array.isArray(data) ? data[0] : data;

                settxtvalue({
                    ...txtvalue,
                    t_id: ID,
                    t_fabricid: item.fabricID || item.FabricID, 
                    t_cupboard: item.fabricNum || item.FabricNum, 
                    t_num: item.lostnum || item.Lostnum, 
                    t_other: item.lostother || item.Lostother,
                    t_fabricid2: item.fabricID || item.FabricID, 
                    t_cupboard2: item.fabricNum || item.FabricNum, 
                    t_num2: item.lostnum || item.Lostnum,
                })
            })
            .catch(error => {
                console.log("Error Showdataedit:", error);
            });
    }
    async function Onchangselect(even) {
        fetch(API.dataSource.url + "Losts/Showstock/" + even.value)
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
                    t_cupboard: item.fabricNum || item.FabricNum 
                })
            })
            .catch(error => {
                console.log("Error Onchangselect:", error);
            });
    }

   async function Savedata() {
        if (txtvalue.t_fabricid == "") {
            alert("กรุณาเลือกรายการด้วยครับ !");
            return false;
        } else if (txtvalue.t_num == "") {
            alert("กรุณาใส่จำนวนผ้าด้วยครับ");
            return false;
        } else {
            const method = "POST";
            const body = new FormData();
            body.append("tid", txtvalue.t_id || "0"); 
            body.append("tfabricid", txtvalue.t_fabricid);
            body.append("tcupboard", txtvalue.t_cupboard);
            body.append("tnum", txtvalue.t_num);
            body.append("tother", txtvalue.t_other);
            body.append("tfabricid2", txtvalue.t_fabricid2);
            body.append("tcupboard2", txtvalue.t_cupboard2);
            body.append("tnum2", txtvalue.t_num2);

            fetch(API.dataSource.url + "Losts", { method, body })
                .then(res => res.json())
                .then(data => {
                    alert("ระบบได้ทำการบันทึกใบขอเบิกเรียบร้อยแล้วครับ");
                    Showdata();
                    settxtvalue(inputData);
                    setModal(false);
                })
                .catch(error => console.log("Error Savedata:", error));
        }
    }

    async function Adddata(ID) {
        var conF = window.confirm("คุณต้องการรับเข้าข้อมูลรายการนี้ใช่หรือไม่ ?");
        if (conF == true) {
            fetch(API.dataSource.url + "Losts/Adddata/" + ID, { method: "POST" })
                .then(response => {
                    if (!response.ok) throw new Error("Network response was not ok");
                    return response.json();
                })
                .then(data => {
                    Showdata();
                    settxtvalue(inputData)
                    alert("ระบบได้ทำการนำเข้าข้อมูลเรียบร้อยแล้วครับ !");
                })
                .catch(error => {
                    console.log("Error Adddata:", error);
                    alert("เกิดข้อผิดพลาดในการนำเข้าข้อมูล");
                });
        }
    }

    return (
        <div>
            <div className="page-heading">
                <h1 className="page-title"> รายการผ้าสูญหาย </h1>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="index.html"><i className="la la-home font-20" /></a>
                    </li>
                    <li className="breadcrumb-item"> Losts From </li>
                </ol>
            </div>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <div className="ibox-head">
                        <div className="ibox-title"> รายการ</div>
                        <div> <button className="btn btn-info" style={{ cursor: 'pointer' }} onClick={() => openModal('0')}> <i className="fa fa-plus-circle" style={{ fontSize: 18 }} /> เพิ่มรายการ </button> </div>
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
                                                            <div className="ibox-title"> ลงข้อมูลเบิกผ้าสูญหาย </div>
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
                                                                        <label> จำนวน/ชิ่น </label>
                                                                        <input className="form-control" type="text" placeholder="จำนวน/ชิ่น" value={txtvalue.t_num} onChange={(even) => settxtvalue({ ...txtvalue, t_num: even.target.value })} />
                                                                    </div>
                                                                </div>

                                                                <div className="form-group">
                                                                    <label> หมายเหตุ </label>
                                                                    <input className="form-control" type="text" placeholder="หมายเหตุ" onChange={(even) => settxtvalue({ ...txtvalue, t_other: even.target.value })} />
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
