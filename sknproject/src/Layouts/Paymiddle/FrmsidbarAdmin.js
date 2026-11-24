import React from 'react'
import { CLink } from '@coreui/react'

export default function FrmsidbarAdmin() {
    return (
        <>
            <ul className="side-menu metismenu">
                <li>
                    <a className="active" href="#"><i className="sidebar-item-icon fa fa-th-large" />
                        <span className="nav-label">Dashboard</span>
                    </a>
                </li>
                <li className="heading">Manu</li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-bookmark" />
                        <span className="nav-label"> คลัง </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink name="รายการผ้า" to="/Content/Fabric/"> รายการผ้า </CLink></li>
                        <li><a href="#"> รายการผ้าชำรุด </a></li>
                        <li><a href="#"> รายการผ้าสูญหาย </a></li>
                        <li><CLink name="รายการผ้า" to="/Content/Stock/"> รายการผ้าใน Ward </CLink></li>
                        <li><a href="#"> รายการผ้าชำรุด </a></li>
                        <li><a href="#"> รายการผ้าสูญหาย </a></li>
                    </ul>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-edit" />
                        <span className="nav-label"> รายการเบิกผ้า </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><a href="#"> เบิกผ้า </a></li>
                        <li><a href="#"> ส่งซัก </a></li>
                        <li><a href="#">Form input masks</a></li>
                        <li><a href="#">Form Validation</a></li>
                        <li><a href="#">Text Editors</a></li>
                    </ul>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-table" />
                        <span className="nav-label">Tables</span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><a href="#">Basic Tables</a></li>
                        <li><a href="#">Datatables</a></li>
                    </ul>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-bar-chart" />
                        <span className="nav-label">Charts</span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><a href="#">Flot Charts</a></li>
                        <li>
                            <a href="#">Morris Charts</a>
                        </li>
                        <li>
                            <a href="#">Chart.js</a>
                        </li>
                        <li>
                            <a href="#">Sparkline Charts</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-map" />
                        <span className="nav-label">Maps</span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li>
                            <a href="#">Vector maps</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#"><i className="sidebar-item-icon fa fa-smile-o" />
                        <span className="nav-label">Icons</span>
                    </a>
                </li>
                <li className="heading">PAGES</li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-envelope" />
                        <span className="nav-label">Mailbox</span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li>
                            <a href="#">Inbox</a>
                        </li>
                        <li>
                            <a href="#">Mail view</a>
                        </li>
                        <li>
                            <a href="#">Compose mail</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#"><i className="sidebar-item-icon fa fa-calendar" />
                        <span className="nav-label">Calendar</span>
                    </a>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-file-text" />
                        <span className="nav-label">Pages</span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li>
                            <a href="#">Invoice</a>
                        </li>
                        <li>
                            <a href="#">Profile</a>
                        </li>
                        <li>
                            <a href="#">Login</a>
                        </li>
                        <li>
                            <a href="#">Register</a>
                        </li>
                        <li>
                            <a href="#">Lockscreen</a>
                        </li>
                        <li>
                            <a href="#">Forgot password</a>
                        </li>
                        <li>
                            <a href="#">404 error</a>
                        </li>
                        <li>
                            <a href="#">500 error</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-sitemap" />
                        <span className="nav-label">Menu Levels</span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li>
                            <a href="javascript:;">Level 2</a>
                        </li>
                        <li>
                            <a href="javascript:;">
                                <span className="nav-label">Level 2</span><i className="fa fa-angle-left arrow" /></a>
                            <ul className="nav-3-level collapse">
                                <li>
                                    <a href="javascript:;">Level 3</a>
                                </li>
                                <li>
                                    <a href="javascript:;">Level 3</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </>
    )
}
