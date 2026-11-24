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
                        <span className="nav-label"> ตั้งค่า </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink name="หน่วยงาน" to="/Content/Offices/"> หน่วยงาน </CLink></li>
                        <li><CLink name="หน่วยงาน" to="/Content/Launder/Users/"> ผู้ใช้งาน </CLink></li>
                    </ul>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-bookmark" />
                        <span className="nav-label"> คลัง </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink name="รายการผ้า" to="/Content/Fabric/"> รายการผ้า </CLink></li>
                        <li><CLink to="/Content/Launder/Accepting/"> รับผ้าเข้าคลัง </CLink></li>
                        <li><CLink to="/Content/Launder/Waste/"> รายการผ้าชำรุด </CLink></li>
                        <li><CLink to="/Content/Launder/Losts/"> รายการผ้าสูญหาย </CLink></li>
                    </ul>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-edit" />
                        <span className="nav-label"> รายการเบิกผ้า </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink name="ขอเบิกผ้า" to="/Content/Launder/Withdrawadmin/"> ขอเบิกผ้า </CLink></li>
                        <li><CLink name="รายการส่งซัก" to="/Content/Launder/Sendwashadmin/"> รายการส่งซัก </CLink></li>
                    </ul>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-table" />
                        <span className="nav-label"> จ่ายผ้า </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink to="/Content/Launder/Recoup/"> จ่ายออก </CLink></li>
                        <li><CLink to="/Content/Launder/Recoupdata/"> ข้อมูลการจ่าย </CLink></li>
                    </ul>
                </li>
                <li className="heading">ระบบรายงาน</li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-bar-chart" />
                        <span className="nav-label"> รายงาน </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink to="/Content/Launder/Reportsdisburse/">รายงานการเบิก-จ้ายผ้า</CLink></li>
                        <li><CLink to="/Content/Launder/Reportsenwash/">รายงานการส่งซัก</CLink></li>
                    </ul>
                </li>

            </ul>
        </>
    )
}
