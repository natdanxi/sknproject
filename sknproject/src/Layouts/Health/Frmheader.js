import React, { useState, useEffect } from 'react'
import API from '../../Config/config'
import sknlogo from '../../assets/Images/logohms1.png'
import Frmpopup from '../../Content/Popuprooms/Frmpopuproom'
import Modal from 'react-awesome-modal';

export default function Frmheader() {

    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
    }
    const [txtvalue, settxtvalue] = useState(inputData);

    const [modal, setModal] = useState(false);


    useEffect(() => {

        if(txtvalue.t_officeid != "01S" && txtvalue.t_officeid != "02S" && txtvalue.t_officeid != "03S"){
            setModal(true);
        }

    }, []);

    async function Logout() {

        var conF = window.confirm("คุณต้องการออกจากระบบ ใช่หรือไม่");
        if (conF == true) {
            sessionStorage.removeItem('sessStr');
            sessionStorage.removeItem('sessuserID');
            sessionStorage.removeItem('sessName');
            sessionStorage.removeItem('sessPositon');
            sessionStorage.removeItem('sessImage');
            sessionStorage.removeItem('sessProjectid');
            sessionStorage.removeItem('sessProjectname');

            window.location.reload();
        }
    }

    async function closeModal() {
        setModal(false);
    }


    return (
        <header className="header">
            <div className="page-brand">
                <a className="link" href="#">
                    <span className="brand">
                        <span className="brand-tip">
                            <img src={sknlogo} style={{ width: 40 }} /> รพ.สกลนคร
                        </span>
                    </span>
                    <span className="brand-mini"><img src={sknlogo} style={{ width: 50 }} /></span>
                </a>
            </div>
            <div className="flexbox flex-1">
                {/* START TOP-LEFT TOOLBAR*/}
                <ul className="nav navbar-toolbar">
                    <li>
                        <a className="nav-link sidebar-toggler js-sidebar-toggler"><i className="ti-menu" /></a>
                    </li>
                    <li>
                        <form className="navbar-search" action="javascript:;">
                            <div className="rel">
                                <span className="search-icon"><i className="ti-home" style={{ fontSize: 20 }} /></span>
                                <span style={{ paddingLeft: 40, fontSize: 25 }}> <h> {sessionStorage.getItem("sessProjectname")} </h> </span>
                            </div>
                        </form>
                    </li>
                </ul>
                {/* END TOP-LEFT TOOLBAR*/}
                {/* START TOP-RIGHT TOOLBAR*/}
                <ul className="nav navbar-toolbar">
                    <span> หน่วยงาน [<a href='#' onClick={() => setModal(true)}>{sessionStorage.getItem("sessOfficename")}</a>]</span>
                    <li className="dropdown dropdown-notification">
                        <a className="nav-link dropdown-toggle" data-toggle="dropdown"><i className="fa fa-bell-o rel"><span className="notify-signal"></span></i></a>
                        <ul className="dropdown-menu dropdown-menu-right dropdown-menu-media">
                            <li className="dropdown-menu-header">
                                <div>
                                    <span><strong>รายใหม่ 10 </strong> ราย</span>
                                    <a className="pull-right" href="javascript:;">view all</a>
                                </div>
                            </li>
                            <li className="list-group list-group-divider scroller" data-height="240px" data-color="#71808f">
                                <div>
                                    <a className="list-group-item">
                                        <div className="media">
                                            <div className="media-img">
                                                <span className="badge badge-success badge-big"><i className="fa fa-check" /></span>
                                            </div>
                                            <div className="media-body">
                                                <div className="font-13">4 task compiled</div><small className="text-muted">22 mins</small></div>
                                        </div>
                                    </a>
                                    <a className="list-group-item">
                                        <div className="media">
                                            <div className="media-img">
                                                <span className="badge badge-default badge-big"><i className="fa fa-shopping-basket" /></span>
                                            </div>
                                            <div className="media-body">
                                                <div className="font-13">You have 12 new orders</div><small className="text-muted">40 mins</small></div>
                                        </div>
                                    </a>
                                    <a className="list-group-item">
                                        <div className="media">
                                            <div className="media-img">
                                                <span className="badge badge-danger badge-big"><i className="fa fa-bolt" /></span>
                                            </div>
                                            <div className="media-body">
                                                <div className="font-13">Server #7 rebooted</div><small className="text-muted">2 hrs</small></div>
                                        </div>
                                    </a>
                                    <a className="list-group-item">
                                        <div className="media">
                                            <div className="media-img">
                                                <span className="badge badge-success badge-big"><i className="fa fa-user" /></span>
                                            </div>
                                            <div className="media-body">
                                                <div className="font-13">New user registered</div><small className="text-muted">2 hrs</small></div>
                                        </div>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li className="dropdown dropdown-inbox">
                        <a className="nav-link dropdown-toggle" data-toggle="dropdown" title='จำนวนผู้ป่วย'><i className="fa fa-envelope-o" />
                            <span className="badge badge-primary envelope-badge">9</span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-right dropdown-menu-media">
                            <li className="dropdown-menu-header">
                                <div>
                                    <span><strong>รายใหม่ 9 </strong> ราย </span>
                                    <a className="pull-right" href="#"> ดูทั้งหมด </a>
                                </div>
                            </li>
                            <li className="list-group list-group-divider scroller" data-height="240px" data-color="#71808f">
                                <div>
                                    <a className="list-group-item">
                                        <div className="media">
                                            <div className="media-img">
                                                <img src="./assets/img/users/u1.jpg" />
                                            </div>
                                            <div className="media-body">
                                                <div className="font-strong"> </div>Jeanne Gonzalez<small className="text-muted float-right">Just now</small>
                                                <div className="font-13">Your proposal interested me.</div>
                                            </div>
                                        </div>
                                    </a>
                                    <a className="list-group-item">
                                        <div className="media">
                                            <div className="media-img">
                                                <img src="./assets/img/users/u2.jpg" />
                                            </div>
                                            <div className="media-body">
                                                <div className="font-strong" />Becky Brooks<small className="text-muted float-right">18 mins</small>
                                                <div className="font-13">Lorem Ipsum is simply.</div>
                                            </div>
                                        </div>
                                    </a>
                                    <a className="list-group-item">
                                        <div className="media">
                                            <div className="media-img">
                                                <img src="./assets/img/users/u3.jpg" />
                                            </div>
                                            <div className="media-body">
                                                <div className="font-strong" />Frank Cruz<small className="text-muted float-right">18 mins</small>
                                                <div className="font-13">Lorem Ipsum is simply.</div>
                                            </div>
                                        </div>
                                    </a>
                                    <a className="list-group-item">
                                        <div className="media">
                                            <div className="media-img">
                                                <img src="./assets/img/users/u4.jpg" />
                                            </div>
                                            <div className="media-body">
                                                <div className="font-strong" />Rose Pearson<small className="text-muted float-right">3 hrs</small>
                                                <div className="font-13">Lorem Ipsum is simply.</div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </li>

                    <li className="dropdown dropdown-user">
                        <a className="nav-link dropdown-toggle link" data-toggle="dropdown">
                            <img src={API.dataSource.code + "File/imageUser/" + sessionStorage.getItem('sessImage')} />
                            <span /> {sessionStorage.getItem("sessName")} <i className="fa fa-angle-down m-l-5" /></a>
                        <ul className="dropdown-menu dropdown-menu-right">
                            <a className="dropdown-item" href="#"><i className="fa fa-user" />Profile</a>
                            <a className="dropdown-item" href="#"><i className="fa fa-cog" />Settings</a>
                            <a className="dropdown-item" href="javascript:;"><i className="fa fa-support" />Support</a>
                            <li className="dropdown-divider" />
                            <a className="dropdown-item" href="#" onClick={() => Logout()}><i className="fa fa-power-off" />Logout</a>
                        </ul>
                    </li>
                </ul>
                {/* END TOP-RIGHT TOOLBAR*/}
            </div>

            <Modal visible={modal} width="40%" effect="fadeInUp" onClick={() => closeModal()}>
                <div className="Modelbody">
                    <div className="Modelheader">

                    </div>

                    <div className="cssModelbody">

                        <div className="panel-body">
                            <div className='row'>
                                <div className="col-md-12">
                                    <div className="ibox">
                                        <div className="ibox-head">
                                            <div className="ibox-title"> <span> <i className="fa fa-university" style={{ fontSize: 20 }} /> เลือกห้องตรวจ </span> </div>
                                            <div className="ibox-tools">
                                                <a onClick={() => setModal(false)}><i className="fa ti-close" /></a>
                                            </div>
                                        </div>
                                        <div className='row'>

                                            <div className="col-md-12">
                                                <div className="ibox">
                                                    <Frmpopup />
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

        </header>

    )
}
