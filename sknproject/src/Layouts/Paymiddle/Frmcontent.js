import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from '../../Content/Launder/Home/Frmhome'
import Fabric from '../../Content/Launder/Fabric/Frmfabric'
import Stockward from '../../Content/Launder/Stock/Frmstockward'
import Withdraw from '../../Content/Launder/Withdraw/Frmwithdraw'
import Testfrm from '../../Content/Launder/Withdraw/Frmtest'

export default function Frmcontent() {
    return (

        <div>
            
            <Route exact path="/" component={Home} />
            <Route path="/Content/Fabric" component={Fabric} />
            <Route path="/Content/Stock" component={Stockward} />
            <Route path="/Content/Withdraw" component={Withdraw} />

        </div>

    )
}
