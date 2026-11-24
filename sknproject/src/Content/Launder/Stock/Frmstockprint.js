import React, { Component } from 'react'

export default class Frmstockprint extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataRow: [],
        };
    }

    componentDidMount() {

        const { row } = this.props;

        this.setState({
            dataRow: row,
        })

    }


    render() {

        var { dataRow } = this.state;

        return (
            <div style={{padding: 20}}>
                <div>
                    <h>รายการผ้า {sessionStorage.getItem('sessOfficename')}</h>
                </div>
                <table className='csstable' width="100%" border={0} cellPadding={0} cellSpacing={1}>
                    <tbody>
                        <tr>
                            <td className='td' width={118} align="center">รหัส</td>
                            <td className='td' width={599} align="center">รายการผ้า</td>
                            <td className='td' width={615} align="center">บันทึกการใช้ผ้า</td>
                        </tr>
                        {
                            dataRow.map((item, row) =>
                                <tr>
                                    <td className='td'>&nbsp;{item.FabricID}</td>
                                    <td className='td'>&nbsp;{item.FabricName}</td>
                                    <td className='td'>&nbsp;</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>

            </div>
        )
    }
}
