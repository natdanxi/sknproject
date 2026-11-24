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
import API from '../Config/config'
import Select from 'react-select'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { EventNote } from '@material-ui/icons';

export default function Frmhealth() {

    const [modal, setModal] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [myData, setmyData] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_id: '', t_sublabid: '', t_sublabneme: '', t_subprice: '', t_subsex: '', t_cid: '', t_hn: '', t_name: '',
        t_tname: '', t_fname: '', t_lname: '', t_birthday: '', t_moo: '', t_alley: '', t_road: '', t_province: '',
        t_ampher: '', t_tambon: '', t_zipcode: '', t_oocpart: '', t_vsid: '',
        t_sex: '', t_age: '', t_address: '', t_departmentid: '', t_department: '', t_offID: '', t_office: '', t_insclid: '', t_insclname: '', t_abroadID: '',
        t_type: '', t_hosid: '', t_hosname: '', t_numberNo: '', t_Dx: '', t_BMI: '', t_vsdate: '', t_vstime: '',
        t_vsstr: '', t_pattype: '', t_tel: '', t_visitnew: '', t_cc: '', t_pi: '', t_strHP: '0', t_strFH: '0',
        t_strSX: '0', t_strHPOther: '', t_strFHOther: '', t_strSXOther: '', t_drugAllergy: '', t_G: '',
        t_P: '', t_A: '', t_L: '', t_last: '', t_lmp: '', t_lmpdate: '', t_lmptime: '', t_notdate: '',
        t_edcdate: '', t_FPplantyp: '', t_TVC: '', t_TEV: '', t_smoke: '', t_smoktype: '', t_dring: '', t_dringtype: '',
        t_foot: '0', t_Opthalmoscope: '', t_CCRetina: '', t_lpmtype: '', t_diabetes: '', t_pressure: '',
        t_ChkPN: '0', t_ChkBF: '0', t_c: '', t_high: '', t_weight: '', t_waistline: '', t_hip: '', t_head: '',
        t_o2: '', t_pulse: '', t_breathing: '', t_bloodpressure1: '', t_sbp1: '', t_dbp1: '', t_time1: '',
        t_bloodpressure2: '', t_sbp2: '', t_dbp2: '', t_time2: '', t_pe: '', t_ga: '', t_heent: '0', t_ngf: '',
        t_ext: '0', t_extother: '', t_heart: '0', t_heartother: '', t_neuro: '0', t_neuroother: '',
        t_lung: '0', t_lungother: '', t_skin: '0', t_skinother: '', t_abdomen: '0', t_abdomenother: '',
        t_other: '0', t_othertext: '', t_userid: '', t_username: '', t_doctorid: '', t_doctorname: '', t_status: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [packagemain, setpackagemain] = useState([]);
    const [packagesub, setpackagesub] = useState([]);
    const [labdata, setlabdata] = useState([]);
    const [packageID, setpackageID] = useState('');
    const selectType = [
        { value: '', label: '---เลือก---' },
        { value: '1', label: 'มาตามนัด' },
        { value: '2', label: 'มาเอง' },
        { value: '3', label: 'รับConsult' },
        { value: '4', label: 'รับRefer' },
        { value: '5', label: 'ผู้ป่วยใน' },
        { value: '6', label: 'Lab รพช' },
        { value: '7', label: 'ส่งจาก รพ.' },
    ];
    const selectLmp = [
        { value: '', label: '---เลือก---' },
        { value: '1', label: '1=ไม่ทราบ' },
        { value: '2', label: '2=LMPวันที่' },
        { value: '3', label: '3=LMPระบุช่วง' },
        { value: '4', label: '4=หมดประจำเดือน' },
        { value: '5', label: '5=ยังไม่มีประจำเดือน' },
    ];
    const selectSmoke = [
        { value: '', label: '---เลือก---' },
        { value: '1', label: '1=นานๆครั้ง' },
        { value: '2', label: '2=เป็นครั้งคราว' },
        { value: '3', label: '3=เป็นประจำ' },
    ];
    const selectDring = [
        { value: '', label: '---เลือก---' },
        { value: '1', label: '1=นานๆครั้ง' },
        { value: '2', label: '2=เป็นครั้งคราว' },
        { value: '3', label: '3=เป็นประจำ' },
    ];
    const [selectContraceptive, setselectContraceptive] = useState([]);
    const [selectDepartment, setselectDepartment] = useState([]);
    const [selectOffice, setselectOffice] = useState([]);
    const [selectInscl, setselectInscl] = useState([]);
    const [selectDoctor, setselectDoctor] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [listorderlab1, setlistorderlab1] = useState([]);
    const [listorderlab2, setlistorderlab2] = useState([]);
    const [listorderlab3, setlistorderlab3] = useState([]);
    const [strsmoke, setstrsmoke] = useState(true);
    const [strdring, setstrdring] = useState(true);
    const [strPE, setstrPE] = useState(true);
    const [strHeent, setstrHeent] = useState(true);
    const [strext, setstrext] = useState(true);
    const [strHeart, setstrHeart] = useState(true);
    const [strNeuro, setstrNeuro] = useState(true);
    const [strLung, setstrLung] = useState(true);
    const [strSkin, setstrSkin] = useState(true);
    const [strAbdomen, setstrAbdomen] = useState(true);
    const [strOther, setstrOther] = useState(true);


    useEffect(() => {

        settxtvalue(inputData);
        Showdata();
        Showpackagemain();
        Showlab();
        listContraceptive();
        listDepartment();
        listOffice('');
        listInscl();
        listDoctor();

    }, []);

    async function openModal(ID, genID, str) {

        //settxtvalue(inputData);

        if (str == '0') {

            setpackagesub([]);
            Showpatient(ID);
            setModal(true);

        } else {

            if (genID == '') {
                alert("กรุณาทำการลงข้อมูลตรวจสุขภาพให้เรียบร้อยก่อนครับ !");
            } else {
                setpackagesub([]);
                Showpatient(ID);
                Showdataedit(genID);
                setModal(true);
            }

        }

    }

    async function closeModal() {
        //settxtvalue(inputData);
        setpackageID('');
        setModal(false);
    }

    async function closeModal2() {
        setModal2(false);
    }

    async function Openpuplab() {

        if (packageID == "") {
            alert("กรุณาเลือกแพคเกจการตรวจสุขภาพด้วยครับ !")
            return false;
        } else {
            setModal2(true);
        }

    }

    async function Showhospital(even) {

        if (even.keyCode == '13') {

            fetch(API.dataSource.code + "Healthcheck.php?module=Showhospital&hosid=" + even.target.value)
                .then(response => {
                    return response.json();
                })
                .then(data => {

                    if (data == "") {
                        alert("ไม่พบข้อมูลนี้ครับ !");
                        settxtvalue({ ...txtvalue, t_hosid: '', t_hosname: 'ไม่พบข้อมูล' })
                    } else {

                        settxtvalue({ ...txtvalue, t_hosid: data[0].value, t_hosname: data[0].label })

                    }

                })
                .catch(error => {
                    console.log(error);
                });

        }

    }

    async function Showdata() {

        fetch(API.dataSource.code + "Healthcheck.php?module=Showdata&roomID=" + txtvalue.t_officeid)
            .then(res => res.json())
            .then(json => {
                //alert(json);
                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    Edit: (
                        <div style={{ textAlign: 'center' }}>
                            <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(row.Vsid, '', '0')}><i className="fa fa-stethoscope font-14" title='เลือกตรวจสุขภาพ' /></button>
                        </div>
                    ),
                    Num: (
                        key + 1
                    ),
                    VSfu: (
                        row.VSfu == '1' ? (
                            <span>นัด</span>
                        ) : (
                            <span>ตรวจต่อ</span>
                        )
                    )

                }));

                Mydata = {
                    columns: [
                        {
                            label: 'HN',
                            field: 'Vspid',
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
                            label: 'คิวVisit',
                            field: 'QNumber',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'VisitDate',
                            field: 'VSDate',
                            sort: 'asc',
                            width: 100
                        },
                        {
                            label: 'VisitTime',
                            field: 'VsTime',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'สถานะ',
                            field: 'regis_tel',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'ประเภท',
                            field: 'VSfu',
                            sort: 'asc',
                            width: 500
                        },
                        {
                            label: 'สิทธิ์รักษา',
                            field: 'subinsname ',
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

    function Showpatient(Vsid) {
        //alert(API.dataSource.code + "Healthcheck.php?module=Showpatient&vsid=" + Vsid + "&roomID=" + txtvalue.t_officeid)
        fetch(API.dataSource.code + "Healthcheck.php?module=Showpatient&vsid=" + Vsid + "&roomID=" + txtvalue.t_officeid)
            .then(response => {
                return response.json();
            })
            .then(data => {

                if (data != "") {
                    settxtvalue({
                        ...txtvalue,
                        t_cid: data[0].cid, t_hn: data[0].Vshn, t_name: data[0].Titletyp + data[0].fname + ' ' + data[0].lname, t_age: data[0].Age, t_sex: data[0].sex,
                        t_address: data[0].addrpart + " ม." + data[0].moopart + " ตำบล " + data[0].tmname + " อำเภอ " + data[0].amname +
                            " จังหวัด " + data[0].proname, t_insclname: data[0].subinsname,
                        t_vsdate: data[0].VSDate.substring(0, 10), t_vstime: data[0].VsTime.substring(0, 5),
                        t_insclid: data[0].subinstyp, t_tname: data[0].pname, t_fname: data[0].fname, t_lname: data[0].lname, t_birthday: data[0].birthdate,
                        t_oocpart: data[0].occpation, t_road: data[0].road, t_tambon: data[0].tmbpart, t_ampher: data[0].amppart,
                        t_province: data[0].chwpart, t_zipcode: data[0].zipcode, t_tel: data[0].hometel, t_vsid: data[0].Vsid,
                        t_status: data[0].Status, t_addpart: data[0].addrpart, t_type: data[0].VsPIncome,
                    })
                }

                if (data[0].OOCRegister != "") {

                    settxtvalue({
                        ...txtvalue,
                        t_cid: data[0].cid, t_hn: data[0].Vshn, t_name: data[0].Titletyp + data[0].fname + ' ' + data[0].lname, t_age: data[0].Age, t_sex: data[0].sex,
                        t_address: data[0].addrpart + " ม." + data[0].moopart + " ตำบล " + data[0].tmname + " อำเภอ " + data[0].amname +
                            " จังหวัด " + data[0].proname, t_insclname: data[0].subinsname,
                        t_vsdate: data[0].VSDate.substring(0, 10), t_vstime: data[0].VsTime.substring(0, 5),
                        t_insclid: data[0].subinstyp, t_tname: data[0].pname, t_fname: data[0].fname, t_lname: data[0].lname, t_birthday: data[0].birthdate,
                        t_oocpart: data[0].occpation, t_road: data[0].road, t_tambon: data[0].tmbpart, t_ampher: data[0].amppart,
                        t_province: data[0].chwpart, t_zipcode: data[0].zipcode, t_tel: data[0].hometel, t_vsid: data[0].Vsid,
                        t_status: data[0].Status, t_addpart: data[0].addrpart, t_type: data[0].VsPIncome,
                        t_departmentid: data[0].OOCRegister[0].dep_id, t_department: data[0].OOCRegister[0].dep_name,
                        t_offID: data[0].OOCRegister[0].office_id, t_office: data[0].OOCRegister[0].office_name,
                    })
                }


            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Showpackagemain() {

        fetch(API.dataSource.code + "Healthcheck.php?module=Showpackagemain")
            .then(res => res.json())
            .then(json => {
                //alert(json);
                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    Edit: (
                        <div style={{ textAlign: 'center' }}>
                            <button className="btn Chkbtnckick btn-xs m-r-5"
                                style={{ cursor: 'pointer' }}
                                data-toggle="tooltip"
                                data-original-title="Edit"
                                onClick={() => Showpackagesub(row.pk_id)}><i className="fa fa-stethoscope font-14" title='เลือกตรวจสุขภาพ' /></button>
                        </div>
                    ),
                    Rows: (
                        <span>{key + 1}</span>
                    )

                }));

                Mydata = {
                    columns: [
                        {
                            label: 'ลำดับ',
                            field: 'Rows',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'รายการแพคเกจ',
                            field: 'pk_name',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'เลือก',
                            field: 'Edit',
                            sort: 'asc',
                            width: 20
                        }
                    ],
                    rows
                };
                setpackagemain(Mydata);
            });

    }

    async function Showpackagesub(ID) {
        var tsex = document.getElementById("t_sex").value;
        var tage = document.getElementById("t_age").value;

        fetch(API.dataSource.code + "Healthcheck.php?module=Showpackagesub&ID=" + ID + "&sex=" + tsex + "&age=" + tage)
            .then(response => {
                return response.json();
            })
            .then(data => {

                setpackagesub([]);
                setpackageID(ID);

                for (var i = 0; i < data.length; i++) {

                    setpackagesub(prevItems => [...prevItems,
                    {
                        ID: prevItems.length,
                        itemLabid: data[i].pks_labid,
                        itemLabname: data[i].pks_name,
                        itemLabprice: data[i].pks_price,
                        itemLabsex: data[i].psk_sex,
                        itemLabscid: data[i].Scid,
                        itemLabtype: data[i].pkd_type,
                    }]);

                }

                // Clickpackages();

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Clickpackages() {


        var header = document.getElementById("myDIV");
        var btns = header.getElementsByClassName("btn");
        for (var i = 0; i < packagemain.length; i++) {
            btns[i].addEventListener("click", function () {
                var current = document.getElementsByClassName("active");
                current[0].className = current[0].className.replace(" active", "");
                this.className += " active";
            });
        }


    }

    async function Showlab() {

        fetch(API.dataSource.code + "Healthcheck.php?module=Showlab")
            .then(res => res.json())
            .then(json => {
                //alert(json);
                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    Edit: (
                        <div style={{ textAlign: 'center' }}>
                            <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="เพิ่มรายการตรวจ" onClick={() => Addlistorder(row.pkd_labid, row.pkd_name, row.pkd_price, txtvalue.t_sex)}><i className="fa fa-plus-square font-14" title='เลือกตรวจสุขภาพ' /></button>
                        </div>
                    ),

                }));

                Mydata = {
                    columns: [
                        {
                            label: 'รหัส Lab',
                            field: 'pkd_labid',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'รายการ Lab',
                            field: 'pkd_name',
                            sort: 'asc',
                            width: 500
                        },
                        {
                            label: 'ราคา',
                            field: 'pkd_price',
                            sort: 'asc',
                            width: 100
                        },
                        {
                            label: 'เพิ่ม',
                            field: 'Edit',
                            sort: 'asc',
                            width: 20
                        }
                    ],
                    rows
                };
                setlabdata(Mydata);
            });

    }

    async function Addlistorder(Labid, Labname, Labprice, sex) {

        /*
        if (Checkaddlab(Labid) == '1') {
            alert("มีรายการตรวจนี้แล้วครับ !");
            return false;
        } else {
            */

        setpackagesub(prevItems => [...prevItems,
        {
            ID: prevItems.length,
            itemLabid: Labid,
            itemLabname: Labname,
            itemLabprice: Labprice,
            itemLabsex: sex,
        }]);

        //}

    }

    function Checkaddlab(Labid) {

        let result = 0;

        for (var i = 0; i < packagesub.length; i++) {
            if (Labid == packagesub[i].itemLabid) {
                result += result + 1;
            }
        }

        return result;
    }

    async function Removeorder(val) {
        const people = [...packagesub]
        const newList = people.filter((item) => item.ID !== val);
        setpackagesub(newList);
    }

    async function Checkpackage(str) {

        if (str == "1") {
            if (packagesub.length == "0") {
                alert("กรุณาทำการเลือกแพ็กเกจตรวจสุขภาพประจำปีด้วยครับ !");
                setTabIndex(0);
                return false;
            } else {
                setTabIndex(str);

                setlistorderlab1([]);
                setlistorderlab2([]);
                setlistorderlab3([]);

                Createlab(packageID, txtvalue.t_sex, txtvalue.t_age, txtvalue.t_hn, txtvalue.t_abroadID);

            }
        } else {
            setTabIndex(str);
        }
    }

    //แสดง List การคุมกำเนิด
    async function listContraceptive() {

        fetch(API.dataSource.code + "Healthcheck.php?module=Contraceptive")
            .then(response => {
                return response.json();
            })
            .then(data => {

                setselectContraceptive(data);

            })
            .catch(error => {
                console.log(error);
            });

    }

    //แสดง List หน่วยงาาน
    async function listDepartment() {

        fetch(API.dataSource.code + "Healthcheck.php?module=Showlistdepartment")
            .then(response => {
                return response.json();
            })
            .then(data => {

                setselectDepartment(data);
            })
            .catch(error => {
                console.log(error);
            });

    }

    async function onChangdepartment(even) {
        settxtvalue({ ...txtvalue, t_departmentid: even.value })
        listOffice(even.value);
    }

    //แสดง List กลุ่มงา/ฝ่าย
    async function listOffice(dipID) {

        fetch(API.dataSource.code + "Healthcheck.php?module=Showlistoffice&departmentID=" + dipID)
            .then(response => {
                return response.json();
            })
            .then(data => {

                setselectOffice(data);

            })
            .catch(error => {
                console.log(error);
            });

    }

    //แสดง List สิทธ์รักษา
    async function listInscl() {

        fetch(API.dataSource.code + "Healthcheck.php?module=Showlistinscl")
            .then(response => {
                return response.json();
            })
            .then(data => {

                setselectInscl(data);

            })
            .catch(error => {
                console.log(error);
            });

    }

    //แสดง List หน่วยงาาน
    async function listDoctor() {

        fetch(API.dataSource.code + "Healthcheck.php?module=Showlistdoctor")
            .then(response => {
                return response.json();
            })
            .then(data => {

                setselectDoctor(data);

            })
            .catch(error => {
                console.log(error);
            });

    }

    //เช็คประเภทผู้ป่วยเก่า-ใหม่
    async function Checkpattype() {

        fetch(API.dataSource.code + "Healthcheck.php?module=Checkpattype&thn=" + txtvalue.t_hn + "&tvsdate=" + txtvalue.t_vsdate)
            .then(response => {
                return response.json();
            })
            .then(data => {

                if (data[0].CountOfVsid > 1) {
                    settxtvalue({ ...txtvalue, t_pattype: 'เก่า', t_visitnew: data[0].typePat })
                } else {
                    settxtvalue({ ...txtvalue, t_pattype: 'ใหม่', t_visitnew: data[0].typePat })
                }

            })
            .catch(error => {
                console.log(error);
            });
    }

    async function checkOpthalmoscope(str) {

        var Opthalmoscope1 = document.getElementById("t_Opthalmoscope1");
        var Opthalmoscope2 = document.getElementById("t_Opthalmoscope2");
        var Opthalmoscope3 = document.getElementById("t_Opthalmoscope3");

        if (str == "1" && Opthalmoscope1.checked == true) {
            document.getElementById("t_Opthalmoscope2").checked = false;
            document.getElementById("t_Opthalmoscope3").checked = false;
            settxtvalue({ ...txtvalue, t_Opthalmoscope: str });
        } else if (str == "2" && Opthalmoscope2.checked == true) {
            document.getElementById("t_Opthalmoscope1").checked = false;
            document.getElementById("t_Opthalmoscope3").checked = false;
            settxtvalue({ ...txtvalue, t_Opthalmoscope: str });
        } else if (str == "9" && Opthalmoscope3.checked == true) {
            document.getElementById("t_Opthalmoscope2").checked = false;
            document.getElementById("t_Opthalmoscope1").checked = false;
            settxtvalue({ ...txtvalue, t_Opthalmoscope: str });
        } else {
            settxtvalue({ ...txtvalue, t_Opthalmoscope: '' });
        }

    }

    //สร้าง Lab
    async function Createlab(pkID, Sex, age, hn, abroadID) {

        var OR = "";
        var lab_pid = "";
        var lab_type = "";

        for (var i1 = 0; i1 < packagesub.length; i1++) {
            lab_pid += packagesub[i1].itemLabid + " OR Labcode = ";
        }
        OR += lab_pid + '000';

        Checkpattype();

        fetch(API.dataSource.code + "Healthcheck.php?module=Createlab&TpkID=" + pkID + "&Tsex=" + Sex + "&tage=" + age + "&thn=" + hn + "&tabroadID=" + abroadID + "&OR=" + OR + "&Tckstr=" + "&tGrid6=")
            .then(response => {
                return response.json();
            })
            .then(data => {

                for (var i = 0; i < data.length; i++) {

                    var LEQID = data[i].LEQID;
                    var LSEQRUN = data[i].LSEQRUN;
                    var LPrice = data[i].Price;
                    var LSecID = data[i].secID;
                    var LReqID = data[i].ReqID;

                    setlistorderlab1(prevItems => [...prevItems,
                    {
                        itemLEQID: data[i].LEQID,
                        itemLSEQRUN: data[i].LSEQRUN,
                        itemReqID: data[i].ReqID,
                        itemsecID: data[i].secID,
                        itemPrice: data[i].Price,
                        itemLabt: '1',
                    }]);

                    for (var i1 = 0; i1 < packagesub.length; i1++) {

                        var Labid = packagesub[i1].itemLabid;
                        var Price = packagesub[i1].itemLabprice;
                        var Scid = packagesub[i1].itemLabscid;
                        var Ptype = packagesub[i1].itemLabtype;

                        if (Labid != "" && LSecID == Scid) {

                            setlistorderlab2(prevItems => [...prevItems,
                            {
                                itemLEQID2: LEQID,
                                itemLab2: Labid,
                                itemPrice2: Price,
                                itemScid2: Scid,
                                itemPtype: Ptype,
                            }]);

                            //รายละเอียด Lab
                            fetch(API.dataSource.code + "Healthcheck.php?module=Createlab&tGrid6=1&tLabid=" + Labid + "&tLEQID=" + LEQID)
                                .then(response => {
                                    return response.json();
                                })
                                .then(data3 => {

                                    for (var i3 = 0; i3 < data3.length; i3++) {

                                        setlistorderlab3(prevItems => [...prevItems,
                                        {
                                            ID: prevItems.length,
                                            itemLEQID3: data3[i3].LEQID,
                                            itemLabid3: data3[i3].Lab_code,
                                            itemlabname3: data3[i3].Lab_name,
                                            itemSecid3: data3[i3].Lab_secid,
                                            itemspecimen3: data3[i3].Lab_specimen,
                                            itemlabtype3: data3[i3].Labtype,
                                            itemPrice3: data3[i3].Price,
                                        }]);

                                    }


                                })
                                .catch(error => {
                                    console.log(error);
                                });

                        }

                    }

                }

            })
            .catch(error => {
                console.log(error);
            });


    }

    //สูบบุหรี่
    async function Clicksmoke(even) {
        if (even.target.checked == true) {
            setstrsmoke(false);
        } else {
            setstrsmoke(true);
            settxtvalue({ ...txtvalue, t_smoke: '' });
        }
    }

    //ดื่มสุรา
    async function Clickdring(even) {
        if (even.target.checked == true) {
            setstrdring(false);
        } else {
            setstrdring(true);
            settxtvalue({ ...txtvalue, t_dring: '' });
        }
    }

    //ตรวจเท้า
    async function Clickfoot(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_foot: '1' });
        } else {
            settxtvalue({ ...txtvalue, t_foot: '0' });
        }
    }

    //ตั้งครร
    async function ClickchkPN(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_ChkPN: '1' });
        } else {
            settxtvalue({ ...txtvalue, t_ChkPN: '2' });
        }
    }

    //ให้นมบุตร
    async function Clickcheckbox(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_ChkBF: '1' });
        } else {
            settxtvalue({ ...txtvalue, t_ChkBF: '2' });
        }
    }

    //มีประวัติเบาหวานในญาติสายตรง
    async function Clickdiabetes(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_diabetes: '1' });
        } else {
            settxtvalue({ ...txtvalue, t_diabetes: '2' });
        }
    }

    //มีประวัติความดันสูงในฐาติสายตรง
    async function Clickpressure(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_pressure: '1' });
        } else {
            settxtvalue({ ...txtvalue, t_pressure: '2' });
        }
    }

    //PE
    async function ClickPE(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_pe: '1' });
            setstrPE(false);
        } else {
            settxtvalue({ ...txtvalue, t_pe: '0', t_ga: '' });
            setstrPE(true);
        }
    }

    //Heent
    async function ClickHeent(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_heent: '1' });
            setstrHeent(false);
        } else {
            settxtvalue({ ...txtvalue, t_heent: '0', t_ngf: '' });
            setstrHeent(true);
        }
    }

    //ext
    async function Clickext(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_ext: '1' });
            setstrext(false);
        } else {
            settxtvalue({ ...txtvalue, t_ext: '0', t_extother: '' });
            setstrext(true);
        }
    }

    //Heart
    async function ClickHeart(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_heart: '1' });
            setstrHeart(false);
        } else {
            settxtvalue({ ...txtvalue, t_heart: '0', t_heartother: '' });
            setstrHeart(true);
        }
    }

    //Neuro
    async function ClickNeuro(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_neuro: '1' });
            setstrNeuro(false);
        } else {
            settxtvalue({ ...txtvalue, t_neuro: '0', t_neuroother: '' });
            setstrNeuro(true);
        }
    }

    //Lung
    async function ClickLung(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_lung: '1' });
            setstrLung(false);
        } else {
            settxtvalue({ ...txtvalue, t_lung: '0', t_lungother: '' });
            setstrLung(true);
        }
    }

    //Skin
    async function ClickSkin(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_skin: '1' });
            setstrSkin(false);
        } else {
            settxtvalue({ ...txtvalue, t_skin: '0', t_skinother: '' });
            setstrSkin(true);
        }
    }

    //Abdomen
    async function ClickAbdomen(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_abdomen: '1' });
            setstrAbdomen(false);
        } else {
            settxtvalue({ ...txtvalue, t_abdomen: '0', t_abdomenother: '' });
            setstrAbdomen(true);
        }
    }

    //other
    async function ClickOther(even) {
        if (even.target.checked == true) {
            settxtvalue({ ...txtvalue, t_other: '1' });
            setstrOther(false);
        } else {
            settxtvalue({ ...txtvalue, t_other: '0', t_othertext: '' });
            setstrOther(true);
        }
    }

    //เช็ค User
    async function Chekuser(even) {

        if (even.keyCode == "13") {

            fetch(API.dataSource.code + "Healthcheck.php?module=Chekuser&Tuserid=" + even.target.value)
                .then(response => {
                    return response.json();
                })
                .then(data => {

                    settxtvalue({ ...txtvalue, t_username: data[0].fullname })

                })
                .catch(error => {
                    console.log(error);
                });

        }

    }

    //หาค่า BMI
    async function GetBMI(even, t_name) {
        var Weight = document.getElementById("t_weight");
        var High = document.getElementById("t_high");

        if (Weight.value != "0" && High.value != "0") {
            var ConvertHigh1 = (parseFloat(High.value) / 100);
            var ConvertHigh2 = (parseFloat(High.value) / 100);
            var ConvertHigh3 = parseFloat(ConvertHigh1) * parseFloat(ConvertHigh2);
            var BMIM = parseFloat(Weight.value) / parseFloat(ConvertHigh3);

            if (t_name == 'high') {
                settxtvalue({ ...txtvalue, t_BMI: BMIM.toFixed(2), t_high: even.target.value })
            } else if (t_name == 'weight') {
                settxtvalue({ ...txtvalue, t_BMI: BMIM.toFixed(2), t_weight: even.target.value })
            }

        } else {
            settxtvalue({ ...txtvalue, t_BMI: '0' })
        }



    }

    //บันทึกข้อมูลซักประวัติ
    async function Savedata() {

        //เช็คว่ามีการส่ง lab ซ้ำหรือป่าว
        var ckLab = "";
        for (var i = 0; i < packagesub.length; i++) {
            if (Checkaddlab(packagesub[i].itemLabid) >= 2) {
                ckLab = "1";
            }
        }

        if (ckLab == "1") {
            alert("มีรายการตรวจสุขภาพซ้ำกรุณาตรวจสอบข้อมูลใหม่ด้วยครับ !");
            setTabIndex(0);
            return false;
        } else if (txtvalue.t_departmentid == "") {
            alert("กรุณาเลือกหน่วยงานด้วยครับ !");
            return false;
        } else if (txtvalue.t_offID == "") {
            alert("กรุณาเลือกกลุ่มงาน/ฝ่ายด้วยครับ !");
            return false;
        } else if (txtvalue.t_insclid == "") {
            alert("กรุณาเลือกสิทธ์รักษาพยาบาลด้วยครับ !");
            return false;
        } else if (txtvalue.t_doctorid == "") {
            alert("กรุณาเลือกแพทย์รักษาด้วยครับ !");
            return false;
        } else if (txtvalue.t_type == "") {
            alert("กรุณาเลือกประเภทการมาด้วยครับ !");
            return false;
        } else if (txtvalue.t_hosid == "" && txtvalue.t_type == "4" || txtvalue.t_type == "7") {
            alert("กรุณาใส่รหัสสถานพยาบาลด้วยครับ !");
            document.getElementById("t_hosid").focus();
            return false;
        } else if (txtvalue.t_age == "") {
            alert("ไม่พบข้อมูลอายุกรุณาตรวจสอบข้อมูลการ Visit ผู้ป่วยใหม่ด้วยครับ !");
            return false;
        } else if (txtvalue.t_sex == "") {
            alert("ไม่พบข้อมูลเพศกรุณาตรวจสอบข้อมูลการ Visit ผู้ป่วยใหม่ด้วยครับ !");
            return false;
        } else if (txtvalue.t_high == "") {
            alert("กรุณใส่ส่วนสูงด้วยครับ !");
            document.getElementById("t_high").focus();
            return false;
        } else if (txtvalue.t_weight == "") {
            alert("กรุณาใส่น้ำหนักด้วยครับ !");
            document.getElementById("t_weight").focus();
            return false;
        } else if (txtvalue.t_sbp1 == "") {
            alert("กรุณาใส่ข้อมูลช่อง SBP ด้วยครับ !");
            document.getElementById("t_sbp1").focus();
            return false;
        } else if (txtvalue.t_dbp1 == "") {
            alert("กรุณาใส่ข้อมูลช่อง DBP ด้วยครับ !");
            document.getElementById("t_dbp1").focus();
            return false;
        } else if (txtvalue.t_pulse == "") {
            alert("กรุณาใส่ข้อมูลช่องชีพจรด้วยครับ !");
            document.getElementById("t_pulse").focus();
            return false;
        } else if (txtvalue.t_userid == "") {
            alert("กรุณาใส่รหัสเจ้าหน้าที่ด้วยครับ ! !");
            document.getElementById("t_userid").focus();
            return false;
        } else {

            const method = "POST";
            const body = new FormData();
            body.append("t_id", txtvalue.t_id);
            body.append("t_pkID", packageID);
            body.append("t_vsid", txtvalue.t_vsid);
            body.append("t_hn", txtvalue.t_hn);
            body.append("t_cid", txtvalue.t_cid);
            body.append("t_sex", txtvalue.t_sex);
            body.append("t_tname", txtvalue.t_tname);
            body.append("t_fname", txtvalue.t_fname);
            body.append("t_lname", txtvalue.t_lname);
            body.append("t_status", txtvalue.t_status);
            body.append("t_address", txtvalue.t_addpart);
            body.append("t_birthday", txtvalue.t_birthday);
            body.append("t_moo", txtvalue.t_moo);
            body.append("t_alley", txtvalue.t_alley);
            body.append("t_road", txtvalue.t_road);
            body.append("t_province", txtvalue.t_province);
            body.append("t_ampher", txtvalue.t_ampher);
            body.append("t_tambon", txtvalue.t_tambon);
            body.append("t_zipcode", txtvalue.t_zipcode);
            body.append("t_oocpart", txtvalue.t_oocpart);
            body.append("t_age", txtvalue.t_age);
            body.append("t_departmentid", txtvalue.t_departmentid);
            body.append("t_offID", txtvalue.t_offID);
            body.append("t_insclid", txtvalue.t_insclid);
            body.append("t_abroadID", txtvalue.t_abroadID);
            body.append("t_type", txtvalue.t_type);
            body.append("t_hosid", txtvalue.t_hosid);
            body.append("t_numberNo", txtvalue.t_numberNo);
            body.append("t_Dx", txtvalue.t_Dx);
            body.append("t_BMI", txtvalue.t_BMI);
            body.append("t_vsdate", txtvalue.t_vsdate);
            body.append("t_vstime", txtvalue.t_vstime);
            body.append("t_vsstr", txtvalue.t_vsstr);
            body.append("t_pattype", txtvalue.t_pattype);
            body.append("t_tel", txtvalue.t_tel);
            body.append("t_visitnew", txtvalue.t_visitnew);
            body.append("t_cc", txtvalue.t_cc);
            body.append("t_pi", txtvalue.t_pi);
            body.append("t_strHP", txtvalue.t_strHP);
            body.append("t_strFH", txtvalue.t_strFH);
            body.append("t_strSX", txtvalue.t_strSX);
            body.append("t_strHPOther", txtvalue.t_strHPOther);
            body.append("t_strFHOther", txtvalue.t_strFHOther);
            body.append("t_strSXOther", txtvalue.t_strSXOther);
            body.append("t_drugAllergy", txtvalue.t_drugAllergy);
            body.append("t_G", txtvalue.t_G);
            body.append("t_P", txtvalue.t_P);
            body.append("t_A", txtvalue.t_A);
            body.append("t_L", txtvalue.t_L);
            body.append("t_last", txtvalue.t_last);
            body.append("t_lmp", txtvalue.t_lmp);
            body.append("t_lmpdate", txtvalue.t_lmpdate);
            body.append("t_lmptime", txtvalue.t_lmptime);
            body.append("t_notdate", txtvalue.t_notdate);
            body.append("t_edcdate", txtvalue.t_edcdate);
            body.append("t_FPplantyp", txtvalue.t_FPplantyp);
            body.append("t_TVC", txtvalue.t_TVC);
            body.append("t_TEV", txtvalue.t_TEV);
            body.append("t_smoke", txtvalue.t_smoke);
            body.append("t_smoktype", txtvalue.t_smoktype);
            body.append("t_dring", txtvalue.t_dring);
            body.append("t_dringtype", txtvalue.t_dringtype);
            body.append("t_foot", txtvalue.t_foot);
            body.append("t_Opthalmoscope", txtvalue.t_Opthalmoscope);
            body.append("t_CCRetina", txtvalue.t_CCRetina);
            body.append("t_lpmtype", txtvalue.t_lpmtype);
            body.append("t_diabetes", txtvalue.t_diabetes);
            body.append("t_pressure", txtvalue.t_pressure);
            body.append("t_ChkPN", txtvalue.t_ChkPN);
            body.append("t_ChkBF", txtvalue.t_ChkBF);
            body.append("t_c", txtvalue.t_c);
            body.append("t_high", txtvalue.t_high);
            body.append("t_weight", txtvalue.t_weight);
            body.append("t_waistline", txtvalue.t_waistline);
            body.append("t_hip", txtvalue.t_hip);
            body.append("t_head", txtvalue.t_head);
            body.append("t_o2", txtvalue.t_o2);
            body.append("t_pulse", txtvalue.t_pulse);
            body.append("t_breathing", txtvalue.t_breathing);
            body.append("t_bloodpressure1", txtvalue.t_bloodpressure1);
            body.append("t_sbp1", txtvalue.t_sbp1);
            body.append("t_dbp1", txtvalue.t_dbp1);
            body.append("t_time1", txtvalue.t_time1);
            body.append("t_bloodpressure2", txtvalue.t_bloodpressure2);
            body.append("t_sbp2", txtvalue.t_sbp2);
            body.append("t_dbp2", txtvalue.t_dbp2);
            body.append("t_time2", txtvalue.t_time2);
            body.append("t_pe", txtvalue.t_pe);
            body.append("t_ga", txtvalue.t_ga);
            body.append("t_heent", txtvalue.t_heent);
            body.append("t_ngf", txtvalue.t_ngf);
            body.append("t_ext", txtvalue.t_ext);
            body.append("t_extother", txtvalue.t_extother);
            body.append("t_heart", txtvalue.t_heart);
            body.append("t_heartother", txtvalue.t_heartother);
            body.append("t_neuro", txtvalue.t_neuro);
            body.append("t_neuroother", txtvalue.t_neuroother);
            body.append("t_lung", txtvalue.t_lung);
            body.append("t_lungother", txtvalue.t_lungother);
            body.append("t_skin", txtvalue.t_skin);
            body.append("t_skinother", txtvalue.t_skinother);
            body.append("t_abdomen", txtvalue.t_abdomen);
            body.append("t_abdomenother", txtvalue.t_abdomenother);
            body.append("t_other", txtvalue.t_other);
            body.append("t_othertext", txtvalue.t_othertext);
            body.append("t_userid", txtvalue.t_userid);
            body.append("t_doctorid", txtvalue.t_doctorid);
            body.append("t_roomid", txtvalue.t_officeid);
            fetch(API.dataSource.code + "Healthcheck.php?module=Inputdata", { method, body })
                .then(res => res.json())
                .then(data => {

                    //alert(JSON.stringify(data, null, "\t"))
                    var Savestr = "";

                    //บันทึก LabOrderM
                    for (var i1 = 0; i1 < listorderlab1.length; i1++) {

                        fetch(API.dataSource.code + "Healthcheck.php?module=InputLabOrderM&genID=" + data[0].genID + "&tLEQID=" + listorderlab1[i1].itemLEQID + "&tLSEQRUN=" + listorderlab1[i1].itemLSEQRUN + "&tReqID=" + listorderlab1[i1].itemReqID + "&tsecID=" + listorderlab1[i1].itemsecID + "&tPrice=" + listorderlab1[i1].itemPrice + "&tLabt=" + listorderlab1[i1].itemLabt + "&tOrderID=" + data[0].Orderid + "&tvsid=" + txtvalue.t_vsid + "&tsex=" + txtvalue.t_sex + "&thn=" + txtvalue.t_hn + "&tuserid=" + txtvalue.t_userid + "&tinsclid=" + txtvalue.t_insclid)
                            .then(response => {
                                return response.json();
                            })
                            .then(data1 => {

                                Savestr += data1;

                            })
                            .catch(error => {
                                console.log(error);
                            });

                    }

                    //บันทึก LabDetailM
                    for (var i2 = 0; i2 < listorderlab2.length; i2++) {

                        fetch(API.dataSource.code + "Healthcheck.php?module=InputLabDetailM&genID=" + data[0].genID + "&tLEQID=" + listorderlab2[i2].itemLEQID2 + "&tLabid=" + listorderlab2[i2].itemLab2 +
                            "&tPrice=" + listorderlab2[i2].itemPrice2 + "&tScid=" + listorderlab2[i2].itemScid2 + "&tPtype=" + listorderlab2[i2].itemPtype)
                            .then(response => {
                                return response.json();
                            })
                            .then(data2 => {

                                Savestr += data2;

                            })
                            .catch(error => {
                                console.log(error);
                            });

                    }

                    //บันทึก LabDetailM_bytest
                    for (var i3 = 0; i3 < listorderlab3.length; i3++) {

                        fetch(API.dataSource.code + "Healthcheck.php?module=InputLabDetailMbytest&genID=" + data[0].genID + "&tLEQID=" + listorderlab3[i3].itemLEQID3 + "&tLabid=" + listorderlab3[i3].itemLabid3 +
                            "&tlabname=" + listorderlab3[i3].itemlabname3 + "&tSecid=" + listorderlab3[i3].itemSecid3 + "&tSpecimen=" + listorderlab3[i3].itemspecimen3 +
                            "&tlabtype=" + listorderlab3[i3].itemlabtype3 + "&tPrice=" + listorderlab3[i3].itemPrice3)
                            .then(response => {
                                return response.json();
                            })
                            .then(data3 => {

                                Savestr += data3;

                            })
                            .catch(error => {
                                console.log(error);
                            });

                    }

                    if (data != "") {

                        alert("บันทึกส่งตรวจสุขภาพประจำปีเรียบร้อยแล้วครับ");
                        setpackagesub([]);
                        setlistorderlab1([]);
                        setlistorderlab2([]);
                        setlistorderlab3([]);
                        setTabIndex(0);
                    }

                });

        }

    }

    //แสดงข้อมูลเพื่อแก้ไข
    async function Showdataedit(ID) {
        alert(API.dataSource.code + "Healthcheck.php?module=Showdataedit&idEdit=" + ID)
        fetch(API.dataSource.code + "Healthcheck.php?module=Showdataedit&idEdit=" + ID)
            .then(response => {
                return response.json();
            })
            .then(data => {


            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Deletedata() {

    }

    return (
        <div>

            <div className="page-heading">
                <h1 className="page-title"> รายการข้อมูลตรวจสุขภาพ </h1>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="#"><i className="la la-home font-20" /></a>
                    </li>
                    <li className="breadcrumb-item"> Healthcheck From </li>
                </ol>
            </div>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <div className="ibox-head">
                        <div className="ibox-title"> รายการ</div>
                        <div>  </div>
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
                <Modal visible={modal} width="90%" effect="fadeInUp" onClick={() => closeModal()}>
                    <div className="Modelbody">
                        <div className="Modelheader">

                        </div>
                        <div className="panel-body">

                            <div className='row'>
                                <div className="col-md-12">
                                    <div className="ibox">
                                        <div className="ibox-head" style={{ height: 180 }}>
                                            <div className="ibox-title">
                                                <div className="row headPop" style={{ position: 'absolute' }}>

                                                    <div className='boxImg'>
                                                        <img src="./assets/img/users/userM.png" />
                                                    </div>

                                                    <div className='row' style={{ width: '100vh', marginLeft: 150 }}>
                                                        <input className="form-control" type="text" placeholder="Sex" id="t_sex" value={txtvalue.t_sex} hidden={true} />
                                                        <input className="form-control" type="text" placeholder="Sex" id="t_age" value={txtvalue.t_age} hidden={true} />
                                                        <div> &nbsp;&nbsp; เลขบัตรประจำตัวประชาบน </div> &nbsp;&nbsp; <label> {txtvalue.t_cid} </label> &nbsp;&nbsp;
                                                        <div> &nbsp;&nbsp; HN </div> &nbsp;&nbsp; <label> {txtvalue.t_hn} </label>
                                                        <div> &nbsp;&nbsp; ชื่อ-สกุล </div> &nbsp;&nbsp; <label> {txtvalue.t_name} </label>
                                                        <div> &nbsp;&nbsp; เพศ </div> &nbsp;&nbsp; <label> {
                                                            txtvalue.t_sex == '1' ? (<span>ชาย</span>) : (<span>หญิง</span>)
                                                        } </label>
                                                        <div> &nbsp;&nbsp; อายุ </div> &nbsp;&nbsp; <label> {txtvalue.t_age} </label><p>&nbsp;</p>
                                                        <div> &nbsp;&nbsp; ที่อยู่ </div> &nbsp;&nbsp; <label> {txtvalue.t_address} </label>
                                                        <div> &nbsp;&nbsp; หน่วยงาน </div> &nbsp;&nbsp; <label> {txtvalue.t_department} </label>
                                                        <div> &nbsp;&nbsp; กลุ่มงาน/ฝ่าย </div> &nbsp;&nbsp; <label> {txtvalue.t_office} </label>
                                                        <div> &nbsp;&nbsp; สิทธ์การตรวจสุขภาพ </div> &nbsp;&nbsp; <label> {txtvalue.t_insclname} </label>&nbsp;&nbsp;

                                                    </div>

                                                </div>
                                            </div>
                                            <div className="ibox-tools" style={{ top: -50 }}>
                                                <a onClick={() => closeModal()}><i className="fa ti-close" /></a>
                                            </div>
                                        </div>
                                        <div>

                                            <div className="col-md-12">

                                                <Tabs selectedIndex={tabIndex} onSelect={index => Checkpackage(index)}>
                                                    <TabList>
                                                        <Tab> <i className="fa fa-product-hunt" aria-hidden="true" /> แพ็กเกจตรวจสุขภาพ </Tab>
                                                        <Tab> <i className="fa fa-address-card" aria-hidden="true" /> ซักประวัติผู้รับบริการ </Tab>
                                                    </TabList>

                                                    <TabPanel>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="ibox">
                                                                    <MDBDataTableV5
                                                                        hover entriesOptions={[5, 20, 25]}
                                                                        entries={5}
                                                                        pagesAmount={4}
                                                                        data={packagemain}
                                                                        searchTop searchBottom={false} />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6" style={{ overflow: 'scroll', height: '60vh' }}>
                                                                <button className="btn btn-info" type="button" style={{ cursor: 'pointer', backgroundColor: 'green' }} onClick={() => Openpuplab()}> <i className="fa fa-plus-square" style={{ fontSize: 15 }} /> ตรวจเพิ่ม </button>
                                                                <div className="ibox">
                                                                    <div className="form-group">
                                                                        <table className="table table-striped">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th> LabID </th>
                                                                                    <th> รายการตรวจสุขภาพ </th>
                                                                                    <th> ราคา </th>
                                                                                    <th> เพศ </th>
                                                                                    <th> ยกเลิก </th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {
                                                                                    packagesub.map((item, row) =>
                                                                                        <tr>
                                                                                            <td className="py-1">{item.itemLabid}</td>
                                                                                            <td> {item.itemLabname} </td>
                                                                                            <td> {item.itemLabprice} </td>
                                                                                            <td> {item.itemLabsex == '1' ? (<span>ชาย</span>) : (<span>หญิง</span>)} </td>
                                                                                            <td>
                                                                                                <button type="button" className="btn btn-outline-danger btn-icon-text" onClick={() => Removeorder(item.ID)}>
                                                                                                    <i className="mdi mdi-close-circle"></i>
                                                                                                    ยกเลิก
                                                                                                </button>
                                                                                            </td>
                                                                                        </tr>
                                                                                    )
                                                                                }

                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </TabPanel>
                                                    <TabPanel>
                                                        <div style={{ overflow: 'scroll', height: '60vh' }}>

                                                            <dvi className='row'>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label> หน่วยงาน *</label>
                                                                        <Select
                                                                            value={selectDepartment.find(obj => obj.value === txtvalue.t_departmentid)}
                                                                            options={selectDepartment}
                                                                            onChange={even => onChangdepartment(even)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label> กลุ่มงาน/ฝ่าย *</label>
                                                                        <Select
                                                                            value={selectOffice.find(obj => obj.value === txtvalue.t_offID)}
                                                                            options={selectOffice}
                                                                            onChange={even => settxtvalue({ ...txtvalue, t_offID: even.value })}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label> สิทธ์การตรวจสุขภาพ *</label>
                                                                        <Select
                                                                            value={selectInscl.find(obj => obj.value === txtvalue.t_insclid)}
                                                                            options={selectInscl}
                                                                            onChange={even => settxtvalue({ ...txtvalue, t_insclid: even.value })}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label> แพทย์ผู้ตรวจ *</label>
                                                                        <Select
                                                                            value={selectDoctor.find(obj => obj.value === txtvalue.t_doctorid)}
                                                                            options={selectDoctor}
                                                                            onChange={even => settxtvalue({ ...txtvalue, t_doctorid: even.value })}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </dvi>

                                                            <div className="row">
                                                                <div className="col-md-2">
                                                                    <div className="form-group">
                                                                        <label> ประเภทการมา *</label>
                                                                        <Select
                                                                            value={selectType.find(obj => obj.value === txtvalue.t_type)}
                                                                            options={selectType}
                                                                            onChange={even => settxtvalue({ ...txtvalue, t_type: even.value })}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <div className="form-group">
                                                                        <label> รหัสสถานบริการ* </label>
                                                                        <input className="form-control" type="text" id='t_hosid' placeholder="รหัส รพ Enter" value={txtvalue.t_hosid} onChange={(even) => settxtvalue({ ...txtvalue, t_hosid: even.target.value })} onKeyDown={(even) => Showhospital(even)} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label> &nbsp; </label>
                                                                        <span className="form-control"> {txtvalue.t_hosname} </span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-1">
                                                                    <div className="form-group">
                                                                        <label> เลขที่ </label>
                                                                        <input className="form-control" type="text" id='t_numberNo' placeholder="เลขที่" onChange={(even) => settxtvalue({ ...txtvalue, t_numberNo: even.target.value })} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <div className="form-group">
                                                                        <label> Dx. </label>
                                                                        <input className="form-control" type="text" id='t_Dx' placeholder="Dx" onChange={(even) => settxtvalue({ ...txtvalue, t_Dx: even.target.value })} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <div className="form-group">
                                                                        <label> BMI </label>
                                                                        <input className="form-control" type="text" placeholder="BMI" id='t_bmi' value={txtvalue.t_BMI} onChange={(even) => settxtvalue({ ...txtvalue, t_BMI: even.target.value })} />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <div className="col-md-2">
                                                                    <div className="form-group">
                                                                        <label> วันที่ </label>
                                                                        <input className="form-control" type="date" placeholder="" id="t_vsdate" value={txtvalue.t_vsdate} onChange={(even) => settxtvalue({ ...txtvalue, t_vsdate: even.target.value })} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <div className="form-group">
                                                                        <label> เวลา </label>
                                                                        <input className="form-control" type="time" placeholder="เวลา" id='t_vstime' value={txtvalue.t_vstime} onChange={(even) => settxtvalue({ ...txtvalue, t_vstime: even.target.value })} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label> &nbsp; </label>
                                                                        <div>
                                                                            <label className="ui-radio ui-radio-inline">
                                                                                <input type="radio" name="test" onClick={() => settxtvalue({ ...txtvalue, t_vsstr: '1' })} />
                                                                                <span className="input-span" /> R1 </label>
                                                                            <label className="ui-radio ui-radio-inline">
                                                                                <input type="radio" name="test" onClick={() => settxtvalue({ ...txtvalue, t_vsstr: '2' })} />
                                                                                <span className="input-span" /> 2E </label>
                                                                            <label className="ui-radio ui-radio-inline">
                                                                                <input type="radio" name="test" onClick={() => settxtvalue({ ...txtvalue, t_vsstr: '3' })} />
                                                                                <span className="input-span" /> 3U </label>
                                                                            <label className="ui-radio ui-radio-inline">
                                                                                <input type="radio" name="test" onClick={() => settxtvalue({ ...txtvalue, t_vsstr: '4' })} />
                                                                                <span className="input-span" /> 4N </label>
                                                                            <label className="ui-radio ui-radio-inline">
                                                                                <input type="radio" name="test" onClick={() => settxtvalue({ ...txtvalue, t_vsstr: '5' })} />
                                                                                <span className="input-span" /> 5Gen </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-1.5">
                                                                    <div className="form-group">
                                                                        <label> ประเภทผู้ป่วย </label>
                                                                        <span className="form-control"> {txtvalue.t_pattype} </span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <div className="form-group">
                                                                        <label> เบอร์โทร </label>
                                                                        <input className="form-control" type="text" placeholder="Tel" value={txtvalue.t_tel} onChange={(even) => settxtvalue({ ...txtvalue, t_tel: even.target.value })} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-1">
                                                                    <div className="form-group">
                                                                        <label> Visit </label>
                                                                        <input className="form-control" type="text" placeholder="New" value={txtvalue.t_visitnew} />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label> CC </label>
                                                                        <input className="form-control" type="text" placeholder="CC" value={txtvalue.t_cc} onChange={(even) => settxtvalue({ ...txtvalue, t_cc: even.target.value })} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label> PI </label>
                                                                        <input className="form-control" type="text" placeholder="PI" value={txtvalue.t_pi} onChange={(even) => settxtvalue({ ...txtvalue, t_pi: even.target.value })} />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="row">
                                                                        <div className="col-md-3">
                                                                            <div className="form-group">
                                                                                <label> PH </label>
                                                                                <div>
                                                                                    <label className="ui-radio ui-radio-inline">
                                                                                        <input type="radio" name="test" onClick={() => settxtvalue({ ...txtvalue, t_strHP: '0' })} />
                                                                                        <span className="input-span" /> ปฎิเสธ </label>
                                                                                    <label className="ui-radio ui-radio-inline">
                                                                                        <input type="radio" name="test" onClick={() => settxtvalue({ ...txtvalue, t_strHP: '1' })} />
                                                                                        <span className="input-span" /> มี </label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-9">
                                                                            <div className="form-group">
                                                                                <label> &nbsp; </label>
                                                                                <input className="form-control" type="text" placeholder="อื่นๆ..." value={txtvalue.t_strHPOther} onChange={(even) => settxtvalue({ ...txtvalue, t_strHPOther: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-3">
                                                                            <div className="form-group">
                                                                                <label> FH </label>
                                                                                <div>
                                                                                    <label className="ui-radio ui-radio-inline">
                                                                                        <input type="radio" name="test" onClick={() => settxtvalue({ ...txtvalue, t_strFH: '0' })} />
                                                                                        <span className="input-span" /> ปฎิเสธ </label>
                                                                                    <label className="ui-radio ui-radio-inline">
                                                                                        <input type="radio" name="test" onClick={() => settxtvalue({ ...txtvalue, t_strFH: '1' })} />
                                                                                        <span className="input-span" /> มี </label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-9">
                                                                            <div className="form-group">
                                                                                <label> &nbsp; </label>
                                                                                <input className="form-control" type="text" placeholder="" value={txtvalue.t_strFHOther} onChange={(even) => settxtvalue({ ...txtvalue, t_strFHOther: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-3">
                                                                            <div className="form-group">
                                                                                <label> SX </label>
                                                                                <div>
                                                                                    <label className="ui-radio ui-radio-inline">
                                                                                        <input type="radio" name="test" onClick={() => settxtvalue({ ...txtvalue, t_strSX: '0' })} />
                                                                                        <span className="input-span" /> ไม่เคย </label>
                                                                                    <label className="ui-radio ui-radio-inline">
                                                                                        <input type="radio" name="test" onClick={() => settxtvalue({ ...txtvalue, t_strSX: '1' })} />
                                                                                        <span className="input-span" /> เคย </label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-9">
                                                                            <div className="form-group">
                                                                                <label> &nbsp; </label>
                                                                                <input className="form-control" type="text" placeholder="" value={txtvalue.t_strSXOther} onChange={(even) => settxtvalue({ ...txtvalue, t_strSXOther: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="form-group">
                                                                                <label> แพ้ยา </label>
                                                                                <input className="form-control" type="text" placeholder="" value={txtvalue.t_drugAllergy} onChange={(even) => settxtvalue({ ...txtvalue, t_drugAllergy: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-md-2">
                                                                            <div className="form-group">
                                                                                <label> G </label>
                                                                                <input className="form-control" type="text" placeholder="G" value={txtvalue.t_G} onChange={(even) => settxtvalue({ ...txtvalue, t_G: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2">
                                                                            <div className="form-group">
                                                                                <label> P </label>
                                                                                <input className="form-control" type="text" placeholder="P" value={txtvalue.t_P} onChange={(even) => settxtvalue({ ...txtvalue, t_P: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2">
                                                                            <div className="form-group">
                                                                                <label> A </label>
                                                                                <input className="form-control" type="text" placeholder="A" value={txtvalue.t_A} onChange={(even) => settxtvalue({ ...txtvalue, t_A: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2">
                                                                            <div className="form-group">
                                                                                <label> L </label>
                                                                                <input className="form-control" type="text" placeholder="L" value={txtvalue.t_L} onChange={(even) => settxtvalue({ ...txtvalue, t_L: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2">
                                                                            <div className="form-group">
                                                                                <label> Last </label>
                                                                                <input className="form-control" type="text" placeholder="Last" value={txtvalue.t_last} onChange={(even) => settxtvalue({ ...txtvalue, t_last: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-2">
                                                                            <div className="form-group">
                                                                                <label> ระบุLmp </label>
                                                                                <Select
                                                                                    value={selectLmp.find(obj => obj.value === txtvalue.t_lpmtype)}
                                                                                    options={selectLmp}
                                                                                    onChange={even => settxtvalue({ ...txtvalue, t_lpmtype: even.value })}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-md-3">
                                                                            <div className="form-group">
                                                                                <label> วันที่ Lmp </label>
                                                                                <input className="form-control" type="date" placeholder="Date" value={txtvalue.t_lmpdate} onChange={(even) => settxtvalue({ ...txtvalue, t_lmpdate: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-3">
                                                                            <div className="form-group">
                                                                                <label> Lmp ช่วงเวลา </label>
                                                                                <input className="form-control" type="time" placeholder="Time" value={txtvalue.t_lmptime} onChange={(even) => settxtvalue({ ...txtvalue, t_lmptime: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-3">
                                                                            <div className="form-group">
                                                                                <label> วันหมดประจำเดือน </label>
                                                                                <input className="form-control" type="date" placeholder="วันหมดประจำเดือน" value={txtvalue.t_notdate} onChange={(even) => settxtvalue({ ...txtvalue, t_notdate: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-3">
                                                                            <div className="form-group">
                                                                                <label> EDC </label>
                                                                                <input className="form-control" type="date" placeholder="EDC" value={txtvalue.t_edcdate} onChange={(even) => settxtvalue({ ...txtvalue, t_edcdate: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-md-4">
                                                                            <div className="form-group">
                                                                                <label> คุมกำเนิด </label>
                                                                                <Select
                                                                                    value={selectContraceptive.find(obj => obj.value === txtvalue.t_FPplantyp)}
                                                                                    options={selectContraceptive}
                                                                                    onChange={even => settxtvalue({ ...txtvalue, t_FPplantyp: even.value })}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <div className="form-group">
                                                                                <label> วัคซีน 0-12 ปี </label>
                                                                                <input className="form-control" type="text" placeholder="วัคซีน" value={txtvalue.t_TVC} onChange={(even) => settxtvalue({ ...txtvalue, t_TVC: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <div className="form-group">
                                                                                <label> พัฒนาการ  </label>
                                                                                <input className="form-control" type="text" placeholder="พัฒนาการ" value={txtvalue.t_TEV} onChange={(even) => settxtvalue({ ...txtvalue, t_TEV: even.target.value })} />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="form-group row">
                                                                        <div className="col-md-6">
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" id='t_smoke' onClick={(even) => Clicksmoke(even)} />
                                                                                <span className="input-span" /> สูบบุหรี่ </label>
                                                                            <Select
                                                                                value={selectSmoke.find(obj => obj.value === txtvalue.t_smoke)}
                                                                                options={selectSmoke}
                                                                                onChange={even => settxtvalue({ ...txtvalue, t_smoke: even.value })}
                                                                                isDisabled={strsmoke}
                                                                            />
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" id='t_dring' onClick={(even) => Clickdring(even)} />
                                                                                <span className="input-span" /> ดื่มเอลกอฮอล์ </label>
                                                                            <Select
                                                                                value={selectDring.find(obj => obj.value === txtvalue.t_dring)}
                                                                                options={selectDring}
                                                                                onChange={even => settxtvalue({ ...txtvalue, t_dring: even.value })}
                                                                                isDisabled={strdring}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" onClick={(even) => Clickfoot(even)} />
                                                                                <span className="input-span" /> ตรวจเท้า ตรวจจอประสาทตาด้วย </label>
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" id='t_Opthalmoscope1' onClick={() => checkOpthalmoscope('1')} />
                                                                                <span className="input-span" /> Opthalmoscope </label>
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" id='t_Opthalmoscope2' onClick={() => checkOpthalmoscope('2')} />
                                                                                <span className="input-span" /> Fundus camera </label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" id='t_Opthalmoscope3' onClick={() => checkOpthalmoscope('9')} />
                                                                                <span className="input-span" /> ไม่ตรวจ </label>
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" id='t_diabetes' onClick={(even) => Clickdiabetes(even)} />
                                                                                <span className="input-span" /> มีประวัติเบาหวานในญาติสายตรง </label>
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" id='t_pressure' onClick={(even) => Clickpressure(even)} />
                                                                                <span className="input-span" /> มีประวัติความดันสูงในฐาติสายตรง </label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" id='t_ChkPN' onClick={(even) => ClickchkPN(even)} />
                                                                                <span className="input-span" /> ตั้งครรภ์ </label>
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" id='t_ChkBF' onClick={(even) => Clickcheckbox(even)} />
                                                                                <span className="input-span" /> ให้นมบุตร </label>
                                                                        </div>
                                                                    </div>

                                                                </div>

                                                                <div className="col-md-6">

                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="row">
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label> อุณหภูมิ(c) </label>
                                                                                        <input className="form-control" type="text" placeholder="อุณหภูมิ(c)" value={txtvalue.t_c} onChange={(even) => settxtvalue({ ...txtvalue, t_c: even.target.value })} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label> ส่วนสูง * </label>
                                                                                        <input className="form-control" type="text" placeholder="ส่วนสูง" id='t_high' value={txtvalue.t_high} onChange={(even) => GetBMI(even, 'high')} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label> น้ำหนัก * </label>
                                                                                        <input className="form-control" type="text" placeholder="น้ำหนัก" id='t_weight' value={txtvalue.t_weight} onChange={(even) => GetBMI(even, 'weight')} />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="row">
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label> รอบเอว(cm) </label>
                                                                                        <input className="form-control" type="text" id='t_waistline' value={txtvalue.t_waistline} placeholder="รอบเอว" onChange={(even) => settxtvalue({ ...txtvalue, t_waistline: even.target.value })} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label> รอบสะโพก </label>
                                                                                        <input className="form-control" type="text" id='t_hip' value={txtvalue.t_hip} placeholder="รอบสะโพก" onChange={(even) => settxtvalue({ ...txtvalue, t_hip: even.target.value })} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label> รอบศรีษะ </label>
                                                                                        <input className="form-control" type="text" id='t_head' value={txtvalue.t_head} placeholder="รอบศรีษะ" onChange={(even) => settxtvalue({ ...txtvalue, t_head: even.target.value })} />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="row">
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label> ค่าO2 </label>
                                                                                        <input className="form-control" type="text" id='t_o2' value={txtvalue.t_o2} placeholder="ค่าO2" onChange={(even) => settxtvalue({ ...txtvalue, t_o2: even.target.value })} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label> ชีพจร * </label>
                                                                                        <input className="form-control" type="text" id='t_pulse' value={txtvalue.t_pulse} placeholder="ชีพจร" onChange={(even) => settxtvalue({ ...txtvalue, t_pulse: even.target.value })} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label> การหายใจ </label>
                                                                                        <input className="form-control" type="text" id='t_breathing' value={txtvalue.t_breathing} placeholder="การหายใจ" onChange={(even) => settxtvalue({ ...txtvalue, t_breathing: even.target.value })} />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="row">
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label> ความดันโลหิตครั้งที่1 SBP * </label>
                                                                                        <input className="form-control" type="text" id='t_sbp1' placeholder="SBP" value={txtvalue.t_sbp1} onChange={(even) => settxtvalue({ ...txtvalue, t_sbp1: even.target.value })} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label> DBP * </label>
                                                                                        <input className="form-control" type="text" id='t_dbp1' placeholder="DBP" value={txtvalue.t_dbp1} onChange={(even) => settxtvalue({ ...txtvalue, t_dbp1: even.target.value })} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label> เวลาครั่งที่1 </label>
                                                                                        <input className="form-control" type="text" id='t_time1' placeholder="" value={txtvalue.t_time1} onChange={(even) => settxtvalue({ ...txtvalue, t_time1: even.target.value })} />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="row">
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label> ความดันโลหิตครั้งที่2 SBP </label>
                                                                                        <input className="form-control" type="text" id='t_sbp2' value={txtvalue.t_sbp2} placeholder="SBP" onChange={(even) => settxtvalue({ ...txtvalue, t_sbp2: even.target.value })} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label> DBP </label>
                                                                                        <input className="form-control" type="text" id='t_dbp2' value={txtvalue.t_dbp2} placeholder="DBP" onChange={(even) => settxtvalue({ ...txtvalue, t_dbp2: even.target.value })} />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label> เวลาครั่งที่2 </label>
                                                                                        <input className="form-control" type="text" id='t_time2' value={txtvalue.t_time2} placeholder="" onChange={(even) => settxtvalue({ ...txtvalue, t_time2: even.target.value })} />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-md-4">
                                                                            <label> PE </label><br />
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" onClick={(even) => ClickPE(even)} />
                                                                                <span className="input-span" /> N = Normal </label>

                                                                            <div className="form-group row">
                                                                                <label className="col-sm-2 col-form-label"> GA </label>
                                                                                <div className="col-sm-10">
                                                                                    <input className="form-control" type="text" disabled={strPE} id='t_ga' value={txtvalue.t_ga} placeholder="" onChange={(even) => settxtvalue({ ...txtvalue, t_ga: even.target.value })} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <label> Heent </label><br />
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" onClick={(even) => ClickHeent(even)} />
                                                                                <span className="input-span" /> N = Normal </label>

                                                                            <div className="form-group row">
                                                                                <label className="col-sm-2 col-form-label"> gf </label>
                                                                                <div className="col-sm-10">
                                                                                    <input className="form-control" type="text" disabled={strHeent} id='t_ngf' value={txtvalue.t_ngf} placeholder="" onChange={(even) => settxtvalue({ ...txtvalue, t_ngf: even.target.value })} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <label> ext </label><br />
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" onClick={(even) => Clickext(even)} />
                                                                                <span className="input-span" /> N = Normal </label>
                                                                            <input className="form-control" type="text" disabled={strext} id='t_extother' value={txtvalue.t_extother} placeholder="" onChange={(even) => settxtvalue({ ...txtvalue, t_extother: even.target.value })} />

                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-md-4">
                                                                            <label> Heart </label><br />
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" onClick={(even) => ClickHeart(even)} />
                                                                                <span className="input-span" /> N = Normal </label>
                                                                            <input className="form-control" type="text" id='t_heartother' value={txtvalue.t_heartother} placeholder="" onChange={(even) => settxtvalue({ ...txtvalue, t_heartother: even.target.value })} />
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <label> Neuro </label><br />
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" onClick={(even) => ClickNeuro(even)} />
                                                                                <span className="input-span" /> N = Normal </label>
                                                                            <input className="form-control" type="text" id='t_neuroother' value={txtvalue.t_neuroother} placeholder="" onChange={(even) => settxtvalue({ ...txtvalue, t_neuroother: even.target.value })} />
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <label> Lung </label><br />
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" onClick={(even) => ClickLung(even)} />
                                                                                <span className="input-span" /> N = Normal </label>
                                                                            <input className="form-control" type="text" id='t_lungother' value={txtvalue.t_lungother} placeholder="" onChange={(even) => settxtvalue({ ...txtvalue, t_lungother: even.target.value })} />
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="col-md-4">
                                                                            <label> Skin </label><br />
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" onClick={(even) => ClickSkin(even)} />
                                                                                <span className="input-span" /> N = Normal </label>
                                                                            <input className="form-control" type="text" disabled={strSkin} placeholder="" onChange={(even) => settxtvalue({ ...txtvalue, t_skinother: even.target.value })} />
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <label> Abdomen </label><br />
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" onClick={(even) => ClickAbdomen(even)} />
                                                                                <span className="input-span" /> N = Normal </label>
                                                                            <input className="form-control" type="text" disabled={strAbdomen} placeholder="" onChange={(even) => settxtvalue({ ...txtvalue, t_abdomenother: even.target.value })} />
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <label> อื่นๆ </label><br />
                                                                            <label className="ui-checkbox ui-checkbox-inline">
                                                                                <input type="checkbox" onClick={(even) => ClickOther(even)} />
                                                                                <span className="input-span" /> N = Normal </label>
                                                                            <input className="form-control" type="text" disabled={strOther} placeholder="" onChange={(even) => settxtvalue({ ...txtvalue, t_othertext: even.target.value })} />
                                                                            <label>โรคเรื้อรังที่เป็น</label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row">
                                                                        <div className="form-group row">
                                                                            <div className="col-md-12">
                                                                                <label> รหัสผู้บันทึก </label><br />
                                                                                <div className='row'>
                                                                                    <div className="col-sm-6">
                                                                                        <input className="form-control" type="text" id='t_userid' value={txtvalue.t_userid} placeholder="Enter" onKeyDown={(even) => Chekuser(even)} onChange={(even) => settxtvalue({ ...txtvalue, t_userid: even.target.value })} />
                                                                                    </div>
                                                                                    <label className="col-sm-6 col-form-label">{txtvalue.t_username}</label>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </div>

                                                        </div>
                                                    </TabPanel>
                                                </Tabs>

                                            </div>

                                            <div className="ml-sm-auto" style={{ textAlign: 'center' }}>

                                                <button className="btn btn-info" type="button" style={{ cursor: 'pointer' }} onClick={() => Savedata()}> <i className="fa ti-save" style={{ fontSize: 18 }} /> บันทึกส่งซัก </button>&nbsp;
                                                <button className="btn btn-danger" type="button" style={{ cursor: 'pointer' }}> <i className="fa ti-trash" style={{ fontSize: 18 }} /> ยกเลิกใบนำส่ง </button>

                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                </Modal>
            </sesion>

            <>
                <Modal visible={modal2} width="70%" effect="fadeInUp" onClickAway={() => closeModal2()}>
                    <div className="Modelbody">
                        <div className="Modelheader">
                            <div className="ibox-tools" style={{ float: 'right', padding: 10 }}>
                                <a onClick={() => setModal2(false)}><i className="fa ti-close" /></a>
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className='row'>
                                <div className="col-md-12">
                                    <MDBDataTableV5
                                        hover entriesOptions={[5, 20, 25]}
                                        entries={5}
                                        pagesAmount={4}
                                        data={labdata}
                                        searchTop searchBottom={false}
                                    />
                                </div>

                            </div>
                        </div>

                    </div>
                </Modal>
            </>

        </div>
    )
}
