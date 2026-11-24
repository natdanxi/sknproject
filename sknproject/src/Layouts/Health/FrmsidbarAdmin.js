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
                        <li><CLink name="ข้อมูลกลุ่มงาน" to="/Content/Health/Department/"> จัดการข้อมูลกลุ่มงาน </CLink></li>
                        <li><CLink name="ข้อมูลหน่วยงาน" to="/Content/Health/Office/"> จัดการข้อมูลหน่วยงาน </CLink></li>
                        <li><CLink name="ผลตรวจสุขภาพ" to="/Content/Health/Labsetting/"> จัดการผลตรวจสุขภาพ </CLink></li>
                    </ul>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-edit" />
                        <span className="nav-label"> ลงทะเบียน </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink name="รายการผ้า" to="/Content/Health/Registers/"> ลงทะเบียนใหม่ </CLink></li>
                    </ul>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-heart" />
                        <span className="nav-label"> ตรวจสุขภาพประจำปี </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink name="ขอเบิกผ้า" to="/Content/Health/Healthcheck/"> ตรวจสุขภาพ </CLink></li>
                        <li><CLink name="รายการส่งซัก" to="/Content/Health/Healthdata/"> ข้อมูลการตรวจสุขภาพประจำปี </CLink></li>
                        <li><CLink name="รายการส่งซัก" to="/"> ปริ้นสติ๊กเกอร์ </CLink></li>
                    </ul>
                </li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-user-md" />
                        <span className="nav-label"> ห้องตรวจแพทย์ </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink to="/"> ผล LAB ตรวจสุขภาพ </CLink></li>
                        <li><CLink to="/"> สรุปผลตรวจสุขภาพ </CLink></li>
                    </ul>
                </li>
                <li className="heading">ระบบรายงาน</li>
                <li>
                    <a href="javascript:;"><i className="sidebar-item-icon fa fa-bar-chart" />
                        <span className="nav-label"> รายงาน </span><i className="fa fa-angle-left arrow" /></a>
                    <ul className="nav-2-level collapse">
                        <li><CLink to="/" title="รายงานตรวจสุขภาพประจำปี"> รายงานตรวจสุขภาพประจำปี </CLink></li>
                        <li><CLink to="/" title="รายงานภาพรวมหน่วยงาน"> รายงานภาพรวมหน่วยงาน </CLink></li>
                        <li><CLink to="/" title="รายงานการตรวจ Ekg"> รายงานการตรวจ Ekg </CLink></li>
                        <li><CLink to="/" title="ผลการตรวจค่าระดับสารเคมีในร่างกาย"> ผลการตรวจค่าระดับสารเคมีในร่างกาย </CLink></li>
                        <li><CLink to="/" title="ความสมบูรณ์ของเม็ดเลือด (CBC)"> ความสมบูรณ์ของเม็ดเลือด (CBC) </CLink></li>
                        <li><CLink to="/" title="สรุปผลการตรวจสุขภาพทั่วไป"> สรุปผลการตรวจสุขภาพทั่วไป </CLink></li>
                        <li><CLink to="/" title=" สรุปผลการตรวจปัสสาวะและอุจจาระ">  สรุปผลการตรวจปัสสาวะและอุจจาระ </CLink></li>
                        <li><CLink to="/" title=" สรุปผลการตรวจเอ็กซเรย์ทรวงอก">  สรุปผลการตรวจเอ็กซเรย์ทรวงอก </CLink></li>
                    </ul>
                </li>

            </ul>
        </>
    )
}
