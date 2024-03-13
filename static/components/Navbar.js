import SignUp from "./SignUp.js";

export default {
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid" style=" background-color:black;" >
      <a class="navbar-brand"  style="color:white; font-weight: bold; font-family: Times New Roman" href="#">Fresh Direct &zigrarr;</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item"  v-if="role == 'admin'">
            <router-link class="nav-link" style="color:white;" to="/admin-home">&#x22D2; Home</router-link>
          </li>
          <li class="nav-item" v-if="role == 'admin'">
            <router-link class="nav-link"  style="color:white;" to="/request-admin-category">&#x260E; Manager Request</router-link>
          </li>
          <li class="nav-item" v-if="role == 'admin'">
          <router-link class="nav-link"  style="color:white;" to="/request-admin">&#x260E; User Request</router-link>
          </li>
          <li class="nav-item"  v-if="role == 'manager'">
            <router-link class="nav-link" style="color:white;" to="/manager-home">&#x22D2; Home</router-link>
          </li>
          <li class="nav-item" v-if="role == 'manager'">
            <router-link class="nav-link"  style="color:white;" to="/category-request">&#x2720; Request</router-link>
          </li>
          <li class="nav-item" v-if="role == 'manager'">
            <router-link class="nav-link"  style="color:white;" to="/my-products">&divideontimes; My Products</router-link>
          </li>
          <li class="nav-item"  v-if="role == 'customer'">
            <router-link class="nav-link" style="color:white;" to="/product-detail">&#x22D2; Home</router-link>
          </li>
          <li class="nav-item"  v-if="role == 'customer'">
            <router-link class="nav-link" style="color:white;" to="/checkout">&trpezium; Cart</router-link>
          </li>
          <li class="nav-item"  v-if="role == 'customer'">
            <router-link class="nav-link" style="color:white;" to="/customer-home">&#x266A; Request</router-link>
          </li>
          <li class="nav-item"  v-if="role == 'customer'">
            <router-link class="nav-link" style="color:white;" to="/booked-products">&#x2663; Your Orders</router-link>
          </li>
          <li class="nav-item"  v-if="role == 'customer'">
            <router-link class="nav-link" style="color:white;" to="/search">🔍 Search</router-link>
          </li>
          <li class="nav-item"  v-if="is_login">
          <button class="nav-link" style="color:white;" @click="logout">&cross; Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
    `,
  components: {
    SignUp,
  },
  data() {
    return {
      is_login: localStorage.getItem("auth-token"),
      role: localStorage.getItem("role"),
    };
  },
  methods: {
    showSignUp() {
      this.$router.push({ path: "/signup" });
    },
    login() {
      location.reload();
    },
    SignUp() {
      location.reload();
    },
    logout() {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("role");
      this.$router.push({ path: "/login" });
    },
  },
};
