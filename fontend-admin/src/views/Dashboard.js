import * as React from "react";
import { Line, Pie } from "react-chartjs-2";
import { FaTshirt, FaMoneyCheck, FaRegListAlt, FaMoneyCheckAlt } from "react-icons/fa";
import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import 'moment-timezone';
import dayjs from "dayjs";


// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,

} from "reactstrap";
// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardBarChart,
} from "variables/charts.js";

function Dashboard() {
  // const [currentDateTime, setcurrentDateTime] = React.useState(null);
  const HCM = moment().tz("Asia/Ho_Chi_Minh");
  const currentDate = HCM.format("MMM Do YYYY");
  const time = dayjs().format('HH:mm');


  return (
    <>
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning" >
                      <FaTshirt className="clothing" ></FaTshirt>
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Sản Phẩm Đã Bán</p>
                      <CardTitle tag="p">1000</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Cập nhật
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <FaMoneyCheckAlt className="money"></FaMoneyCheckAlt>
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Doanh Thu</p>
                      <CardTitle tag="p">$ 1,345</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-calendar" /> Ngày {' '}
                  {currentDate}
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <FaRegListAlt className="bill"></FaRegListAlt>
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Số đơn hàng</p>
                      <CardTitle tag="p">23</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  {/* <input type="time" id="time" name="time" className="time" style={{ fontSize: '0.75rem', color: '#9A9A9A', border: 'white' }}></input> */}
                {time}
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <FaMoneyCheck className="bill-cancel"></FaMoneyCheck>
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Số đơn hủy</p>
                      <CardTitle tag="p">50</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Cập nhật
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Biểu đồ</CardTitle>
                <p className="card-category">Hiệu suất 24h</p>
              </CardHeader>
              <CardBody>
                <Line
                  data={dashboard24HoursPerformanceChart.data}
                  options={dashboard24HoursPerformanceChart.options}
                  width={400}
                  height={100}
                />
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" /> Cập nhật 3 phút trước
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Thống kê Email</CardTitle>  
                <p className="card-category">Hiệu suất</p>
              </CardHeader>
              <CardBody style={{ height: "266px" }}>
                <Pie
                  data={dashboardEmailStatisticsChart.data}
                  options={dashboardEmailStatisticsChart.options}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-primary" /> Đã phản hồi{" "}
                  <i className="fa fa-circle text-warning" /> Đã đọc{" "}<br></br>
                  <i className="fa fa-circle text-danger" /> Đã xóa{" "}
                  <i className="fa fa-circle text-gray" /> Chưa mở
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-calendar" /> Số email đã được gửi
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col md="8">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h5"></CardTitle>
                <p className="card-category"></p>
              </CardHeader>
              <CardBody>
                <div className="chart-container">
                  <h2 style={{ textAlign: "center" }}>Sản phẩm bán chạy</h2>
                  <Bar
                    data={dashboardBarChart.data}
                    options={{
                      plugins: {
                        title: {
                          display: true,
                          text: "Số sản phẩm bán được trong vòng 12 tháng"
                        },
                        legend: {
                          display: false
                        }
                      }
                    }}
                  />
                </div>
              </CardBody>
              <CardFooter>

              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
