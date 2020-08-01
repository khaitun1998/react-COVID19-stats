import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import "./Home.css";
import moment from "moment";
import numeral from 'numeral';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

let compare = (a, b) => {
    const genreA = a.province_name.toUpperCase();
    const genreB = b.province_name.toUpperCase();

    let comparison = 0;
    if (genreA > genreB) {
        comparison = 1;
    } else if (genreA < genreB) {
        comparison = -1;
    }
    return comparison;
}

let NavBar = () => {
    return (
        <nav className="indigo darken-3">
            <div className="nav-wrapper">
                <a href="# " className="brand-logo center">
                    COVID-19
                </a>
            </div>
        </nav>
    );
};

let UpdatedTime = ({ time }) => {
    return (
        <span>
      <i>
        Lần cập nhập cuối: <b>{moment.unix(time).format("DD/MM/YYYY h:mm:ss a")}</b>
      </i>
    </span>
    );
};

let CovidTable = ({data}) => {
    const rows = data.map(row => {
        return (
            <tr key={row.id}>
                <td>{row.province_name}</td>
                <td>
                    {numeral(row.confirmed).format(0, 0)} ca{" "}
                    <b>(Tăng {numeral(row.increase_confirmed).format(0,0)} ca)</b>
                </td>
                <td>
                    {numeral(row.recovered).format(0,0)} ca <b>(Tăng {numeral(row.increase_recovered).format(0,0)} ca)</b>
                </td>
                <td>
                    {numeral(row.deaths).format(0,0)} ca <b>(Tăng {numeral(row.increase_deaths).format(0,0)} ca)</b>
                </td>
            </tr>
        );
    });

    return (
        <table className="striped highlight centered responsive-table">
            <thead>
                <tr>
                    <th>Tỉnh thành</th>
                    <th>Số ca nhiễm</th>
                    <th>Số ca hồi phục</th>
                    <th>Số ca tử vong</th>
                </tr>
            </thead>

            <tbody>{rows}</tbody>
        </table>
    );
};

let CovidChart = ({ chartData, chartID }) => {
    const chart = useRef(null);

    if(chartID === "dataTG") chartData = chartData.filter(function(el) { return el.province_name !== "Thế giới"; })
    else if(chartID === "dataVN") chartData = chartData.filter(function(el) { return el.province_name !== "Việt Nam"; })

    useLayoutEffect(() => {
        // Create chart instance
        let x = am4core.create(chartID, am4charts.XYChart);

        // Add data
        x.data = chartData;

        // Create axes
        let categoryAxis = x.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "province_name";
        categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.renderer.labels.template.hideOversized = false;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.tooltip.label.rotation = 270;
        categoryAxis.tooltip.label.horizontalCenter = "right";
        categoryAxis.tooltip.label.verticalCenter = "middle";

        let valueAxis = x.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.disabled = true;
        valueAxis.min = 0;

        // Create series
        function createSeries(field, name) {
            // Set up series
            let series = x.series.push(new am4charts.ColumnSeries());
            series.name = name;
            series.dataFields.valueY = field;
            series.dataFields.categoryX = "province_name";
            series.sequencedInterpolation = true;

            // Make it stacked
            series.stacked = true;

            // Configure columns
            series.columns.template.width = am4core.percent(60);
            series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";

            // Add label
            let labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = "{valueY}";
            labelBullet.locationY = 0.5;
            labelBullet.label.hideOversized = true;

            return series;
        }

        createSeries("confirmed", "Số ca nhiễm");
        createSeries("deaths", "Số ca chết");
        createSeries("recovered", "Số ca hồi phục");

        // Legend
        x.legend = new am4charts.Legend();

        chart.current = x;

        return () => {
            x.dispose();
        };
    }, [chartData, chartID])

    return (
        <div id={chartID} style={{ width: "100%", height: "600px" }}></div>
    );
}

let Home = () => {
    const [dataVN, setDataVN] = useState([]);
    const [dataTG, setDataTG] = useState([]);
    const [lastUpdate, setLastUpdate] = useState("");
    const [showChart, setShowChart] = useState(0);

    useEffect(() => {
        const url = "https://ncovi.vnpt.vn/thongtindichbenh_v2";

        fetch(url)
            .then(result => result.json())
            .then(result => {
                if(result.data.VN) setDataVN(result.data.VN);
                if(result.data.TG){
                    setDataTG(result.data.TG.sort(compare));
                    setLastUpdate(result.data.TG[0].last_update);
                }
            });
    }, []);

    let handleButtonShowChart = () => {
        if(window.confirm(`Bạn có chắc chắn muốn tải biểu đồ thống kê toàn Thế Giới?`)) {
            setShowChart(1);
        }
    }

    return (
        <div className="row">
            <NavBar />

            <div style={{ padding: "1% 5% 1% 5%" }}>
                <h3>Việt Nam</h3>
                <UpdatedTime time={lastUpdate} style={{"padding": "10px"}}/>
                <br/>

                {dataVN.length > 0 &&
                <CovidChart chartData={dataVN} chartID={"dataVN"}/>
                }

                {dataVN.length > 0
                    ? <CovidTable data={dataVN}/>
                    : <h4 style={{"textAlign": "center"}}>Không có dữ liệu</h4>
                }

                <h3>Thế giới</h3>
                <UpdatedTime time={lastUpdate} style={{"padding": "10px"}}/>

                {showChart === 0 &&
                    <div style={{"padding": "1% 0 1% 0"}}>
                        <button onClick={handleButtonShowChart} className="waves-effect waves-light btn indigo darken-3">Hiện biểu đồ</button>
                    </div>
                }

                {(dataTG.length > 0 && showChart === 1) &&
                    <CovidChart chartData={dataTG} chartID={"dataTG"}/>
                }

                {dataTG.length > 0
                    ? <CovidTable data={dataTG}/>
                    : <h4 style={{"textAlign": "center"}}>Không có dữ liệu</h4>
                }
                <div className="right" style={{"padding": "1%"}}><i>Nguồn: API ứng dụng <a
                    href="https://ncovi.vnpt.vn">ncovi.vnpt.vn</a></i></div>
            </div>
        </div>
    );
};

export default Home;
