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
import API from '../../../Config/config'
import { AlternateEmail } from '@material-ui/icons';
import Select from 'react-select'

export default function Frmuser() {

  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [myData, setmyData] = useState({ columns: [], rows: [] });
  const [dataOffice, setdataOffice] = useState([]);
  const inputData = {
    t_tname: '', t_fname: '', t_lname: '', t_position: '', t_officeid: '', t_tel: '', t_email: '',
    t_username: '', t_passwd: '', t_passwdconF: '', t_file: '', t_id: '', t_filename: ''
  }
  const [txtvalue, settxtvalue] = useState(inputData);
  const [listTname, setlistTname] = useState([]);
  const [listOffice, setlistOffice] = useState([]);

  useEffect(() => {

    Showlisttname();
    Showlistoffice();
    Showdata();
  }, []);

  async function openModal(ID) {

    if (ID != "0") {
      Showdataedit(ID);
    } else {
      settxtvalue(inputData);
    }

    setModal(true);
  }

  async function closeModal() {
    settxtvalue(inputData);
    setModal(false);
  }

  async function openModal2(ID){
    Showproject(ID)
    setModal2(true);
  }

  async function Showlisttname() {

    fetch(API.dataSource.url + "User/Showlisttname")
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

    fetch(API.dataSource.url + "User/Showlistoffice")
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

  async function Showproject(ID) {

    fetch(API.dataSource.url + "User/Showproject/" + ID)
      .then(response => {
        return response.json();
      })
      .then(data => {

        setdataOffice(data);

      })
      .catch(error => {
        console.log(error);
      });

  }

  async function Showdata() {
    fetch(API.dataSource.url + "User")
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(json => {
        let rowsData = json.map((row, key) => ({
          ...row,
          Pid: row.pid || row.Pid,
          fullname: row.fullname || row.Fullname,
          Officename: row.officename || row.Officename,
          Pstr: row.pstr || row.Pstr,
          
          Edit: (
            <>
              <button title="แก้ไขรายการ" onClick={() => openModal(row.pid || row.Pid)}>
                <i className="fa fa-edit" style={{ fontSize: 20, color: 'green' }} />
              </button>
              <button title="จัดการโปรเจกต์" onClick={() => openModal2(row.pid || row.Pid)}>
                <i className="fa fa-h-square" style={{ fontSize: 20, color: 'green' }} />
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
            { label: 'รหัส', field: 'Pid', sort: 'asc', width: 20 },
            { label: 'ชื่อ-สกุล', field: 'fullname', sort: 'asc', width: 500 },
            { label: 'หน่วยงาน', field: 'Officename', sort: 'asc', width: 200 },
            { label: 'สถานะ', field: 'Pstr', sort: 'asc', width: 200 },
            { label: '', field: 'Edit', sort: 'asc', width: 20 }
          ],
          rows: rowsData
        };
        setmyData(Mydata);
      })
      .catch(error => {
        console.error("Fetch Error:", error);
        alert("ไม่สามารถโหลดข้อมูลผู้ใช้งานได้ กรุณาตรวจสอบ API"); 
      });
  }

  async function Showdataedit(ID) {
    fetch(API.dataSource.url + "User/" + ID)
      .then(response => {
        return response.json();
      })
      .then(data => {

       settxtvalue({
          ...txtvalue,
          t_tname: data[0].tid || data[0].Tid, 
          t_fname: data[0].fname || data[0].Fname, 
          t_lname: data[0].lname || data[0].Lname, 
          t_position: data[0].position || data[0].Position,
          t_id: data[0].pid || data[0].Pid, 
          t_officeid: data[0].officeid || data[0].Officeid, 
          t_tel: data[0].tel || data[0].Tel, 
          t_email: data[0].email || data[0].Email,
          t_username: data[0].username || data[0].Username, 
          t_filename: data[0].images || data[0].Images
        })

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
    } else {

      const method = "POST";
      const body = new FormData();
      body.append("tid", txtvalue.t_id);
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
      body.append("tfilename", txtvalue.t_filename);
      fetch(API.dataSource.url + "User", { method, body })
        .then(res => res.json())
        .then(data => {

          //alert(JSON.stringify(data, null, "\t"))

          if (data == "0") {
            alert("ระบบทำการลงทะเบียนเข้าใช้งานเรียบร้อยแล้วครับ");
            window.location.reload();
          } else if (data == "1") {
            alert("Username นี้มีการใช้งานในระบบแล้วครับ !");
            return false;
          } else if (data == "2") {
            alert("ระบบทำการแก้ไขข้อมูลเรียบร้อยแล้วครับ !");
            return false;
          }

        });



    }

  }

  async function Onchecked(row){
    
    document.getElementById("cb_id" + row).checked = true;
    alert(document.getElementById("cb_id" + row).value)
  }

  return (
    <>

      <div className="page-heading">
        <h1 className="page-title"> ผู้ใช้งาน </h1>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="index.html"><i className="la la-home font-20" /></a>
          </li>
          <li className="breadcrumb-item"> Users From </li>
        </ol>
      </div>
      <div className="page-content fade-in-up">
        <div className="ibox">
          <div className="ibox-head">
            <div className="ibox-title"> ข้อมูลผู้ใช้งาน </div>
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
            <div className="content">
              <div className="brand">
                <a className="link" href="#"> </a>
              </div>
              <form id="register-form" action="javascript:;" method="post">
                <h2 className="login-title"> ข้อมูลผู้ใช้งาน </h2>
                <div className="form-group">
                  <Select
                    value={listTname.find(obj => obj.value === txtvalue.t_tname) || null}
                    options={listTname}
                    onChange={e => settxtvalue({ ...txtvalue, t_tname: e.value })}
                  />
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <input className="form-control" type="text" id="t_fname" placeholder="ชื่อ" value={txtvalue.t_fname} onChange={(even) => settxtvalue({ ...txtvalue, t_fname: even.target.value })} />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <input className="form-control" type="text" id="t_lname" placeholder="นามสกุล" value={txtvalue.t_lname} onChange={(even) => settxtvalue({ ...txtvalue, t_lname: even.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <input className="form-control" type="text" id="t_position" placeholder="ตำแหน่ง" value={txtvalue.t_position} onChange={(even) => settxtvalue({ ...txtvalue, t_position: even.target.value })} />
                </div>
                <div className="form-group">
                  <input className="form-control" type="text" id="t_tel" placeholder="เบอร์โทร" value={txtvalue.t_tel} onChange={(even) => settxtvalue({ ...txtvalue, t_tel: even.target.value })} />
                </div>
                <div className="form-group">
                  <input className="form-control" type="email" id="t_email" placeholder="Email" value={txtvalue.t_email} autoComplete="off" onChange={(even) => settxtvalue({ ...txtvalue, t_email: even.target.value })} />
                </div>
                <div className="form-group">
                  <Select
                    value={listOffice.find(obj => obj.value === txtvalue.t_officeid) || null}
                    options={listOffice}
                    onChange={e => settxtvalue({ ...txtvalue, t_officeid: e.value })}
                  />
                </div>
                <div className="form-group">
                  <input className="form-control" type="text" id="t_username" value={txtvalue.t_username} placeholder="User login" onChange={(even) => settxtvalue({ ...txtvalue, t_username: even.target.value })} />
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
          </CModalBody>
        </CModal>
      </sesion>

      <sesion>
        <CModal
          title="แจ้งเตือน"
          color="primary"
          show={modal2}
          onClose={setModal2}
          size='xl'
        >
          <CModalBody>
            <div className="content">
              <div className="brand">
                <h2 className="login-title"> โปรแกรม </h2>
              </div>
              <div className="form-group" style={{overflow: 'scroll', height: 500}}>
                <div className="row">
                  {
                    dataOffice.map((item, row) =>

                      <div className="col-6 m-b-20">
                        <div className="check-list">
                          <label className="ui-checkbox">
                            <input type="checkbox" id={"cb_id" + row} value={item.Projectid} checked={
                              item.Projectid == item.Projectid2 ? (
                                true
                              ) : (
                                false
                              )
                            } onClick={() => Onchecked(row)} />
                            <span className="input-span" /> {item.Projectname}
                          </label>
                        </div>
                      </div>

                    )
                  }


                </div>

              </div>

            </div>
          </CModalBody>
        </CModal>
      </sesion>
    </>
  );
}
