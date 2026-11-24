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
import { LocationSearchingSharp, Tune } from '@material-ui/icons';

export default function Frmreserve() {

    const [modal, setModal] = useState(false);
    const [myData, setmyData] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_id: '', t_hn: '', t_name: '', t_room1: '', t_room2: '', t_listid: '', t_list: '', t_car1: '', t_car2: '',
        t_car3: '', t_car4: '', t_date:'', t_time: '', t_type: '', t_carnum1: '', t_carnum2: '', t_carnum3: '',
        t_carnum4: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [listRoom, setlistRoom] = useState([]);
    const [listactivities, setlistactivities] = useState([]);

    useEffect(() => {

        Showdata();
        Showlistroom();
        Showlistactivities();

    }, []);

    //วันที่ปัจจุบัน
    async function Showdatenow() {
        var datenow = new Date();
        var dateString =
            datenow.getUTCFullYear() + "-" +
            ("0" + (datenow.getUTCMonth() + 1)).slice(-2) + "-" +
            ("0" + datenow.getUTCDate()).slice(-2) + " " +
            ("0" + datenow.getHours()).slice(-2) + ":" +
            ("0" + datenow.getUTCMinutes()).slice(-2) + ":" +
            ("0" + datenow.getUTCSeconds()).slice(-2);

        settxtvalue({ ...txtvalue, t_date: dateString.substr(0, 10), t_time: dateString.substr(11, 5) })
    }

    async function openModal(ID) {

        if (ID != '0') {
            Showdataedit(ID);
        } else {
            settxtvalue(inputData);
        }

        Showdatenow();
        setModal(true);

    }

    async function closeModal() {
        settxtvalue(inputData);
        setModal(false)
    }

    async function Showdata() {
        //alert(API.Cardles.resultAPI + "ReserveAPI.php?module=Showdata&officeID=" + txtvalue.t_officeid)
        fetch(API.Cardles.resultAPI + "ReserveAPI.php?module=Showdata&officeID=" + txtvalue.t_officeid)
            .then(res => res.json())
            .then(json => {
                //alert(json);
                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    Edit: (
                        <div style={{ textAlign: 'center' }}>
                            <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(row.Order_ID)}><i className="fa fa-pencil font-14" title='จัดการข้อมูลผ้า' /></button>
                            <button className="btn btn-default btn-xs" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Delete" onClick={() => Deletedata(row.Order_ID)}><i className="fa fa-trash" /></button>
                        </div>
                    ),
                    roomName1: (
                        <>
                            {row.strroom + " " + row.roomName}
                        </>
                    ),
                    Strcar: (
                        <>
                            <i className="fa fa-wheelchair" style={{ fontSize: 15 }} title="รถนั้ง" /> : {row.Num1}
                            <i className="fa fa-bed" style={{ fontSize: 15 }} title="รถนอน" /> : {row.Num2}
                            <i className="fa fa-fire-extinguisher" style={{ fontSize: 15 }} title="ออกซิเจน" /> : {row.Num3}
                        </>
                    ),
                    Fullname: (
                        <span>{row.Patient[0].fullname}</span>
                    ), Status: (
                        <>
                            {
                                row.Order_type == '1' ? (
                                    <i className="fa fa-circle" style={{ fontSize: 48, color: '#FF0000' }} />
                                ) : row.Order_type == '2' ? (
                                    <i className="fa fa-circle" style={{ fontSize: 48, color: '#FF0099' }} />
                                ) : row.Order_type == '3' ? (
                                    <i className="fa fa-circle" style={{ fontSize: 48, color: '#FFFF00' }} />
                                ) : row.Order_type == '4' ? (
                                    <i className="fa fa-circle" style={{ fontSize: 48, color: '#339900' }} />
                                ) : (
                                    <i className="fa fa-circle" style={{ fontSize: 48, color: '' }} />
                                )
                            }

                        </>
                    )

                }));

                Mydata = {
                    columns: [
                        {
                            label: '#',
                            field: 'Status',
                            sort: 'asc',
                            width: 20
                        },
                        {
                            label: 'HN',
                            field: 'Order_hn',
                            sort: 'asc',
                            width: 500
                        },
                        {
                            label: 'ชื่อ-สกุล',
                            field: 'Fullname',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'หน่วยจอง',
                            field: 'roomName1',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'กิจกรรม',
                            field: 'Order_list',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'เปล',
                            field: 'Strcar',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'วันที่',
                            field: 'Order_date',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'เวลาส่ง',
                            field: 'Order_timereceive',
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

    async function Showlistroom() {

        fetch(API.Cardles.resultAPI + "ReserveAPI.php?module=Showlistroom")
            .then(response => {
                return response.json();
            })
            .then(data => {

                setlistRoom(data);

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Showlistactivities() {
        //alert(API.Cardles.resultAPI + "ReserveAPI.php?module=Showlistactivities")
        fetch(API.Cardles.resultAPI + "ReserveAPI.php?module=Showlistactivities")
            .then(response => {
                return response.json();
            })
            .then(data => {

                setlistactivities(data);

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Savedata() {

        if (txtvalue.t_hn == "") {
            alert("กรุณาใส่ HN ด้วยครับ !");
            document.getElementById("t_hn").focus();
            return false;
        } else if (txtvalue.t_name == "") {
            alert("กรุณาใส่ HN แล้วกด Enter ก่อนครับ !");
            document.getElementById("t_hn").focus();
            return false;
        } else if (txtvalue.t_room1 == "") {
            alert("กรุณาเลือกส่งจากด้วยครับ !");
            return false;
        } else if (txtvalue.t_room2 == "") {
            alert("กรุณาเลือกปลายทางที่ส่งด้วยครับ !");
            return false;
        } else if (txtvalue.t_date == "") {
            alert("กรุณาเลือกวันที่จองด้วยครับ !");
            return false;
        } else if (txtvalue.t_time == "") {
            alert("กรุณาใส่เวลาที่ต้องการใช้งานด้วยครับ !");
            return false;
        } else if (txtvalue.t_type == "") {
            alert("กรุณาเลือกระดับความฉุกเฉินของผู้ป่วยด้วยครับ !");
            return false;
        } else {

            const method = "POST";
            const body = new FormData();
            body.append("tid", txtvalue.t_id);
            body.append("thn", txtvalue.t_hn);
            body.append("tname", txtvalue.t_name);
            body.append("troom", txtvalue.t_officeid);
            body.append("troom1", txtvalue.t_room1);
            body.append("troom2", txtvalue.t_room2);
            body.append("tlistid", txtvalue.t_listid);
            body.append("tlist", txtvalue.t_list);
            body.append("tcar1", txtvalue.t_car1);
            body.append("tcar2", txtvalue.t_car2);
            body.append("tcar3", txtvalue.t_car3);
            body.append("tcar4", txtvalue.t_car4);
            body.append("tdate", txtvalue.t_date);
            body.append("ttime", txtvalue.t_time);
            body.append("ttype", txtvalue.t_type);
            body.append("tcarnum1", txtvalue.t_carnum1);
            body.append("tcarnum2", txtvalue.t_carnum2);
            body.append("tcarnum3", txtvalue.t_carnum3);
            body.append("tcarnum4", txtvalue.t_carnum4);
            fetch(API.Cardles.resultAPI + "ReserveAPI.php?module=Inputdata", { method, body })
                .then(res => res.json())
                .then(data => {

                    //alert(JSON.stringify(data, null, "\t"))

                    if (data == '0') {
                        alert("ระบบได้ทำการบันทึกข้อมูลเรียบร้อยแล้วครับ");
                    } else if (data == '1') {
                        alert("ระบบได้ทำการบันทึกแก้ไขข้อมูลใหม่เรียบร้อยแล้วครับ");
                    } else if (data == '2') {
                        alert("ระบบทำการบันทึกแก้ไขข้อมูลใหม่เรียบร้อยแล้วครับ !");
                    }

                    settxtvalue(inputData);
                    Showdata();
                    setModal(false);

                });

        }

    }

    async function Deletedata(ID) {

        var conF = window.confirm("คุณต้องการยกเลิกรายการนี้ใช่หรือไม่ ?");
        if (conF == true) {

            fetch(API.Cardles.resultAPI + "ReserveAPI.php?module=Deletedata&ID=" + ID)
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

    //แสดงข้อมูลเพื่อแก้ไข
    async function Showdataedit(ID) {
        //alert(API.Cardles.resultAPI + "ReserveAPI.php?module=Showdataedit&ID=" + ID)
        fetch(API.Cardles.resultAPI + "ReserveAPI.php?module=Showdataedit&ID=" + ID)
            .then(response => {
                return response.json();
            })
            .then(data => {

                settxtvalue({
                    ...txtvalue, t_hn: data[0].Order_hn, t_name: data[0].Patient[0].fullname, t_room1: data[0].Order_room,
                    t_room2: data[0].Order_room2, t_list: data[0].Order_list, t_car1: data[0].Order_car1, t_car2: data[0].Order_car2,
                    t_car3: data[0].Order_oxygen, t_car4: data[0].Authorities, t_date: data[0].Order_date.substr(0, 10),
                    t_time: data[0].Order_date.substr(11, 5), t_type: data[0].Order_type, t_id: data[0].Order_ID,
                    t_carnum1: data[0].Order_carnum1, t_carnum2: data[0].Order_carnum2, t_carnum3: data[0].Order_oxygennum,
                    t_carnum4: data[0].Authoritiesnum,
                })

                if (data[0].Order_car1 == "1") {
                    document.getElementById("t_car1").checked = true;
                } else {
                    document.getElementById("t_car1").checked = false;
                }
                if (data[0].Order_car2 == "1") {
                    document.getElementById("t_car2").checked = true;
                } else {
                    document.getElementById("t_car2").checked = false;
                }
                if (data[0].Order_oxygen == "1") {
                    document.getElementById("t_car3").checked = true;
                } else {
                    document.getElementById("t_car3").checked = false;
                }
                if (data[0].Authorities == "1") {
                    document.getElementById("t_car4").checked = true;
                } else {
                    document.getElementById("t_car4").checked = false;
                }

                var t_type1 = document.getElementById("t_type1");
                var t_type2 = document.getElementById("t_type2");
                var t_type3 = document.getElementById("t_type3");
                var t_type4 = document.getElementById("t_type4");
                var t_type5 = document.getElementById("t_type5");
                var t_typename = document.getElementById("t_typename");
                var iconCollor = document.getElementById("icon_collor");

                if (data[0].Order_type == "1") {
                    t_type1.checked = true;
                    t_type2.checked = false;
                    t_type3.checked = false;
                    t_type4.checked = false;
                    t_type5.checked = false;
                    t_typename.innerHTML = "ผู้ป่วยวิกฤตมีภาวะคุกคามที่จะทำให้เสียชีวิตตรวจทันที";
                    iconCollor.style.color = "red";
                    iconCollor.style.border = "solid #DCDCDC";
                } else if (data[0].Order_type == "2") {
                    t_type1.checked = false;
                    t_type2.checked = true;
                    t_type3.checked = false;
                    t_type4.checked = false;
                    t_type5.checked = false;
                    t_typename.innerHTML = "ผู้ป่วยเจ็บป่วยรุนแรงเสี่ยงต่อการเสียชีวิตตรวจภายใน 5-15 นาที";
                    iconCollor.style.color = "#FF3399";
                    iconCollor.style.border = "solid #DCDCDC";
                } else if (data[0].Order_type == "3") {
                    t_type1.checked = false;
                    t_type2.checked = false;
                    t_type3.checked = true;
                    t_type4.checked = false;
                    t_type5.checked = false;
                    t_typename.innerHTML = "ผู้ป่วยฉุกเฉินเจ็บป่วยป่านกลางตรวจภายใน 15-30 นาที";
                    iconCollor.style.color = "yellow";
                    iconCollor.style.border = "solid #DCDCDC";
                } else if (data[0].Order_type == "4") {
                    t_type1.checked = false;
                    t_type3.checked = false;
                    t_type2.checked = false;
                    t_type4.checked = true;
                    t_type5.checked = false;
                    t_typename.innerHTML = "ผู้ป่วยเจ็บป่วยเล็กน้อยตรวจภายใน 30-60 นาที";
                    iconCollor.style.color = "green";
                    iconCollor.style.border = "solid #DCDCDC";
                } else if (data[0].Order_type == "5") {
                    t_type1.checked = false;
                    t_type3.checked = false;
                    t_type4.checked = false;
                    t_type2.checked = false;
                    t_type5.checked = true;
                    t_typename.innerHTML = "ผู้ป่วยทั่วไปรอตรวจ 1-2 ชั่วโมง";
                    iconCollor.style.color = "white";
                    iconCollor.style.border = "solid #DCDCDC";
                }

            })
            .catch(error => {
                console.log(error);
            });

    }

    //ค้น HN
    async function SearchHN(even) {

        if (even.keyCode == "13") {

            if (txtvalue.t_hn == "") {

                alert("กรุณาใส่ HN ด้วยครับ !");
                document.getElementById("t_hn").focus();

            } else {

                fetch(API.Cardles.resultAPI + "ReserveAPI.php?module=Searchhn&HN=" + even.target.value)
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {

                        if (data != "") {
                            settxtvalue({ ...txtvalue, t_name: data[0].Name })
                        } else {
                            settxtvalue({ ...txtvalue, t_name: '' })
                        }

                    })
                    .catch(error => {
                        console.log(error);
                    });

            }

        }

    }

    //สถานะรถ
    async function Fucar1(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_car1: '1', t_carnum1: '1' })
            document.getElementById("t_carnum1").focus();
        } else {
            settxtvalue({ ...txtvalue, t_car1: '', t_carnum1: '' })
        }
    }
    async function Fucar2(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_car2: '1', t_carnum2: '1' })
            document.getElementById("t_carnum2").focus();
        } else {
            settxtvalue({ ...txtvalue, t_car2: '', t_carnum2: '' })
        }
    }
    async function Fucar3(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_car3: '1', t_carnum3: '1' })
            document.getElementById("t_carnum3").focus();
        } else {
            settxtvalue({ ...txtvalue, t_car3: '', t_carnum3: '' })
        }
    }
    async function Fucar4(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_car4: '1', t_carnum4: '1' })
            document.getElementById("t_carnum4").focus();
        } else {
            settxtvalue({ ...txtvalue, t_car4: '', t_carnum4: '' })
        }
    }

    //ลำดับความเร่งด่วน
    async function Futype(val) {

        var t_type1 = document.getElementById("t_type1");
        var t_type2 = document.getElementById("t_type2");
        var t_type3 = document.getElementById("t_type3");
        var t_type4 = document.getElementById("t_type4");
        var t_type5 = document.getElementById("t_type5");
        var t_typename = document.getElementById("t_typename");
        var iconCollor = document.getElementById("icon_collor");

        settxtvalue({ ...txtvalue, t_type: val })

        if (val == "1" && t_type1.checked == true) {
            t_type2.checked = false;
            t_type3.checked = false;
            t_type4.checked = false;
            t_type5.checked = false;
            t_typename.innerHTML = "ผู้ป่วยวิกฤตมีภาวะคุกคามที่จะทำให้เสียชีวิตตรวจทันที";
            iconCollor.style.color = "red";
            iconCollor.style.border = "solid #DCDCDC";
        } else if (val == "2" && t_type2.checked == true) {
            t_type1.checked = false;
            t_type3.checked = false;
            t_type4.checked = false;
            t_type5.checked = false;
            t_typename.innerHTML = "ผู้ป่วยเจ็บป่วยรุนแรงเสี่ยงต่อการเสียชีวิตตรวจภายใน 5-15 นาที";
            iconCollor.style.color = "#FF3399";
            iconCollor.style.border = "solid #DCDCDC";
        } else if (val == "3" && t_type3.checked == true) {
            t_type1.checked = false;
            t_type2.checked = false;
            t_type4.checked = false;
            t_type5.checked = false;
            t_typename.innerHTML = "ผู้ป่วยฉุกเฉินเจ็บป่วยป่านกลางตรวจภายใน 15-30 นาที";
            iconCollor.style.color = "yellow";
            iconCollor.style.border = "solid #DCDCDC";
        } else if (val == "4" && t_type4.checked == true) {
            t_type1.checked = false;
            t_type3.checked = false;
            t_type2.checked = false;
            t_type5.checked = false;
            t_typename.innerHTML = "ผู้ป่วยเจ็บป่วยเล็กน้อยตรวจภายใน 30-60 นาที";
            iconCollor.style.color = "green";
            iconCollor.style.border = "solid #DCDCDC";
        } else if (val == "5" && t_type5.checked == true) {
            t_type1.checked = false;
            t_type3.checked = false;
            t_type4.checked = false;
            t_type2.checked = false;
            t_typename.innerHTML = "ผู้ป่วยทั่วไปรอตรวจ 1-2 ชั่วโมง";
            iconCollor.style.color = "white";
            iconCollor.style.border = "solid #DCDCDC";
        }
    }

    return (
        <>
            <div className="page-heading">
                <h1 className="page-title"> จองเปล </h1>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="index.html"><i className="la la-home font-20" /></a>
                    </li>
                    <li className="breadcrumb-item"> Reserve From </li>
                </ol>
            </div>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <div className="ibox-head">
                        <div className="ibox-title"> รายการ</div>
                        <div> <button className="btn btn-info" style={{ cursor: 'pointer' }} onClick={() => openModal('0')}> <i className="fa fa-plus-circle" style={{ fontSize: 18 }} /> จองเปล </button> </div>
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
                                            <div className="ibox-title"> <span> <i className="fa ti-server" style={{ fontSize: 20 }} /> ข้อมูลการจอง </span> </div>
                                            <div className="ibox-tools">
                                                <a onClick={() => closeModal()}><i className="fa ti-close" /></a>
                                            </div>
                                        </div>
                                        <div className='row'>

                                            <div className="col-md-12">
                                                <div className="ibox">
                                                    <div className="ibox-head">
                                                        <div className="ibox-title"> จัดการข้อมูลการจอง </div>
                                                        <div className="ibox-tools">

                                                        </div>
                                                    </div>
                                                    <div className="ibox-body">
                                                        <form>
                                                            <div className="row">
                                                                <div className='col-md-4'>
                                                                    <div className="form-group">
                                                                        <label> HN </label>
                                                                        <input className="form-control" type="text" id="t_hn" placeholder="HN Enter" value={txtvalue.t_hn} onChange={(even) => settxtvalue({ ...txtvalue, t_hn: even.target.value })} onKeyDown={(even) => SearchHN(even)} />
                                                                    </div>
                                                                </div>
                                                                <div className='col-md-8'>
                                                                    <div className="form-group">
                                                                        <label> ชื่อ-สกุล </label>
                                                                        <input className="form-control" type="text" placeholder="ชื่อ-สกุล" value={txtvalue.t_name} onChange={(even) => settxtvalue({ ...txtvalue, t_name: even.target.value })} readOnly="true" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label> ส่งจาก </label>
                                                                <Select
                                                                    value={listRoom.find(obj => obj.value === txtvalue.t_room1)}
                                                                    options={listRoom}
                                                                    onChange={(even) => settxtvalue({ ...txtvalue, t_room1: even.value })}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label> ปลายทางที่ส่ง </label>
                                                                <Select
                                                                    value={listRoom.find(obj => obj.value === txtvalue.t_room2)}
                                                                    options={listRoom}
                                                                    onChange={(even) => settxtvalue({ ...txtvalue, t_room2: even.value })}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label> กิจกรรม </label>
                                                                {
                                                                    /*
                                                                    <Select
                                                                    value={listactivities.find(obj => obj.value === txtvalue.t_listid)}
                                                                    options={listactivities}
                                                                    onChange={(even) => settxtvalue({ ...txtvalue, t_listid: even.value, t_list: even.label })}
                                                                />
                                                                    */
                                                                }

                                                                <input className="form-control" type="text" placeholder="กิจกรรม" value={txtvalue.t_list} onChange={(even) => settxtvalue({ ...txtvalue, t_list: even.target.value })} />
                                                            </div>

                                                            <div className="form-group">
                                                                <label> สถานะ </label>
                                                                <div className="col-12 m-b-20">
                                                                    <div className="check-list">
                                                                        <div className="row">
                                                                            <div className='col-md-2.5'>
                                                                                <label className="ui-checkbox">
                                                                                    <input type="checkbox" id="t_car1" onClick={(even) => Fucar1(even)} />
                                                                                    <span className="input-span" />รถนั่ง
                                                                                </label>
                                                                            </div>
                                                                            <div className='col-md-3'>
                                                                                <input className="form-control" type="text" placeholder="จำนวน" id="t_carnum1" value={txtvalue.t_carnum1} onChange={(even) => settxtvalue({ ...txtvalue, t_carnum1: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className='col-md-2.5'>
                                                                                <label className="ui-checkbox">
                                                                                    <input type="checkbox" id="t_car2" onClick={(even) => Fucar2(even)} />
                                                                                    <span className="input-span" />รถนอน</label>
                                                                            </div>
                                                                            <div className='col-md-3'>
                                                                                <input className="form-control" type="text" placeholder="จำนวน" id="t_carnum2" value={txtvalue.t_carnum2} onChange={(even) => settxtvalue({ ...txtvalue, t_carnum2: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className='col-md-2.5'>
                                                                                <label className="ui-checkbox">
                                                                                    <input type="checkbox" id="t_car3" onClick={(even) => Fucar3(even)} />
                                                                                    <span className="input-span" />มีออกซิเจน</label>
                                                                            </div>
                                                                            <div className='col-md-3'>
                                                                                <input className="form-control" type="text" placeholder="จำนวน" id="t_carnum3" value={txtvalue.t_carnum3} onChange={(even) => settxtvalue({ ...txtvalue, t_carnum3: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className='col-md-2.5'>
                                                                                <label className="ui-checkbox">
                                                                                    <input type="checkbox" id="t_car4" onClick={(even) => Fucar4(even)} />
                                                                                    <span className="input-span" />เจ้าหน้าที่</label>
                                                                            </div>
                                                                            <div className='col-md-3'>
                                                                                <input className="form-control" type="text" placeholder="จำนวน" id="t_carnum4" value={txtvalue.t_carnum4} onChange={(even) => settxtvalue({ ...txtvalue, t_carnum4: even.target.value })} />
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <div className='col-md-6'>
                                                                    <div className="form-group">
                                                                        <label> วันที่จอง </label>
                                                                        <input className="form-control" type="date" placeholder="HN Enter" value={txtvalue.t_date} onChange={(even) => settxtvalue({ ...txtvalue, t_date: even.target.value })} />
                                                                    </div>
                                                                </div>
                                                                <div className='col-md-6'>
                                                                    <div className="form-group">
                                                                        <label> เวลาที่ต้องการใช้งานรถ </label>
                                                                        <input className="form-control" type="time" placeholder="ชื่อ-สกุล" value={txtvalue.t_time} onChange={(even) => settxtvalue({ ...txtvalue, t_time: even.target.value })} />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="form-group">
                                                                <label> ลำดับความเร่งด่วน </label>
                                                                <div className="m-b-10">
                                                                    <label className="ui-checkbox ui-checkbox-inline">
                                                                        <input type="checkbox" id="t_type1" onClick={() => Futype('1')} />
                                                                        <span className="input-span" />แดง</label>
                                                                    <label className="ui-checkbox ui-checkbox-inline">
                                                                        <input type="checkbox" id="t_type2" onClick={() => Futype('2')} />
                                                                        <span className="input-span" />ชมพู</label>
                                                                    <label className="ui-checkbox ui-checkbox-inline">
                                                                        <input type="checkbox" id="t_type3" onClick={() => Futype('3')} />
                                                                        <span className="input-span" />เหลือง</label>
                                                                    <label className="ui-checkbox ui-checkbox-inline">
                                                                        <input type="checkbox" id="t_type4" onClick={() => Futype('4')} />
                                                                        <span className="input-span" />เขียว</label>
                                                                    <label className="ui-checkbox ui-checkbox-inline">
                                                                        <input type="checkbox" id="t_type5" onClick={() => Futype('5')} />
                                                                        <span className="input-span" />ขาว</label>
                                                                </div>
                                                            </div>

                                                            <div className="form-group">
                                                                <label className="ui-checkbox ui-checkbox-inline">
                                                                    <i id="icon_collor" className="fa fa-wheelchair" style={{ fontSize: 22, border: 'solid rgb(220, 220, 220)', color: 'red' }} />&nbsp;
                                                                    <span id="t_typename" />
                                                                </label>
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

        </>
    )
}
