import React, { useState, useEffect } from "react";
import M from 'materialize-css';
import moment from 'moment';

import Chart from './components/Chart';
import NavBar from "./components/NavBar";
import UpdatedTime from "./components/UpdatedTime";
import Table from "./components/Table";

import "./Home.css";

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

let Home = () => {
    const url = ["https://ncovi.vnpt.vn/thongtindichbenh_v2",
                "https://webapi.dantri.com.vn/corona-info"];

    const [dataVN, setDataVN] = useState([]);
    const [dataTG, setDataTG] = useState([]);
    const [lastUpdate, setLastUpdate] = useState("");
    const [showChart, setShowChart] = useState(0);
    const [currentURL, setCurrentURL] = useState(url[0]);

    useEffect(() => {
        let select = document.querySelectorAll("select");
        M.FormSelect.init(select);

        fetch(currentURL)
            .then(result => result.json())
            .then(result => {
                switch(currentURL){
                    case url[0]:
                        if(result.data.VN) setDataVN(result.data.VN);

                        if(result.data.TG){
                            setDataTG(result.data.TG.sort(compare));
                            setLastUpdate(result.data.TG[0].last_update);
                        }

                        break;
                    case url[1]:
                        if(result.data.latest) {
                            let convertedDataTG = [],
                                dataKey = Object.keys(result.data.latest);

                            dataKey.forEach((value, idx) => {
                                convertedDataTG.push({
                                    id: idx + 1,
                                    confirmed: result.data.latest[value].confirmed,
                                    deaths: result.data.latest[value].deaths,
                                    recovered: result.data.latest[value].recovered,
                                    province_name: result.data.latest[value].vietnamese
                                })
                            })
                            setDataTG(convertedDataTG)
                            setDataVN('');
                            setLastUpdate(moment().unix());
                        }

                        break;
                    default:
                        throw Error;
                }

            })
            .catch(e => console.log(e));
    }, [currentURL]);

    const handleChangeDataSource = e => {
        setCurrentURL(url[parseInt(e.target.value)]);
        console.log(dataTG);
    }

    if(url.indexOf(currentURL) === 0){
        const handleButtonShowChart = () => {
            if(window.confirm(`Bạn có chắc chắn muốn tải biểu đồ thống kê toàn Thế Giới?`)) {
                setShowChart(1);
            }
        }

        return (
            <div className="row">
                <NavBar />

                <div style={{ padding: "1% 5% 1% 5%" }}>
                    <div style={{"top": 0, "left": 0, "float": "right", "margin": "50px 2% 0 0"}}>
                        <div className="input-field">
                            <select onChange={e => handleChangeDataSource(e)} value={url.indexOf(currentURL)}>
                                <option value="0">nCovi</option>
                                <option value="1">Dân trí</option>
                            </select>
                            <label>Nguồn dữ liệu</label>
                        </div>
                    </div>

                    <h3>Việt Nam</h3>
                    <UpdatedTime time={lastUpdate} style={{"padding": "10px"}}/>

                    <br/>

                    {dataVN.length > 0 &&
                        <Chart chartData={dataVN} chartID={"dataVN"}/>
                    }

                    {dataVN.length > 0
                        ? <Table data={dataVN}/>
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
                        <Chart chartData={dataTG} chartID={"dataTG"}/>
                    }

                    {dataTG.length > 0
                        ? <Table data={dataTG}/>
                        : <h4 style={{"textAlign": "center"}}>Không có dữ liệu</h4>
                    }
                    <div className="right" style={{"padding": "1%"}}><i>Nguồn: API ứng dụng <a
                        href="https://ncovi.vnpt.vn">ncovi.vnpt.vn</a></i>
                    </div>
                </div>
            </div>
        );
    }
    else if(url.indexOf(currentURL) === 1){
        return (
            <div className="row">
                <NavBar />

                <div style={{ padding: "1% 5% 1% 5%" }}>
                    <div style={{"top": 0, "left": 0, "float": "right", "margin": "50px 2% 0 0"}}>
                        <div className="input-field">
                            <select onChange={e => handleChangeDataSource(e)} value={url.indexOf(currentURL)}>
                                <option value="0">nCovi</option>
                                <option value="1">Dân trí</option>
                            </select>
                            <label>Nguồn dữ liệu</label>
                        </div>
                    </div>

                    <h3>Thế giới</h3>
                    <UpdatedTime time={lastUpdate} style={{"padding": "10px"}}/>

                    <br/>

                    {dataTG.length > 0 &&
                        <Chart chartData={dataTG} chartID={"dataTG"}/>
                    }

                    {dataTG.length > 0
                        ? <Table data={dataTG}/>
                        : <h4 style={{"textAlign": "center"}}>Không có dữ liệu</h4>
                    }

                    <div className="right" style={{"padding": "2%"}}><i>Nguồn: API báo <a
                        href="https://dantri.com.vn">Dân trí</a></i>
                    </div>
                </div>
            </div>
        );
    }
};

export default Home;
