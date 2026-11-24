import React, { useState, useEffect } from 'react'
import API from '../../../Config/config'

export default function Frmhome() {

    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_userstr: sessionStorage.getItem('sessStr'), t_countnum1: '', t_percent1: '', t_countnum2: '', t_percent2: '',
    }
    const [txtvalue, settxtvalue] = useState(inputData);
    const [orderDatacloth, setorderDatacloth] = useState([]);
    const [datachart1, setdatachart1] = useState([]);
    const [dataquantity, setdataquantity] = useState({
        t_Sendnum: '', t_Recoupnum: '', t_Borrow: '', t_Borrowpersen: '', t_Recouppersen: '', t_Sendpersen: '',
        t_Wastenum: '', t_Lostnum: '', t_Wastepersen: '', t_Lostpersen: ''
    })

    useEffect(() => {



    }, []);

    return (
        <div className="page-content fade-in-up">
            <div className="row">
                <div className="col-lg-3 col-md-6">
                    <div className="ibox bg-success color-white widget-stat">
                        <div className="ibox-body">
                            <h2 className="m-b-5 font-strong"> {txtvalue.t_countnum1} </h2>
                            <div className="m-b-5"> ข้อมูลตรวจสุขภาพ </div><i className="fa fa-user-circle widget-stat-icon" />
                            <div><i className="fa fa-level-up m-r-5" /><small>{txtvalue.t_percent1}%</small></div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="ibox bg-info color-white widget-stat">
                        <div className="ibox-body">
                            <h2 className="m-b-5 font-strong"> {txtvalue.t_countnum2} </h2>
                            <div className="m-b-5"> รอผลการตรวจ </div><i className="fa fa-superpowers widget-stat-icon" />
                            <div><i className="fa fa-level-up m-r-5" /><small>{txtvalue.t_percent2}%</small></div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="ibox bg-warning color-white widget-stat">
                        <div className="ibox-body">
                            <h2 className="m-b-5 font-strong">{txtvalue.t_Wastenum}</h2>
                            <div className="m-b-5"> ผลการตรวจออก </div><i className="fa fa-gratipay widget-stat-icon" />
                            <div><i className="fa fa-level-down m-r-5" /><small> {txtvalue.t_Wastepersen}% </small></div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="ibox bg-danger color-white widget-stat">
                        <div className="ibox-body">
                            <h2 className="m-b-5 font-strong">{txtvalue.t_Lostnum}</h2>
                            <div className="m-b-5"> เสี่ยง </div><i className="ti-user widget-stat-icon" />
                            <div><i className="fa fa-level-down m-r-5" /><small> {txtvalue.t_Lostpersen}%</small></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-8">
                    <div className="ibox">
                        <div className="ibox-body">
                            <div className="flexbox mb-4">
                                <div>
                                    <h3 className="m-0"> สถิติการ </h3>
                                    <div> สถิติการตรวจสุขภาพประจำปี </div>
                                </div>
                                <div className="d-inline-flex">
                                    <div className="px-3" style={{ borderRight: '1px solid rgba(0,0,0,.1)' }}>
                                        <div className="text-muted"> ยอดการเบิก </div>
                                        <div>
                                            <span className="h2 m-0">{dataquantity.t_Borrow}</span>
                                            <span className="text-success ml-2"><i className="fa fa-level-up" /> {dataquantity.t_Borrowpersen}%</span>
                                        </div>
                                    </div>
                                    <div className="px-3">
                                        <div className="text-muted">ยอดการรับ</div>
                                        <div>
                                            <span className="h2 m-0">{dataquantity.t_Recoupnum}</span>
                                            <span className="text-warning ml-2"><i className="fa fa-level-down" /> {dataquantity.t_Recouppersen}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <canvas id="chartData" style={{ height: 260 }} />
                                {/*<Frmchart1/>*/}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="ibox">
                        <div className="ibox-head">
                            <div className="ibox-title"> สถิติการเบิกทั้งหมด </div>
                        </div>
                        <div className="ibox-body">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <canvas id="doughnut_chart" style={{ height: 160 }} />
                                </div>
                                <div className="col-md-6">
                                    <div className="m-b-20 text-success"><i className="fa fa-circle-o m-r-10" />เบิก {dataquantity.t_Borrowpersen}%</div>
                                    <div className="m-b-20 text-info"><i className="fa fa-circle-o m-r-10" />รับ {dataquantity.t_Recouppersen}%</div>
                                    <div className="m-b-20 text-warning"><i className="fa fa-circle-o m-r-10" />คืน {dataquantity.t_Sendpersen}%</div>
                                </div>
                            </div>
                            <ul className="list-group list-group-divider list-group-full">
                                <li className="list-group-item">เบิกทั้งหมด
                                    <span className="float-right text-success"><i className="fa fa-caret-up" /> {dataquantity.t_Borrow} ชิ้น</span>
                                </li>
                                <li className="list-group-item">รับทั้งหมด
                                    <span className="float-right text-success"><i className="fa fa-caret-up" /> {dataquantity.t_Recoupnum} ชิ้น</span>
                                </li>
                                <li className="list-group-item">คืนทั้งหมด
                                    <span className="float-right text-danger"><i className="fa fa-caret-down" /> {dataquantity.t_Sendnum} ชิ้น</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <div className="ibox">
                        <div className="ibox-head">
                            <div className="ibox-title"> รายการขอเบิก </div>
                            <div className="ibox-tools">
                                <a className="ibox-collapse"><i className="fa fa-minus" /></a>
                                <a className="dropdown-toggle" data-toggle="dropdown"><i className="fa fa-ellipsis-v" /></a>
                                <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item"> ส่งออก PDF </a>
                                    <a className="dropdown-item"> ส่งออก Excel </a>
                                </div>
                            </div>
                        </div>
                        <div className="ibox-body">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th> เลขที่ใบเบิก </th>
                                        <th> เจ้าหน้าที่ </th>
                                        <th> วันที่เบิก </th>
                                        <th> เวลา </th>
                                        <th> ช่วง </th>
                                        <th width="91px"> สถานะ </th>
                                    </tr>
                                </thead>
                                <tbody style={{ overflow: 'scroll' }}>

                                    {
                                        orderDatacloth.map((item, row) =>
                                            <>
                                                <tr>
                                                    <td><a href="#">{item.Orderid}</a></td>
                                                    <td> {item.fullname} </td>
                                                    <td> {item.Orderdate} </td>
                                                    <td> {item.Ordertime} </td>
                                                    <td> {
                                                        item.Orderseason == '1' ? (
                                                            <span>เช้า</span>
                                                        ) : (
                                                            <span>บ่าย</span>
                                                        )
                                                    } </td>
                                                    <td>{
                                                        item.Orderstatus == '0' ? (
                                                            <span className="badge badge-warning">รอรับเข้า</span>
                                                        ) : (
                                                            <span className="badge badge-success"> รับเข้าแล้ว </span>
                                                        )
                                                    }</td>
                                                </tr>
                                            </>
                                        )
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4" hidden="hidden">
                    <div className="ibox">
                        <div className="ibox-head">
                            <div className="ibox-title">Messages</div>
                        </div>
                        <div className="ibox-body">
                            <ul className="media-list media-list-divider m-0">
                                <li className="media">
                                    <a className="media-img" href="javascript:;">
                                        <img className="img-circle" src="./assets/img/users/u1.jpg" width={40} />
                                    </a>
                                    <div className="media-body">
                                        <div className="media-heading">Jeanne Gonzalez <small className="float-right text-muted">12:05</small></div>
                                        <div className="font-13">Lorem Ipsum is simply dummy text of the printing and typesetting.</div>
                                    </div>
                                </li>
                                <li className="media">
                                    <a className="media-img" href="javascript:;">
                                        <img className="img-circle" src="./assets/img/users/u2.jpg" width={40} />
                                    </a>
                                    <div className="media-body">
                                        <div className="media-heading">Becky Brooks <small className="float-right text-muted">1 hrs ago</small></div>
                                        <div className="font-13">Lorem Ipsum is simply dummy text of the printing and typesetting.</div>
                                    </div>
                                </li>
                                <li className="media">
                                    <a className="media-img" href="javascript:;">
                                        <img className="img-circle" src="./assets/img/users/u3.jpg" width={40} />
                                    </a>
                                    <div className="media-body">
                                        <div className="media-heading">Frank Cruz <small className="float-right text-muted">3 hrs ago</small></div>
                                        <div className="font-13">Lorem Ipsum is simply dummy text of the printing and typesetting.</div>
                                    </div>
                                </li>
                                <li className="media">
                                    <a className="media-img" href="javascript:;">
                                        <img className="img-circle" src="./assets/img/users/u6.jpg" width={40} />
                                    </a>
                                    <div className="media-body">
                                        <div className="media-heading">Connor Perez <small className="float-right text-muted">Today</small></div>
                                        <div className="font-13">Lorem Ipsum is simply dummy text of the printing and typesetting.</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
