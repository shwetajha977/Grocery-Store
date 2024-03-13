import AdminHome from "./AdminHome.js";
import CustomerHome from "./CustomerHome.js";
import ManagerHome from "./ManagerHome.js";

export default {
  template: `
    <div style="background-color:lightblue">
        <ManagerHome v-if="userRole == 'manager'"/>
        <CustomerHome v-else-if="userRole == 'customer'"/>
        <AdminHome v-else-if="userRole == 'admin'"/>
    </div>
    `,
  data() {
    return {
      userRole: localStorage.getItem("role"),
    };
  },
  components: {
    AdminHome,
    CustomerHome,
    ManagerHome,
  },
};
