const ctx1 = document.getElementById('myChart1').getContext('2d');
const ctx2 = document.getElementById('myChart2').getContext('2d');
const ctx3 = document.getElementById('myChart3').getContext('2d');
let myChart1;
let myChart2;
let myChart3;
let lineX = [];
let lineY = [];
let lineType;
let totalAmountList = [];
let chartExist = false;
const container = document.getElementById("exampleModal");
const modal = new bootstrap.Modal(container);

const container2 = document.getElementById("staticBackdrop");
const modalConfirm = new bootstrap.Modal(container2);

const firebaseConfig = {
    apiKey: "AIzaSyAHMHAHTCMnkxL_N2zLyA52QliQtk5jaqQ",
    authDomain: "budgetmonitor-68d6a.firebaseapp.com",
    projectId: "budgetmonitor-68d6a",
    storageBucket: "budgetmonitor-68d6a.appspot.com",
    messagingSenderId: "407945418401",
    appId: "1:407945418401:web:03595ae744328b452fc2e0",
    measurementId: "G-8D67WHMPXL"
};
let getInfo;
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// $('#saveBtn').on('click', () => {
//     console.log('save btn clicked');

//     console.log($('#type-name').val(), $('#amount-no').val(), Date(), $('#types').val())
// })

function groupBy(objectArray, property) {
    // console.log(objectArray);
    return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        // Add object to list for given key's value
        acc[key].push(obj);
        return acc;
    }, {});
}
const dbUsers = db.collection('users')
const uid = localStorage.getItem('UID');

async function setData() {
    // let info = getEP();
    // console.log(uid);
    await getContent();
    // let lineX;
    // let lineY;
    let currentAmount;
    let objArray = getInfo;
    // console.log(objArray);
    date = new Date();
    let dateString = `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${date.toLocaleTimeString()}`;
    let dateOnly = date.toDateString().substring(4)
    let DoC;
    let amount = document.getElementById('amount-no').value
    let type;
    let dropDownTypeVal = $('#types').val()
    let inpTypeVal = $('#type-name').val().toLowerCase()

    if (inpTypeVal.trim() == 'credit') {
        document.getElementById('typeHelpD').innerText = "can't set debit as 'CREDIT' type"
        return
    }
    if ($('#inlineRadio1').is(':checked')) {
        DoC = 'debit'
    }
    else
        DoC = 'credit'

    if (DoC == 'debit') {
        // currentAmount = currentAmount - amount
        if (inpTypeVal.trim() == '')
            type = dropDownTypeVal
        else
            type = inpTypeVal
    }
    else {
        // currentAmount = currentAmount + Number(amount)

        // amount = 0;
        type = 'credit'  //currentAmount

    }


    let currAmount = 0
    if (Number(amount)) {
        if (Number(amount) <= 10 && DoC == 'debit') {
            document.getElementById('amountHelp').innerText = 'Amount less than 10 not acceptable'
            return
        }
        else {
            amount = Number(amount);

            if (Number(amount)) {
                document.getElementById('amountHelp').innerText = ''
                if ($('#inlineRadio1').is(':checked')) {
                    amount = Number(amount)
                    currAmount = totalAmountList[totalAmountList.length - 1]
                    if (currAmount * 0.90 < amount && currAmount > amount) {
                        $('#amountHelp').text(`Amount is greater than 90% ${currAmount * 0.90} of Current`)
                        modal.hide();
                        $('.confirmMsg').html(`Are You Sure... <br>Amt. after deduct. is <strong>$${(currAmount-amount).toFixed(2)}</strong>`)
                        modalConfirm.show()
                        $('#underConfirm').click(() => setData2(objArray, amount, dateString, DoC))
                        return
                    }
                    if (currAmount <= amount) {
                        $('#amountHelp').text('Debit Amount is greater than Current Amount')
                        return
                    }
                }
            }
            // document.getElementById("saveBtn").disabled = true;
            // totalAmountList.push(currentAmount)
            // objArray['Data'].push({
            //     "id": max + 1, "dateTime": dateString, price: Number(amount), "type": type, 'currentAmount': currentAmount, dateOnly: date.toDateString().substring(4)
            // })
            // console.log(objArray['Data']);

        }

    }
    else {
        document.getElementById('amountHelp').innerText = 'Invalid Amount'
        return
    }
    setData2(objArray, amount, dateString, DoC)
    // if ($('#inlineRadio1').is(':checked')) {
    //     DoC = 'debit'
    // }
    // else
    //     DoC = 'credit'
    // console.log(objArray,' objArray');
}
function setData2(objArray, amount, dateString, DoC) {
    let inpTypeVal = $('#type-name').val().toLowerCase()
    let dropDownTypeVal = $('#types').val()

    if (Object.keys(objArray).length === 1) {

        // $("#inlineRadio2").prop("checked", true);
        // console.log('111..');
        // let price = Number(amount)
        // console.log("undefin", objArray); // put the credit first
        totalAmountList.push(amount)
        objArray['Data'] = [{ id: 0, dateOnly: dateOnly, type: 'credit', price: amount, currentAmount: amount, dateTime: dateString }]

    }
    else {
        currentAmount = objArray['Data'][objArray['Data'].length - 1].currentAmount
        if (DoC == 'debit') {
            currentAmount = currentAmount - amount
            if (inpTypeVal.trim() == '')
                type = dropDownTypeVal
            else
                type = inpTypeVal
        }
        else {
            currentAmount = currentAmount + Number(amount)

            // amount = 0;
            type = 'credit'  //currentAmount

        }
        let max = -1;
        for (const iterator of objArray['Data']) {
            if (max < iterator.id)
                max = iterator.id
        }

        document.getElementById("saveBtn").disabled = true;
        totalAmountList.push(currentAmount)
        objArray['Data'].push({
            "id": max + 1, "dateTime": dateString, price: Number(amount), "type": type, 'currentAmount': currentAmount, dateOnly: date.toDateString().substring(4)
        })

    }
    modal.hide();
    modalConfirm.hide()
    let piepriceType = priceTypeFunction(objArray.Data)
    // console.log(myChart2.data.labels);
    // console.log(myChart2.data.datasets);
    if (myChart1 !== undefined) {
        myChart2.data.labels = Object.keys(piepriceType)
        myChart2.data.datasets[0].data = Object.values(piepriceType)
        myChart2.update();

        myChart1.data.labels = Object.keys(piepriceType)
        myChart1.data.datasets[0].data = Object.values(piepriceType)
        myChart1.data.datasets[1].data = Array(Object.values(piepriceType).length).fill(Object.values(piepriceType).reduce((a, b) => a + b, 0) / Object.values(piepriceType).length)
        myChart1.update();

        chartData(objArray.Data)
        myChart3.data.labels = lineX
        myChart3.data.datasets[0].data = totalAmountList
        myChart3.data.datasets[1].data = lineY
        myChart3.update();
    }
    console.log(totalAmountList);
    updateSummary(lineY.reduce((x, y) => x + y, 0), lineY.length, totalAmountList[totalAmountList.length - 1], objArray.Data);
    dbUsers.doc(uid).set(objArray).then((para) => {
        if ($('table tbody tr').length != 0) {
            let tr = $('<tr></tr>')
            let td1;
            let td2;
            if (objArray.Data[objArray.Data.length - 1].type == 'credit')
                td1 = $(`<td>-</td>`)
            else
                td1 = $(`<td>${objArray.Data[objArray.Data.length - 1].type[0].toUpperCase() + objArray.Data[objArray.Data.length - 1].type.substring(1)}</td>`)

            if (objArray.Data[objArray.Data.length - 1].type == 'credit')
                td2 = $(`<td style="color:green;"><span class="badge rounded-pill bg-success">${objArray.Data[objArray.Data.length - 1].price}</span></td>`)
            else
                td2 = $(`<td style="color:red;"><span class="badge rounded-pill bg-danger">-${objArray.Data[objArray.Data.length - 1].price}</span></td>`)

            let td3 = $(`<td>${objArray.Data[objArray.Data.length - 1].currentAmount}</td>`)
            let td4 = $(`<td>${objArray.Data[objArray.Data.length - 1].dateTime.replace(/\d{4}\s/, '')}</td>`)
            tr.append(td1).append(td2).append(td3).append(td4)
            $('table tbody').prepend(tr)
        }
        // console.log(para)
        // console.log(document.getElementById('content').value)
        document.getElementById("saveBtn").disabled = false;
        dataAdded(objArray)
    })
        .catch((err) => {
            console.log(err)
            document.getElementById("saveBtn").disabled = false;
        })

}

function dataAdded(dd) {
    let m = Object.keys(dd).length;
    if (m == 1) {
        $("#inlineRadio2").prop("checked", true);
        $('.noData').text('NO DATA!!')
        $('.noData').show();

        return false
    }
    else if (dd.Data.length == 1) {
        $('.noData').text('Not enough data')
        $('.noData').show();
        document.getElementsByClassName('alert')[0].style.display = 'block'
        document.getElementsByClassName('alert')[0].setAttribute('style', 'opacity:1 !important')
        // $('.noData').text('One more entry !')
        // $('.noData').show();
        if (!$('#transTable_wrapper').hasClass('container')) {
            drawTable()
            $('#transTable').DataTable({ "order": [] })
            $('#transTable_wrapper').addClass('container my-5')
        }
        return false
    }
    else {
        try {
            document.getElementsByClassName('alert')[0].setAttribute('style', 'opacity:0 !important')
            document.getElementsByClassName('alert')[0].style.display = 'none'
            if (!$('#transTable_wrapper').hasClass('container')) {
                drawTable()
                $('#transTable').DataTable({ "order": [] })
                $('#transTable_wrapper').addClass('container my-5')
            }
        }
        catch (e) {
            console.log('err', e);
        }
        $('.noData').hide();
        if (!chartExist) {
            createChart(dd)
            chartExist = true
        }
        return true;
    }

}

function updateSummary(a, b, c, data) {
    let date = new Date()
    let month = months[date.getMonth()].substring(0, 3)
    let year = date.getFullYear()
    $('#gistTotal').html(`Current total Amount is $ <strong>${c}</strong>`)
    $('#gistPrev10').html(`Last ${b} days expenditure sum is $ <strong>${a}</strong>`)
    let creditMonth = 0;
    for (let i = data.length - 1; i >= 0; i--) {
        if (/\w{3}\s/.exec(data[i].dateOnly)[0].trim() == month && /\s\d{4}/.exec(data[i].dateOnly)[0].trim() == year && data[i].type == 'credit') {
            creditMonth += data[i].price
        }
    }
    $('#gistCreditM').html(`This month's credit is $ <strong>${creditMonth}</strong>`)

}

function drawTable() {
    let headers = ['Product', 'Price', 'Total Amount', 'Date']
    let values = ['type', 'price', 'currentAmount', 'dateTime']
    let table = $('#transTable')
    let thead = $('thead')
    let tbody = $('tbody')
    let tr = $('<tr></tr>')
    let th = $('<th></th>')
    for (let i = 0; i < headers.length; i++) {
        th = $('<th></th>')
        th.text(headers[i])
        tr.append(th)
    }
    thead.append(tr)
    let tableRowData;
    for (let i = 0; i < getInfo.Data.length; i++) {
        tr = $('<tr></tr>')
        tableRowData = getInfo.Data[getInfo.Data.length - 1 - i]
        for (let j = 0; j < 4; j++) {
            td = $('<td></td>')
            if (j == 0) {
                if (tableRowData.type == 'credit')
                    td.text('-')
                else
                    td.text(tableRowData[values[j]][0].toUpperCase() + tableRowData[values[j]].substring(1))
            }
            else if (j == 1) {
                if (tableRowData.type == 'credit') {
                    td.html(`<span class="badge rounded-pill bg-success p-2">+${tableRowData[values[j]]}</span>`)
                    td.css("color", "green");
                }
                else {
                    td.html(`<span class="badge rounded-pill bg-danger p-2">-${tableRowData[values[j]]}</span>`)
                    td.css("color", "red");

                }
            }
            else if (j == 2) {
                if (tableRowData.type == 'credit') {
                    td.text(tableRowData[values[j]])
                }
                else {
                    td.text(tableRowData[values[j]])
                }
            }
            else
                td.text(tableRowData[values[j]].replace(/\d{4}\s/, ''));

            tr.append(td)
        }
        tbody.append(tr)
    }
    table.append(thead)
    table.append(tbody)
    // $('#transTable_wrapper').addClass('container')

}


function creditCheck() {
    document.getElementById('types').disabled = true
    document.getElementById('type-name').disabled = true
}
function debitCheck() {
    document.getElementById('types').disabled = false
    document.getElementById('type-name').disabled = false
}

document.getElementById('inlineRadio2').addEventListener('input', creditCheck)
document.getElementById('inlineRadio1').addEventListener('input', debitCheck)

document.getElementById('type-name').addEventListener('input', typeInfo)

function typeInfo() {
    let inpTypeVal = $('#type-name').val()
    if (inpTypeVal.trim() == '' || inpTypeVal.trim().toLowerCase() == 'credit')
        $('#typeHelpS').text('')
    else
        $('#typeHelpS').text(`'${inpTypeVal}' will be takes as new Type`)
}

function validateAmount() {
    let amount = document.getElementById('amount-no').value
    let currentAmount = 0
    if (Number(amount)) {
        document.getElementById('amountHelp').innerText = ''
        if ($('#inlineRadio1').is(':checked')) {
            amount = Number(amount)
            currentAmount = totalAmountList[totalAmountList.length - 1]
            if (currentAmount * 0.90 < amount && currentAmount >= amount) {
                $('#amountHelp').html(`Amount is greater than 90% <strong>(${currentAmount * 0.90})</strong> of Current`)
            }
            if (currentAmount <= amount) {
                $('#amountHelp').html(`Debit Amount is greater than Current Amount (<strong>${currentAmount}</strong>)`)
            }
        }
    } else
        document.getElementById('amountHelp').innerText = 'Invalid Amount'

}

document.getElementById('amount-no').addEventListener('input', validateAmount)

document.getElementById('saveBtn').addEventListener('click', setData);

async function getContent() {
    let uid = localStorage.getItem('UID');
    let dbUsers = await db.collection('users')
    await dbUsers.doc(uid).get().then((para) => {
        // console.log(para);
        getInfo = para.data();
        // return para.data();
    }).catch((err) => {
        console.log(err)
    })
}

function setDeviceInfo() {
    let browserName = navigator.userAgentData.brands[2].brand;
    let browserVersion = navigator.userAgentData.brands[2].version;
    let platformName = navigator.userAgentData.platform;
    let loginData = {
        'browserName': browserName,
        'browserVersion': browserVersion,
        'platformName': platformName,
        'loginDate': new Date().toDateString(),
        'loginTime': new Date().toTimeString(),
        'mobile': navigator.userAgentData.mobile
    }
    // console.log(getInfo);
    if (!getInfo.loginInfo) {
        getInfo['loginInfo'] = [loginData]
    }
    else {
        getInfo.loginInfo.push(loginData)
        if (getInfo.loginInfo.length > 10)
            getInfo.loginInfo.splice(0, getInfo.loginInfo.length - 10)
    }
    dbUsers.doc(uid).set(getInfo).then((para) => {
        document.getElementById("saveBtn").disabled = false;
    })
        .catch((err) => {
            console.log(err)
            document.getElementById("saveBtn").disabled = false;
        })
}

function getSummary(data) {
    let count = 0;
    for (let i = 0; i < data.length; i++) {
        if (count == 10) {
            count = 10
            break
        }
        if (data[i].type != 'credit')
            count++


    }
    let expenditure = 0;
    let creditMonth = 0;
    for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].type != 'credit')
            expenditure += data[i].price
    }

    let date = new Date()
    let month = months[date.getMonth()].substring(0, 3)
    let year = date.getFullYear()

    for (let i = data.length - 1; i >= 0; i--) {
        if (/\w{3}\s/.exec(data[i].dateOnly)[0].trim() == month && /\s\d{4}/.exec(data[i].dateOnly)[0].trim() == year && data[i].type == 'credit') {
            creditMonth += data[i].price
        }


    }
    document.getElementById('gistTotal').innerHTML = `Current total Amount is $ <strong>${data[data.length - 1].currentAmount}</strong>`
    document.getElementById('gistPrev10').innerHTML = `Last ${count} expenditure sum is $ <strong>${expenditure}</strong>`
    document.getElementById('gistCreditM').innerHTML = `This month's credit is $ <strong>${creditMonth}</strong>`
}

function priceTypeFunction(dataArray) {
    let priceTypeObj = {}
    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].type != 'credit') {
            if (!priceTypeObj[dataArray[i].type])
                priceTypeObj[dataArray[i].type] = dataArray[i].price;
            else
                priceTypeObj[dataArray[i].type] = priceTypeObj[dataArray[i].type] + dataArray[i].price;
        }
    }
    return priceTypeObj
}
// $( document ).ready(function() {
function chartData(data) {
    lineX = []
    lineType = []
    lineY = []
    totalAmountList = []
    lineX = Object.keys(groupBy(data, 'dateOnly'));
    // totalAmountList = []
    for (let i = 0; i < lineX.length; i++) {
        let a = groupBy(data, 'dateOnly')[lineX[i]]
        let sum = 0
        let strType = '';
        let lowDebit = Infinity;
        for (let j = 0; j < a.length; j++) {
            if (a[j].type !== 'credit') {
                sum += a[j].price
                if (lowDebit > a[j].currentAmount)
                    lowDebit = a[j].currentAmount
                strType += ' ' + a[j].type
            }
        }
        totalAmountList.push(a.slice(-1)[0].currentAmount)
        lineY.push(sum)
        lineType.push(strType)
    }
}
function createChart(data) {

    document.getElementById('myChart1').style.display = 'block';
    document.getElementById('myChart2').style.display = 'block';
    document.getElementById('myChart3').style.display = 'block';
    data = data['Data']
    // lineX ;
    // lineY ;
    lineType = []
    //     lineX = Object.keys(groupBy(data, 'dateOnly'));
    //     // totalAmountList = []
    //     for (let i = 0; i < lineX.length; i++) {
    //         let a = groupBy(data, 'dateOnly')[lineX[i]]
    //         let sum = 0
    //         let strType = '';
    //         let lowDebit = Infinity;
    //         for (let j = 0; j < a.length; j++) {
    //             if (a[j].type !== 'credit') {
    //                 sum += a[j].price
    //                 if (lowDebit > a[j].currentAmount)
    //                     lowDebit = a[j].currentAmount
    //                 strType += ' ' + a[j].type
    //             }
    //         }
    //         totalAmountList.push(a.slice(-1)[0].currentAmount)
    //         // console.log('aman',a.slice(-1)[0].currentAmount);
    //         lineY.push(sum)
    //         lineType.push(strType)
    //     }
    // console.log(data);
    chartData(data)
    // console.log(lineY, lineX);
    // console.log(lineType);

    // console.log(data);   // array of objects
    // document.getElementById('gistCard').style.display = 'block'
    // getSummary(data);
    updateSummary(lineY.reduce((x, y) => x + y, 0), lineY.length, totalAmountList[totalAmountList.length - 1], data)
    // let priceArray = []
    // let typeArray = []
    let priceTypeObj = priceTypeFunction(data);
    // for (let i = 0; i < data.length; i++) {
    //     // typeArray.push(data[i].type)
    //     // priceArray.push(data[i].price);
    //     if (data[i].type != 'credit') {
    //         if (!priceTypeObj[data[i].type])
    //             priceTypeObj[data[i].type] = data[i].price;
    //         else
    //             priceTypeObj[data[i].type] = priceTypeObj[data[i].type] + data[i].price;
    //     }
    // }
    const chartColors = {
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
        ]
    }
    myChart1 = new Chart(ctx1, {
        options: {
            responsive: true,
        },
        data: {
            datasets: [{
                type: 'bar',
                label: 'Product',
                data: Object.values(priceTypeObj),
                backgroundColor: chartColors['backgroundColor'],
                borderColor: chartColors['borderColor'],
                borderWidth: 1,
                hoverBorderWidth: 3,
            }, {
                type: 'line',
                label: 'Average Price',
                backgroundColor: ['rgba(255,0,0)'],
                borderColor: ['rgba(0,255,0)'],
                data: Array(Object.values(priceTypeObj).length).fill(Object.values(priceTypeObj).reduce((a, b) => a + b, 0) / Object.values(priceTypeObj).length),
            }],
            labels: Object.keys(priceTypeObj)
        }
    })

    myChart2 = new Chart(ctx2, {
        type: 'doughnut',
        options: {
            responsive: true,
        },
        data: {
            labels: Object.keys(priceTypeObj),
            datasets: [{
                hoverOffset: 10,
                hoverBorderWidth: 3,
                // label: 'Average Price',
                data: Object.values(priceTypeObj),
                backgroundColor: chartColors['backgroundColor'],
                borderColor: chartColors['borderColor'],
                borderWidth: 1
            }]
        }

    })
    // document.getElementById('addData').addEventListener('click', () => {
    // myChart3.data.labels=['aman','aanchal']
    // myChart3.data.datasets[0].data=[210,100]
    // myChart3.update();
    // })
    for (let i of Object.keys(priceTypeObj)) {
        option = $(`<option value="${i}">${i[0].toUpperCase() + i.substring(1)}</option>`)
        $('#types').append(option)
    }
    // $('#types').change(function () {

    // })

    // $('#addData').popover({
    //     trigger: 'hover',
    //     content: 'Add Data',
    //     delay: { "show": 100, "hide": 300 },
    // })

    // let dateToObj={}
    // for (let i of data) {
    // dateToObj[i.dateTime]=i;
    // }

    // data.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    // return new Date(b.dateTime) - new Date(a.dateTime);
    // });

    // const d = new Date();
    // let day = days[d.getDay()];
    // days[new Date(obj.dateTime).getDay()]

    let xLabel = data.map(obj => new Date(obj.dateTime).getDate() + ' ' + months[new Date(obj.dateTime).getMonth()]);
    let yLabel = data.map(obj => obj.currentAmount)
    let typeName = data.map(obj => obj.type)

    let lineDD = {
        labels: lineX,
        datasets: [
            {
                hoverBorderWidth: 5,
                label: 'Total: ',
                data: totalAmountList,
                borderColor: '#36a2eb',
                // backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
            },
            {
                hoverBorderWidth: 5,
                type: 'line',
                label: 'Expenditure: ',
                data: lineY,
                borderColor: '#ff6384',
                // backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
            }
        ]
    };
    myChart3 = new Chart(ctx3, {
        type: 'line',
        data: lineDD,
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            stacked: false,
            plugins: {
                title: {
                    display: true,
                    // text: 'Chart.js Line Chart - Multi Axis'
                }
            },
        },
    })
}
document.getElementById('addData').addEventListener('click', () => {
    if (getInfo.Data) {
        document.getElementById('inlineRadio1').disabled = false;
        if (getInfo.Data[getInfo.Data.length - 1].currentAmount == 0) {
            document.getElementById('inlineRadio1').disabled =true;
            $("#inlineRadio2").prop("checked", true);
            document.getElementById('types').disabled = true;
            document.getElementById('type-name').disabled = true;
        }

    } else {
        document.getElementById('inlineRadio1').disabled = true;
        $("#inlineRadio2").prop("checked", true);
        document.getElementById('types').disabled = true;
        document.getElementById('type-name').disabled = true;

    }
})
async function main() {
    // const response = await fetch('data.json');
    // let data = await response.json();
    await getContent();
    $('#addData').attr('href', '');
    $('#offCan').attr('href', '');
    $('#logOut').attr('href', '');
    document.getElementById('firstL').style.display = 'none';
    document.getElementById('firstS').style.display = 'none';
    document.getElementById('firstT').style.display = 'none';

    let data = getInfo;
    document.getElementById('gistGIF').style.display = 'none'
    setDeviceInfo();
    if (!dataAdded(data))
        return false
    if (!chartExist) {
        createChart(data)
        chartExist = true
    }
    // if (Object.keys(data).length == 1) {
    //     $("#inlineRadio2").prop("checked", true);
    //     $('.noData').text('NO DATA!!')
    //     $('.noData').show();

    //     return false
    // }
    // else if (data.Data.length == 1) {
    //     $('.noData').text('Not enough data')
    //     $('.noData').show();
    //     document.getElementsByClassName('alert')[0].style.display = 'block'
    //     document.getElementsByClassName('alert')[0].setAttribute('style', 'opacity:1 !important')
    //     // $('.noData').text('One more entry !')
    //     // $('.noData').show();
    //     return false
    // }
    // else {
    //     document.getElementsByClassName('alert')[0].setAttribute('style', 'opacity:0 !important')
    //     document.getElementsByClassName('alert')[0].style.display = 'none'
    //     $('.noData').hide();
    //     drawTable()
    //     $('#transTable').DataTable({ "order": [] })
    //     $('#transTable_wrapper').addClass('container my-5')

    // }
    // getDeviceInfo();  ///////////////////////
    // document.getElementById('myChart1').style.display = 'block';
    // document.getElementById('myChart2').style.display = 'block';
    // document.getElementById('myChart3').style.display = 'block'; try {
    $('#deviceInfo').text(`${getInfo.loginInfo[getInfo.loginInfo.length - 2].browserName} v${getInfo.loginInfo[getInfo.loginInfo.length - 2].browserVersion} ${getInfo.loginInfo[getInfo.loginInfo.length - 2].platformName}`)

    $('#lastLoginTime').text(getInfo.loginInfo[getInfo.loginInfo.length - 2].loginDate + ' ' + getInfo.loginInfo[getInfo.loginInfo.length - 2].loginTime)
    // console.log(getInfo.loginInfo[getInfo.loginInfo.length - 2].time);
    if (getInfo.loginInfo[getInfo.loginInfo.length - 2].mobile)
        $('#deviceLogo').attr("src", "res/smartphone.png");
    else
        $('#deviceLogo').attr("src", "res/computer.png");
    $('.toast').toast('show');
    // }
    // catch (error) {
    // }
    // // createChart(data);

    //     document.getElementById('myChart1').style.display = 'block';
    //     document.getElementById('myChart2').style.display = 'block';
    //     document.getElementById('myChart3').style.display = 'block';
    //     data = data['Data']
    //     // lineX ;
    //     // lineY ;
    //     lineType = []
    //     //     lineX = Object.keys(groupBy(data, 'dateOnly'));
    //     //     // console.log(lineX);
    //     //     // console.log(groupBy(lineX, 'dateOnly'));
    //     //     // totalAmountList = []
    //     //     for (let i = 0; i < lineX.length; i++) {
    //     //         let a = groupBy(data, 'dateOnly')[lineX[i]]
    //     //         // console.log(a);
    //     //         let sum = 0
    //     //         let strType = '';
    //     //         let lowDebit = Infinity;
    //     //         for (let j = 0; j < a.length; j++) {
    //     //             if (a[j].type !== 'credit') {
    //     //                 sum += a[j].price
    //     //                 if (lowDebit > a[j].currentAmount)
    //     //                     lowDebit = a[j].currentAmount
    //     //                 strType += ' ' + a[j].type
    //     //             }
    //     //             // console.log(data[i],sum)
    //     //         }
    //     //         totalAmountList.push(a.slice(-1)[0].currentAmount)
    //     //         // console.log('aman',a.slice(-1)[0].currentAmount);
    //     //         lineY.push(sum)
    //     //         lineType.push(strType)
    //     //     }
    //     // console.log(data);
    //     chartData(data)
    //     // console.log(lineY, lineX);
    //     // console.log(lineType);

    //     // console.log(data);   // array of objects
    //     // document.getElementById('gistCard').style.display = 'block'
    //     // getSummary(data);
    //     updateSummary(lineY.reduce((x, y) => x + y, 0), lineY.length, totalAmountList[totalAmountList.length - 1], data)
    //     // let priceArray = []
    //     // let typeArray = []
    //     let priceTypeObj = priceTypeFunction(data);
    //     // for (let i = 0; i < data.length; i++) {
    //     //     // typeArray.push(data[i].type)
    //     //     // priceArray.push(data[i].price);
    //     //     if (data[i].type != 'credit') {
    //     //         if (!priceTypeObj[data[i].type])
    //     //             priceTypeObj[data[i].type] = data[i].price;
    //     //         else
    //     //             priceTypeObj[data[i].type] = priceTypeObj[data[i].type] + data[i].price;
    //     //     }
    //     // }
    //     // console.log(priceTypeObj);
    // console.log(lineX,lineY,totalAmountList);
    //     myChart1 = new Chart(ctx1, {
    //         options: {
    //             responsive: true,
    //         },
    //         data: {
    //             datasets: [{
    //                 type: 'bar',
    //                 label: 'Bar Dataset',
    //                 data: Object.values(priceTypeObj),
    //                 backgroundColor: [
    //                     'rgba(255, 99, 132, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)',
    //                     'rgba(255, 205, 86, 0.2)',
    //                     'rgba(75, 192, 192, 0.2)',
    //                     'rgba(54, 162, 235, 0.2)',
    //                     'rgba(153, 102, 255, 0.2)',
    //                     'rgba(201, 203, 207, 0.2)'
    //                 ],
    //                 borderColor: [
    //                     'rgb(255, 99, 132)',
    //                     'rgb(255, 159, 64)',
    //                     'rgb(255, 205, 86)',
    //                     'rgb(75, 192, 192)',
    //                     'rgb(54, 162, 235)',
    //                     'rgb(153, 102, 255)',
    //                     'rgb(201, 203, 207)'
    //                 ],
    //                 borderWidth: 1
    //             }, {
    //                 type: 'line',
    //                 label: 'Average Price',
    //                 backgroundColor: ['rgba(255,0,0)'],
    //                 borderColor: ['rgba(0,255,0)'],
    //                 data: Array(Object.values(priceTypeObj).length).fill(Object.values(priceTypeObj).reduce((a, b) => a + b, 0) / Object.values(priceTypeObj).length),
    //             }],
    //             labels: Object.keys(priceTypeObj)
    //         }
    //     })
    //     // console.log(Array(Object.values(priceTypeObj).length).fill(Object.values(priceTypeObj).reduce((a, b) => a + b, 0) / Object.values(priceTypeObj).length))

    //     myChart2 = new Chart(ctx2, {
    //         type: 'doughnut',
    //         options: {
    //             responsive: true,
    //         },
    //         data: {
    //             labels: Object.keys(priceTypeObj),
    //             datasets: [{
    //                 label: 'Average Price',
    //                 data: Object.values(priceTypeObj),
    //                 backgroundColor: [
    //                     'rgba(255, 99, 132, 0.2)',
    //                     'rgba(54, 162, 235, 0.2)',
    //                     'rgba(255, 206, 86, 0.2)',
    //                     'rgba(75, 192, 192, 0.2)',
    //                     'rgba(153, 102, 255, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)'
    //                 ],
    //                 borderColor: [
    //                     'rgba(255, 99, 132, 1)',
    //                     'rgba(54, 162, 235, 1)',
    //                     'rgba(255, 206, 86, 1)',
    //                     'rgba(75, 192, 192, 1)',
    //                     'rgba(153, 102, 255, 1)',
    //                     'rgba(255, 159, 64, 1)'
    //                 ],
    //                 borderWidth: 1
    //             }]
    //         }

    //     })
    //     for (let i of Object.keys(priceTypeObj)) {
    //         option = $(`<option value="${i}">${i}</option>`)
    //         $('#types').append(option)
    //     }
    //     // $('#types').change(function () {
    //     //     console.log('change', $(this).val());

    //     // })

    //     // $('#addData').popover({
    //     //     trigger: 'hover',
    //     //     content: 'Add Data',
    //     //     delay: { "show": 100, "hide": 300 },
    //     // })

    //     // let dateToObj={}
    //     // for (let i of data) {
    //     // console.log(i.dateTime);
    //     // dateToObj[i.dateTime]=i;
    //     // }
    //     // console.log(dateToObj);

    //     // data.sort(function (a, b) {
    //     // Turn your strings into dates, and then subtract them
    //     // to get a value that is either negative, positive, or zero.
    //     // return new Date(b.dateTime) - new Date(a.dateTime);
    //     // });
    //     // console.log(data);

    //     // const d = new Date();
    //     // let day = days[d.getDay()];
    //     // days[new Date(obj.dateTime).getDay()]

    //     let xLabel = data.map(obj => new Date(obj.dateTime).getDate() + ' ' + months[new Date(obj.dateTime).getMonth()]);
    //     let yLabel = data.map(obj => obj.currentAmount)
    //     let typeName = data.map(obj => obj.type)

    //     // console.log(lineX, lineY, totalAmountList);
    //     // myChart3 = new Chart(ctx3, {
    //     //     type: 'line',
    //     //     data: {
    //     //         labels: lineX,
    //     //         datasets: [{
    //     //             pointStyle: 'circle',
    //     //             radius: 6,
    //     //             hoverRadius: 10,
    //     //             backgroundColor: '#ff6384',
    //     //             // fill: {

    //     //             //     target: 'origin',
    //     //             //     above: '#ff6384',   // Area will be red above the origin
    //     //             //     below: '#ff6384'    // And blue below the origin
    //     //             // },
    //     //             label: 'Price',
    //     //             data: lineY,
    //     //             borderColor: '#ff6384'  //#36a2eb
    //     //             // borderColor:
    //     //             //                 function(context) {
    //     //             //                     // console.log(context.raw);

    //     //             //                     let bordercolor= context.raw>0? 'lightgreen':'black';
    //     //             //                     // console.log(bordercolor);
    //     //             //                     return {
    //     //             //                         borderColor: bordercolor,
    //     //             // }}}]
    //     //         }, {

    //     //             pointStyle: 'line',
    //     //             radius: 6,
    //     //             hoverRadius: 10,
    //     //             backgroundColor: 'blue',
    //     //             // fill: {

    //     //             //     target: 'origin',
    //     //             //     above: '#ff6384',   // Area will be red above the origin
    //     //             //     below: '#ff6384'    // And blue below the origin
    //     //             // },
    //     //             label: 'Price',
    //     //             data: totalAmountList,
    //     //             borderColor: '#36a2eb'  //
    //     //             // borderColor:
    //     //             //                 function(context) {
    //     //             //                     // console.log(context.raw);

    //     //             //                     let bordercolor= context.raw>0? 'lightgreen':'black';
    //     //             //                     // console.log(bordercolor);
    //     //             //                     return {
    //     //             //                         borderColor: bordercolor,
    //     //             // }}}]

    //     //             // }, {


    //     //             //     pointStyle: 'circle',
    //     //             //     radius: 6,
    //     //             //     hoverRadius: 10,
    //     //             //     backgroundColor: '#36a2eb',
    //     //             // fill: {

    //     //             //     target: 'origin',
    //     //             //     above: '#ff6384',   // Area will be red above the origin
    //     //             //     below: '#ff6384'    // And blue below the origin
    //     //             // },
    //     //             // label: 'Price',
    //     //             // data: [300, 100],
    //     //             // borderColor: '#36a2eb'  //
    //     //             // borderColor:
    //     //             //                 function(context) {
    //     //             //                     // console.log(context.raw);

    //     //             //                     let bordercolor= context.raw>0? 'lightgreen':'black';
    //     //             //                     // console.log(bordercolor);
    //     //             //                     return {
    //     //             //                         borderColor: bordercolor,
    //     //             // }}}]


    //     //         }]
    //     //     },
    //     //     options: {

    //     //         responsive: true,

    //     //         plugins: {
    //     //             tooltip: {
    //     //                 cornerRadius: 6,
    //     //                 backgroundColor: '#ff6384',
    //     //                 titleColor: '#000000',
    //     //                 borderColor: '#ff6384',
    //     //                 usePointStyle: false,
    //     //                 borderWidth: 2,
    //     //                 callbacks: {
    //     //                     title: function (t, d) {
    //     //                         // console.log(t, d);
    //     //                         return "Today's:$ " + lineY[t[0].dataIndex];
    //     //                     },
    //     //                     label: function (t, d) {

    //     //                         return lineType[t.dataIndex] + ' Total: ' + totalAmountList[t.dataIndex];
    //     //                     },
    //     //                     // labelColor: function (context) {

    //     //                     //     let bordercolor = context.raw > 0 ? 'lightgreen' : 'black';
    //     //                     //     return {
    //     //                     //         borderColor: bordercolor,
    //     //                     //         backgroundColor: 'rgb(255,0,0)',
    //     //                     //         // color:'#000000',
    //     //                     //         borderWidth: 2,
    //     //                     //         borderDash: [2, 2],
    //     //                     //         borderRadius: 2,
    //     //                     //     };
    //     //                     // },
    //     //                     borderColor: '#ff6384',
    //     //                     labelTextColor: function (context) {
    //     //                         return '#000000';
    //     //                     }
    //     //                 },

    //     //             }
    //     //         }
    //     //     }
    //     // })



    //     // console.log(myChart3.data.datasets);
    //     // console.log(myChart3.data.labels);
    //     // }
    //     // console.log(lineX, lineY, totalAmountList);
    //     let lineDD = {
    //         labels: lineX,
    //         datasets: [
    //             {
    //                 label: 'Total: ',
    //                 data: totalAmountList,
    //                 borderColor: '#36a2eb',
    //                 // backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
    //             },
    //             {
    //                 type: 'line',
    //                 label: 'Expenditure: ',
    //                 data: lineY,
    //                 borderColor: '#ff6384',
    //                 // backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
    //             }
    //         ]
    //     };
    //     myChart3 = new Chart(ctx3, {
    //         type: 'line',
    //         data: lineDD,
    //         options: {
    //             responsive: true,
    //             interaction: {
    //                 mode: 'index',
    //                 intersect: false,
    //             },
    //             stacked: false,
    //             plugins: {
    //                 title: {
    //                     display: true,
    //                     // text: 'Chart.js Line Chart - Multi Axis'
    //                 }
    //             },
    //         },
    //     })


}

window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("gifLoader").style.display = "none";
    $('#addData').removeAttr('href');
    $('#offCan').removeAttr('href');
    $('#logOut').removeAttr('href');
    this.document.getElementById('noLoginBtn').addEventListener('click', () => {
        location.href = 'index.html'
    })
    if (localStorage.getItem('UID') == null) {
        $('.noLogin').show(1000);
        $('#noLoginBtn').show(10);
        return false;
    }
    document.getElementById("wrapper").style.display = "block";

    document.getElementById('logOut').addEventListener('click', () => {
        localStorage.removeItem('UID')
        location.href = 'index.html';

    })

    let hue = 0
    window.addEventListener('scroll', () => {
        hue += Math.floor(Math.random() * 15);
        this.document.getElementById('titleBM').style.color = 'hsl(' + hue + ',100%,50%)';
    })

    main()

});

const radioButtons = document.querySelectorAll('input[name="theme"]');

for (var i = 0; i < radioButtons.length; i++) {
    radioButtons[i].addEventListener('change', function() {
        // (prev) ? console.log(prev.value): null;
        // if (this !== prev) {
        //     prev = this;
        // }
        console.log(this.value)
        document.getElementsByTagName('link')[4].setAttribute('href',`res/${this.value}.css`);
    });
}

// $('#themeChange').click(()=>{
// })

function reveal() {
    var reveals = document.querySelectorAll(".reveal");
  
    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 200;
  
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
    } else {
        reveals[i].classList.remove("active");
      }
    }
  }
  
  window.addEventListener("scroll", reveal);
  