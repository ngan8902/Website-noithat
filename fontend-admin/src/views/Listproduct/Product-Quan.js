import React from "react";
import { Table } from "reactstrap";
import { FaPlus, FaMinus, FaPen, FaCaretDown, FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";


function Quan() {
    return (
        <div id="danhmuc">
            <nav className="nav nav-bar">
                <div class="dropdown">
                    <button class="dropbtn">Danh mục sản phẩm<FaCaretDown style={{ marginLeft: "5px", marginBottom: "4px" }}></FaCaretDown></button>
                    <div class="dropdown-content">
                        <Link to="/admin/danhmucsanpham/Ao" style={{ fontSize: "1rem" }}>Áo</Link>
                        <Link to="/admin/danhmucsanpham/Vay" style={{ fontSize: "1rem" }}>Váy</Link>
                    </div>
                </div>

                <button className="btn-back">
                    <Link to="/admin/*" style={{ color: 'white' }}><FaChevronLeft></FaChevronLeft></Link>
                </button>

                <button className="btn-edit">
                    <FaPen></FaPen>
                </button>
            </nav>
            <Table className="list-products">
                <tr>
                    <th className="msp">MSP</th>
                    <th>Tên sản phẩm</th>
                    <th>Màu</th>
                    <th>Số lượng đã bán</th>
                    <th>Số lượng chưa bán</th>
                    <th>Giá</th>
                    <th>Hình ảnh</th>
                    <th></th>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <button className="btn-plus">
                            <FaPlus></FaPlus>
                        </button>
                        <button className="btn-minus">
                            <FaMinus></FaMinus>
                        </button>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <button className="btn-plus">
                            <FaPlus></FaPlus>
                        </button>
                        <button className="btn-minus">
                            <FaMinus></FaMinus>
                        </button>
                    </td>
                </tr>
            </Table>
        </div>
    );
}

export default Quan;