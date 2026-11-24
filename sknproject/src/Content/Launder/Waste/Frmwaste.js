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
import API from '../../../Config/config'
import Select from 'react-select'



export default function Frmwaste() {

    const [modal, setModal] = useState(false);
    const [myData, setmyData] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_id: '', t_fabricid: '', t_cupboard: '', t_num: '', t_other: '',
        t_fabricid2: '', t_cupboard2: '', t_num2: '', t_numin: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [listfabric, setlistfabric] = useState([]);
    const [strOut, setstrOut] = useState(true);
    const [strIn, setstrIn] = useState(true);

    useEffect(() => {

        Listfabric();
        Showdata();

    }, []);

    async function openModal(ID, str) {

        settxtvalue(inputData);

        if(str == 'Edit'){
            setstrOut(false);
            setstrIn(true);
        }else{
            setstrOut(true);
            setstrIn(false);
        }

        if (ID != '0') {
            Showdataedit(ID);
        }
        setModal(true);
    }

    async function closeModal() {
        settxtvalue(inputData);

    }

    async function Listfabric() {

        fetch(API.dataSource.code + "WasteAPI.php?module=Showlistfabric")
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

        fetch(API.dataSource.code + "WasteAPI.php?module=Showdata&officeID=" + txtvalue.t_officeid)
            .then(res => res.json())
            .then(json => {
                //alert(json);
                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    Edit: (
                        <MDBBadge
                            className='w-0'
                            searchvalue={key}
                            key={key}
                            style={{ float: 'right' }}
                        >

                            <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(row.ID, 'Edit')}><i className="fa fa-pencil font-14" title='จัดการข้อมูลผ้า' /></button>
                            <button className="btn btn-default btn-xs" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Delete" onClick={() => openModal(row.ID, 'Add')}><i className="fa fa-plus-square" /></button>

                        </MDBBadge>
                    ),
                    Num: (
                        parseInt(row.Wastenum)-parseInt(row.Wastenumin)
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
                            label: 'จำนวน',
                            field: 'Num',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'วันที่',
                            field: 'Wastedate',
                            sort: 'asc',
                            width: 200
                        },
                        {
                            label: 'หมายเหตุ',
                            field: 'Other',
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

        fetch(API.dataSource.code + "WasteAPI.php?module=Showdataedit&id=" + ID)
            .then(response => {
                return response.json();
            })
            .then(data => {

                settxtvalue({
                    ...txtvalue,
                    t_id: ID, t_fabricid: data[0].FabricID, t_cupboard: data[0].FabricNum, t_num: (parseInt(data[0].Wastenum)-parseInt(data[0].Wastenumin)), t_other: data[0].Other,
                    t_fabricid2: data[0].FabricID, t_cupboard2: data[0].FabricNum, t_num2: data[0].Wastenum,
                })

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Onchangselect(even) {

        fetch(API.dataSource.code + "WasteAPI.php?module=Showstock&id=" + even.value)
            .then(response => {
                return response.json();
            })
            .then(data => {

                settxtvalue({ ...txtvalue, t_fabricid: even.value, t_fabricname: even.label, t_cupboard: data[0].FabricNum })

            })
            .catch(error => {
                console.log(error);
            });

    }

    async function Savedata() {

        if (txtvalue.t_fabricid == "") {
            alert("กรุณาเลือกรายการด้วยครับ !");
            return false;
        } else if (txtvalue.t_num == "") {
            alert("กรุณาใส่จำนวนผ้าด้วยครับ");
            return false;
        } else {

            const method = "POST";
            const body = new FormData();
            body.append("tid", txtvalue.t_id);
            body.append("tfabricid", txtvalue.t_fabricid);
            body.append("tcupboard", txtvalue.t_cupboard);
            body.append("tnum", txtvalue.t_num);
            body.append("tother", txtvalue.t_other);
            body.append("tfabricid2", txtvalue.t_fabricid2);
            body.append("tcupboard2", txtvalue.t_cupboard2);
            body.append("tnum2", txtvalue.t_num2);
            body.append("tnumin", txtvalue.t_numin);
            fetch(API.dataSource.code + "WasteAPI.php?module=Inputdata", { method, body })
                .then(res => res.json())
                .then(data => {

                    //alert(JSON.stringify(data, null, "\t"))

                    alert("ระบบได้ทำการบันทึกใบขอเบิกเรียบร้อยแล้วครับ");

                    Showdata();
                    settxtvalue(inputData);
                    setModal(false);

                });

        }
    }

    async function Adddata(ID) {

        var conF = window.confirm("คุณต้องการรับเข้าข้อมูลรายการนี้ใช่หรือไม่ ?");
        if (conF == true) {

            fetch(API.dataSource.code + "WasteAPI.php?module=Adddata&id=" + ID)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    
                    Showdata();
                    settxtvalue(inputData)
                    alert("ระบบได้ทำการนำเข้าข้อมูลเรียบร้อยแล้วครับ !");

                })
                .catch(error => {
                    console.log(error);
                });

        }

    }

    async function onchangenumin(even){

        if(even.target.value > txtvalue.t_num){
            alert("คุณใส่ข้อมูลไม่ถูกต้อง !")
            settxtvalue({...txtvalue, t_numin: ''})
            return false;
        }else{
            settxtvalue({ ...txtvalue, t_numin: even.target.value })
        }        

    }


    return (
        <div>
            <div className="page-heading">
                <h1 className="page-title"> รายการผ้าชำรุด </h1>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="index.html"><i className="la la-home font-20" /></a>
                    </li>
                    <li className="breadcrumb-item"> Waste From </li>
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
                                                <div className="ibox-title"> <span> <i className="fa ti-server" style={{ fontSize: 20 }} /> ข้อมูลรายการผ้า </span> </div>
                                                <div className="ibox-tools">
                                                    <a onClick={() => setModal(false)}><i className="fa ti-close" /></a>
                                                </div>
                                            </div>
                                            <div className='row'>

                                                <div className="col-md-12">
                                                    <div className="ibox">
                                                        <div className="ibox-head">
                                                            <div className="ibox-title"> ลงข้อมูลผ้าชำรุด </div>
                                                            <div className="ibox-tools">

                                                            </div>
                                                        </div>
                                                        <div className="ibox-body">
                                                            <form>
                                                                <div className="form-group">
                                                                    <label> รายการผ้า </label>
                                                                    <Select
                                                                        value={listfabric.find(obj => obj.value === txtvalue.t_fabricid)}
                                                                        options={listfabric}
                                                                        onChange={even => Onchangselect(even)}
                                                                    />
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-sm-6 form-group">
                                                                        <label> คงเหลือในตู้ </label>
                                                                        <input className="form-control" type="text" readOnly="true" placeholder="คงเหลือในตู้" value={txtvalue.t_cupboard} onChange={(even) => settxtvalue({ ...txtvalue, t_cupboard: even.target.value })} />
                                                                    </div>
                                                                    <div className="col-sm-3 form-group">
                                                                        <label> จำนวนผ้าชำรุด/ชิ่น </label>
                                                                        <input className="form-control" type="text" placeholder="จำนวน/ชิ่น" value={txtvalue.t_num} onChange={(even) => settxtvalue({ ...txtvalue, t_num: even.target.value })} disabled={strOut} />
                                                                    </div>
                                                                    <div className="col-sm-3 form-group">
                                                                        <label> จำนวนรับเข้า/ชิ่น </label>
                                                                        <input className="form-control" type="text" placeholder="จำนวน/ชิ่น" value={txtvalue.t_numin} onChange={(even) => onchangenumin(even)} disabled={strIn} />
                                                                    </div>
                                                                </div>

                                                                <div className="form-group">
                                                                    <label> หมายเหตุ </label>
                                                                    <input className="form-control" type="text" placeholder="หมายเหตุ" onChange={(even) => settxtvalue({ ...txtvalue, t_other: even.target.value })} />
                                                                </div>

                                                                <div className="form-group">
                                                                    <button className="btn btn-default" type="button" style={{ cursor: 'pointer' }} onClick={() => Savedata()}> <i className="fa fa-floppy-o" style={{ fontSize: 18 }} /> เพิ่มรายการ </button>
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
    )
}
