import { useLoginStore as store } from "src/stores/login";
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    name: "Home",
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        name: "Dashboard",
        beforeEnter: (to, from) => {
          if (!Boolean(store().user.groups[0].name == "admin")) {
            return { name: "Locations" };
          }
        },
      },
      {
        path: "/structure",
        component: () => import("pages/HotelStructurePage.vue"),
        name: "HotelStructure",
        beforeEnter: (to, from) => {
          if (!Boolean(store().user.groups[0].name == "admin")) {
            return { name: "Locations" };
          }
        },
        children: [
          {
            path: "floors",
            name: "Floors",
            component: () => import("pages/FloorPage.vue"),
          },
          {
            path: "",
            name: "RoomTypes",
            component: () => import("pages/RoomTypePage.vue"),
          },
          {
            path: "rooms",
            name: "Rooms",
            component: () => import("pages/RoomPage.vue"),
          },
          {
            path: "price-manager",
            name: "PriceManager",
            component: () => import("pages/PriceManagerPage.vue"),
          },
          {
            path: "coupon",
            name: "Coupon",
            component: () => import("pages/CouponPage.vue"),
          },
          {
            path: "housekeeping",
            name: "Housekeep",
            component: () => import("pages/HousekeepingPage.vue"),
          },
        ],
      },
      {
        path: "/bookings",
        name: "Locations",
        component: () => import("pages/BookingPage.vue"),
      },
      {
        path: "/reserved",
        component: () => import("pages/BookedRoomPage.vue"),
        name: "Reserved",
      },
      {
        path: "/calendar",
        component: () => import("pages/CalendarPage.vue"),
        name: "Calendar",
      },
      {
        path: "/guests",
        component: () => import("pages/GuestPage.vue"),
        name: "Guests",
      },
      {
        path: "/administration",
        name: "Admin",
        component: () => import("pages/AdminPage.vue"),
        beforeEnter: (to, from) => {
          if (!Boolean(store().user.groups[0].name == "admin")) {
            return { name: "Locations" };
          }
        },
        children: [
          {
            path: "compta",
            name: "Comptabilite",
            component: () => import("pages/ComptabilitePage.vue"),
          },
          {
            path: "employees",
            name: "Employees",
            component: () => import("pages/EmployePage.vue"),
          },
          {
            path: "statistics",
            name: "Statistics",
            component: () => import("pages/StatisticPage.vue"),
          },
        ],
      },
      {
        path: "/reports",
        component: () => import("pages/ReportPage.vue"),
        name: "Reports",
        beforeEnter: (to, from) => {
          if (!Boolean(store().user.groups[0].name == "admin")) {
            return { name: "Locations" };
          }
        },
      },
      {
        path: "/test",
        component: () => import("pages/TestPage.vue"),
        name: "Tests",
      },
    ],
  },
  {
    path: "/login",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/LoginPage.vue"),
        name: "Login",
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
