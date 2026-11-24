import React from 'react'
import { La_Header, La_Sidebar, La_Content, La_Footer } from './Launder/index'
import { Pa_Header, Pa_Sidebar, Pa_Content, Pa_Footer } from './Paymiddle/index'
import { He_Header, He_Sidebar, He_Content, He_Footer } from './Health/index'
import { Car_Header, Car_Sidebar, Car_Content, Car_Footer } from './Cradle/index'


export default function Frmlayout() {
    return (
        <>
            {
                sessionStorage.getItem("sessProjectid") == "01" ? (
                    <>{/* ซักฟอก */}
                        <La_Header />
                        <La_Sidebar />
                        <div className="content-wrapper">
                            <La_Content />
                            <La_Footer />
                        </div>
                    </>
                ) : sessionStorage.getItem("sessProjectid") == "02" ? (
                    <>{/* จ่ายกลาง */}
                        <Pa_Header />
                        <Pa_Sidebar />
                        <div className="content-wrapper">
                            <Pa_Content />
                            <Pa_Footer />
                        </div>
                    </>
                ) : sessionStorage.getItem("sessProjectid") == "03" ? (
                    <>{/* โปรแกรมตรวจสุขภาพ */}
                        <He_Header />
                        <He_Sidebar />
                        <div className="content-wrapper">
                            <He_Content />
                            <He_Footer />
                        </div>
                    </>
                ) : sessionStorage.getItem("sessProjectid") == "04" ? (
                    <>{/* โปรแกรมจองเปล */}
                        <Car_Header />
                        <Car_Sidebar />
                        <div className="content-wrapper">
                            <Car_Content />
                            <Car_Footer />
                        </div>
                    </>
                ) : (
                    <>
                        
                    </>
                )
            }

        </>
    )
}
