export default {
  template: `
    <section style="background-color: lightblue;">
    <div class="container py-5" align="center">
      <div v-if="carts.length > 0">
        <u><div class="text-center" style="color:black; font-size: 40px; font-weight: bold; font-family: Times New Roman"> Your Cart</div></u><br/><br/>
          <div class="col-md-12 col-xl-10">
            <div class="card shadow-0 border rounded-3" style="background-color: lightblue">
              <div class="card-body">
                <div v-for="item in carts" :key="item.c_id">
                <div style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black;">{{ item.P_name }}</div></br>
                  <img src="https://as1.ftcdn.net/v2/jpg/00/83/13/94/1000_F_83139402_s6y48XWjWA7HG2u0LN9GqblalgN2fG1O.jpg" align="center" class="w-50" />
                  <div class="mt-1 mb-0 text-muted small">
                    <span class="text" style="font-size: 20px; font-family: Times New Roman; font-weight: bold; color: black;"> • Quantity: {{ item.quantity  }} </span><br/>
                    <span class="text" style="font-size: 20px; font-family: Times New Roman; font-weight: bold; color: black;"> Total: Rs.{{item.total}} </span><br/>
                  </div>
                </div>
              </div>
              <div style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: red;">
            *****************************************************************
            </div>
            </div><br/><br/>
          <button type="button" class="btn btn-success"  @click="checkout">Buy All</button>
        </div>

      </div>
      <div v-else>
        <p align="center" style="color:black; font-size: 30px; font-family: Times New Roman">Sorry, Your cart is empty!</p>
      </div>
    </div>
  </section>

    `,
  data() {
    return {
      carts: [],
    };
  },
  methods: {
    fetchCart() {
      // Fetch user's cart from the backend
      // const productId = this.$route.params.id;
      const productId = localStorage.getItem("P_id");
      fetch("/get-carts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.carts = data.carts;
        })
        .catch((error) => console.error(error));
    },
    checkout() {
      // Call the backend API to perform checkout
      fetch("/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ user_id: localStorage.getItem("auth-token") }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.fetchCart(); // Update cart after checkout
          this.$router.push({ path: "/booked-products" });
        })
        .catch((error) => console.error(error));
    },
  },
  mounted() {
    this.fetchCart();
  },
};
