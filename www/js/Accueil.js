if (typeof dir === 'undefined') {
    let dir = window.myGlobalDir;
}



function getProspectsByCrypt(crypt) {
    return new Promise(function (resolve, reject) {
        var data = "action=GetProspectsByCrypt&crypt=" + crypt;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", dir + '/ajax/ProspectUtils.php');
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            if (xhr.status === 200) {
                const responseObject = JSON.parse(xhr.response);
                resolve(responseObject);
            } else {
                reject(Error(xhr.statusText));
            }
        };
        xhr.onerror = function () {
            reject(Error("Network Error"));
        };
        xhr.send(data);
    });
}
function GetIdUserConnect() {
    return new Promise(function (resolve, reject) {
        var data = `action=getIdUserConnect&appToken=${getAppToken()}`;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", dir + '/ajax/AjaxUtils.php');
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            if (xhr.status === 200) {
                const responseObject = JSON.parse(xhr.response);
                resolve(responseObject);
            } else {
                reject(Error(xhr.statusText));
            }
        };
        xhr.onerror = function () {
            reject(Error("Network Error"));
        };
        xhr.send(data);
    });
}


document.addEventListener2('DOMContentLoaded', function () {


    GetIdUserConnect().then(function (response) {
        const idUserConnect = response.IdUserConnect;
        var crypt = document.getElementById('crypt').value;
        console.log(crypt);
        getProspectsByCrypt(crypt).then(function (json) {
            console.log(json);
            console.log(json.tabLinks);


            Highcharts.chart('container', {
                chart: {
                    type: 'spline',
                    scrollablePlotArea: {
                        minWidth: 600,
                        scrollPositionX: 1
                    }
                },
                title: {
                    text: 'Tableau de bord',
                    align: 'center'
                },
                subtitle: {
                    text: ' ',
                    align: 'left'
                },
                xAxis: {
                    type: 'datetime',
                    labels: {
                        overflow: 'justify'
                    }
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    minorGridLineWidth: 0,
                    gridLineWidth: 0,
                    alternateGridColor: null,
                    plotBands: []
                },
                tooltip: {
                    useHTML: true,
                    formatter: function () {
                        let index = this.series.data.indexOf(this.point);
                        var additionalInfo = '';
                        if (parseInt(json.tabClics[index]) > 0) {
                            Object.keys(json.tabLinks[index]).forEach(imgPath => {
                                additionalInfo += '<div style="display: inline-block; text-align: center; margin-right: 5px;">' +
                                    '<img style="height: 20px; width: 20px; border-radius: 15%;" src="' + dir + '/img/' + json.tabLinks[index][imgPath] + '" alt="' + json.tabLinks[index][imgPath] + '">' +
                                    '<p class="text-center" style="font-size: 10px;">' + imgPath + '</p>' +
                                    '</div>';
                            });
                        }
                        console.log(additionalInfo);
                        return '<b>' + this.series.name + ' : ' + this.y + '</b><br/>' +
                            Highcharts.dateFormat('%d/%m', this.x) + '  ' +
                            additionalInfo;
                    }
                },
                plotOptions: {
                    spline: {
                        lineWidth: 4,
                        states: {
                            hover: {
                                lineWidth: 5
                            }
                        },
                        marker: {
                            enabled: false
                        },
                        pointInterval: 86400000, // one minute
                        pointStart: Date.UTC(json.Y, json.m, json.d, 0, 0, 0)
                    }
                },
                series: [{
                    name: 'Nombre de bips',
                    data: json.tabBips

                }, {
                    name: 'Nombre de clics',
                    data: json.tabClics
                }],
                navigation: {
                    menuItemStyle: {
                        fontSize: '10px'
                    }
                }
            });
        });
    });
});
