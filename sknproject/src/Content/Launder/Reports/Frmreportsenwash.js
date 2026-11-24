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
import XLSX from "xlsx";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Frmreportsenwash() {

    const [modal, setModal] = useState(false);
    const [myData, setmyData] = useState([]);
    const [listOffice, setlistOffice] = useState([]);
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_userstr: sessionStorage.getItem('sessStr'), t_date1: '', t_date2: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData)

    useEffect(() => {

        Showlistoffice();
        Showdata(sessionStorage.getItem('sessOfficeid'));

    }, []);

    async function openModal(ID) {

        setModal(true);

    }

    async function closeModal() {
        setModal(false);
    }

    async function Showdata(officeid) {
        
        fetch(API.dataSource.code + "Reportsenwash.php?module=Showdata&officeID=" + officeid + "&userStr=" + txtvalue.t_userstr + "&tdate1=" + txtvalue.t_date1 + "&tdate2=" + txtvalue.t_date2)
            .then(res => res.json())
            .then(json => {
                //alert(json);
                let Mydata = json;
                let { rows } = json;
                rows = Mydata.map((row, key) => ({
                    ...row,
                    Edit: (
                        <>
                            <button className="btn btn-default btn-xs m-r-5" style={{ cursor: 'pointer' }} data-toggle="tooltip" data-original-title="Edit" onClick={() => openModal(row.Recoupid)}><i className="ti-hand-open font-14" /></button>
                        </>
                    ),

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
                            field: 'Sendnum',
                            sort: 'asc',
                            width: 200
                        }
                    ],
                    rows
                };
                setmyData(Mydata);
            });
    }

    async function Showlistoffice() {

        fetch(API.dataSource.code + "Reportsenwash.php?module=Showlistoffice")
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

    async function downloadToPDF() {

        let Datenow = new Date();
        const datename = Datenow.getFullYear() + "-" + Datenow.getMonth() + 1 + "-" + Datenow.getDate();
        //const filename = txtvalue.t_searchdate.replace("-", "") + "_" + txtvalue.t_searchdate2.replace("-", "")
        const unit = "mm";
        const size = "A4";
        const orientation = "l";

        const marginLeft = 15;
        const doc = new jsPDF(orientation, unit, size);
        //doc.addFont('assets/fonts/THSarabunNew.ttf', 'THSarabunNew', 'normal');
        doc.addFont('assets/fonts/THSarabunNew.ttf', 'THSarabunNew', 'normal');
        doc.setFont('THSarabunNew');
        doc.setFontSize(15);

        const title = "รายงานการส่งซัก";
        const headers = [["รหัส", "รายการ", "จำนวน"]];
        const data = myData.rows.map((itemRow, irow) => [itemRow.FabricID, itemRow.FabricName, itemRow.Sendnum]);

        const content = {
            startY: 50,
            head: headers,
            body: data,
            styles: { font: 'THSarabunNew', fontSize: 15 }
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("รายงานการส่งซัก_" + datename + ".pdf")

    }

    async function downloadToExcel() {

        let Datenow = new Date();
        const datename = Datenow.getFullYear() + "-" + Datenow.getMonth() + 1 + "-" + Datenow.getDate();
        const filename = "รายงานการส่งซัก" + datename
        const rowData = [];
        myData.rows.map((itemRow, irow) => {
            rowData.push({ "รหัส": itemRow.FabricID, "รายการ": itemRow.FabricName, "จำนวน": itemRow.Sendnum })
        })

        let wb = XLSX.utils.book_new();
        let ws1 = XLSX.utils.json_to_sheet(rowData);
        XLSX.utils.book_append_sheet(wb, ws1, "รายการส่งซัก");
        XLSX.writeFile(wb, filename + '.xlsx');

        return false;

    }

    async function onchangeSelect(val) {
        setmyData([]);
        settxtvalue({ ...txtvalue, t_officeid: val })
        Showdata(val);
    }

    return (
        <div>
            <div className="page-heading">
                <h1 className="page-title">
                    รายงานการส่งซัก  &nbsp; หน่วยงาน &nbsp;
                    {
                        sessionStorage.getItem('sessStr') == '1' ? (
                            <Select
                                value={listOffice.find(obj => obj.value === txtvalue.t_officeid)}
                                options={listOffice}
                                onChange={even => onchangeSelect(even.value)}
                            />
                        ) : (
                            <span>{sessionStorage.getItem('sessOfficename')}</span>
                        )
                    }
                </h1>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="#"><i className="la la-home font-20" /></a>
                    </li>
                    <li className="breadcrumb-item"> Senwash From </li>
                </ol>
            </div>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <div className="ibox-head">
                        <div className="ibox-title">
                            สืบค้น &nbsp;
                            <input type="date" name='t_date1' value={txtvalue.t_date1} onChange={(even) => settxtvalue({ ...txtvalue, t_date1: even.target.value })} /> -
                            <input type="date" name='t_date2' value={txtvalue.t_date2} onChange={(even) => settxtvalue({ ...txtvalue, t_date2: even.target.value })} />&nbsp;&nbsp;
                            <i className="fa fa-search font-14" style={{ fontSize: 22, cursor: 'pointer' }} onClick={() => Showdata(txtvalue.t_officeid)} />
                        </div>
                        <div>

                            <a className="nav-link dropdown-toggle link" data-toggle="dropdown">
                                <i className="fa fa-ellipsis-v" />
                            </a>
                            <ul className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" to="#" onClick={() => downloadToExcel()}><i className="fa fa-file-excel-o" /> Excel </a>
                                <a className="dropdown-item" to="#" onClick={() => downloadToPDF()}><i className="fa fa-file-pdf-o" /> PDF </a>
                                <li className="dropdown-divider" />
                            </ul>

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
        </div>
    )
}
