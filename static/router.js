import Home from "./components/Home.js";
import Login from "./components/Login.js";
import SignUp from "./components/SignUp.js";
import CategoryResourceForm from "./components/CategoryResourceForm.js";
import ProductResourceForm from "./components/ProductResourceForm.js";
import ManagerRequest from "./components/ManagerRequest.js";
import CustomerHome from "./components/CustomerHome.js";
import AdminHome from "./components/AdminHome.js";
import ManagerHome from "./components/ManagerHome.js";
import Cart from "./components/Cart.js";
import ProductDetail from "./components/ProductDetail.js";
import Search from "./components/Search.js";
import RequestAdmin from "./components/RequestAdmin.js";
import BookedProducts from "./components/BookedProducts.js";
import CategoryRequest from "./components/CategoryRequest.js";
import RequestAdminCategory from "./components/RequestAdminCategory.js";
import MyProducts from "./components/MyProducts.js";

const routes = [
  { path: "/", component: Home, name: "home" },
  { path: "/login", component: Login, name: "login" },
  { path: "/signup", component: SignUp },
  { path: "/create-categories", component: CategoryResourceForm },
  { path: "/create-products", component: ProductResourceForm },
  { path: "/make-manager-request", component: ManagerRequest },
  { path: "/customer-home", component: CustomerHome },
  { path: "/admin-home", component: AdminHome },
  { path: "/manager-home", component: ManagerHome },
  { path: "/checkout", component: Cart },
  { path: "/product-detail", component: ProductDetail },
  { path: "/search", component: Search },
  { path: "/request-admin", component: RequestAdmin },
  { path: "/booked-products", component: BookedProducts },
  { path: "/category-request", component: CategoryRequest },
  { path: "/request-admin-category", component: RequestAdminCategory },
  { path: "/my-products", component: MyProducts },
];

export default new VueRouter({ routes });
