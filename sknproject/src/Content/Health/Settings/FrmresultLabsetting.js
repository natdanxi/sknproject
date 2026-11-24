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

export default function FrmresultLabsetting() {

    const [modal, setModal] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [myData, setmyData] = useState([]);
    const [myDatadetail, setmyDatadetail] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_id: '', t_groupid: '', t_groupname: '', t_id2: '', t_subid: '', t_subname: '', t_subnameTH: '', t_substr: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [groupid, setgroupid] = useState('');

    useEffect(() => {

        Showdata();
        //Showdatadetail('');

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

    async function openModal2(ID, groupID) {

        if (groupID == "") {
            alert("กรุณาเลือก Lab Group ด้วยครับ!");
            return false;
        } else {

            settxtvalue(inputData);

            if (ID != '0') {
                Showdataedit2(ID)
            }

            setModal2(true);

        }

    }

    async function closeModal2() {
        settxtvalue(inputData);
    }

    async function Showdata() {

        fetch(API.dataSource.code + "LabsetingAPI.php?module=Showgrouplab")
            .then(res => res.json())
            .then(json => {
                //alert(json);
                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    Name: (
                        <a onClick={() => Showdatadetail(row.resultgroupID)}>{row.resultgroupName}</a>
                    ),
                    Edit: (
                        <div style={{ textAlign: 'center' }}>
                            <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(row.resultgroupID)}><i className="fa fa-pencil font-14" title='จัดการข้อมูลผ้า' /></button>
                            <button className="btn btn-default btn-xs" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Delete" onClick={() => Deletedata(row.resultgroupID)}><i className="fa fa-trash" /></button>
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
                            field: 'resultgroupLabcode',
                            sort: 'asc',
                            width: 20
                        },
                        {
                            label: 'ชื่อหน่วยงาน',
                            field: 'Name',
                            sort: 'asc',
                            width: 500
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

    async function Showdatadetail(ID) {

        setgroupid(ID);

        fetch(API.dataSource.code + "LabsetingAPI.php?module=Showsublab&groupid=" + ID)
            .then(res => res.json())
            .then(json => {
                //alert(json);

                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    Edit: (
                        <div style={{ textAlign: 'center' }}>
                            <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal2(row.resultsubID, ID)}><i className="fa fa-pencil font-14" title='จัดการข้อมูลผ้า' /></button>
                            <button className="btn btn-default btn-xs" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Delete" onClick={() => Deletedata2(row.resultsubID)}><i className="fa fa-trash" /></button>
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
                            field: 'resultsubLabcode',
                            sort: 'asc',
                            width: 20
                        },
                        {
                            label: 'ชื่อหน่วยงาน',
                            field: 'Fullname',
                            sort: 'asc',
                            width: 500
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

                setmyDatadetail(Mydata);

            });

    }

    async function Showdataedit(ID) {

        fetch(API.dataSource.code + "LabsetingAPI.php?module=Showdataedit&id=" + ID)
            .then(response => {
                return response.json();
            })
            .then(data => {

                settxtvalue({
                    ...txtvalue,
                    t_id: ID, t_labid: data[0].resultgroupLabcode, t_labname: data[0].resultgroupName
                })

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Savegrouplab() {

        if (txtvalue.t_labid == "") {
            alert("กรุณารหัส Group Lab ด้วยครับ !");
            return false;
        } else if (txtvalue.t_name == "") {
            alert("กรุณาใส่ชื่อ Group Lab ด้วยครับ !");
            return false;
        } else {

            const method = "POST";
            const body = new FormData();
            body.append("tid", txtvalue.t_id);
            body.append("tlabid", txtvalue.t_labid);
            body.append("tlabname", txtvalue.t_labname);
            fetch(API.dataSource.code + "LabsetingAPI.php?module=Inputdata", { method, body })
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

            fetch(API.dataSource.code + "LabsetingAPI.php?module=Deletedata&id=" + ID)
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

    async function Savesublab() {

        if (groupid == "") {
            alert("กรุณาเลือก Group Lab ด้วยครับ !");
            return false;
        } else if (txtvalue.t_subid == "") {
            alert("กรุณาใส่รหัส Lab ด้วยครับ !");
            return false;
        } else if (txtvalue.t_subname == "") {
            alert("กรุณาใส่ชื่อ Lab ด้วยครับ !");
            return false;
        } else {

            const method = "POST";
            const body = new FormData();
            body.append("tid2", txtvalue.t_id2);
            body.append("tlabgruopid", groupid);
            body.append("tlabid2", txtvalue.t_subid);
            body.append("tlabname2", txtvalue.t_subname);
            body.append("tsubstr", txtvalue.t_substr);
            fetch(API.dataSource.code + "LabsetingAPI.php?module=Inputlabsub", { method, body })
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

    async function Showdataedit2(ID) {

        fetch(API.dataSource.code + "LabsetingAPI.php?module=Showlabsubedit&tlabid=" + ID)
            .then(response => {
                return response.json();
            })
            .then(data => {

                settxtvalue({
                    ...txtvalue,
                    t_id2: data[0].resultsubID, t_subid: data[0].resultsubLabcode,
                    t_subname: data[0].Fullname, t_subnameTH: data[0].LabnameTH, t_substr: data[0].resultsbuStatus
                })

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Showlabneme(even) {

        if (even.key == 'Enter') {

            fetch(API.dataSource.code + "LabsetingAPI.php?module=Showlabname&tlabid=" + even.target.value)
                .then(response => {
                    return response.json();
                })
                .then(data => {

                    settxtvalue({ ...txtvalue, t_subname: data[0].Fullname, t_subnameTH: data[0].LabnameTH })

                })
                .catch(error => {
                    console.log(error);
                });

        }

    }

    async function Deletedata2(ID) {

        var conF = window.confirm("คุณต้องการยกเลิกรายการนี้ใช่หรือไม่ ?");
        if (conF == true) {

            fetch(API.dataSource.code + "LabsetingAPI.php?module=Deletedata2&id=" + ID)
                .then(response => {
                    return response.json();
                })
                .then(data => {

                    Showdatadetail(groupid)

                })
                .catch(error => {
                    console.log(error);
                });

        }

    }


    return (
        <div>
            <div className="page-heading">
                <h1 className="page-title"> รายการข้อมูลการตรวจ LAB </h1>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="index.html"><i className="la la-home font-20" /></a>
                    </li>
                    <li className="breadcrumb-item"> Lab From </li>
                </ol>
            </div>
            <div className="page-content fade-in-up">

                <div className='row'>
                    <div className="col-md-6">

                        <div className="ibox">
                            <div className="ibox-head">
                                <div className="ibox-title"> รายการ LAB GROUP</div>
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

                    <div className="col-md-6">

                        <div className="ibox">
                            <div className="ibox-head">
                                <div className="ibox-title"> รายการ LAB SUB </div>
                                <div> <button className="btn btn-info" style={{ cursor: 'pointer' }} onClick={() => openModal2('0')}> <i className="fa fa-plus-circle" style={{ fontSize: 18 }} /> เพิ่มรายการ </button> </div>
                            </div>
                            <div className="ibox-body">
                                <MDBDataTable
                                    striped
                                    bordered
                                    hover
                                    sortRows={['id']}
                                    data={myDatadetail}
                                />
                            </div>
                        </div>
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
                                                <div className="ibox-title"> <span> <i className="fa ti-server" style={{ fontSize: 20 }} /> ข้อมูลตรวจสุขภาพ </span> </div>
                                                <div className="ibox-tools">
                                                    <a onClick={() => setModal(false)}><i className="fa ti-close" /></a>
                                                </div>
                                            </div>
                                            <div className='row'>

                                                <div className="col-md-12">
                                                    <div className="ibox">
                                                        <div className="ibox-head">
                                                            <div className="ibox-title"> จัดการข้อมูลการตรวจสุขภาพ </div>
                                                            <div className="ibox-tools">

                                                            </div>
                                                        </div>
                                                        <div className="ibox-body">
                                                            <form>
                                                                <div className="form-group">
                                                                    <label> รหัส Lab </label>
                                                                    <input className="form-control" type="text" placeholder="รหัส Lab" value={txtvalue.t_labid} onChange={(even) => settxtvalue({ ...txtvalue, t_labid: even.target.value })} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label> ชื่อ Lab </label>
                                                                    <input className="form-control" type="text" placeholder="ชื่อ Lab" value={txtvalue.t_labname} onChange={(even) => settxtvalue({ ...txtvalue, t_labname: even.target.value })} />
                                                                </div>

                                                                <div className="form-group">
                                                                    <button className="btn btn-default" type="button" style={{ cursor: 'pointer' }} onClick={() => Savegrouplab()}> <i className="fa fa-floppy-o" style={{ fontSize: 18 }} /> บันทึกข้อมูล </button>
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

            <sesion>
                {/* onClickAway */}
                <Modal visible={modal2} width="60%" effect="fadeInUp" onClick={() => closeModal2()}>
                    <div className="Modelbody">
                        <div className="Modelheader">

                        </div>

                        <div className="cssModelbody" style={{ overflow: 'scroll', height: '80vh' }}>

                            <div className="panel-body">
                                <div className='row'>
                                    <div className="col-md-12">
                                        <div className="ibox">
                                            <div className="ibox-head">
                                                <div className="ibox-title"> <span> <i className="fa ti-server" style={{ fontSize: 20 }} /> ข้อมูลตรวจสุขภาพ </span> </div>
                                                <div className="ibox-tools">
                                                    <a onClick={() => setModal2(false)}><i className="fa ti-close" /></a>
                                                </div>
                                            </div>
                                            <div className='row'>

                                                <div className="col-md-12">
                                                    <div className="ibox">
                                                        <div className="ibox-head">
                                                            <div className="ibox-title"> จัดการข้อมูลการตรวจสุขภาพ </div>
                                                            <div className="ibox-tools">

                                                            </div>
                                                        </div>
                                                        <div className="ibox-body">
                                                            <form>
                                                                <div className="form-group" hidden={true}>
                                                                    <label> รหัส Group </label>
                                                                    <input className="form-control" type="text" placeholder="รหัส Group" value={groupid} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label> รหัส Lab </label>
                                                                    <input className="form-control" type="text" placeholder="รหัส Lab" value={txtvalue.t_subid} onKeyDown={(even) => Showlabneme(even)} onChange={(even) => settxtvalue({ ...txtvalue, t_subid: even.target.value })} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label> ชื่อ Lab </label>
                                                                    <input className="form-control" type="text" placeholder="ชื่อ Lab" value={txtvalue.t_subname} onChange={(even) => settxtvalue({ ...txtvalue, t_subname: even.target.value })} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label> ชื่อ Lab ภาษาไทย </label>
                                                                    <input className="form-control" type="text" placeholder="ชื่อ Lab ภาษาไทย" value={txtvalue.t_subnameTH} onChange={(even) => settxtvalue({ ...txtvalue, t_subnameTH: even.target.value })} />
                                                                </div>
                                                                <label className="ui-checkbox ui-checkbox-info"><input type="checkbox" onClick={(even) => settxtvalue({ ...txtvalue, t_substr: even.target.checked })} checked={txtvalue.t_substr} /><span className="input-span" /> สถานะ </label>

                                                                <div className="social-auth-hr">
                                                                    <span></span>
                                                                </div>

                                                                <div className="form-group">
                                                                    <button className="btn btn-default" type="button" style={{ cursor: 'pointer' }} onClick={() => Savesublab()}> <i className="fa fa-floppy-o" style={{ fontSize: 18 }} /> บันทึกข้อมูล </button>
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
