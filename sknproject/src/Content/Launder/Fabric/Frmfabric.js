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
} from '@coreui/react'
import API from '../../../Config/config'
import { AlternateEmail } from '@material-ui/icons';

export default function Frmfabric() {

    const [modal, setModal] = useState(false);
    const [myData, setmyData] = useState([]);
    const inputData = {
        t_id: '', t_name: '', t_file: '', t_num: ''
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
        }

        setModal(true);
    }

    async function Showdata() {

        fetch(API.dataSource.url + "Fabric")
            .then(res => res.json())
            .then(json => {
                //alert(json);
                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    Edit: (
                        <MDBBadge
                            className='w-100'
                            searchvalue={key}
                            key={key}
                            style={{ float: 'right' }}
                        >

                            <button title="แก้ไขรายการ" onClick={() => openModal(row.FabricID)}><i className="fa fa-edit" style={{ fontSize: 20, color: 'green' }} /></button>
                            <button title="ยกเลิกการ" onClick={() => Deletedata(row.FabricID)}><i className="fa fa-trash" style={{ fontSize: 20, color: 'red' }} /></button>

                        </MDBBadge>
                    ),
                    Imag: (
                        <>
                            {
                                (row.fabricImages || row.FabricImages) == "" || (row.fabricImages || row.FabricImages) == null ? (
                                    <span></span>
                                ) : (
                                    <img src={API.dataSource.url.replace('/api/', '') + "/StaticFiles/Fabric/" + (row.fabricImages || row.FabricImages)} width="40px" height="45px" alt="ผ้า" />
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
                            field: 'FabricNum',
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
                            label: '',
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
        fetch(API.dataSource.url + "Fabric/" + ID)
            .then(response => response.json())
            .then(data => {
                const item = Array.isArray(data) ? data[0] : data; 
                settxtvalue({
                    ...txtvalue,
                    t_id: item.fabricID || item.FabricID,
                    t_name: item.fabricName || item.FabricName,
                    t_num: item.fabricNum || item.FabricNum,
                    t_file: item.fabricImages || item.FabricImages
                })
            })
            .catch(error => {
                console.log(error);
            });
    }

    async function Savedata() {
        if (txtvalue.t_name == "") {
            alert("กรุณาใส่ชื่อรายการผ้าด้วยครับ !");
            document.getElementById("t_name").focus();
            return false;
        } else {
            const method = "POST";
            const body = new FormData();
            body.append("tid", txtvalue.t_id || "0"); 
            body.append("tname", txtvalue.t_name);
            body.append("tnum", txtvalue.t_num);
            body.append("tfile", txtvalue.t_file);
            
            fetch(API.dataSource.url + "Fabric", { method, body })
                .then(res => res.json())
                .then(data => {
                    if (data == "0") {
                        alert("ระบบทำการบันทึกข้อมูลเรียบร้อยแล้วครับ");
                    } else if (data == "1") {
                        alert("มีชื่อหัวข้อนี้ในระบบแล้วครับ !");
                    } else if (data == "2") {
                        alert("ระบบทำการบันทึกแก้ไขข้อมูลเรียบร้อยแล้วครับ");
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
            const method = "DELETE"; 
            fetch(API.dataSource.url + "Fabric/" + ID, { method })
                .then(response => response.json())
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
                                            <a className="ibox-collapse"><i className="fa fa-minus" /></a>
                                            <a className="fullscreen-link"><i className="fa fa-expand" /></a>
                                        </div>
                                    </div>
                                    <div className="ibox-body">
                                        <form>

                                            <div className="form-group">
                                                <label> รายการผ้า </label>
                                                <input className="form-control" type="text" placeholder="ชื่อรายการผ้า" value={txtvalue.t_name} onChange={(even) => settxtvalue({ ...txtvalue, t_name: even.target.value })} />
                                                <span className="help-block"> รายการผ้าที่ใช้เบิก </span>
                                            </div>
                                            <div className="form-group">
                                                <label> จำนวนผ้า </label>
                                                <input className="form-control" type="text" placeholder="จำนวนทั้งหมด" value={txtvalue.t_num} onChange={(even) => settxtvalue({ ...txtvalue, t_num: even.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label> รูปภาพ </label>
                                                <input className="form-control" type="file" placeholder="รูปภาพ" onChange={(even) => settxtvalue({ ...txtvalue, t_file: even.target.files[0] })} />
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
