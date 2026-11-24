import React, { useEffect, useState } from 'react'
import {
    MDBDataTable, MDBDataTableV5, MDBBtn, MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBBadge,
} from 'mdbreact';
//import Modal from 'react-awesome-modal';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
} from '@coreui/react'
import API from '../../../Config/config'
import Select from 'react-select'
import Frmprint from './Frmstockprint'
import ReactToPrint from 'react-to-print'

export default function Frmstockward() {

    const [modal, setModal] = useState(false);
    const [openprint, setopenprint] = useState(false);
    const [myData, setmyData] = useState([]);
    const [dataprint, setdataprint] = useState([]);
    const [componentRef, setcomponentRef] = useState(true);
    const inputData = {
        t_id: '', t_fabricID: '', t_num: '', t_officeid: sessionStorage.getItem('sessOfficeid'),
        t_userid: sessionStorage.getItem('sessuserID'), t_file: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [listfabric, setlistfabric] = useState([]);

    useEffect(() => {

        Listfabric();
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

    async function Listfabric() {

        fetch(API.dataSource.code + "StockwardAPI.php?module=Showlistfabric")
            .then(response => {
                return response.json();
            })
            .then(data => {

                setlistfabric(data);

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Showdata() {

        fetch(API.dataSource.code + "StockwardAPI.php?module=Showdata&officeID=" + txtvalue.t_officeid)
            .then(res => res.json())
            .then(json => {
                //alert(json);
                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    Edit: (
                        <div style={{ textAlign: 'center' }}>
                            {/*<MDBBadge
                            className='w-100'
                            searchvalue={key}
                            key={key}
                            style={{ float: 'right' }}
                        >

                            <button title="แก้ไขรายการ" onClick={() => openModal(row.Stockid)}><i className="fa fa-edit" style={{ fontSize: 20, color: 'green' }} /></button>
                            <button title="ยกเลิกการ" onClick={() => Deletedata(row.Stockid)}><i className="fa fa-trash" style={{ fontSize: 20, color: 'red' }} /></button>

                        </MDBBadge>*/}

                            <a title="แก้ไขรายการ" onClick={() => openModal(row.Stockid)}><i className="fa fa-edit" style={{ fontSize: 20, color: 'green' }} /></a>&nbsp;
                            <a title="ยกเลิกการ" onClick={() => Deletedata(row.Stockid)}><i className="fa fa-trash" style={{ fontSize: 20, color: 'red' }} /></a>
                        </div>
                    ),
                    Imag: (
                        <>
                            {
                                row.FabricImages == "" ? (
                                    <span></span>
                                ) : (
                                    <img src={API.dataSource.code + "File/Fabric/" + row.FabricImages} width="40px" height="45px" />
                                )
                            }
                        </>
                    )

                }));

                Mydata = {
                    columns: [
                        {
                            label: 'รหัส',
                            field: 'FabricID',
                            sort: 'asc',
                            width: 20
                        },
                        {
                            label: 'รายการ',
                            field: 'FabricName',
                            sort: 'asc',
                            width: 500
                        },
                        {
                            label: 'จำนวนในคลัง',
                            field: 'Stocknum',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'รูปภาพ',
                            field: 'Imag',
                            sort: 'asc',
                            width: 50
                        },
                        {
                            label: 'Edit | Del',
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

        fetch(API.dataSource.code + "StockwardAPI.php?module=Showdataedit&idEdit=" + ID)
            .then(response => {
                return response.json();
            })
            .then(data => {

                settxtvalue({
                    ...txtvalue,
                    t_id: ID,
                    t_fabricID: data[0].FabricID,
                    t_num: data[0].Stocknum,
                    t_file: data[0].FabricImages
                })

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Showdataprint(){
        
        fetch(API.dataSource.code + "StockwardAPI.php?module=Showdata&officeID=" + txtvalue.t_officeid)
            .then(response => {
                return response.json();
            })
            .then(data => {

                setdataprint(data);

            })
            .catch(error => {
                console.log(error);
            });

            setopenprint(true);

    }

    async function Savedata() {

        if (txtvalue.t_fabricID == "") {
            alert("กรุณาเลือกรายารด้วยครับ !");
            return false;
        } else if (txtvalue.t_num == "") {
            alert("กรุณาใส่จำนวนด้วยครับ !");
            document.getElementById("t_num").focus();
            return false;
        } else {
            const method = "POST";
            const body = new FormData();
            body.append("tid", txtvalue.t_id);
            body.append("tfabricID", txtvalue.t_fabricID);
            body.append("tnum", txtvalue.t_num);
            body.append("tofficeid", txtvalue.t_officeid);
            body.append("tuserid", txtvalue.t_userid);
            fetch(API.dataSource.code + "StockwardAPI.php?module=Inputdata", { method, body })
                .then(res => res.json())
                .then(data => {

                    //alert(JSON.stringify(data, null, "\t"))

                    if (data == "0") {
                        alert("ระบบทำการบันทึกข้อมูลเรียบร้อยแล้วครับ");
                    } else if (data == "1") {
                        alert("มีชื่อหัวข้อนี้ในระบบแล้วครับ !");
                    } else if (data == "2") {
                        alert("ระบบทำการบันทึกแก้ไขข้อมูลเรียบร้อยแล้วครับ");
                    }

                    Showdata();
                    settxtvalue(inputData);
                    Listfabric();
                    //setModal(false);

                });
        }

    }

    async function Onchangselect(even) {

        fetch(API.dataSource.code + "StockwardAPI.php?module=Showimgfile&id=" + even.value)
            .then(response => {
                return response.json();
            })
            .then(data => {

                settxtvalue({
                    ...txtvalue, t_fabricID: data[0].FabricID, t_file: data[0].FabricImages
                })

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Deletedata(ID) {

        var conF = window.confirm("คุณต้องการยกเลิกรายการนี้ใช่หรือไม่ ?");
        if (conF == true) {

            fetch(API.dataSource.code + "StockwardAPI.php?module=Deletedata&idDel=" + ID)
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

    return (
        <div>
            <div className="page-heading">
                <h1 className="page-title"> รายการผ้า </h1>
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
                        <div className="ibox-title"> รายการผ้า </div>
                        <div>
                        <button className="btn btn-warning" style={{ cursor: 'pointer' }} onClick={() => Showdataprint()}> <i className="fa ti-printer" style={{ fontSize: 18 }} /> พิมพ์รายการผ้า </button>
                            &nbsp;
                            <button className="btn btn-info" style={{ cursor: 'pointer' }} onClick={() => openModal('0')}> <i className="fa ti-write" style={{ fontSize: 18 }} /> เพิ่มรายการใหม่ </button>
                        </div>
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
                {/*<Modal visible={modal} width="80%" effect="fadeInUp" onClickAway={() => setModal(false)}>
                    <div className="Modelbody">
                        <div className="Modelheader">

                        </div>

                        <div className="cssModelbody">

                            <div className="panel-body">


                                
                            </div>

                        </div>

                    </div>
                </Modal>*/}

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
                                        <div className="ibox-title"> <span> <i className="fa ti-server" style={{ fontSize: 20 }} /> ข้อมูลรายการผ้า </span> </div>
                                        <div className="ibox-tools">
                                            <a className="ibox-collapse" onClick={() => setModal(false)}><i className="ti-close" /></a>
                                        </div>
                                    </div>
                                    <div className="ibox-body">
                                        <form>

                                            <div className="form-group">
                                                <label> รายการผ้า </label>
                                                <Select
                                                    value={listfabric.find(obj => obj.value === txtvalue.t_fabricID)}
                                                    options={listfabric}
                                                    styles={customStyles}
                                                    onChange={even => Onchangselect(even)}
                                                />
                                                <span className="help-block"> รายการผ้าที่ใช้เบิก </span>
                                            </div>
                                            <div className="form-group">
                                                <label> จำนวนผ้า </label>
                                                <input className="form-control" type="text" id='t_num' placeholder="จำนวนทั้งหมด" value={txtvalue.t_num} onChange={(even) => settxtvalue({ ...txtvalue, t_num: even.target.value })} />
                                            </div>
                                            {
                                                txtvalue.t_file == "" ? (
                                                    <>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="form-group">
                                                            <label> รูปภาพ </label><br />
                                                            <img src={API.dataSource.code + "File/Fabric/" + txtvalue.t_file} width="40px" height="45px" />
                                                        </div>
                                                    </>
                                                )
                                            }

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

            <sesion>
                <CModal
                    title="พิมพ์"
                    color="primary"
                    show={openprint}
                    onClose={setopenprint}
                    size='lg'
                    aria-labelledby='example-modal-sizes-title-lg'
                >
                    <CModalHeader>
                        พิมพ์
                    </CModalHeader>
                    <CModalBody>
                        <Frmprint key={dataprint} row={dataprint} ref={(el) => (setcomponentRef(el))} />
                    </CModalBody>
                    <CModalFooter>
                        <ReactToPrint
                            trigger={() => <CButton style={{ backgroundColor: "green", color: "white", cursor: 'pointer' }}> พิมพ์ </CButton>}
                            content={() => componentRef}
                        />
                        <CButton style={{ backgroundColor: "red", color: "white", cursor: 'pointer' }} onClick={() => setopenprint(false)}> ยกเลิก </CButton>
                    </CModalFooter>
                </CModal>
            </sesion>
        </div>
    )
}

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        background: '#fff',
        borderColor: '#9e9e9e',
        minHeight: '35px',
        height: '35px',
        top: 0,
        boxShadow: state.isFocused ? null : null,
    }),
}
