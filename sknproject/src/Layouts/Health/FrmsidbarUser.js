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
                        <span className="nav-label"> ตั้งค่า </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink name="รายการผ้า" to=""> จัดการข้อมูลหน่วยงาน </CLink></li>
                        <li><CLink name="รายการผ้า" to=""> จัดการข้อมูลกลุ่มงาน </CLink></li>
                        <li><CLink name="รายการผ้า" to=""> จัดการผลตรวจสุขภาพ </CLink></li>
                    </ul>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-edit" />
                        <span className="nav-label"> แพทย์ออกตรวจ </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink name="ขอเบิก" to="/Content/Launder/Withdraw/"> ผล LAB ตรวจสุขภาพ </CLink></li>
                        <li><CLink name="ส่งซัก" to="/Content/Launder/Sendwash/"> สรุปผลตรวจสุขภาพ </CLink></li>
                        <li><CLink name="รับผ้า" to="/Content/Launder/Takedown/"> ข้อมูลการตรวจสุขภาพ </CLink></li>
                    </ul>
                </li>
                <li className="heading"> รายงาน </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-table" />
                        <span className="nav-label"> ระบบรายงาน </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink to="/Content/Launder/Reportsdisburse/">รายงานตรวจสุขภาพประจำปี</CLink></li>
                        <li><CLink to="/Content/Launder/Reportsenwash/">รายงานภาพรวมหน่วยงาน</CLink></li>
                        <li><CLink to="/Content/Launder/Reportsenwash/">ผลการตรวจค่าระดับสารเคมีในร่างกาย</CLink></li>
                    </ul>
                </li>
            </ul>
        </>
    )
}
