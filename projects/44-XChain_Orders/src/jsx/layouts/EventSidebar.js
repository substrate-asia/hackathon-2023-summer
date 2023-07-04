import React, { useState } from "react";

/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";

const EventSidebar = ({ activeEvent }) => {
   const [value, onChange] = useState(new Date());

   return (
      <PerfectScrollbar
         className={`event-sidebar dz-scroll ${activeEvent ? "active" : ""}`}
         id="eventSidebar"
      >
         <div className="card shadow-none rounded-0 bg-transparent h-auto mb-0">
            <div className="card-body text-center event-calender pb-2">
               <Calendar onChange={onChange} value={value} />
            </div>
         </div>
         <div className="card shadow-none rounded-0 bg-transparent h-auto">
            <div className="card-header border-0 pb-0">
               <h4 className="text-black">Upcoming Events</h4>
            </div>
            <div className="card-body">
               <div className="media mb-5 align-items-center event-list">
                  <div className="p-3 text-center rounded me-3 date-bx bgl-primary">
                     <h2 className="mb-0 text-black">3</h2>
                     <h5 className="mb-1 text-black">Wed</h5>
                  </div>
                  <div className="media-body px-0">
                     <h6 className="mt-0 mb-3 fs-14">
                        <a className="text-black" href="events.html">
                           Live Concert Choir Charity Event 2020
                        </a>
                     </h6>
                     <ul className="fs-14 list-inline mb-2 d-flex justify-content-between">
                        <li>Ticket Sold</li>
                        <li>561/650</li>
                     </ul>
                     <div
                        className="progress mb-0"
                        style={{ height: 4, width: "100%" }}
                     >
                        <div
                           className="progress-bar bg-warning progress-animated"
                           style={{ width: "85%", height: 8 }}
                           role="progressbar"
                        >
                           <span className="sr-only">60% Complete</span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="media mb-5 align-items-center event-list">
                  <div className="p-3 text-center rounded me-3 date-bx bgl-primary">
                     <h2 className="mb-0 text-black">16</h2>
                     <h5 className="mb-1 text-black">Tue</h5>
                  </div>
                  <div className="media-body px-0">
                     <h6 className="mt-0 mb-3 fs-14">
                        <a className="text-black" href="events.html">
                           Beautiful Fireworks Show In The New Year Night
                        </a>
                     </h6>
                     <ul className="fs-14 list-inline mb-2 d-flex justify-content-between">
                        <li>Ticket Sold</li>
                        <li>431/650</li>
                     </ul>
                     <div
                        className="progress mb-0"
                        style={{ height: 4, width: "100%" }}
                     >
                        <div
                           className="progress-bar bg-warning progress-animated"
                           style={{ width: "50%", height: 8 }}
                           role="progressbar"
                        >
                           <span className="sr-only">60% Complete</span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="media mb-0 align-items-center event-list">
                  <div className="p-3 text-center rounded me-3 date-bx bgl-success">
                     <h2 className="mb-0 text-black">28</h2>
                     <h5 className="mb-1 text-black">Fri</h5>
                  </div>
                  <div className="media-body px-0">
                     <h6 className="mt-0 mb-3 fs-14">
                        <a className="text-black" href="events.html">
                           The Story Of Danau Toba (Musical Drama)
                        </a>
                     </h6>
                     <ul className="fs-14 list-inline mb-2 d-flex justify-content-between">
                        <li>Ticket Sold</li>
                        <li>650/650</li>
                     </ul>
                     <div
                        className="progress mb-0"
                        style={{ height: 4, width: "100%" }}
                     >
                        <div
                           className="progress-bar bg-success progress-animated"
                           style={{ width: "100%", height: 8 }}
                           role="progressbar"
                        >
                           <span className="sr-only">60% Complete</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="card-footer justify-content-between border-0 d-flex fs-14">
               <span>5 events more</span>
               <Link to="#" className="text-primary">
                  View more{" "}
                  <i className="las la-long-arrow-alt-right scale5 ms-2" />
               </Link>
            </div>
         </div>
         <div className="card shadow-none rounded-0 bg-transparent h-auto mb-0">
            <div className="card-body text-center event-calender">
               <Link
                  to="#"
                  className="btn btn-primary btn-rounded btn-lg shadow"
               >
                  + New Event
               </Link>
            </div>
         </div>
      </PerfectScrollbar>
   );
};

export default EventSidebar;
