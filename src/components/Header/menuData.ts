import { Menu } from "@/types/Menu";

const TARGET_MAIN_CATEGORIES = [
  "VW-T5",
  "VW-T6.1",
  "VW-T7",
  "Universal Camper Parts",
];

const rawMenu: Menu[] = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Shop",
    newTab: false,
    path: "/shop",
  },
  {
    id: 15,
    title: "VW-T5",
    newTab: false,
    path: "/vwt5",
    submenu: [
      {
        id: 100,
        title: "Exterior Styling",
        newTab: false,
        path: "/exterior-styling",
        apiUrl: "",
      },
      {
        id: 101,
        title: "OEM Replacement Items",
        newTab: false,
        path: "/oem-replacement-items",
        apiUrl: "",
      },
      {
        id: 102,
        title: "Alloy Wheels",
        newTab: false,
        path: "/alloy-wheels",
        apiUrl: "",
      },
      {
        id: 103,
        title: "Night Diesel Heaters",
        newTab: false,
        path: "/night-diesel-heaters",
        apiUrl: "",
      },
      {
        id: 104,
        title: "Kitchen Furniture Units	",
        newTab: false,
        path: "/kitchen-furniture-units",
        apiUrl: "",
      },
      {
        id: 105,
        title: "Upholstery",
        newTab: false,
        path: "/upholstery",
        apiUrl: "",
      },
      {
        id: 106,
        title: "Beds",
        newTab: false,
        path: "/beds",
        apiUrl: "",
      },
      {
        id: 107,
        title: "Pop Top",
        newTab: false,
        path: "/pop-top",
        apiUrl: "",
      },
      {
        id: 108,
        title: "Solar kits",
        newTab: false,
        path: "/solar-kits",
        apiUrl: "",
      },
      {
        id: 109,
        title: "Stretch carpet Kits",
        newTab: false,
        path: "/stretch-carpet-kits",
        apiUrl: "",
      },
      {
        id: 110,
        title: "Insulation",
        newTab: false,
        path: "/insulation",
        apiUrl: "",
      },
      {
        id: 111,
        title: "Flooring",
        newTab: false,
        path: "/flooring",
        apiUrl: "",
      },
      {
        id: 112,
        title: "Power banks",
        newTab: false,
        path: "/power-banks",
        apiUrl: "",
      },
      {
        id: 113,
        title: "Window Blinds",
        newTab: false,
        path: "/window-blinds",
        apiUrl: "",
      },
    ],
  },
  {
    id: 26,
    title: "VW-T6.1",
    newTab: false,
    path: "/vwt6.1",
    submenu: [
      {
        id: 200,
        title: "Exterior Styling",
        newTab: false,
        path: "/exterior-styling",
        apiUrl: "",
      },
      {
        id: 201,
        title: "OEM Replacement Items",
        newTab: false,
        path: "/oem-replacement-items",
        apiUrl: "",
      },
      {
        id: 202,
        title: "Alloy Wheels",
        newTab: false,
        path: "/alloy-wheels",
        apiUrl: "",
      },
      {
        id: 203,
        title: "Night Diesel Heaters",
        newTab: false,
        path: "/night-diesel-heaters",
        apiUrl: "",
      },
      {
        id: 204,
        title: "Kitchen Furniture Units	",
        newTab: false,
        path: "/kitchen-furniture-units",
        apiUrl: "",
      },
      {
        id: 205,
        title: "Upholstery",
        newTab: false,
        path: "/upholstery",
        apiUrl: "",
      },
      {
        id: 206,
        title: "Beds",
        newTab: false,
        path: "/beds",
        apiUrl: "",
      },
      {
        id: 207,
        title: "Pop Top",
        newTab: false,
        path: "/pop-top",
        apiUrl: "",
      },
      {
        id: 208,
        title: "Solar kits",
        newTab: false,
        path: "/solar-kits",
        apiUrl: "",
      },
      {
        id: 209,
        title: "Stretch carpet Kits",
        newTab: false,
        path: "/stretch-carpet-kits",
        apiUrl: "",
      },
      {
        id: 210,
        title: "Insulation",
        newTab: false,
        path: "/insulation",
        apiUrl: "",
      },
      {
        id: 211,
        title: "Flooring",
        newTab: false,
        path: "/flooring",
        apiUrl: "",
      },
      {
        id: 212,
        title: "Power banks",
        newTab: false,
        path: "/power-banks",
        apiUrl: "",
      },
      {
        id: 213,
        title: "Window Blinds",
        newTab: false,
        path: "/window-blinds",
        apiUrl: "",
      },
    ],
  },
  {
    id: 36,
    title: "VW-T7",
    newTab: false,
    path: "/vwt7",
    submenu: [
      {
        id: 300,
        title: "Exterior Styling",
        newTab: false,
        path: "/exterior-styling",
        apiUrl: "",
      },
      {
        id: 301,
        title: "OEM Replacement Items",
        newTab: false,
        path: "/oem-replacement-items",
        apiUrl: "",
      },
      {
        id: 302,
        title: "Alloy Wheels",
        newTab: false,
        path: "/alloy-wheels",
        apiUrl: "",
      },
      {
        id: 303,
        title: "Night Diesel Heaters",
        newTab: false,
        path: "/night-diesel-heaters",
        apiUrl: "",
      },
      {
        id: 304,
        title: "Kitchen Furniture Units	",
        newTab: false,
        path: "/kitchen-furniture-units",
        apiUrl: "",
      },
      {
        id: 305,
        title: "Upholstery",
        newTab: false,
        path: "/upholstery",
        apiUrl: "",
      },
      {
        id: 306,
        title: "Beds",
        newTab: false,
        path: "/beds",
        apiUrl: "",
      },
      {
        id: 307,
        title: "Pop Top",
        newTab: false,
        path: "/pop-top",
        apiUrl: "",
      },
      {
        id: 308,
        title: "Solar kits",
        newTab: false,
        path: "/solar-kits",
        apiUrl: "",
      },
      {
        id: 309,
        title: "Stretch carpet Kits",
        newTab: false,
        path: "/stretch-carpet-kits",
        apiUrl: "",
      },
      {
        id: 310,
        title: "Insulation",
        newTab: false,
        path: "/insulation",
        apiUrl: "",
      },
      {
        id: 311,
        title: "Flooring",
        newTab: false,
        path: "/flooring",
        apiUrl: "",
      },
      {
        id: 312,
        title: "Power banks",
        newTab: false,
        path: "/power-banks",
        apiUrl: "",
      },
      {
        id: 313,
        title: "Window Blinds",
        newTab: false,
        path: "/window-blinds",
        apiUrl: "",
      },
    ],
  },
  {
    id: 66,
    title: "Universal Camper Parts",
    newTab: false,
    path: "/universal-camper-parts",
    submenu: [
      {
        id: 400,
        title: "Fridge Freezer 12v 50L",
        newTab: false,
        path: "/fridge-freezer-12v-50L",
        apiUrl: "",
      },
      {
        id: 401,
        title: "Sink/Hob 2 burner",
        newTab: false,
        path: "/sink-hob-2-burner",
        apiUrl: "",
      },
      {
        id: 402,
        title: "35psi Water Pump",
        newTab: false,
        path: "/35psi-water-pump",
        apiUrl: "",
      },
      {
        id: 403,
        title: "Night Diesel Heaters",
        newTab: false,
        path: "/night-diesel-heaters",
        apiUrl: "",
      },
      {
        id: 404,
        title: "External Shower Point",
        newTab: false,
        path: "/external-shower-point",
        apiUrl: "",
      },
      {
        id: 405,
        title: "External Power Point",
        newTab: false,
        path: "/external-power-point",
        apiUrl: "",
      },
      {
        id: 406,
        title: "External Water Inlet lockable",
        newTab: false,
        path: "/external-water-inlet-lockable",
        apiUrl: "",
      },
    ],
  },
  {
    id: 3,
    title: "Contact",
    newTab: false,
    path: "/contact",
  },
  // {
  //   id: 6,
  //   title: "pages",
  //   newTab: false,
  //   path: "/",
  //   submenu: [
  //     {
  //       id: 61,
  //       title: "Shop With Sidebar",
  //       newTab: false,
  //       path: "/shop",
  //     },
  //     {
  //       id: 62,
  //       title: "Shop Without Sidebar",
  //       newTab: false,
  //       path: "/shop-without-sidebar",
  //     },
  //     {
  //       id: 64,
  //       title: "Checkout",
  //       newTab: false,
  //       path: "/checkout",
  //     },
  //     {
  //       id: 65,
  //       title: "Cart",
  //       newTab: false,
  //       path: "/cart",
  //     },
  //     {
  //       id: 66,
  //       title: "Wishlist",
  //       newTab: false,
  //       path: "/wishlist",
  //     },
  //     {
  //       id: 67,
  //       title: "Sign in",
  //       newTab: false,
  //       path: "/signin",
  //     },
  //     {
  //       id: 68,
  //       title: "Sign up",
  //       newTab: false,
  //       path: "/signup",
  //     },
  //     {
  //       id: 69,
  //       title: "My Account",
  //       newTab: false,
  //       path: "/my-account",
  //     },
  //     {
  //       id: 70,
  //       title: "Contact",
  //       newTab: false,
  //       path: "/contact",
  //     },
  //     {
  //       id: 62,
  //       title: "Error",
  //       newTab: false,
  //       path: "/error",
  //     },
  //     {
  //       id: 63,
  //       title: "Mail Success",
  //       newTab: false,
  //       path: "/mail-success",
  //     },
  //   ],
  // },
];

export const menuData: Menu[] = rawMenu.map((main) => ({
  ...main,
  submenu: main.submenu
    ? main.title && TARGET_MAIN_CATEGORIES.includes(main.title)
      ? main.submenu.map((sub) => ({
          ...sub,
          path: "/shop",
          apiUrl: `/products?mainCategory=${encodeURIComponent(
            main.title
          )}&subCategory1=${encodeURIComponent(sub.title)}`,
        }))
      : main.submenu // keep original if not in target
    : undefined,
}));
