import React from 'react';
import numeral from "numeral";

let Table = ({data}) => {
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

export default Table;
