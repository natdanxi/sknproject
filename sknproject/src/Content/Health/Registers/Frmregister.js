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

export default function Frmregister() {

  const [modal, setModal] = useState(false);
  const [myData, setmyData] = useState([]);
  const inputData = {
    t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
    t_id: '', t_hn: '', t_department: '', t_office: '', t_tname: '', t_fname: '', t_lname: '',
    t_birthday: '', t_cid: '', t_sexstr: '', t_inscl: '', t_homename: '', t_address: '', t_moo: '',
    t_alley: '', t_road: '', t_province: '', t_ampher: '', t_tambon: '', t_zipcode: '', t_tel: '',
    t_oocpart: '', t_beallergic: '', t_userid: '', t_work: '', t_sex: ''
  }
  const [txtvalue, settxtvalue] = useState(inputData);
  const [listdepartment, setlistdepartment] = useState([]);
  const [listOffice, setlistOffice] = useState([]);
  const [listtitlename, setlisttitlename] = useState([]);
  const [listinscl, setlistinscl] = useState([]);
  const [listprovince, setlistprovince] = useState([]);
  const [listampher, setlistampher] = useState([]);
  const [listtambon, setlisttambon] = useState([]);
  const [listoocupart, setlistoocupart] = useState([]);

  useEffect(() => {

    Showlistdepartment();
    Showlistoffice('');
    Showlisttitlename();
    Showlistinscl();
    Showlistprovince();
    Showlistampher('');
    Showlisttambon('')
    Showlistoocupart();
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

  async function closeModal() {
    settxtvalue(inputData);
  }

  async function Showlistdepartment() {
    fetch(API.dataSource.code + "RegisterAPI.php?module=Showlistdepartment")
      .then(response => {
        return response.json();
      })
      .then(data => {

        setlistdepartment(data);

      })
      .catch(error => {
        console.log(error);
      });
  }

  async function Onselectdepartment(e) {
    settxtvalue({ ...txtvalue, t_department: e.value })
    Showlistoffice(e.value);
  }

  async function Showlistoffice(depid) {
    fetch(API.dataSource.code + "RegisterAPI.php?module=Showlistoffice&depID=" + depid)
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

  async function Showlisttitlename() {
    fetch(API.dataSource.code + "RegisterAPI.php?module=Showlisttitlename")
      .then(response => {
        return response.json();
      })
      .then(data => {

        setlisttitlename(data);

      })
      .catch(error => {
        console.log(error);
      });
  }

  async function Showlistinscl() {
    fetch(API.dataSource.code + "RegisterAPI.php?module=Showlistinscl")
      .then(response => {
        return response.json();
      })
      .then(data => {

        setlistinscl(data);

      })
      .catch(error => {
        console.log(error);
      });
  }

  async function Showlistprovince() {
    fetch(API.dataSource.code + "RegisterAPI.php?module=Showlistprovince")
      .then(response => {
        return response.json();
      })
      .then(data => {

        setlistprovince(data);

      })
      .catch(error => {
        console.log(error);
      });
  }

  async function Onchangeprovince(e) {
    settxtvalue({ ...txtvalue, t_province: e.value });
    Showlistampher(e.value);
  }

  async function Showlistampher(provinceid) {

    fetch(API.dataSource.code + "RegisterAPI.php?module=Showlistampher&provinceID=" + provinceid)
      .then(response => {
        return response.json();
      })
      .then(data => {

        setlistampher(data);

      })
      .catch(error => {
        console.log(error);
      });
  }

  async function Onchangeampher(e) {
    settxtvalue({ ...txtvalue, t_tambon: e.value });
    Showlisttambon(e.value);
  }

  async function Showlisttambon(tambonid) {

    fetch(API.dataSource.code + "RegisterAPI.php?module=Showlisttambon&provinceID=" + txtvalue.t_province + "&tambonID=" + tambonid)
      .then(response => {
        return response.json();
      })
      .then(data => {

        setlisttambon(data);

      })
      .catch(error => {
        console.log(error);
      });
  }

  async function Showlistoocupart() {
    fetch(API.dataSource.code + "RegisterAPI.php?module=Showlistoocupart")
      .then(response => {
        return response.json();
      })
      .then(data => {

        setlistoocupart(data);

      })
      .catch(error => {
        console.log(error);
      });
  }

  async function Checkuser(even) {

    if (even.keyCode == '13') {

      fetch(API.dataSource.code + "RegisterAPI.php?module=Checkuser&userID=" + even.target.value)
        .then(response => {
          return response.json();
        })
        .then(data => {

          document.getElementById("t_name").innerHTML = data[0].Name;

        })
        .catch(error => {
          console.log(error);
        });

    }

  }

  async function Showdata() {

    fetch(API.dataSource.code + "RegisterAPI.php?module=Showdata&depID=" + txtvalue.t_depid)
      .then(res => res.json())
      .then(json => {
        //alert(json);
        let Mydata = json;
        let { rows } = json;
        rows = Mydata.map((row, key) => ({
          ...row,
          Edit: (
            <div style={{ textAlign: 'center' }}>
              <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(row.regis_id)}><i className="fa fa-pencil font-14" title='จัดการข้อมูลผ้า' /></button>
              <button className="btn btn-default btn-xs" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Delete" onClick={() => Deletedata(row.regis_id)}><i className="fa fa-trash" /></button>
            </div>
          ),
          Num: (
            key + 1
          ),
          Sex: (
            row.regis_sex == '1' ? (
              <span>ชาย</span>
            ) : (
              <span>หญิง</span>
            )
          )

        }));

        Mydata = {
          columns: [
            {
              label: 'ลำดับ',
              field: 'Num',
              sort: 'asc',
              width: 20
            },
            {
              label: 'HN',
              field: 'regis_hn',
              sort: 'asc',
              width: 200
            },
            {
              label: 'ชื่อ-สกุล',
              field: 'Name',
              sort: 'asc',
              width: 200
            },
            {
              label: 'เพศ',
              field: 'Sex',
              sort: 'asc',
              width: 100
            },
            {
              label: 'วดป',
              field: 'regis_birthday',
              sort: 'asc',
              width: 200
            },
            {
              label: 'Tel',
              field: 'regis_tel',
              sort: 'asc',
              width: 200
            },
            {
              label: 'ชื่อหน่วยงาน',
              field: 'dep_name',
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

  async function Showdataedit(ID) {
    
    fetch(API.dataSource.code + "RegisterAPI.php?module=Showdataedit&id=" + ID)
      .then(response => {
        return response.json();
      })
      .then(data => {

        settxtvalue({
          ...txtvalue,
          t_id: ID, t_hn: data[0].regis_hn, t_department: data[0].regis_depid, t_office: data[0].regis_officeid,
          t_tname: data[0].regis_tname, t_fname: data[0].regis_fname, t_lname: data[0].regis_lname, t_cid: data[0].regis_cid,
          t_birthday: data[0].regis_birthday.substring(0, 10), t_sex: data[0].regis_sex, t_sexstr: data[0].regis_status, t_inscl: data[0].regis_inscl,
          t_homename: data[0].regis_homename, t_address: data[0].regis_address, t_moo: data[0].regis_moo,
          t_alley: data[0].regis_alley, t_road: data[0].regis_road, t_province: data[0].regis_province,
          t_ampher: data[0].regis_ampher, t_tambon: data[0].regis_tambon, t_zipcode: data[0].regis_zipcode,
          t_tel: data[0].regis_tel, t_oocpart: data[0].regis_oocpart, t_work: data[0].regis_work,
          t_beallergic: data[0].regis_beallergic
        })

        if (data[0].regis_sex == "1") {
          document.getElementById("t_sex1").checked = true;
          document.getElementById("t_sex2").checked = false;
        } else if (data[0].regis_sex == "2") {
          document.getElementById("t_sex2").checked = true;
          document.getElementById("t_sex1").checked = false;
        } else {
          document.getElementById("t_sex1").checked = false;
          document.getElementById("t_sex2").checked = false;
        }

        if (data[0].regis_status == "1") {
          document.getElementById("t_sexstr1").checked = true;
          document.getElementById("t_sexstr2").checked = false;
          document.getElementById("t_sexstr3").checked = false;
          document.getElementById("t_sexstr4").checked = false;
        } else if (data[0].regis_status == "2") {
          document.getElementById("t_sexstr2").checked = true;
          document.getElementById("t_sexstr1").checked = false;
          document.getElementById("t_sexstr3").checked = false;
          document.getElementById("t_sexstr4").checked = false;
        } else if (data[0].regis_status == "3") {
          document.getElementById("t_sexstr3").checked = true;
          document.getElementById("t_sexstr2").checked = false;
          document.getElementById("t_sexstr1").checked = false;
          document.getElementById("t_sexstr4").checked = false;
        } else if (data[0].regis_status == "4") {
          document.getElementById("t_sexstr4").checked = true;
          document.getElementById("t_sexstr2").checked = false;
          document.getElementById("t_sexstr3").checked = false;
          document.getElementById("t_sexstr1").checked = false;
        } else {
          document.getElementById("t_sexstr1").checked = false;
          document.getElementById("t_sexstr2").checked = false;
          document.getElementById("t_sexstr3").checked = false;
          document.getElementById("t_sexstr4").checked = false;
        }

      })
      .catch(error => {
        console.log(error);
      });

  }

  async function Savedata() {

    if (txtvalue.t_hn == "") {
      alert("กรุณาใส่ HN ผู้มารับบริการด้วยครับ !")
      document.getElementById("t_hn").focus();
      return false;
    } else if (txtvalue.t_department == "") {
      alert("กรุณาเลือกหน่วยงานด้วยครับ !");
      return false;
    } else if (txtvalue.t_office == "") {
      alert("กรุณาเลือกกลุ่มงานด้วยครับ !");
      return false;
    } else if (txtvalue.t_tname == "") {
      alert("กรุณาเลือกคำนำหน้าชื่อด้วยครับ !");
      return false;
    } else if (txtvalue.t_fname == "") {
      alert("กรุณาใส่ชื่อผู้มารับบริการด้วยครับ !");
      document.getElementById("t_fname").focus();
      return false;
    } else if (txtvalue.t_lname == "") {
      alert("กรุณาใส่ชื่อสกุลผู้มารรับบริการด้วยครับ !");
      document.getElementById("t_lname").focus();
      return false;
    } else if (txtvalue.t_sex == "") {
      alert("กรุณาเลือกเพศด้วยครับ !");
      return false;
    } else if (txtvalue.t_inscl == "") {
      alert("กรุณาเลือกสิทธิ์ที่มารับบริการด้วยครับ !");
      return false;
    } else if (txtvalue.t_userid == "") {
      alert("กรุณาใส่รหัสเจ้าหน้าที่บันทึกข้อมูลด้วยครับ !");
      document.getElementById("t_userid").focus();
      return false;
    } else {

      const method = "POST";
      const body = new FormData();
      body.append("tid", txtvalue.t_id);
      body.append("thn", txtvalue.t_hn);
      body.append("tdepartment", txtvalue.t_department);
      body.append("toffice", txtvalue.t_office);
      body.append("ttname", txtvalue.t_tname);
      body.append("tfname", txtvalue.t_fname);
      body.append("tlname", txtvalue.t_lname);
      body.append("tcid", txtvalue.t_cid);
      body.append("tbirthday", txtvalue.t_birthday);
      body.append("tsexstr", txtvalue.t_sexstr);
      body.append("tsex", txtvalue.t_sex);
      body.append("tinscl", txtvalue.t_inscl);
      body.append("thomename", txtvalue.t_homename);
      body.append("taddress", txtvalue.t_address);
      body.append("tmoo", txtvalue.t_moo);
      body.append("talley", txtvalue.t_alley);
      body.append("troad", txtvalue.t_road);
      body.append("tprovince", txtvalue.t_province);
      body.append("tampher", txtvalue.t_ampher);
      body.append("ttambon", txtvalue.t_tambon);
      body.append("tzipcode", txtvalue.t_zipcode);
      body.append("ttel", txtvalue.t_tel);
      body.append("toocpart", txtvalue.t_oocpart);
      body.append("twork", txtvalue.t_work);
      body.append("tbeallergic", txtvalue.t_beallergic);
      body.append("tuserid", txtvalue.t_userid);
      fetch(API.dataSource.code + "RegisterAPI.php?module=Inputdata", { method, body })
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

      fetch(API.dataSource.code + "RegisterAPI.php?module=Deletedata&id=" + ID)
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

  async function Showpatient(even) {

    if (even.keyCode == '13') {

      fetch(API.dataSource.code + "RegisterAPI.php?module=Showpatient&hn=" + even.target.value)
        .then(response => {
          return response.json();
        })
        .then(data => {

          settxtvalue({
            ...txtvalue, t_tname: data[0].pname, t_fname: data[0].fname, t_lname: data[0].lname,
            t_cid: data[0].cid, t_birthday: data[0].birthdate.substring(0, 10), t_sexstr: data[0].Status,
            t_address: data[0].addrpart, t_moo: data[0].moopart, t_province: data[0].chwpart,
            t_ampher: data[0].amppart, t_tambon: data[0].tmbpart, t_zipcode: data[0].zipcode,
            t_tel: data[0].hometel, t_oocpart: data[0].occpation, t_sex: data[0].sex
          })

          if (data[0].sex == "1") {
            document.getElementById("t_sex1").checked = true;
            document.getElementById("t_sex2").checked = false;
          } else if (data[0].sex == "2") {
            document.getElementById("t_sex2").checked = true;
            document.getElementById("t_sex1").checked = false;
          } else {
            document.getElementById("t_sex1").checked = false;
            document.getElementById("t_sex2").checked = false;
          }

          if (data[0].Status == "1") {
            document.getElementById("t_sexstr1").checked = true;
            document.getElementById("t_sexstr2").checked = false;
            document.getElementById("t_sexstr3").checked = false;
            document.getElementById("t_sexstr4").checked = false;
          } else if (data[0].Status == "2") {
            document.getElementById("t_sexstr2").checked = true;
            document.getElementById("t_sexstr1").checked = false;
            document.getElementById("t_sexstr3").checked = false;
            document.getElementById("t_sexstr4").checked = false;
          } else if (data[0].Status == "3") {
            document.getElementById("t_sexstr3").checked = true;
            document.getElementById("t_sexstr2").checked = false;
            document.getElementById("t_sexstr1").checked = false;
            document.getElementById("t_sexstr4").checked = false;
          } else if (data[0].Status == "4") {
            document.getElementById("t_sexstr4").checked = true;
            document.getElementById("t_sexstr2").checked = false;
            document.getElementById("t_sexstr3").checked = false;
            document.getElementById("t_sexstr1").checked = false;
          } else {
            document.getElementById("t_sexstr1").checked = false;
            document.getElementById("t_sexstr2").checked = false;
            document.getElementById("t_sexstr3").checked = false;
            document.getElementById("t_sexstr4").checked = false;
          }

        })
        .catch(error => {
          console.log(error);
        });

    }

  }

  return (
    <div>

      <div className="page-heading">
        <h1 className="page-title"> รายการข้อมูลทะเบียนผู้รับบริการ </h1>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="index.html"><i className="la la-home font-20" /></a>
          </li>
          <li className="breadcrumb-item"> Register From </li>
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
        <Modal visible={modal} width="80%" effect="fadeInUp" onClick={() => closeModal()}>
          <div className="Modelbody">
            <div className="Modelheader">

            </div>

            <div className="cssModelbody" style={{ overflow: 'scroll', height: '80vh' }}>

              <div className="panel-body">
                <div className='row'>
                  <div className="col-md-12">
                    <div className="ibox">
                      <div className="ibox-head">
                        <div className="ibox-title"> <span> <i className="fa ti-server" style={{ fontSize: 20 }} /> ข้อมูลลงทะเบียน </span> </div>
                        <div className="ibox-tools">
                          <a onClick={() => setModal(false)}><i className="fa ti-close" /></a>
                        </div>
                      </div>
                      <div className='row'>

                        <div className="col-md-6">
                          <div className="ibox">

                            <div className="ibox-body">
                              <form>
                                <div className="form-group">
                                  <label> HN </label>
                                  <input className="form-control" type="text" id="t_hn" placeholder="HN Enter" value={txtvalue.t_hn} onChange={(even) => settxtvalue({ ...txtvalue, t_hn: even.target.value })} onKeyDown={(even) => Showpatient(even)} />
                                </div>
                                <div className="form-group">
                                  <label> หน่วยงาน </label>
                                  <Select
                                    value={listdepartment.find(obj => obj.value === txtvalue.t_department)}
                                    options={listdepartment}
                                    onChange={e => Onselectdepartment(e)}
                                  />
                                </div>
                                <div className="form-group">
                                  <label> กลุ่มงาน/ฝ่าย </label>
                                  <Select
                                    value={listOffice.find(obj => obj.value === txtvalue.t_office)}
                                    options={listOffice}
                                    onChange={e => settxtvalue({ ...txtvalue, t_office: e.value })}
                                  />
                                </div>
                                <div className='row'>
                                  <div className="col-md-3">
                                    <div className="form-group">
                                      <label> คำนำหน้าชื่อ </label>
                                      <Select
                                        value={listtitlename.find(obj => obj.value === txtvalue.t_tname)}
                                        options={listtitlename}
                                        onChange={e => settxtvalue({ ...txtvalue, t_tname: e.value })}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label> ชื่อ </label>
                                      <input className="form-control" type="text" id="t_fname" placeholder="ชื่อ" value={txtvalue.t_fname} onChange={(even) => settxtvalue({ ...txtvalue, t_fname: even.target.value })} />
                                    </div>
                                  </div>
                                  <div className="col-md-5">
                                    <div className="form-group">
                                      <label> นามสกุล </label>
                                      <input className="form-control" type="text" id="t_lname" placeholder="นามสกุล" value={txtvalue.t_lname} onChange={(even) => settxtvalue({ ...txtvalue, t_lname: even.target.value })} />
                                    </div>
                                  </div>
                                </div>
                                <div className='row'>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label> เลขที่บัตรประจำตัวประชาชน </label>
                                      <input className="form-control" type="text" placeholder="เลขที่บัตรประจำตัวประชาชน" value={txtvalue.t_cid} onChange={(even) => settxtvalue({ ...txtvalue, t_cid: even.target.value })} />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label> วดป </label>
                                      <input className="form-control" type="date" placeholder="ชื่อ" value={txtvalue.t_birthday} onChange={(even) => settxtvalue({ ...txtvalue, t_birthday: even.target.value })} />
                                    </div>
                                  </div>
                                </div>
                                <div className='row'>
                                  <div className="col-md-12">
                                    <div className="form-group">
                                      <label> เพศ </label>
                                    </div>
                                  </div>
                                  <div className="col-md-2">
                                    <div className="form-group">
                                      <div className="form-group text-left">
                                        <label className="ui-checkbox ui-checkbox-info">
                                          <input type="checkbox" name="t_sex" id="t_sex1" onClick={() => settxtvalue({ ...txtvalue, t_sex: '1' })} />
                                          <span className="input-span" />ชาย</label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="form-group">
                                      <div className="form-group text-left">
                                        <label className="ui-checkbox ui-checkbox-info">
                                          <input type="checkbox" name="t_sex" id="t_sex2" onClick={() => settxtvalue({ ...txtvalue, t_sex: '2' })} />
                                          <span className="input-span" />หญิง</label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className='row'>
                                  <div className="col-md-12">
                                    <div className="form-group">
                                      <label> สถานะภาพ </label>
                                    </div>
                                  </div>
                                  <div className="col-md-2">
                                    <div className="form-group">
                                      <div className="form-group text-left">
                                        <label className="ui-checkbox ui-checkbox-info">
                                          <input type="checkbox" name="agree" id="t_sexstr1" onClick={() => settxtvalue({ ...txtvalue, t_sexstr: '1' })} />
                                          <span className="input-span" />โสด</label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="form-group">
                                      <div className="form-group text-left">
                                        <label className="ui-checkbox ui-checkbox-info">
                                          <input type="checkbox" name="agree" id="t_sexstr2" onClick={() => settxtvalue({ ...txtvalue, t_sexstr: '2' })} />
                                          <span className="input-span" />คู่/สมรส</label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-2">
                                    <div className="form-group">
                                      <div className="form-group text-left">
                                        <label className="ui-checkbox ui-checkbox-info">
                                          <input type="checkbox" name="agree" id="t_sexstr3" onClick={() => settxtvalue({ ...txtvalue, t_sexstr: '3' })} />
                                          <span className="input-span" />หม้าย</label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-2">
                                    <div className="form-group">
                                      <div className="form-group text-left">
                                        <label className="ui-checkbox ui-checkbox-info">
                                          <input type="checkbox" name="agree" id="t_sexstr4" onClick={() => settxtvalue({ ...txtvalue, t_sexstr: '4' })} />
                                          <span className="input-span" />หย่า</label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className='row'>
                                  <div className="col-md-12">
                                    <div className="form-group">
                                      <label> สิทธิค่ารักษาพยาบาล </label>
                                      <Select
                                        value={listinscl.find(obj => obj.value === txtvalue.t_inscl)}
                                        options={listinscl}
                                        onChange={e => settxtvalue({ ...txtvalue, t_inscl: e.value })}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="ibox">

                            <div className="ibox-body">
                              <form>
                                <div className='row'>
                                  <div className="col-md-5">
                                    <div className="form-group">
                                      <label> ชื่อหมู่บ้าน </label>
                                      <input className="form-control" type="text" placeholder="ชื่อหมู่บ้าน" value={txtvalue.t_homename} onChange={(even) => settxtvalue({ ...txtvalue, t_homename: even.target.value })} />
                                    </div>
                                  </div>
                                  <div className="col-md-5">
                                    <div className="form-group">
                                      <label> บ้านเลขที่ </label>
                                      <input className="form-control" type="text" placeholder="บ้านเลขที่" value={txtvalue.t_address} onChange={(even) => settxtvalue({ ...txtvalue, t_address: even.target.value })} />
                                    </div>
                                  </div>
                                  <div className="col-md-2">
                                    <div className="form-group">
                                      <label> หมู่ </label>
                                      <input className="form-control" type="text" placeholder="หมู่" value={txtvalue.t_moo} onChange={(even) => settxtvalue({ ...txtvalue, t_moo: even.target.value })} />
                                    </div>
                                  </div>
                                </div>
                                <div className='row'>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label> ซอย </label>
                                      <input className="form-control" type="text" placeholder="ซอย" value={txtvalue.t_alley} onChange={(even) => settxtvalue({ ...txtvalue, t_alley: even.target.value })} />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label> ถนน </label>
                                      <input className="form-control" type="text" placeholder="ถนน" value={txtvalue.t_road} onChange={(even) => settxtvalue({ ...txtvalue, t_road: even.target.value })} />
                                    </div>
                                  </div>
                                </div>

                                <div className='row'>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label> จังหวัด </label>
                                      <Select
                                        value={listprovince.find(obj => obj.value === txtvalue.t_province)}
                                        options={listprovince}
                                        onChange={e => Onchangeprovince(e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label> อำเภอ </label>
                                      <Select
                                        value={listampher.find(obj => obj.value === txtvalue.t_ampher)}
                                        options={listampher}
                                        onChange={e => Onchangeampher(e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label> ตำบล </label>
                                      <Select
                                        value={listtambon.find(obj => obj.value === txtvalue.t_tambon)}
                                        options={listtambon}
                                        onChange={e => settxtvalue({ ...txtvalue, t_tambon: e.value })}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className='row'>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label> รหัสไปรษณีย์ </label>
                                      <input className="form-control" type="text" placeholder="รหัสไปรษณีย์" value={txtvalue.t_zipcode} onChange={(even) => settxtvalue({ ...txtvalue, t_zipcode: even.target.value })} />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label> เบอร์โทร </label>
                                      <input className="form-control" type="text" placeholder="เบอร์โทร" value={txtvalue.t_tel} onChange={(even) => settxtvalue({ ...txtvalue, t_tel: even.target.value })} />
                                    </div>
                                  </div>
                                </div>

                                <div className='row'>
                                  <div className="col-md-3">
                                    <div className="form-group">
                                      <label> อาชีพ </label>
                                      <Select
                                        value={listoocupart.find(obj => obj.value === txtvalue.t_oocpart)}
                                        options={listoocupart}
                                        onChange={e => settxtvalue({ ...txtvalue, t_oocpart: e.value })}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="form-group">
                                      <label> อายุงาน </label>
                                      <input className="form-control" type="text" placeholder="อายุงาน" value={txtvalue.t_work} onChange={(even) => settxtvalue({ ...txtvalue, t_work: even.target.value })} />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label> ประวัติแพ้ยา </label>
                                      <textarea className="form-control" type="text" placeholder="ประวัติแพ้ยา" value={txtvalue.t_beallergic} onChange={(even) => settxtvalue({ ...txtvalue, t_beallergic: even.target.value })} />
                                    </div>
                                  </div>
                                </div>
                                <div className='row'>
                                  <div className="col-md-3">
                                    <div className="form-group">
                                      <label> รหัสเจ้าหน้าที่ </label>
                                      <input className="form-control" type="text" id="t_userid" placeholder="รหัสเจ้าหน้าที่" value={txtvalue.t_userid} onChange={(even) => settxtvalue({ ...txtvalue, t_userid: even.target.value })} onKeyDown={(even) => Checkuser(even)} />
                                    </div>
                                  </div>
                                  <div className="col-md-9">
                                    <div className="form-group">
                                      <label>ชื่อเจ้าหน้าที่</label>
                                      <span className="form-control" id='t_name'>-</span>
                                    </div>
                                  </div>
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

            <div style={{ textAlign: 'center' }}>
              <div className="form-group">
                <button className="btn btn-default" type="button" style={{ cursor: 'pointer' }} onClick={() => Savedata()}> <i className="fa fa-floppy-o" style={{ fontSize: 18 }} /> บันทึกข้อมูล </button>
              </div>
            </div>

          </div>
        </Modal>

      </sesion>

    </div>
  );
}
