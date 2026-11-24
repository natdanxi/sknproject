import React, { useEffect, useState, useRef } from 'react'
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
const delay = 1;

export default function Frmwithdraw() {

    const [modal, setModal] = useState(false);
    const [myData, setmyData] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_officestr: sessionStorage.getItem('sessOfficestr'), t_fabricid: '', t_fabricname: '', t_cupboard: '',
        t_bed: '', t_borrow: '', t_patientnum: '', t_other: '', t_orderID: '', t_orderstr: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [listfabric, setlistfabric] = useState([]);
    const [listOrder, setlistOrder] = useState([]);
    const [timeCheck, settimeCheck] = useState('');

    const [chkTime, setchkTime] = useState(Date().substr(16, 8).replaceAll(":", ""));
    const timer = useRef(null);


    useEffect(() => {

        Checktime();
        Listfabric();
        Showdata();
        StartClock24();

        timer.current = setInterval(() => StartClock24(), delay * 1000);


    }, []);

    async function openModal(ID, str) {


        Checktime();
        setlistOrder([]);

        if (ID != "0") {
            if (str == '0') {
                Showdataedit(ID);
                setModal(true);
            } else {
                alert("ไม่สามารถทำรายการดังกล่าวได้ครับเนื่องจากมีการรับเข้าระบบเรียบร้อยแล้ว ! \n กรุณาทำการติดต่องานซักฟอกโรงพยาบาลสกลนคร Tel. 2701");
                return false;
            }
        } else {

            if (timeCheck == '1') {
                alert("ขอโทษด้วยเนื่องจากไม่ได้อยู่ในช่วงเวลากำหนดให้เบิกผ้าได้ !");
                return false;
            } else {
                settxtvalue(inputData);
                Checkordernumber('0');
                setModal(true);
            }

        }

        //setopenmodal(true);
    }

    async function closeModal() {
        settxtvalue(inputData);
        setlistOrder([]);
        document.getElementById("t_str1").checked = false;
        document.getElementById("t_str2").checked = false;
    }

    function showFilled(Value) {
        return (Value > 9) ? "" + Value : "0" + Value;
    }

    function StartClock24() {
        const TheTime = new Date;
        document.getElementById("showTime").value = showFilled(TheTime.getHours()) + ":" +
            showFilled(TheTime.getMinutes()) + ":" + showFilled(TheTime.getSeconds());
        setchkTime(showFilled(TheTime.getHours()) + showFilled(TheTime.getMinutes()) + showFilled(TheTime.getSeconds()));
        //setTimeout(StartClock24() ,1000)
    }

    const toFormData = (obj) => {
        const formData = new FormData();
        Object.entries(obj).forEach(([key, value]) => {
            formData.append(key, value ?? "");
        });
        return formData;
    };

    async function Listfabric() {
        try {
            const res = await fetch(`${API.dataSource.url}Withdraw/Showlistfabric?officeID=${txtvalue.t_officeid}`);
            if (!res.ok) throw new Error(`โหลดรายการผ้าไม่สำเร็จ (${res.status})`);
            const data = await res.json();
            setlistfabric(data);
        } catch (error) {
            console.error("[Listfabric Error]:", error);
        }
    }
    async function Onchangselect(even) {
        try {
            const res = await fetch(`${API.dataSource.url}Withdraw/Showstock/${even.value}?officeID=${txtvalue.t_officeid}`);
            if (!res.ok) throw new Error(`โหลดสต็อกไม่สำเร็จ (${res.status})`);
            const data = await res.json();
            const item = Array.isArray(data) ? data[0] : data;

            settxtvalue({
                ...txtvalue,
                t_fabricid: even.value,
                t_fabricname: even.label,
                t_cupboard: item ? (item.stocknum ?? item.Stocknum ?? "") : ""
            });
        } catch (error) {
            console.error("[Onchangselect Error]:", error);
        }
    }

    //เช็ครายการเบิก
    async function Checkordernumber(str) {
        try {
            const res = await fetch(`${API.dataSource.url}Withdraw/Checkordernumber?officeID=${txtvalue.t_officeid}`);
            if (!res.ok) throw new Error(`ตรวจสอบเลขที่ใบเบิกไม่สำเร็จ (${res.status})`);
            const data = await res.json();

            if (!data || data === "" || data.length === 0) {
                if (str !== "0") {
                    Createnumber();
                }
            } else {
                const item = Array.isArray(data) ? data[0] : data;
                const countID = item.countID ?? item.CountID;
                const orderId = item.orderid || item.Orderid;
                const orderStatus = item.orderstatus ?? item.Orderstatus;

                if (countID == "0" || countID === 0) {
                    settxtvalue({ ...txtvalue, t_orderID: orderId });
                } else if (countID > "0" && orderStatus == "0") {
                }
            }
        } catch (error) {
            console.error("[Checkordernumber Error]:", error);
        }
    }

    //เสร้างเลขที่ใบเบิก
    async function Createnumber() {
        try {
            const res = await fetch(
                `${API.dataSource.url}Withdraw/Createnumber?officeID=${txtvalue.t_officeid}&userID=${txtvalue.t_userid}`,
                { method: "POST" }
            );
            if (!res.ok) throw new Error(`สร้างเลขที่ใบเบิกไม่สำเร็จ (${res.status})`);
            const data = await res.text();
            settxtvalue({ ...txtvalue, t_orderID: data.replace(/['"]+/g, '') });
        } catch (error) {
            console.error("[Createnumber Error]:", error);
        }
    }

    async function Showdata() {
        try {
            const res = await fetch(`${API.dataSource.url}Withdraw?officeID=${txtvalue.t_officeid}`);
            if (!res.ok) throw new Error(`โหลดข้อมูลไม่สำเร็จ (${res.status})`);
            const json = await res.json();

            const rows = json.map((row, key) => {
                const orderId = row.orderid || row.Orderid;
                const orderStatus = row.orderstatus ?? row.Orderstatus;
                const orderSeason = row.orderseason ?? row.Orderseason;

                return {
                    ...row,
                    Orderid: orderId,
                    Orderdate: row.orderdate || row.Orderdate,
                    Ordertime: row.ordertime || row.Ordertime,
                    fullname: row.fullname || row.Fullname,
                    Edit: (
                        <MDBBadge
                            className='w-0'
                            searchvalue={key}
                            key={key}
                            style={{ float: 'right' }}
                        >
                            <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(orderId, orderStatus)}><i className="fa fa-pencil font-14" /></button>
                            <button className="btn btn-default btn-xs" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Delete" onClick={() => Deletedata(orderId, orderStatus)}><i className="fa fa-trash font-14" /></button>
                        </MDBBadge>
                    ),
                    status: (
                        <>
                            {
                                orderStatus == "0" ? (
                                    <span style={{ backgroundColor: '#CC9900', color: '#FFFFFF', fontSize: 10, padding: 4, borderRadius: 2 }}>รอยืนยันรับเข้า</span>
                                ) : orderStatus == "1" ? (
                                    <span style={{ backgroundColor: '#009900', color: '#FFFFFF', fontSize: 10, padding: 4, borderRadius: 2 }}>รับเข้าแล้ว</span>
                                ) : orderStatus == "2" ? (
                                    <span style={{ backgroundColor: '#CC0000', color: '#FFFFFF', fontSize: 10, padding: 4, borderRadius: 2 }}>ค้างจ่าย</span>
                                ) : (
                                    <span style={{ backgroundColor: '#666666', color: '#FFFFFF', fontSize: 10, padding: 4, borderRadius: 2 }}>จ่ายครบแล้ว</span>
                                )
                            }
                        </>
                    ),
                    typestr: (
                        <>
                            {
                                orderSeason == "1" ? (
                                    <span style={{ color: '#23B7E5' }}>เช้า</span>
                                ) : (
                                    <span style={{ color: '#23B7E5' }}>บ่าย</span>
                                )
                            }
                        </>
                    )
                };
            });

            setmyData({
                columns: [
                    { label: 'เลขที่ใบเบิก', field: 'Orderid', sort: 'asc', width: 20 },
                    { label: 'วันที่เบิก', field: 'Orderdate', sort: 'asc', width: 500 },
                    { label: 'เวลา', field: 'Ordertime', sort: 'asc', width: 200 },
                    { label: 'เจ้าหน้าที่', field: 'fullname', sort: 'asc', width: 50 },
                    { label: 'ช่วงเวลา', field: 'typestr', sort: 'asc', width: 50 },
                    { label: 'สถานะ', field: 'status', sort: 'asc', width: 50 },
                    { label: '', field: 'Edit', sort: 'asc', width: 20 }
                ],
                rows
            });
        } catch (error) {
            console.error("[Showdata Error]:", error);
        }
    }
    async function Showdataedit(ID) {
        setlistOrder([]);
        try {
            const res = await fetch(`${API.dataSource.url}Withdraw/Edit/${ID}`);
            if (!res.ok) throw new Error(`โหลดข้อมูลแก้ไขไม่สำเร็จ (${res.status})`);
            const data = await res.json();
            if (!data || data.length === 0) return;

            const orderId = data[0].orderid || data[0].Orderid;
            const orderSeason = data[0].orderseason ?? data[0].Orderseason;

            settxtvalue({
                ...txtvalue,
                t_id: ID,
                t_orderID: orderId,
                t_orderstr: orderSeason
            });

            if (orderSeason == "1") {
                document.getElementById("t_str1").checked = true;
            } else {
                document.getElementById("t_str2").checked = true;
            }

            const newOrders = data.map((item, index) => ({
                ID: index,
                itemfabricid: item.fabricID || item.FabricID,
                itemfabricname: item.fabricName || item.FabricName,
                itemcupboard: item.cupboard ?? item.Cupboard,
                itembed: item.bed ?? item.Bed,
                itemborrow: item.borrow ?? item.Borrow,
                itempatientum: item.patientnum ?? item.Patientnum,
                itemother: item.other || item.Other,
            }));

            setlistOrder(newOrders);
        } catch (error) {
            console.error("[Showdataedit Error]:", error);
        }
    }

    async function Savedata() {
        if (timeCheck == '1') {
            alert("ขอโทษด้วยเนื่องจากไม่ได้อยู่ในช่วงเวลากำหนดให้เบิกผ้าได้ !");
            return false;
        } else if (!listOrder?.length) {
            alert("กรุณาทำการเพิ่มรายการผ้าด้วยครับ !");
            return false;
        } else if (txtvalue.t_orderstr == '') {
            alert("กรุณาเลือกช่วงเวลาขอเบิกผ้าด้วยครับ !");
            return false;
        }

        try {
            const headerPayload = toFormData({
                tid: txtvalue.t_id || "0",
                torderid: txtvalue.t_orderID,
                torderstatus: txtvalue.t_orderstr,
                tofficeid: txtvalue.t_officeid,
                tuserid: txtvalue.t_userid,
            });

            const headerRes = await fetch(`${API.dataSource.url}Withdraw`, {
                method: "POST",
                body: headerPayload,
            });

            if (!headerRes.ok) throw new Error(`บันทึกข้อมูลหลักไม่สำเร็จ (${headerRes.status})`);

            const headerData = await headerRes.json();
            const orderId = headerData && headerData !== "0" ? headerData : txtvalue.t_orderID;

            await Promise.all(
                listOrder.map(async (item) => {
                    const detailPayload = toFormData({
                        torderid: orderId,
                        tfabricID: item.itemfabricid,
                        tcupboard: item.itemcupboard || "0",
                        tbed: item.itembed || "0",
                        tborrow: item.itemborrow || "0",
                        tpatientnum: item.itempatientum || "0",
                        tother: item.itemother,
                    });

                    const detailRes = await fetch(`${API.dataSource.url}Withdraw/Detail`, {
                        method: "POST",
                        body: detailPayload,
                    });

                    if (!detailRes.ok) throw new Error(`บันทึกรายการผ้า ${item.itemfabricid} ไม่สำเร็จ`);
                    return detailRes.json();
                })
            );

            alert("ระบบได้ทำการบันทึกใบขอเบิกเรียบร้อยแล้วครับ");
            Showdata();
            settxtvalue(inputData);
            setlistOrder([]);
            setModal(false);
        } catch (error) {
            console.error("[Savedata Error]:", error);
            alert(`เกิดข้อผิดพลาดในการบันทึก: ${error.message}`);
        }
    }

    async function Deletedata(ID, str = '0') {
        if (str != '0') {
            alert("ไม่สามารถทำรายการดังกล่าวได้ครับเนื่องจากมีการรับเข้าระบบเรียบร้อยแล้ว ! \n กรุณาทำการติดต่องานซักฟอกโรงพยาบาลสกลนคร Tel. 2701");
            return false;
        }

        if (!window.confirm("คุณต้องการยกเลิกรายการนี้ใช่หรือไม่ ?")) return;

        if (!ID) {
            alert("ไม่พบรายการที่คุณต้องการยกเลิกใบเบิก !");
            return false;
        }

        try {
            const res = await fetch(
                `${API.dataSource.url}Withdraw/${ID}?tuserid=${txtvalue.t_userid}`,
                { method: "DELETE" }
            );
            if (!res.ok) throw new Error(`ยกเลิกรายการไม่สำเร็จ (${res.status})`);

            await res.json();
            Showdata();
            setModal(false);
        } catch (error) {
            console.error("[Deletedata Error]:", error);
            alert(`เกิดข้อผิดพลาดในการยกเลิก: ${error.message}`);
        }
    }

    async function Addlistorder() {
        if (txtvalue.t_orderID == "") {
            alert("กรุณาทำการสร้างเลขที่ใบเบิกด้วยครับ !");
            return false;
        } else if (Checkaddlistorder(txtvalue.t_fabricid) == '1') {
            alert("รายการนี้มีการเลือกไปแล้วครับ !")
            return false;
        } else {

            setlistOrder(prevItems => [...prevItems,
            {
                ID: prevItems.length,
                itemfabricid: txtvalue.t_fabricid,
                itemfabricname: txtvalue.t_fabricname,
                itemcupboard: txtvalue.t_cupboard,
                itembed: txtvalue.t_bed,
                itemborrow: txtvalue.t_borrow,
                itempatientum: txtvalue.t_patientnum,
                itemother: txtvalue.t_other,
            }]);

        }
    }

    function Checkaddlistorder(fabricid) {

        var result = '';
        for (var i = 0; i < listOrder.length; i++) {

            if (fabricid == listOrder[i].itemfabricid) {
                result = '1'
            }

        }

        return result;

    }

    async function Removeorder(val) {
        const people = [...listOrder]
        const newList = people.filter((item) => item.itemfabricid !== val);
        setlistOrder(newList);
    }

    async function Checktime() {
        //const dateNow = new Date();
        //const replateDate = dateNow.toLocaleTimeString().replace(/:/g, "");

        if (chkTime >= "060000" && chkTime <= "100000") {
            settimeCheck('0');
        } else if (chkTime >= "123000" && chkTime <= "140000") {
            settimeCheck('0');
        } else if (txtvalue.t_officestr == "2" && chkTime >= "160000" && chkTime <= "180000") {
            settimeCheck('0');
        } else {
            settimeCheck('1');
        }


        //settimeCheck(replateDate.replace(/:/g, ""));
    }

    async function Checknumber(even, tname) {

        if (isNaN(even.target.value) == true) {
            alert("กรุณาใส่จำนวนเป็นตัวเลขด้วยครับ !");
            document.getElementById(tname).value = "";
            return false;
        } else {
            if (tname == 't_bed') {
                settxtvalue({ ...txtvalue, t_bed: even.target.value });
            } else if (tname == 't_borrow') {
                settxtvalue({ ...txtvalue, t_borrow: even.target.value });
            } else if (tname == 't_patientnum') {
                settxtvalue({ ...txtvalue, t_patientnum: even.target.value });
            } else if (tname == 't_patientnum') {
                settxtvalue({ ...txtvalue, t_bed: even.target.value });
            }

        }

    }


    return (
        <div>
            <div className="page-heading">
                <h1 className="page-title"> รายการเบิกผ้า </h1>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="#"><i className="la la-home font-20" /></a>
                    </li>
                    <li className="breadcrumb-item"> Withdraw From [<input type="text" name="showTime" id="showTime" size={8} className="input" style={{ fontFamily: 'Verdana', fontSize: 8, borderStyle: 'none', width: 52 }} />]</li>
                </ol>
            </div>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <div className="ibox-head">
                        <div className="ibox-title"> รายการเบิก</div>
                        <div> <button className="btn btn-info" style={{ cursor: 'pointer' }} onClick={() => openModal('0')}> <i className="fa ti-write" style={{ fontSize: 18 }} /> ขอเบิกผ้า </button> </div>
                    </div>
                    <div className="ibox-body">
                        <MDBDataTable
                            striped
                            bordered
                            hover
                            data={myData}
                        />
                    </div>

                    <di style={{ color: 'red', fontSize: 12 }}>
                        <div>** หมายเหตุ</div>
                        <div>&nbsp;&nbsp;&nbsp; 1. เวลาเบิกผ้าช่วงเช้า เวลา 06.00น. - 10.00น.</div>
                        <div>&nbsp;&nbsp;&nbsp; 2. เวลาเบิกผ้าช่วงบ่าย เวลา 12.30น. - 14.00น.</div>
                        <div>&nbsp;&nbsp;&nbsp; 3. เวลาเบิกผ้าช่วงเวลาพิเศษ(BD) เวลา 16.00น. - 18.00น.</div>
                        <div>&nbsp;&nbsp;&nbsp; BD = หน่วยงานที่ซักฟอกกำหนดให้เบิกช่วงเวลาพิเศษได้ </div>
                    </di>

                </div>

            </div>

            <sesion>
                {/* onClickAway */}
                <Modal visible={modal} width="90%" effect="fadeInUp" onClick={() => closeModal()}>
                    <div className="Modelbody">
                        <div className="Modelheader">

                        </div>

                        <div className="cssModelbody" style={{ overflow: 'scroll', height: '90vh' }}>

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
                                            <div>

                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <div className="ibox">
                                                            <div className="ibox-head">
                                                                <div className="ibox-title"> ข้อมูลเบิกผ้า </div>
                                                                <div className="ibox-tools">
                                                                    <button className="btn btn-success" type="button" style={{ cursor: 'pointer' }} onClick={() => Checkordernumber('1')}> <i className="fa ti-pencil-alt" style={{ fontSize: 18 }} /> สร้างเลขที่ใบเบิก </button>
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
                                                                        <div className="col-sm-6 form-group">
                                                                            <label> คงเหลือในเตียง </label>
                                                                            <input className="form-control" type="text" placeholder="คงเหลือในเตียง" id="t_bed" value={txtvalue.t_bed} onChange={(even) => Checknumber(even, 't_bed')} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-sm-6 form-group">
                                                                            <label> จำนวนยืมผ้า </label>
                                                                            <input className="form-control" type="text" placeholder="จำนวนยืมผ้า" id="t_borrow" value={txtvalue.t_borrow} onChange={(even) => Checknumber(even, 't_borrow')} />
                                                                        </div>
                                                                        <div className="col-sm-6 form-group">
                                                                            <label> จำนวนผู้ป่วย </label>
                                                                            <input className="form-control" type="text" placeholder="จำนวนผู้ป่วย" id="t_patientnum" value={txtvalue.t_patientnum} onChange={(even) => Checknumber(even, 't_patientnum')} />
                                                                        </div>
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <label> หมายเหตุ </label>
                                                                        <input className="form-control" type="text" placeholder="หมายเหตุ" onChange={(even) => settxtvalue({ ...txtvalue, t_other: even.target.value })} />
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <button className="btn btn-default" type="button" style={{ cursor: 'pointer' }} onClick={() => Addlistorder()}> <i className="fa ti-plus" style={{ fontSize: 18 }} /> เพิ่มรายการเบิก </button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-7">
                                                        <div className="ibox">
                                                            <div className="ibox-head">
                                                                <div className="ibox-title"> รายการเบิกผ้า <span>[ {txtvalue.t_orderID} ]</span></div>
                                                                <div className="ibox-tools">
                                                                    <span>จำนวนทั้งหมด {listOrder.length} รายการ</span>
                                                                </div>
                                                            </div>
                                                            <div className="ibox-body">
                                                                <table className="table table-striped">
                                                                    <thead>
                                                                        <tr>
                                                                            <th> # </th>
                                                                            <th> รายการผ้า </th>
                                                                            <th> คงเหลือในตู้ </th>
                                                                            <th> คงเหลือในเตียง </th>
                                                                            <th> จำนวนยืมผ้า </th>
                                                                            <th> จำนวนผู้ป่วย </th>
                                                                            <th> หมายเหตุ </th>
                                                                            <th> ลบ </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            listOrder.map((item, row) =>

                                                                                <tr>
                                                                                    <td className="py-1">{row + 1}</td>
                                                                                    <td> {item.itemfabricname} </td>
                                                                                    <td> {item.itemcupboard} </td>
                                                                                    <td> {item.itembed} </td>
                                                                                    <td> {item.itemborrow} </td>
                                                                                    <td> {item.itempatientum} </td>
                                                                                    <td> {item.itemother} </td>
                                                                                    <td>
                                                                                        <button type="button" className="btn btn-outline-danger btn-icon-text" onClick={() => Removeorder(item.itemfabricid)}>
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

                                                            <div style={{ padding: 25 }}>
                                                                <label className="ui-radio ui-radio-primary">
                                                                    <input type="radio" id="t_str1" name="t_str" onClick={(even) => settxtvalue({ ...txtvalue, t_orderstr: '1' })} />
                                                                    <span className="input-span" /> เช้า </label> &nbsp;&nbsp;
                                                                <label className="ui-radio ui-radio-warning">
                                                                    <input type="radio" id="t_str2" name="t_str" onClick={(even) => settxtvalue({ ...txtvalue, t_orderstr: '2' })} />
                                                                    <span className="input-span" /> บ่าย </label>
                                                            </div>

                                                        </div>

                                                        <di style={{ color: 'red', fontSize: 12 }}>
                                                            <div>** หมายเหตุ</div>
                                                            <div>&nbsp;&nbsp;&nbsp; 1. เวลาเบิกผ้าช่วงเช้า เวลา 06.00น. - 10.00น.</div>
                                                            <div>&nbsp;&nbsp;&nbsp; 2. เวลาเบิกผ้าช่วงบ่าย เวลา 12.30น. - 14.00น.</div>
                                                            <div>&nbsp;&nbsp;&nbsp; 3. เวลาเบิกผ้าช่วงเวลาพิเศษ(BD) เวลา 16.00น. - 18.00น.</div>
                                                            <div>&nbsp;&nbsp;&nbsp; BD = หน่วยงานที่ซักฟอกกำหนดให้เบิกช่วงเวลาพิเศษได้ </div>
                                                        </di>

                                                    </div>

                                                </div>

                                                <div className="ml-sm-auto" style={{ textAlign: 'center' }}>

                                                    <button className="btn btn-info" type="button" style={{ cursor: 'pointer' }} onClick={() => Savedata()}> <i className="fa ti-save" style={{ fontSize: 18 }} /> บันทึกส่งเบิก </button>&nbsp;
                                                    <button className="btn btn-danger" type="button" style={{ cursor: 'pointer' }} onClick={() => Deletedata(txtvalue.t_orderID)}> <i className="fa ti-trash" style={{ fontSize: 18 }} /> ยกเลิกใบเบิก </button>

                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>
                </Modal>


                {/*<CModal
                    title="แจ้งเตือน"
                    color="primary"
                    show={openmodal}
                    onClose={setopenmodal}
                    size='lg'
                >
                    <CModalBody>
                        <div className="panel-body">
                            <div className='row'>
                                <div className="col-md-12">
                                    <div className="ibox">
                                        <div className="ibox-head">
                                            <div className="ibox-title"> <span> <i className="fa ti-server" style={{ fontSize: 20 }} /> ข้อมูลรายการผ้า </span> </div>
                                            <div className="ibox-tools">
                                                <a onClick={() => closeModal()}><i className="fa ti-close" /></a>
                                            </div>
                                        </div>
                                        <div className="ibox-body">
                                            <div style={{ overflow: 'scroll' }}>

                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <div className="ibox">
                                                            <div className="ibox-head">
                                                                <div className="ibox-title"> ข้อมูลเบิกผ้า </div>
                                                                <div className="ibox-tools">
                                                                    <button className="btn btn-success" type="button" style={{ cursor: 'pointer' }} onClick={() => Checkordernumber('1')}> <i className="fa ti-pencil-alt" style={{ fontSize: 18 }} /> สร้างเลขที่ใบเบิก </button>
                                                                    
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
                                                                        <div className="col-sm-6 form-group">
                                                                            <label> คงเหลือในเตียง </label>
                                                                            <input className="form-control" type="text" placeholder="คงเหลือในเตียง" onChange={(even) => settxtvalue({ ...txtvalue, t_bed: even.target.value })} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-sm-6 form-group">
                                                                            <label> จำนวนยืมผ้า </label>
                                                                            <input className="form-control" type="text" placeholder="จำนวนยืมผ้า" onChange={(even) => settxtvalue({ ...txtvalue, t_borrow: even.target.value })} />
                                                                        </div>
                                                                        <div className="col-sm-6 form-group">
                                                                            <label> จำนวนผู้ป่วย </label>
                                                                            <input className="form-control" type="text" placeholder="จำนวนผู้ป่วย" onChange={(even) => settxtvalue({ ...txtvalue, t_patientnum: even.target.value })} />
                                                                        </div>
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <label> หมายเหตุ </label>
                                                                        <input className="form-control" type="text" placeholder="หมายเหตุ" onChange={(even) => settxtvalue({ ...txtvalue, t_other: even.target.value })} />
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <button className="btn btn-default" type="button" style={{ cursor: 'pointer' }} onClick={() => Addlistorder()}> <i className="fa ti-plus" style={{ fontSize: 18 }} /> เพิ่มรายการเบิก </button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-7">
                                                        <div className="ibox">
                                                            <div className="ibox-head">
                                                                <div className="ibox-title"> รายการเบิกผ้า <span>[ {txtvalue.t_orderID} ]</span></div>
                                                                <div className="ibox-tools">
                                                                    <button className="btn btn-info" type="button" style={{ cursor: 'pointer' }} onClick={() => Savedata()}> <i className="fa ti-save" style={{ fontSize: 18 }} /> บันทึกส่งเบิก </button>&nbsp;
                                                                    <button className="btn btn-danger" type="button" style={{ cursor: 'pointer' }} onClick={() => Deletedata(txtvalue.t_orderID)}> <i className="fa ti-trash" style={{ fontSize: 18 }} /> ยกเลิกใบเบิก </button>
                                                                </div>
                                                            </div>
                                                            <div className="ibox-body scroller">
                                                                <table className="table table-striped">
                                                                    <thead>
                                                                        <tr>
                                                                            <th> # </th>
                                                                            <th> รายการผ้า </th>
                                                                            <th> คงเหลือในตู้ </th>
                                                                            <th> คงเหลือในเตียง </th>
                                                                            <th> จำนวนยืมผ้า </th>
                                                                            <th> จำนวนผู้ป่วย </th>
                                                                            <th> หมายเหตุ </th>
                                                                            <th> ลบ </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            listOrder.map((item, row) =>

                                                                                <tr>
                                                                                    <td className="py-1">{row + 1}</td>
                                                                                    <td> {item.itemfabricname} </td>
                                                                                    <td> {item.itemcupboard} </td>
                                                                                    <td> {item.itembed} </td>
                                                                                    <td> {item.itemborrow} </td>
                                                                                    <td> {item.itempatientum} </td>
                                                                                    <td> {item.itemother} </td>
                                                                                    <td>
                                                                                        <button type="button" className="btn btn-outline-danger btn-icon-text" onClick={() => Removeorder(item.itemfabricid)}>
                                                                                            <i className="mdi mdi-close-circle"></i>
                                                                                            ยกเลิก
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>

                                                                            )
                                                                        }

                                                                    </tbody>
                                                                </table>

                                                                <div style={{ padding: 10 }}>
                                                                    <label className="ui-radio ui-radio-primary">
                                                                        <input type="radio" id="t_str1" name="t_str" onClick={(even) => settxtvalue({ ...txtvalue, t_orderstr: '1' })} />
                                                                        <span className="input-span" /> เช้า </label> &nbsp;&nbsp;
                                                                    <label className="ui-radio ui-radio-warning">
                                                                        <input type="radio" id="t_str2" name="t_str" onClick={(even) => settxtvalue({ ...txtvalue, t_orderstr: '2' })} />
                                                                        <span className="input-span" /> บ่าย </label>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="ml-sm-auto">

                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </CModalBody>
                </CModal>*/}

            </sesion>
        </div>
    )
}
