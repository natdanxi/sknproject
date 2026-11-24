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
                        <span className="nav-label"> คลัง </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink name="รายการผ้า" to="/Content/Fabric/"> รายการอุปกรณ์ </CLink></li>
                    </ul>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-edit" />
                        <span className="nav-label"> ยืมอุปกรณ์ </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink name="รายการผ้า" to="/Content/Withdraw/"> ยืม </CLink></li>
                        <li><a href="#"> คืน </a></li>
                    </ul>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-table" />
                        <span className="nav-label"> รายงาน </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><a href="#"> รายงานการยืมอุปกรณ์ </a></li>
                        <li><a href="#"> รายงานการใช้อุปกรณ์ </a></li>
                        <li><a href="#"> รายงานอุปกรณ์ </a></li>
                    </ul>
                </li>

            </ul>
        </>
    )
}
