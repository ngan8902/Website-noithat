import * as React from "react";
import { FaCaretDown } from "react-icons/fa6";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Modal,
  ModalHeader, ModalBody, ModalFooter
} from "reactstrap";


function Tables() {
  const [open, setOpen] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);
  const [checkbox, setCheckbox] = React.useState(false);


  let handleClickOpen = () => {
    setOpen(true);
  }

  let handleClickClose = () => {
    setOpen(false);
  }

  let handleClickEdit = () => {
    if (checkbox) {
      setEdit(true);
      console.log(true)
    } else {
      setEdit(false);
      console.log(false)
    }
  }

  let handleClickCloseedit = () => {
    setEdit(false);
    setCheckbox(false);
    console.log("close")
  }

  let handleClickDeleted = () => {
    if (checkbox) {
      setDeleted(true);
    } else {
      setEdit(false);
    }
  }

  let handleClickClosedeleted = () => {
    setDeleted(false);
    setCheckbox(false);
  }


  return (
    <>
      <div className="content">
        <div class="dropdown">
          <button class="dropbtn">Danh mục sản phẩm<FaCaretDown style={{ marginLeft: "5px", marginBottom: "4px" }}></FaCaretDown></button>
          <div class="dropdown-content">
            <Link to="/admin/danhmucsanpham/Ao" style={{ fontSize: "1rem" }}>Áo</Link>
            <Link to="/admin/danhmucsanpham/Quan" style={{ fontSize: "1rem" }}>Quần</Link>
            <Link to="/admin/danhmucsanpham/Vay" style={{ fontSize: "1rem" }}>Váy</Link>
          </div>
        </div>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader className="table-header">
                <CardTitle tag="h4">Các sản phẩm</CardTitle>
                <div className="col-4">
                  <button className="btn-themsp" onClick={handleClickOpen} >
                    Thêm
                  </button>{' '}
                  <button className="btn-xoasp" onClick={handleClickDeleted}>
                    Xóa
                  </button>{' '}
                  <button className="btn-suasp" onClick={handleClickEdit}>
                    Sửa
                  </button>
                </div>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-list">
                    <tr>
                      <th>{''}</th>
                      <th>Sản phẩm</th>
                      <th>Màu</th>
                      <th>Loại</th>
                      <th className="text-right">Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="tr">
                      <td><input type="checkbox" checked={checkbox} value={checkbox} onChange={(e) => { setCheckbox(e.target.value) }} ></input></td>
                      <td>Áo sơ mi</td>
                      <td>Xanh, Đỏ, Trắng, Đen</td>
                      <td>Áo</td>
                      <td className="text-right">$36,738</td>
                    </tr>
                    <tr className="tr">
                      <td><input type="checkbox"></input></td>
                      <td>Đầm body</td>
                      <td>Đen, Trắng</td>
                      <td>Đầm</td>
                      <td className="text-right">$23,789</td>
                    </tr>
                    <tr className="tr">
                      <td><input type="checkbox"></input></td>
                      <td>Váy xếp ly</td>
                      <td>Trắng, Đen, Xanh, Be</td>
                      <td>Chân váy</td>
                      <td className="text-right">$56,142</td>
                    </tr>
                    <tr className="tr">
                      <td><input type="checkbox"></input></td>
                      <td>Áo crop-top</td>
                      <td>Ghi, Xám, Hồng</td>
                      <td>Áo</td>
                      <td className="text-right">$38,735</td>
                    </tr>
                    <tr className="tr">
                      <td><input type="checkbox"></input></td>
                      <td>Set đồ thể thao</td>
                      <td>Đen, Xám</td>
                      <td>Set</td>
                      <td className="text-right">$63,542</td>
                    </tr>
                    <tr className="tr">
                      <td><input type="checkbox"></input></td>
                      <td>Quần Jean</td>
                      <td>Đen, Xanh Đen</td>
                      <td>Quần</td>
                      <td className="text-right">$50,000</td>
                    </tr>
                    <tr className="tr">
                      <td><input type="checkbox"></input></td>
                      <td>Quần ống loe</td>
                      <td>Xanh nhạt, Xanh đậm</td>
                      <td>Quần</td>
                      <td className="text-right">$40,500</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div className="giohang">
          <Modal isOpen={open} toggle={handleClickClose} >

            <ModalHeader toggle={handleClickClose}>Thêm Sản Phẩm</ModalHeader>

            <ModalBody className="row col-8" style={{ height: "230px" }}>
              <label className="setop">
                Loại:
                <select name="selectedLoai">
                  <option value="ao">Áo</option>
                  <option value="quan">Quần</option>
                  <option value="chanvay">Chân Váy</option>
                  <option value="dam">Đầm</option>
                  <option value="set">Set</option>
                </select>
              </label>

              <div className="inp">
                <div className="col">
                  Sản Phẩm:<br></br>
                  <input type="text" placeholder="Nhập tên sản phẩm" className="inp-tensp"></input>
                </div>
                <div className="col">
                  Màu:<br></br>
                  <input type="text" placeholder="Màu của sản phẩm" className="inp-mau"></input>
                </div>
              </div>
              {' '}
              <div className="col">
                Giá:<br></br>
                <input type="text" placeholder="$" className="inp-gia"></input>
              </div>
            </ModalBody>

            <ModalFooter className="modal-footer">
              <button className="btn-huy" onClick={handleClickClose}>Hủy</button>
              <button className="btn-them" onClick={handleClickClose}>Thêm</button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={edit} toggle={handleClickCloseedit} >

            <ModalHeader toggle={handleClickCloseedit}>Chỉnh Sửa Sản Phẩm</ModalHeader>

            <ModalBody className="row1 col-8">

              <div className="inp-1">
                <div className="col">
                  Loại:<br></br>
                  <input type="text" placeholder="Loại" className="inp-tensp"></input>
                </div>
                <div id="sp" className="col">
                  Sản Phẩm:<br></br>
                  <input type="text" placeholder="Tên sản phẩm" className="inp-tensp"></input>
                </div>
              </div>

              <div className="inp-2">
                <div className="col">
                  Màu:<br></br>
                  <input type="text" placeholder="Màu" className="inp-mau"></input>
                </div>
                <div id="gia" className="col">
                  Giá:<br></br>
                  <input type="text" placeholder="$" className="inp-gia"></input>
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="modal-footer">
              <button className="btn-huy" onClick={handleClickCloseedit}>Hủy</button>
              <button className="btn-sua" onClick={handleClickCloseedit}>Sửa</button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={deleted} toggle={handleClickClosedeleted}>

            <ModalHeader toggle={handleClickClosedeleted}>Xác nhận xóa sản phẩm!!!</ModalHeader>


            <ModalFooter className="modal-footer">
              <button className="btn-huy" onClick={handleClickClosedeleted}>Hủy</button>
              <button className="btn-sua" onClick={handleClickClosedeleted}>Xóa</button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Tables;
