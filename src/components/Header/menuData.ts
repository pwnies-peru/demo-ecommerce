import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 1,
    title: "Popular",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Tienda",
    newTab: false,
    path: "/shop-with-sidebar",
  },
  {
    id: 3,
    title: "Contacto",
    newTab: false,
    path: "/contact",
  },
  {
    id: 6,
    title: "páginas",
    newTab: false,
    path: "/",
    submenu: [
      {
        id: 61,
        title: "Tienda con Barra Lateral",
        newTab: false,
        path: "/shop-with-sidebar",
      },
      {
        id: 62,
        title: "Tienda sin Barra Lateral",
        newTab: false,
        path: "/shop-without-sidebar",
      },
      {
        id: 64,
        title: "Finalizar Compra",
        newTab: false,
        path: "/checkout",
      },
      {
        id: 65,
        title: "Carrito",
        newTab: false,
        path: "/cart",
      },
      {
        id: 66,
        title: "Lista de Deseos",
        newTab: false,
        path: "/wishlist",
      },
      {
        id: 67,
        title: "Iniciar Sesión",
        newTab: false,
        path: "/signin",
      },
      {
        id: 68,
        title: "Registrarse",
        newTab: false,
        path: "/signup",
      },
      {
        id: 69,
        title: "Mi Cuenta",
        newTab: false,
        path: "/my-account",
      },
      {
        id: 70,
        title: "Contacto",
        newTab: false,
        path: "/contact",
      },
      {
        id: 62,
        title: "Error",
        newTab: false,
        path: "/error",
      },
      {
        id: 63,
        title: "Correo Enviado",
        newTab: false,
        path: "/mail-success",
      },
    ],
  },
  {
    id: 7,
    title: "blogs",
    newTab: false,
    path: "/",
    submenu: [
      {
        id: 71,
        title: "Blog en Cuadrícula con Barra Lateral",
        newTab: false,
        path: "/blogs/blog-grid-with-sidebar",
      },
      {
        id: 72,
        title: "Blog en Cuadrícula",
        newTab: false,
        path: "/blogs/blog-grid",
      },
      {
        id: 73,
        title: "Detalles del Blog con Barra Lateral",
        newTab: false,
        path: "/blogs/blog-details-with-sidebar",
      },
      {
        id: 74,
        title: "Detalles del Blog",
        newTab: false,
        path: "/blogs/blog-details",
      },
    ],
  },
];
