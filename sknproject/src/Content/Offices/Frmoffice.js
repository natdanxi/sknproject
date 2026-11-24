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
import API from '../../Config/config'
import { AlternateEmail } from '@material-ui/icons';

export default function Frmoffice() {

    const [modal, setModal] = useState(false);
    const [myData, setmyData] = useState({ columns: [], rows: [] });
    const inputData = {
        t_id: '', t_officeid: '', t_officename: '', t_str: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);

    useEffect(() => {

        Showdata();

    }, []);

    async function openModal(ID) {

        if (ID != "0") {
            Showdataedit(ID);
        } else {
            settxtvalue(inputData);
            document.getElementById("t_str1").checked = false
            document.getElementById("t_str2").checked = false
        }

        setModal(true);
    }

    async function closeModal() {
        settxtvalue(inputData);
        setModal(false);
    }

    // async function Showdata() {

    //     fetch(API.dataSource.url + "Office")
    //         .then(res => res.json())
    //         .then(json => {
    //             //alert(json);
    //             let Mydata = json;
    //             let { rows } = json;
    //             rows = Mydata.map((row, key) => ({
    //                 ...row,
    //                 Edit: (
    //                     <>
    //                         <button title="แก้ไขรายการ" onClick={() => openModal(row.Officeid)}><i className="fa fa-edit" style={{ fontSize: 20, color: 'green' }} /></button>
    //                         <button title="ยกเลิกการ"><i className="fa fa-trash" style={{ fontSize: 20, color: 'red' }} /></button>
    //                     </>
    //                 ),
    //                 Str: (
    //                     row.LA_Str == '2' ? (
    //                         <i className="fa fa-check" style={{ fontSize: 20, color: 'green' }} title='สามารถเบิกช่วงเวลาพิเศษได้' />
    //                     ) : (
    //                         <span></span>
    //                     )
    //                 )

    //             }));

    //             Mydata = {
    //                 columns: [
    //                     {
    //                         label: 'รหัส',
    //                         field: 'Officeid',
    //                         sort: 'asc',
    //                         width: 20
    //                     },
    //                     {
    //                         label: 'รายการ',
    //                         field: 'Officename',
    //                         sort: 'asc',
    //                         width: 500
    //                     },
    //                     {
    //                         label: 'สถานะ',
    //                         field: 'Str',
    //                         sort: 'asc',
    //                         width: 200
    //                     },
    //                     {
    //                         label: '',
    //                         field: 'Edit',
    //                         sort: 'asc',
    //                         width: 20
    //                     }
    //                 ],
    //                 rows
    //             };
    //             setmyData(Mydata);
    //         });

    // }
    async function Showdata() {
        fetch(API.dataSource.url + "Office")
            .then(res => {
                if (!res.ok) throw new Error("ไม่สามารถเชื่อมต่อ API ได้");
                return res.json();
            })
            .then(json => {
                let rowsData = json.map((row, key) => ({
                    ...row,
                    Officeid: row.officeid || row.Officeid,
                    Officename: row.officename || row.Officename,
                    Edit: (
                        <>
                            <button title="แก้ไขรายการ" onClick={() => openModal(row.officeid || row.Officeid)}>
                                <i className="fa fa-edit" style={{ fontSize: 20, color: 'green' }} />
                            </button>
                            <button title="ยกเลิกการ"><i className="fa fa-trash" style={{ fontSize: 20, color: 'red' }} /></button>
                        </>
                    ),
                    Str: (
                        (row.lA_Str || row.LA_Str) == '2' ? (
                            <i className="fa fa-check" style={{ fontSize: 20, color: 'green' }} title='สามารถเบิกช่วงเวลาพิเศษได้' />
                        ) : (
                            <span></span>
                        )
                    )
                }));

                const Mydata = {
                    columns: [
                        { label: 'รหัส', field: 'Officeid', sort: 'asc', width: 20 },
                        { label: 'รายการ', field: 'Officename', sort: 'asc', width: 500 },
                        { label: 'สถานะ', field: 'Str', sort: 'asc', width: 200 },
                        { label: '', field: 'Edit', sort: 'asc', width: 20 }
                    ],
                    rows: rowsData 
                };
                setmyData(Mydata);
            })
            .catch(error => {
                console.error("Fetch Error:", error);
                alert("ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์ .NET เปิดทำงานอยู่หรือไม่");
            });
    }

    // async function Showdataedit(ID) {

    //     fetch(API.dataSource.url + "Office/" + ID)
    //         .then(response => {
    //             return response.json();
    //         })
    //         .then(data => {

    //             settxtvalue({
    //                 ...txtvalue,
    //                 t_id: ID,
    //                 t_officeid: data[0].Officeid,
    //                 t_officename: data[0].Officename,
    //                 t_str: data[0].LA_Str
    //             })

    //             if (data[0].LA_Str == '1') {
    //                 document.getElementById("t_str1").checked = true
    //             } else if (data[0].LA_Str == '2') {
    //                 document.getElementById("t_str2").checked = true
    //             } else {
    //                 document.getElementById("t_str1").checked = false
    //                 document.getElementById("t_str2").checked = false
    //             }

    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });

    // }
    async function Showdataedit(ID) {
        fetch(API.dataSource.url + "Office/" + ID)
            .then(response => {
                return response.json();
            })
            .then(data => {
                // ดักจับเผื่อ .NET ส่งมาเป็น Object ตรงๆ 
                const officeData = data[0] || data;

                settxtvalue({
                    ...txtvalue,
                    t_id: ID,
                    // ดักจับตัวพิมพ์เล็ก/พิมพ์ใหญ่ให้ครอบคลุม
                    t_officeid: officeData.officeid || officeData.Officeid,
                    t_officename: officeData.officename || officeData.Officename,
                    t_str: officeData.lA_Str || officeData.LA_Str
                })

                const currentStr = officeData.lA_Str || officeData.LA_Str;
                if (currentStr == '1') {
                    document.getElementById("t_str1").checked = true
                } else if (currentStr == '2') {
                    document.getElementById("t_str2").checked = true
                } else {
                    document.getElementById("t_str1").checked = false
                    document.getElementById("t_str2").checked = false
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    async function Savedata() {
        if (txtvalue.t_officeid == "") {
            alert("กรุณาใส่รหัสหน่วยงานด้วยครับ !");
            document.getElementById("t_officeid").focus();
            return false;
        } else if (txtvalue.t_officename == "") {
            alert("กรุณาใส่ชื่อหน่วยงานด้วยครับ !");
            document.getElementById("t_officename").focus();
            return false;
        } else if (txtvalue.t_str == "") {
            alert("กรุณาเลือกสถานะด้วยครับ !");
            return false;
        } else {

            const method = "POST";
            const body = new FormData();
            body.append("tid", txtvalue.t_id);
            body.append("tofficeid", txtvalue.t_officeid);
            body.append("tofficename", txtvalue.t_officename);
            body.append("tStr", txtvalue.t_str);
            fetch(API.dataSource.url + "Office", { method, body })
                .then(res => res.json())
                .then(data => {

                    //alert(JSON.stringify(data, null, "\t"))

                    if (data == "0") {
                        alert("ระบบได้ทำการบันทึกข้อมูลเรียบร้อยแล้วครับ");
                        return false;
                    } else if (data == "1") {
                        alert("มีรหัสหรือว่าชื่อหน่วยงานนี้แล้วครับ ! \n กรุณาตรวจสอบข้อมูลใหม่อีกครั้ง...");
                        return false;
                    } else if (data == "2") {
                        alert("ระบบได้ทำการบันทึกแก้ไขข้อมูลเรียบร้อยแล้วครับ");
                        return false;
                    }

                    Showdata();
                    settxtvalue(inputData);
                    setModal(false);

                });

        }

    }

    return (
        <div>
            <div className="page-heading">
                <h1 className="page-title"> หน่วยงาน </h1>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="index.html"><i className="la la-home font-20" /></a>
                    </li>
                    <li className="breadcrumb-item"> Fabric From </li>
                </ol>
            </div>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <div className="ibox-head">
                        <div className="ibox-title"> รายการหน่วยงาน </div>
                        <div> <button className="btn btn-info" style={{ cursor: 'pointer' }} onClick={() => openModal('0')}> <i className="fa ti-write" style={{ fontSize: 18 }} /> เพิ่มรายการใหม่ </button> </div>
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

                <CModal
                    title="แจ้งเตือน"
                    color="primary"
                    show={modal}
                    onClose={setModal}
                    size='lg'
                >
                    <CModalBody>
                        <div className='row'>
                            <div className="col-md-12">
                                <div className="ibox">
                                    <div className="ibox-head">
                                        <div className="ibox-title"> <span> <i className="fa ti-server" style={{ fontSize: 20 }} /> ข้อมูลหน่วยงาน </span> </div>
                                        <div className="ibox-tools">
                                            <a onClick={() => setModal(false)}><i className="fa ti-close" /></a>
                                        </div>
                                    </div>
                                    <div className="ibox-body">
                                        <form>

                                            <div className="form-group">
                                                <label> รหัสหน่วยงาน </label>
                                                <input id="t_officeid" className="form-control" type="text" placeholder="รหัสหน่วยงาน" value={txtvalue.t_officeid} onChange={(even) => settxtvalue({ ...txtvalue, t_officeid: even.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label> ชื่อหน่วยงาน </label>
                                                <input id="t_officename" className="form-control" type="text" placeholder="ชื่อหน่วยงาน" value={txtvalue.t_officename} onChange={(even) => settxtvalue({ ...txtvalue, t_officename: even.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label> สถานะ </label>
                                                <div style={{ padding: 25 }}>
                                                    <label className="ui-radio ui-radio-primary">
                                                        <input type="radio" id="t_str1" name="t_str" onClick={(even) => settxtvalue({ ...txtvalue, t_str: '1' })} />
                                                        <span className="input-span" /> เบิกช่วงเวลาธรรมดา
                                                    </label> &nbsp;&nbsp;
                                                    <label className="ui-radio ui-radio-warning">
                                                        <input type="radio" id="t_str2" name="t_str" onClick={(even) => settxtvalue({ ...txtvalue, t_str: '2' })} />
                                                        <span className="input-span" /> เบิกช่วงเวลาพิเศษ
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="ml-sm-auto">
                                                <button className="btn btn-info" type="button" style={{ cursor: 'pointer' }} onClick={() => Savedata()}> <i className="fa ti-save" style={{ fontSize: 18 }} /> บันทึก </button>
                                            </div>


                                        </form>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </CModalBody>
                </CModal>
            </sesion>

        </div>
    )
}
