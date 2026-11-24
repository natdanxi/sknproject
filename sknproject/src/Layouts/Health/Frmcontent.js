import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from '../../Content/Health/Home/Frmhome'
import Office from '../../Content/Health/Office/Frmoffice'
import Department from '../../Content/Health/Office/Frmdepartment'
import Resultlabsetting from '../../Content/Health/Settings/FrmresultLabsetting'
import Register from '../../Content/Health/Registers/Frmregister'
import Frmhealth from '../../Content/Health/Healthcheck/Frmhealth'
import Frmhealthdata from '../../Content/Health/Healthdata/Frmhealthdata'



export default function Frmcontent() {
    return (

        <div>

            <Route exact path="/" component={Home} />
            <Route path="/Content/Health/Office/" component={Office} />
            <Route path="/Content/Health/Department/" component={Department} />
            <Route path="/Content/Health/Labsetting/" component={Resultlabsetting} />
            <Route path="/Content/Health/Registers/" component={Register} />
            <Route path="/Content/Health/Healthcheck/" component={Frmhealth} />
            <Route path="/Content/Health/Healthdata/" component={Frmhealthdata} />

        </div>

    )
}
