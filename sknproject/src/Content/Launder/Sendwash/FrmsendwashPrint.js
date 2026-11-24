import React, { Component } from 'react'
import logoSKN from '../../../assets/Images/sknlogo.png'

export default class FrmsendwashPrint extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataRow: [],
            orderusersend: '',
            orderusersendOption: '',
            Orderuserreceive: '',
            PositionReceive: '',
            Officename: '',
            Orderdate: '',
            Ordertime: '',
        };
    }

    componentDidMount() {

        const { row } = this.props;

        if (row != '') {
            this.setState({
                dataRow: row,
                orderusersend: row[0].Orderusersend,
                orderusersendOption: row[0].PositionSend,
                Orderuserreceive: row[0].Receiveuserid,
                PositionReceive: row[0].Receiveuserposition,
                Officename: row[0].Officename,
                Orderdate: row[0].Senddate,
                Ordertime: row[0].Sendtime,
                Recoupuser: row[0].fullname,
                Recoupuserpositon: row[0].Position
            })
        }

    }

    render() {

        var { dataRow } = this.state;

        return (
            <div style={{ padding: 10 }}>
                <div>
                    <div className='admin-block d-flex'>
                        <div><img src={logoSKN} width="40px" height="45px" /></div>
                        <div className='admin-info'>
                            <div className='font-strong'>ใบรับส่งผ้าโรงพยาบาลสกลนคร</div>
                            <span>หน่วยงาน : {this.state.Officename} วันที่ {this.state.Orderdate} เวลา {this.state.Ordertime} </span>
                        </div>
                    </div>
                    <table width="100%" border={0} cellPadding={0} cellSpacing={1} className='csstable'>
                        <tbody>
                            <tr>
                                <td className='td' width="9%">&nbsp;ลำดับ</td>
                                <td className='td' width="15%">&nbsp;รหัส</td>
                                <td className='td' width="50%">&nbsp;รายการผ้า</td>
                                <td className='td' width="9%">&nbsp;จำนวน</td>
                                <td className='td' width="40%">&nbsp;หมายเหตุ</td>
                            </tr>
                            {
                                dataRow.map((item, row) =>
                                    <tr>
                                        <td className='td'>&nbsp;{row+1}</td>
                                        <td className='td'>&nbsp;{item.FabricID}</td>
                                        <td className='td'>&nbsp;{item.FabricName}</td>
                                        <td className='td'>&nbsp;{item.Sendnum}</td>
                                        <td className='td'>&nbsp;{item.Sendother}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    <div><p />
                        {
                            this.state.Recoupuser == '' ? (
                                <p>ผู้ส่งซัก......................................................ตำแหน่ง......................................................</p>
                            ) : (
                                <p>ผู้ส่งซัก &nbsp;&nbsp;{this.state.Recoupuser}&nbsp;&nbsp; ตำแหน่ง &nbsp;&nbsp; {this.state.Recoupuserpositon} &nbsp;&nbsp;</p>
                            )
                        }

                    </div>
                </div>

            </div>
        )
    }
}
