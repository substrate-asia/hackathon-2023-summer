import Metismenu from "metismenujs";
import React, { Component, useContext, useEffect } from "react";
import {Button} from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link } from "react-router-dom";
import useScrollPosition from "use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";


class MM extends Component {
  componentDidMount() {
    this.$el = this.el;
    this.mm = new Metismenu(this.$el);
  }
  componentWillUnmount() {
  }
  render() {
    return (
		<div className="mm-wrapper">
			<ul className="metismenu" ref={(el) => (this.el = el)}>
				{this.props.children}
			</ul>
		</div>
    );
  }
}

const SideBar = () => {
  const {
    iconHover,
    sidebarposition,
    headerposition,
    sidebarLayout,
  } = useContext(ThemeContext);
  useEffect(() => {
    var btn = document.querySelector(".nav-control");
    var aaa = document.querySelector("#main-wrapper");
    function toggleFunc() {
      return aaa.classList.toggle("menu-toggle");
    }
    btn.addEventListener("click", toggleFunc);
	
  }, []);
  let scrollPosition = useScrollPosition();
  /// Path
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];
  /// Active menu
  let deshBoard = [
      "",
      "readme",
      "coin-details",
      "my-wallet",
      "transactions",
      "portofolio",
      "market-capital",
      "task",
    ],
    app = [
      "app-profile",
      "post-details",
      "app-calender",
      "email-compose",
      "email-inbox",
      "email-read",
      "ecom-product-grid",
      "ecom-product-list",
      "ecom-product-order",
      "ecom-checkout",
      "ecom-invoice",
      "ecom-customers",
      "post-details",
      "ecom-product-detail",
    ],
    email = ["email-compose", "email-inbox", "email-read"],
    shop = [
      "ecom-product-grid",
      "ecom-product-list",
      "ecom-product-list",
      "ecom-product-order",
      "ecom-checkout",
      "ecom-invoice",
      "ecom-customers",
      "ecom-product-detail",
    ],
    charts = [
      "chart-rechart",
      "chart-flot",
      "chart-chartjs",
      "chart-chartist",
      "chart-sparkline",
      "chart-apexchart",
    ],
    bootstrap = [
      "ui-accordion",
      "ui-badge",
      "ui-alert",
      "ui-button",
      "ui-modal",
      "ui-button-group",
      "ui-list-group",
      "ui-media-object",
      "ui-card",
      "ui-carousel",
      "ui-dropdown",
      "ui-popover",
      "ui-progressbar",
      "ui-tab",
      "ui-typography",
      "ui-pagination",
      "ui-grid",
    ],
    plugins = [
      "uc-select2",
      "uc-nestable",
      "uc-sweetalert",
      "uc-toastr",
      "uc-noui-slider",
      "map-jqvmap",
      "uc-lightgallery",
    ],
	redux = [
       "redux-form",
	   "redux-wizard",    
       "todo",
    ],
    widget = ["widget-basic"],
    forms = [
      "form-element",
      "form-wizard",
      "form-editor-summernote",
      "form-pickers",
      "form-validation-jquery",
    ],
    table = ["table-bootstrap-basic", "table-datatable-basic"],
    pages = [
      "page-register",
      "page-login",
      "page-lock-screen",
      "page-error-400",
      "page-error-403",
      "page-error-404",
      "page-error-500",
      "page-error-503",
    ],
    error = [
      "page-error-400",
      "page-error-403",
      "page-error-404",
      "page-error-500",
      "page-error-503",
    ];
  return (
    <div
      className={`deznav ${iconHover} ${ 
        sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
          ? scrollPosition > 120
            ? "fixed"
            : ""
          : ""
      }`}
    >
      <PerfectScrollbar className="deznav-scroll">
        <MM className="metismenu" id="menu">
          <li className={`${charts.includes(path) ? "mm-active" : ""}`}>
            <Link className="ai-icon" to="/readme"><i className="fa fa-book"></i> <span className="nav-text">Readme</span></Link>
          </li>
          <li className={`${charts.includes(path) ? "mm-active" : ""}`}>
            <Link className="ai-icon" to="/OrderManager"><i className="fa fa-list"></i> <span className="nav-text">Order Manager</span></Link>
          </li>
          {/* <li className={`${charts.includes(path) ? "mm-active" : ""}`}>
            <Link className="ai-icon" to="/OrderBook"><i className="fa fa-list"></i> <span className="nav-text">Order Book</span></Link>
          </li> */}
          {/* <li className={`${charts.includes(path) ? "mm-active" : ""}`}>
            <Link className="ai-icon" to="/AdminOrderBooks"><i className="fa fa-list"></i> <span className="nav-text">Admin Books</span></Link>
          </li> */}
        </MM>
        {/* <div className="align-items-center d-flex"style={{justifyContent:"center", marginTop:"750px"}}>
          <Button className="" variant="outline-warning">
            Reset Game
          </Button>
        </div> */}
      </PerfectScrollbar>

    </div>
    
  );
};

export default SideBar;
