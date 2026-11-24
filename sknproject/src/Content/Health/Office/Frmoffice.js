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
import API from '../../Health/Config/config'
import Select from 'react-select'

export default function Frmoffice() {

    const [modal, setModal] = useState(false);
    const [myData, setmyData] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_id: '', t_depid: '', t_name: '', t_name2: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [listdepartment, setlistdepratment] = useState([]);
    const [strOut, setstrOut] = useState(true);
    const [strIn, setstrIn] = useState(true);

    useEffect(() => {

        Listdepartment();
        Showdata();

    }, []);

    async function openModal(ID) {

        settxtvalue(inputData);

        if (ID != '0') {

            Showdataedit(ID);

        }

        setModal(true);

    }

    async function closeModal() {
        settxtvalue(inputData);
    }

    async function Listdepartment() {

        fetch(API.dataSource.code + "OfficeAPI.php?module=Showlistdepartments")
            .then(response => {
                return response.json();
            })
            .then(data => {

                setlistdepratment(data);

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Showdata() {

        fetch(API.dataSource.code + "OfficeAPI.php?module=Showdata&depID=" + txtvalue.t_depid)
            .then(res => res.json())
            .then(json => {
                //alert(json);
                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    Edit: (
                        <div style={{ textAlign: 'center' }}>
                            <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(row.office_id)}><i className="fa fa-pencil font-14" title='จัดการข้อมูลผ้า' /></button>
                            <button className="btn btn-default btn-xs" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Delete" onClick={() => Deletedata(row.office_id)}><i className="fa fa-trash" /></button>
                        </div>
                    ),
                    Num: (
                        parseInt(row.Wastenum) - parseInt(row.Wastenumin)
                    )

                }));

                Mydata = {
                    columns: [
                        {
                            label: 'รหัส',
                            field: 'office_id',
                            sort: 'asc',
                            width: 20
                        },
                        {
                            label: 'ชื่อหน่วยงาน',
                            field: 'office_name',
                            sort: 'asc',
                            width: 500
                        },
                        {
                            label: 'ชื่อย่อ',
                            field: 'office_name2',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'กลุ่มงาน',
                            field: 'dep_name',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'แก้ไข | ยกเลิก',
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

        fetch(API.dataSource.code + "OfficeAPI.php?module=Showdataedit&id=" + ID)
            .then(response => {
                return response.json();
            })
            .then(data => {

                settxtvalue({
                    ...txtvalue,
                    t_id: ID, t_depid: data[0].dep_id, t_name: data[0].office_name, t_name2: data[0].office_name2
                })

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Savedata() {

        if (txtvalue.t_depid == "") {
            alert("กรุณาเลือกกลุ่มงานด้วยครับ !");
            return false;
        } else if (txtvalue.t_name == "") {
            alert("กรุณาใส่ชื่อหน่วยงานด้วยครับ !");
            return false;
        } else {

            const method = "POST";
            const body = new FormData();
            body.append("tid", txtvalue.t_id);
            body.append("tdepid", txtvalue.t_depid);
            body.append("tname", txtvalue.t_name);
            body.append("tname2", txtvalue.t_name2);
            fetch(API.dataSource.code + "OfficeAPI.php?module=Inputdata", { method, body })
                .then(res => res.json())
                .then(data => {

                    //alert(JSON.stringify(data, null, "\t"))

                    if (data == '0') {
                        alert("ระบบได้ทำการบันทึกข้อมูลเรียบร้อยแล้วครับ");
                    } else if (data == '1') {
                        alert("มีข้อมูลนี้ในระบบแล้วครับ ! \n กรุณาตรวจสอบข้อมูลใหม่อีกครั้ง");
                    } else if (data == '2') {
                        alert("ระบบทำการบันทึกแก้ไขข้อมูลใหม่เรียบร้อยแล้วครับ !");
                    }

                    Showdata();
                    settxtvalue(inputData);
                    setModal(false);

                });

        }

    }

    async function Deletedata(ID) {

        var conF = window.confirm("คุณต้องการยกเลิกรายการนี้ใช่หรือไม่ ?");
        if (conF == true) {

            fetch(API.dataSource.code + "OfficeAPI.php?module=Deletedata&id=" + ID)
                .then(response => {
                    return response.json();
                })
                .then(data => {

                    Showdata();

                })
                .catch(error => {
                    console.log(error);
                });

        }

    }

    async function Onchangselect() {

    }



    return (
        <div>
            <div className="page-heading">
                <h1 className="page-title"> รายการข้อมูลหน่วยงาน </h1>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="index.html"><i className="la la-home font-20" /></a>
                    </li>
                    <li className="breadcrumb-item"> Office From </li>
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
                                                <div className="ibox-title"> <span> <i className="fa ti-server" style={{ fontSize: 20 }} /> ข้อมูลหน่วยงาน </span> </div>
                                                <div className="ibox-tools">
                                                    <a onClick={() => setModal(false)}><i className="fa ti-close" /></a>
                                                </div>
                                            </div>
                                            <div className='row'>

                                                <div className="col-md-12">
                                                    <div className="ibox">
                                                        <div className="ibox-head">
                                                            <div className="ibox-title"> จัดการข้อมูลหน่วยงาน </div>
                                                            <div className="ibox-tools">

                                                            </div>
                                                        </div>
                                                        <div className="ibox-body">
                                                            <form>
                                                                <div className="form-group">
                                                                    <label> กลุ่มงาน </label>
                                                                    <Select
                                                                        value={listdepartment.find(obj => obj.value === txtvalue.t_depid)}
                                                                        options={listdepartment}
                                                                        onChange={even => settxtvalue({ ...txtvalue, t_depid: even.value })}
                                                                    />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label> หน่วยงาน </label>
                                                                    <input className="form-control" type="text" placeholder="หน่วยงาน" value={txtvalue.t_name} onChange={(even) => settxtvalue({ ...txtvalue, t_name: even.target.value })} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label> ชื่อย่อ </label>
                                                                    <input className="form-control" type="text" placeholder="ชื่อย่อ" value={txtvalue.t_name2} onChange={(even) => settxtvalue({ ...txtvalue, t_name2: even.target.value })} />
                                                                </div>

                                                                <div className="form-group">
                                                                    <button className="btn btn-default" type="button" style={{ cursor: 'pointer' }} onClick={() => Savedata()}> <i className="fa fa-floppy-o" style={{ fontSize: 18 }} /> บันที่กข้อมูล </button>
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
    );
}
