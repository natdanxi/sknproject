import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import API from '../../Config/config'

export default function Frmregister(props) {

    const [listTname, setlistTname] = useState([]);
    const [listOffice, setlistOffice] = useState([]);
    const inputData = {
        t_tname: '', t_fname: '', t_lname: '', t_position: '', t_officeid: '', t_tel: '', t_email: '',
        t_username: '', t_passwd: '', t_passwdconF: '', t_file: '', t_proid: props.Projectid.Proid
    }
    const [txtvalue, settxtvalue] = useState(inputData)

    useEffect(() => {

        Showlisttname();
        Showlistoffice();

    }, []);

    async function Showlisttname() {

        fetch(API.dataSource.code + "registerAPI.php?module=Showlisttname")
            .then(response => {
                return response.json();
            })
            .then(data => {

                setlistTname(data);

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Showlistoffice() {

        fetch(API.dataSource.code + "registerAPI.php?module=Showlistoffice")
            .then(response => {
                return response.json();
            })
            .then(data => {

                setlistOffice(data);

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Savedata() {

        if (txtvalue.t_tname == "") {
            alert("กรุณาใส่คำนำหน้าชื่อด้วยครับ !");
            document.getElementById("t_tname").focus();
            return false;
        } else if (txtvalue.t_fname == "") {
            alert("กรุณาใส่ชื่อด้วยครับ !");
            document.getElementById("t_fname").focus();
            return false;
        } else if (txtvalue.t_lname == "") {
            alert("กรุณาใส่นามสกุลด้วยครับ !");
            document.getElementById("t_lname").focus();
            return false;
        } else if (txtvalue.t_tel == "") {
            alert("กรุณาใส่เบอร์โทรติดต่อด้วยครับ !");
            document.getElementById("t_tel").focus();
            return false;
        } else if (txtvalue.t_username == "") {
            alert("กรุณาใส่ Username ด้วยครับ !");
            document.getElementById("t_username").focus();
            return false;
        } else if (txtvalue.t_passwd == "") {
            alert("กรุณาใส่รหัสผ่านด้วยครับ !");
            document.getElementById("t_passwd").focus();
            return false;
        } else if (txtvalue.t_passwdconF == "") {
            alert("กรุณายืนยันรหัสผ่านด้วยครับ !");
            document.getElementById("t_userconF").focus();
            return false;
        } else if (txtvalue.t_passwd != txtvalue.t_passwdconF) {
            alert("รหัสผ่านไม่ตรงกันกรุณาตรวจสอบข้อมูลใหม่อีกครั้ง !");
            return false;
        } else {
            
            if (props.Projectid.Proid == "01") {

                //ลงทะเบียนซักฟอก
                const method = "POST";
                const body = new FormData();
                body.append("ttname", txtvalue.t_tname);
                body.append("tfname", txtvalue.t_fname);
                body.append("tlname", txtvalue.t_lname);
                body.append("tposition", txtvalue.t_position);
                body.append("ttel", txtvalue.t_tel);
                body.append("temail", txtvalue.t_email);
                body.append("tofficeid", txtvalue.t_officeid);
                body.append("tusername", txtvalue.t_username);
                body.append("tpasswd", txtvalue.t_passwd);
                body.append("tpasswdconF", txtvalue.t_passwdconF);
                body.append("tfile", txtvalue.t_file);
                fetch(API.dataSource.code + "registerAPI.php?module=Inputdata", { method, body })
                    .then(res => res.json())
                    .then(data => {

                        //alert(JSON.stringify(data, null, "\t"))

                        if (data == "0") {
                            alert("ระบบทำการลงทะเบียนเข้าใช้งานเรียบร้อยแล้วครับ");
                            window.location.reload();
                        } else if (data == "1") {
                            alert("Username นี้มีการใช้งานในระบบแล้วครับ !");
                            return false;
                        }

                    });

            } else if (props.Projectid.Proid == "02") {

            } else if (props.Projectid.Proid == "03") {

            } else if (props.Projectid.Proid == "04") {

                //ลงทะเบียนโปรแกรมจองเปล
                const method = "POST";
                const body = new FormData();
                body.append("ttname", txtvalue.t_tname);
                body.append("tfname", txtvalue.t_fname);
                body.append("tlname", txtvalue.t_lname);
                body.append("tposition", txtvalue.t_position);
                body.append("ttel", txtvalue.t_tel);
                body.append("temail", txtvalue.t_email);
                body.append("tofficeid", '');
                body.append("tusername", txtvalue.t_username);
                body.append("tpasswd", txtvalue.t_passwd);
                body.append("tpasswdconF", txtvalue.t_passwdconF);
                body.append("tfile", txtvalue.t_file);
                fetch(API.Cardles.resultAPI + "RegisterAPI.php?module=Register", { method, body })
                    .then(res => res.json())
                    .then(data => {

                        //alert(JSON.stringify(data, null, "\t"))

                        if (data == "0") {
                            alert("ระบบทำการลงทะเบียนเข้าใช้งานเรียบร้อยแล้วครับ");
                            window.location.reload();
                        } else if (data == "1") {
                            alert("Username นี้มีการใช้งานในระบบแล้วครับ !");
                            return false;
                        }

                    });

            }

        }


    }

    return (
        <div>

            <div className="content">
                <div className="brand">
                    <a className="link" href="#">  </a>
                </div>
                <form id="register-form" action="javascript:;" method="post">
                    <h2 className="login-title">Sign Up</h2>
                    <div className="form-group">
                        <Select
                            value={listTname.find(obj => obj.value === txtvalue.t_tname)}
                            options={listTname}
                            onChange={e => settxtvalue({ ...txtvalue, t_tname: e.value })}
                        />
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group">
                                <input className="form-control" type="text" id="t_fname" placeholder="ชื่อ" onChange={(even) => settxtvalue({ ...txtvalue, t_fname: even.target.value })} />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <input className="form-control" type="text" id="t_lname" placeholder="นามสกุล" onChange={(even) => settxtvalue({ ...txtvalue, t_lname: even.target.value })} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <input className="form-control" type="text" id="t_position" placeholder="ตำแหน่ง" onChange={(even) => settxtvalue({ ...txtvalue, t_position: even.target.value })} />
                    </div>
                    <div className="form-group">
                        <input className="form-control" type="text" id="t_tel" placeholder="เบอร์โทร" onChange={(even) => settxtvalue({ ...txtvalue, t_tel: even.target.value })} />
                    </div>
                    <div className="form-group">
                        <input className="form-control" type="email" id="t_email" placeholder="Email" autoComplete="off" onChange={(even) => settxtvalue({ ...txtvalue, t_email: even.target.value })} />
                    </div>
                    <div className="form-group">
                        <Select
                            value={listOffice.find(obj => obj.value === txtvalue.t_officeid)}
                            options={listOffice}
                            onChange={e => settxtvalue({ ...txtvalue, t_officeid: e.value })}
                        />
                    </div>
                    <div className="form-group">
                        <input className="form-control" type="text" id="t_username" placeholder="User login" onChange={(even) => settxtvalue({ ...txtvalue, t_username: even.target.value })} />
                    </div>
                    <div className="form-group">
                        <input className="form-control" id="t_passwd" type="password" name="password" placeholder="Password" onChange={(even) => settxtvalue({ ...txtvalue, t_passwd: even.target.value })} />
                    </div>
                    <div className="form-group">
                        <input className="form-control" type="password" id="t_passwdconF" placeholder="Confirm Password" onChange={(even) => settxtvalue({ ...txtvalue, t_passwdconF: even.target.value })} />
                    </div>
                    <div className="form-group">
                        <input type="file" placeholder="รูปภาพ" onChange={(even) => settxtvalue({ ...txtvalue, t_file: even.target.files[0] })} />
                    </div>
                    {/*<div className="form-group text-left">
                        <label className="ui-checkbox ui-checkbox-info">
                            <input type="checkbox" name="agree" />
                            <span className="input-span" />I agree the terms and policy</label>
                    </div>*/}
                    <div className="form-group">
                        <button className="btn btn-info btn-block" style={{ cursor: 'pointer' }} type="submit" onClick={() => Savedata()}> Sign up </button>
                    </div>
                    <div className="social-auth-hr">
                        <span> โรงพยาบาลสกลนคร </span>
                    </div>
                    <div className="text-center social-auth m-b-20">

                    </div>
                    <div className="text-center">
                        <a className="color-blue" href="#"> </a>
                    </div>
                </form>
            </div>

        </div>
    )
}
