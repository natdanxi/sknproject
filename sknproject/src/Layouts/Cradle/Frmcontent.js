import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Frmhome from '../../Content/Cardles/Homes/Frmhome'
import Frmreserve from '../../Content/Cardles/Reserves/Frmreserve'

export default function Frmcontent() {
    return (

        <>
            <Route exact path="/" component={Frmhome} />
            <Route path="/Cardles/Reserves/" component={Frmreserve} />
        </>

    )
}
