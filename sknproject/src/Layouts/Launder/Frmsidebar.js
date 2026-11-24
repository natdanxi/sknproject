import { BorderRight } from '@material-ui/icons'
import React from 'react'
import API from '../../Config/config'
import Menuadmin from './FrmsidbarAdmin'
import Menuuser from './FrmsidbarUser'

export default function Frmsidebar() {
    return (
        <nav className="page-sidebar" id="sidebar">
            <div id="sidebar-collapse">
                <div className="admin-block d-flex">
                    <div>
                        <img src={API.dataSource.code + "File/imageUser/" + sessionStorage.getItem('sessImage')} style={{ borderRadius: '50%' }} width="40px" height="45px" />
                    </div>
                    <div className="admin-info">
                        <div className="font-strong"> {sessionStorage.getItem("sessName")} </div>
                        <small> {sessionStorage.getItem("sessPositon")} </small>
                    </div>
                </div>
                {
                    sessionStorage.getItem('sessStr') == '1' ? (
                        <Menuadmin />
                    ) : (
                        <Menuuser />
                    )
                }

            </div>
        </nav>

    )
}
