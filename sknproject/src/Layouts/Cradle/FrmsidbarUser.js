import React from 'react'
import { CLink } from '@coreui/react'

export default function FrmsidbarUser() {
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
                        <span className="nav-label"> ระบบจองเปล </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink name="จองเปล" to="/Cardles/Reserves/"> จองเปล </CLink></li>
                        <li><CLink name="รายการจองเปล" to=""> รายการจองเปล </CLink></li>
                    </ul>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-edit" />
                        <span className="nav-label"> ระบบรายงาน </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink name="ขอเบิก" to="/Content/Launder/Withdraw/"> รายงานการจองเปล </CLink></li>
                        <li><CLink name="ส่งซัก" to="/Content/Launder/Sendwash/"> รายงานกิจกรรม </CLink></li>
                    </ul>
                </li>
                <li className="heading"> รายงาน </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-table" />
                        <span className="nav-label"> ระบบรายงาน </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink to="/Content/Launder/Reportsdisburse/">รายงานการเบิก-จ้ายผ้า</CLink></li>
                        <li><CLink to="/Content/Launder/Reportsenwash/">รายงานการส่งซัก</CLink></li>
                    </ul>
                </li>
            </ul>
        </>
    )
}
