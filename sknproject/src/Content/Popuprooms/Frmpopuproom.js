import React, { useEffect, useState } from 'react'
import API from '../../Config/config'
import Select from 'react-select'

export default function Frmpopuproom() {

    const [listrooms, setlistrooms] = useState({});
    const inputData = {
        t_officeid: sessionStorage.getItem('sessOfficeid'), t_userid: sessionStorage.getItem('sessuserID'),
        t_roomID: ''
    }
    const [txtvalue, settxtvalue] = useState(inputData);

    useEffect(() => {

        Showlistroom();

    }, []);

    async function Showlistroom() {

        if (sessionStorage.getItem('sessProjectid') == "04") {

            fetch(API.Cardles.resultAPI + "RegisterAPI.php?module=Showlistroom")
                .then(response => {
                    return response.json();
                })
                .then(data => {

                    setlistrooms(data);

                })
                .catch(error => {
                    console.log(error);
                });

        } else if (sessionStorage.getItem('sessProjectid') == "03") {

            setlistrooms([
                { value: '01S', label: 'คลินิกโรคจากการทำงาน' },
                { value: '02S', label: 'ศูนย์รักษ์สุขภาพ' },
                { value: '03S', label: 'ศูนย์รักษ์สุขภาพ (ออกหน่วย)' },
            ])

        }




    }

    async function Onchangeselect(even) {

        sessionStorage.setItem('sessOfficeid', even.value);
        sessionStorage.setItem('sessOfficename', even.label);
        window.location.reload();

    }

    return (
        <div className="ibox-body">
            <form>
                <div className="form-group">
                    <label> ห้องตรวจ </label>
                    <Select
                        //value={listrooms.find(obj => obj.value === txtvalue.t_roomID)}
                        options={listrooms}
                        onChange={even => Onchangeselect(even)}
                    />
                </div>
            </form>
        </div>
    );
}
