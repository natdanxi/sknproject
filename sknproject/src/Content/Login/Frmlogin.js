import React, { useEffect, useState } from "react";
import Modal from "react-awesome-modal";
import Frmregister from "../Register/Frmregister";
import API from "../../Config/config";
import Select from "react-select";
import Manual from "../../assets/File/manualWash.pdf";

export default function Frmlogin() {
    const [modal, setModal] = useState(false);
    const Inputdata = {
        t_username: "",
        t_passwd: "",
        t_projectid: "",
        t_projectname: "",
        t_partFile: "",
    };
    const [txtvalue, settxtvalue] = useState(Inputdata);
    const [dataHook, setdataHook] = useState({ Proid: "" });
    const selectdata = [
        { value: "", label: "---เลือก---" },
        { value: "01", label: "ซักฟอก" },
        { value: "02", label: "ศูนย์จ่ายกลาง" },
        { value: "03", label: "ระบบตรวจสุขภาพประจำปี" },
        { value: "04", label: "ระบบจองเปล" },
    ];

    const [listproject, setlistproject] = useState([]);

    useEffect(() => {
        Listproject();
    }, []);

    async function Login() {
        if (txtvalue.t_username == "") {
            alert("กรุณาใส่ Username ด้วยครับ !");
            document.getElementById("t_user").focus();
            return false;
        } else if (txtvalue.t_passwd == "") {
            alert("กรุณาใส่ Password ด้วยครับ !");
            document.getElementById("t_passwd").focus();
            return false;
        } else if (txtvalue.t_projectid == "") {
            alert("กรุณาเลือกประเภทด้วยครับ !");
            return false;
        } else {
            if (txtvalue.t_projectid == "01") {

                const method = "POST";
                const body = new FormData();
                body.append("username", txtvalue.t_username);
                body.append("passwd", txtvalue.t_passwd);

                fetch(API.dataSource.url + "Login", { method, body })
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(`HTTP error! Status: ${res.status}`);
                        }
                        return res.json();
                    })
                    .then(data => {
                        console.log("Login Response:", data);

                        if (!data || data.length === 0) {
                            alert("ข้อมูลล็อกอินเข้าระบบไม่ถูกต้อง");
                        } else {
                            const user = data[0];
                            sessionStorage.setItem('sessStr', user.pstr || user.Pstr);
                            sessionStorage.setItem('sessuserID', user.pid || user.Pid);
                            sessionStorage.setItem('sessName', user.fullname || user.Fullname);
                            sessionStorage.setItem('sessPositon', user.position || user.Position);
                            sessionStorage.setItem('sessOfficeid', user.officeid || user.Officeid);
                            sessionStorage.setItem('sessOfficename', user.officename || user.Officename);
                            sessionStorage.setItem('sessOfficestr', user.lA_Str || user.LA_Str);
                            sessionStorage.setItem('sessImage', user.images || user.Images);
                            sessionStorage.setItem('sessProjectid', txtvalue.t_projectid);
                            sessionStorage.setItem('sessProjectname', txtvalue.t_projectname);
                            window.location.reload();
                        }
                    })
                    
                    .catch(error => {
                        console.error('Error:', error);
                        alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ (ตรวจสอบ URL หรือการรัน Backend)");
                    });

            } else if (txtvalue.t_projectid == "02") {
            } else if (txtvalue.t_projectid == "03") {
                const method = "POST";
                const body = new FormData();
                body.append("tusername", txtvalue.t_username);
                body.append("tpasswd", txtvalue.t_passwd);
                fetch(API.Health.code + "loginAPI.php?module=Checklogin", {
                    method,
                    body,
                })
                    .then((res) => res.json())
                    .then((data) => {
                        //alert(JSON.stringify(data, null, "\t"))

                        if (data == "") {
                            alert("ข้อมูลล็อกอินเข้าระบบไม่ถูกต้อง");
                        } else {
                            sessionStorage.setItem("sessStr", "1");
                            sessionStorage.setItem("sessuserID", data[0].ofcid);
                            sessionStorage.setItem("sessName", data[0].Name);
                            sessionStorage.setItem("sessPositon", data[0].OFCGR.trim());
                            sessionStorage.setItem("sessOfficeid", "");
                            sessionStorage.setItem("sessOfficename", "");
                            sessionStorage.setItem("sessOfficestr", "");
                            sessionStorage.setItem("sessImage", "user.png");
                            sessionStorage.setItem("sessProjectid", txtvalue.t_projectid);
                            sessionStorage.setItem("sessProjectname", txtvalue.t_projectname);
                            window.location.reload();
                        }
                    });
            } else if (txtvalue.t_projectid == "04") {
                const method = "POST";
                const body = new FormData();
                body.append("tusername", txtvalue.t_username);
                body.append("tpasswd", txtvalue.t_passwd);
                fetch(API.Cardles.resultAPI + "LoginAPI.php?module=Checklogin", {
                    method,
                    body,
                })
                    .then((res) => res.json())
                    .then((data) => {
                        //alert(JSON.stringify(data, null, "\t"))

                        if (data == "") {
                            alert("ข้อมูลล็อกอินเข้าระบบไม่ถูกต้อง");
                        } else {
                            sessionStorage.setItem("sessStr", data[0].Pstr);
                            sessionStorage.setItem("sessuserID", data[0].ID);
                            sessionStorage.setItem("sessName", data[0].fullname);
                            sessionStorage.setItem("sessPositon", data[0].member_Positon);
                            sessionStorage.setItem("sessOfficeid", "");
                            sessionStorage.setItem("sessOfficename", "");
                            sessionStorage.setItem("sessUserstr", data[0].member_Str);
                            sessionStorage.setItem("sessImage", data[0].member_Pic);
                            sessionStorage.setItem("sessProjectid", txtvalue.t_projectid);
                            sessionStorage.setItem("sessProjectname", txtvalue.t_projectname);
                            window.location.reload();
                        }
                    });
            }
        }
    }

    // async function Listproject() {
    //     //alert(API.dataSource.code + "loginAPI.php?module=Showlistproject");
    //     //console.log(API.dataSource.code + "loginAPI.php?module=Showlistproject");
    //     //# fetch(API.dataSource.code + "loginAPI.php?module=Showlistproject")
    //     fetch(API.dataSource.url + "Login/liseproject")
    //         .then((response) => {
    //             return response.json();
    //         })
    //         .then((data) => {
    //             setlistproject(data);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

    async function Listproject() {
        try {
            const response = await fetch(`${API.dataSource.url}Login/liseproject`);
            if (!response.ok) throw new Error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
            const data = await response.json();

            // ทำการ map ข้อมูลให้แน่ใจว่าได้โครงสร้าง { value: '...', label: '...' } เสมอ
            const formattedList = data.map(item => ({
                // ดักจับชื่อเผื่อ .NET ส่งมาหลายแบบ
                value: item.value || item.Value || item.projectid || item.ProjectID || item.project_id,
                label: item.label || item.Label || item.projectname || item.ProjectName || item.project_name,
                // เก็บค่าเผื่อใช้งานเพิ่มเติม
                projectfile: item.projectfile || item.Projectfile || "" 
            }));

            setlistproject(formattedList);
        } catch (error) {
            console.error("Error fetching projects:", error);
            alert("ไม่สามารถโหลดรายการโปรแกรมได้ กรุณาตรวจสอบการเชื่อมต่อ API"); 
        }
    }

    async function Onchangelisproject(even) {
        setdataHook({ Proid: even.value });

        const selectedProject = listproject.find(proj => proj.value === even.value);

        if (selectedProject) {
            settxtvalue({
                ...txtvalue,
                t_projectid: even.value,
                t_projectname: even.label,
                t_partFile: selectedProject.projectfile || selectedProject.Projectfile || "", 
            });
        }
        
        even.preventDefault();
    }
    
    async function Onclickregister() {
        if (txtvalue.t_projectid == "") {
            alert("กรุณาทำการเลือกโปรแกรมที่จะเข้าใช้งานก่อนครับ !");
            return false;
        } else {
            setModal(true);
        }
    }

    return (
        <>
            <div className="bg-silver-300 BKlogin" style={{ height: "100vh" }}>
                <div className="content">
                    <div className="brandLonin">SKN HOSPITAL</div>
                    <form
                        id="login-form"
                        action="javascript:;"
                        method="post"
                        className="Divboxshadow"
                    >
                        <h2 className="login-title">Log in</h2>
                        <div className="form-group">
                            <div className="input-group-icon right">
                                <div className="input-icon">
                                    <i className="fa fa-envelope" />
                                </div>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="t_user"
                                    placeholder="Username"
                                    onChange={(even) =>
                                        settxtvalue({ ...txtvalue, t_username: even.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="input-group-icon right">
                                <div className="input-icon">
                                    <i className="fa fa-lock font-16" />
                                </div>
                                <input
                                    className="form-control"
                                    type="password"
                                    id="t_passwd"
                                    placeholder="Password"
                                    onChange={(even) =>
                                        settxtvalue({ ...txtvalue, t_passwd: even.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="input-group-icon right">
                                <div className="input-icon">
                                    <i className="fa fa-lock font-16" />
                                </div>
                                <Select
                                    value={listproject.find(
                                        (obj) => obj.value === txtvalue.t_projectid,
                                    )}
                                    options={listproject}
                                    onChange={(even) => Onchangelisproject(even)}
                                    placeholder="เลือกโปรแกรม"
                                />
                            </div>
                        </div>
                        <div className="form-group d-flex justify-content-between">
                            <label className="ui-checkbox ui-checkbox-info">
                                <i className="fa fa-book" />
                                {txtvalue.t_partFile == "" ? (
                                    <a href="#"> คู่มือใช้งาน </a>
                                ) : (
                                    <a
                                        href={API.partFile.file + "File/" + txtvalue.t_partFile}
                                        target="_blank"
                                    >
                                        {" "}
                                        คู่มือใช้งาน{" "}
                                    </a>
                                )}
                            </label>
                            <a href="#" onClick={() => Onclickregister()}>
                                {" "}
                                ลงทะเบียน{" "}
                            </a>
                        </div>
                        <div className="form-group">
                            <button
                                className="btn btn-info btn-block"
                                style={{ cursor: "pointer" }}
                                type="submit"
                                onClick={() => Login()}
                            >
                                {" "}
                                <i className="fa fa-key" /> Login{" "}
                            </button>
                        </div>
                        <div className="social-auth-hr">
                            <span> โรงพยาบาลสกลนคร </span>
                        </div>

                        <div className="text-center">
                            {" "}
                            Version
                            <a className="color-blue" href="#">
                                {" "}
                                1.0{" "}
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            <Modal
                visible={modal}
                width="60%"
                effect="fadeInUp"
                onClickAway={() => setModal(false)}
            >
                <div className="Modelbody">
                    <div className="Modelheader">
                        <span style={{ float: "right" }} onClick={() => setModal(false)}>
                            {" "}
                            <a className="ibox-collapse">
                                <i className="ti-close" />
                            </a>
                        </span>
                    </div>

                    <div className="cssModelbody">
                        <div
                            className="panel-body"
                            style={{ overflow: "scroll", height: "90vh" }}
                        >
                            <Frmregister Projectid={dataHook} />
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
