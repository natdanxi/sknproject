export default{
    dataSource : {
        //โปรแกรมซักฟอก
        //code : 'http://localhost:8080/sknprojectAPI/LaunderAPI/',
        //code : 'https://sknhospital.moph.go.th/sknprojectAPI/Launder/',
        code : 'http://192.168.211.51/sknprojectAPI/LaunderAPI/', //server เก่า
        //code2 : 'https://sknhospital.moph.go.th/LaundryAPI/api/', //server ใหม่
        code2 : 'http://webintranet/LaundryAPI/api/', //Server 42.7
        url : 'https://localhost:7182/api/'
    },
    loopbackAPI: {
        url: 'https://localhost:3000/'
    },
    partFile: {
        //โปรแกรมซักฟอก
        //file: 'http://localhost:8080/sknprojectAPI/LaunderAPI/File/'
        file : 'https://sknhospital.moph.go.th/sknprojectAPI/Launder/',
    },
    downloadFile:{
        //file: 'http://localhost:8080/sknhospitalAPI/'
        file: 'https://sknhospital.moph.go.th/sknhospitalAPI/'
        //file: 'https://192.168.42.21/sknhospitalAPI/'
    },
    Health: {
        //โปรแกรมตรวจสุขภาพ
        //code : 'http://localhost:8080/sknprojectAPI/Health/'
        code : 'https://sknhospital.moph.go.th/sknprojectAPI/Health/',
    },
    Cardles: {
        //โปรแกรมจองเปล
        //resultAPI : 'http://localhost:8080/sknprojectAPI/CardleAPI/',
        resultAPI : 'http://192.168.211.51/sknprojectAPI/CardleAPI/',
    }
}
//E:\WEBAPI\Laundry