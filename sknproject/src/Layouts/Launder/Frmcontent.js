import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from '../../Content/Launder/Home/Frmhome'
import Fabric from '../../Content/Launder/Fabric/Frmfabric'
import Stockward from '../../Content/Launder/Stock/Frmstockward'
import Withdraw from '../../Content/Launder/Withdraw/Frmwithdraw'
import Wash from '../../Content/Launder/Sendwash/Frmsendwash'
import Takedown from '../../Content/Launder/Takedown/Frmtake'
import Testfrm from '../../Content/Launder/Withdraw/Frmtest'
import Waste from '../../Content/Launder/Waste/Frmwaste'
import Losts from '../../Content/Launder/Losts/Frmlost'
import Withdrawadmin from '../../Content/Launder/Withdraw/FrmwithdrawAdmin'
import Recoupadmin from '../../Content/Launder/Recoup/FrmrecoupAdmin'
import Washsendadmin from '../../Content/Launder/Sendwash/FrmsendwashAdmin'
import Recoupdataadmin from '../../Content/Launder/Recoup/FrmrecoupdataAdmin'
import Accepting from '../../Content/Launder/Accepting/Frmaccepting'
import Offices from '../../Content/Offices/Frmoffice'
import Users from '../../Content/Launder/Users/Frmuser'

import Reprot_disburse from '../../Content/Launder/Reports/Frmreprotdisburse'
import Report_senwash from '../../Content/Launder/Reports/Frmreportsenwash'


export default function Frmcontent() {
    return (

        <div>

            <Route exact path="/" component={Home} />
            <Route path="/Content/Fabric" component={Fabric} />
            <Route path="/Content/Launder/Stock" component={Stockward} />
            <Route path="/Content/Launder/Withdraw" component={Withdraw} />
            <Route path="/Content/Launder/Sendwash" component={Wash} />
            <Route path="/Content/Launder/Takedown" component={Takedown} />
            <Route path="/Content/Launder/Reportsdisburse" component={Reprot_disburse} />
            <Route path="/Content/Launder/Reportsenwash" component={Report_senwash} />
            <Route path="/Content/Launder/Waste" component={Waste} />
            <Route path="/Content/Launder/Losts" component={Losts} />
            <Route path="/Content/Offices" component={Offices} />
            <Route path="/Content/Launder/Users" component={Users} />

            <Route path="/Content/Launder/Withdrawadmin" component={Withdrawadmin} />
            <Route path="/Content/Launder/Sendwashadmin" component={Washsendadmin} />
            <Route path="/Content/Launder/Recoup" component={Recoupadmin} />
            <Route path="/Content/Launder/Recoupdata" component={Recoupdataadmin} />
            <Route path="/Content/Launder/Accepting" component={Accepting} />

        </div>

    )
}
