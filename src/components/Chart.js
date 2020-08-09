import React, {useLayoutEffect, useRef} from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

let Chart = ({ chartData, chartID }) => {
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
        createSeries("deaths", "Số ca tử vong");
        createSeries("recovered", "Số ca hồi phục");

        // Legend
        x.legend = new am4charts.Legend();

        chart.current = x;

        return () => {
            x.dispose();
        };
    }, [chartData, chartID])

    return (
        <div id={chartID} style={{ width: "100%", height: "800px" }}></div>
    );
}

export default Chart;
