import React, { Component } from 'react';
import logoSKN from '../../../assets/Images/sknlogo.png'

export default class FrmrecoupAdminprint extends Component {

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
                Orderdate: row[0].Orderdate,
                Ordertime: row[0].Ordertime,
                Recoupuser: row[0].Recoupuser,
                Recoupuserpositon: row[0].Recoupuserpositon
            })
        }

    }

    render() {

        var { dataRow } = this.state;

        return (
            <>
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
                                    <td className='td' width="36%">&nbsp;รายการผ้า</td>
                                    <td className='td' width="9%">&nbsp;คงเหลือในตู้</td>
                                    <td className='td' width="7%">&nbsp;ยอดเบิก</td>
                                    <td className='td' width="8%">&nbsp;ยอดผู้ป่วย</td>
                                    <td className='td' width="7%">&nbsp;จ่าย</td>
                                    <td className='td' width="7%">&nbsp;ค้างจ่าย</td>
                                    <td className='td' width="26%">&nbsp;หมายเหตุ</td>
                                </tr>
                                {
                                    dataRow.map((item, row) =>
                                        <tr>
                                            <td className='td'>&nbsp;{item.FabricName}</td>
                                            <td className='td'>&nbsp;{item.Stocknum}</td>
                                            <td className='td'>&nbsp;{item.Borrow}</td>
                                            <td className='td'>&nbsp;{item.Patientnum}</td>
                                            <td className='td'>&nbsp;{item.Recoupnum}</td>
                                            <td className='td'>&nbsp;{parseInt(item.Borrow)-parseInt(item.Recoupnum)}</td>
                                            <td className='td'>&nbsp;{item.Other}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        <div><p />
                            {
                                this.state.orderusersend == '' ? (
                                    <p>ผู้เบิก......................................................ตำแหน่ง......................................................</p>
                                ) : (
                                    <p>ผู้เบิก &nbsp;&nbsp;{this.state.orderusersend}&nbsp;&nbsp; ตำแหน่ง &nbsp;&nbsp; {this.state.orderusersendOption} &nbsp;&nbsp;</p>
                                )
                            }
                            {
                                this.state.Orderuserreceive == '' ? (
                                    <p>ผู้รับ......................................................ตำแหน่ง......................................................................</p>
                                ) : (
                                    <p>ผู้รับ &nbsp;&nbsp;{this.state.Orderuserreceive}&nbsp;&nbsp; ตำแหน่ง &nbsp;&nbsp; {this.state.PositionReceive} &nbsp;&nbsp;</p>
                                )
                            }

                            {
                                this.state.Recoupuser == '' ? (
                                    <p>ผู้จ่าย......................................................ตำแหน่ง....................................................................</p>
                                ) : (
                                    <p>ผู้จ่าย {this.state.Recoupuser} ตำแหน่ง {this.state.Recoupuserpositon} </p>
                                )
                            }

                        </div>
                    </div>

                </div>
            </>
        )
    }
}
