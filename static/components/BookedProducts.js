export default {
  template: `
    <section style="background-color: lightblue;">
    <div class="container py-5" align="center">
    <div class="row justify-content-center mb-3" v-if="isorder">
            <u><h2 class="text-center" style="color:black; font-weight: bold; font-size: 30px; font-family: Times New Roman">***Your Booked Products***</h2></u>
            <div class="col-md-12 col-xl-10" style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black; align-items: center; background-color: lightblue">
                <div class="card shadow-0 border rounded-3" style="background-color: lightblue">
                    <div class="card-body" style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black;">
                        <div v-for="order in orders" :key="order.P_id"> </br>
                            <div class="col-md-9 col-lg-6 col-xl-6">
                            <div style="font-size: 40px; font-family: Times New Roman; font-weight: bold; color: black;">{{ order.P_name }}</div>
                              <img src="https://as1.ftcdn.net/v2/jpg/00/83/13/94/1000_F_83139402_s6y48XWjWA7HG2u0LN9GqblalgN2fG1O.jpg" align="center" class="w-50" />
                                  <div class="mt-1 mb-0 text-muted small">
                                    <span class="text" style="font-size: 20px; font-family: Times New Roman; font-weight: bold; color: black;"> Quantity: {{ order.quantity }} </span>
                                  </div>
                                  <p style="font-size: 20px; font-family: Times New Roman; color: black;" class="text-truncate mb-4 mb-md-0">
                                      Your perfect pack for everyday use and walks in the forest.
                                  </p>
                            </div>
                                <div class="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-start">
                                  <div class="d-flex flex-row align-items-center mb-1">
                                      <h4 style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black;" class="mb-1 me-1" align="center">Rs.{{ order.rate_per_unit }}/{{order.unit}}</h4>
                                  </div>
                                </div>
                                <div style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: red;">
                                *******************************************************************
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p align="center" style="color:black; font-size: 30px; font-family: Times New Roman">You don't have any orders at the moment.</p>
        </div> 
    </div>
    </section>
    `,
  data() {
    return {
      orders: [],
      isorder: false,
    };
  },
  mounted() {
    this.orderProduct();
  },
  methods: {
    orderProduct() {
      fetch("/user/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.orders = data;
          this.isorder = this.orders.length > 0;
          console.log(this.orders);
        })
        .catch((error) => console.error(error));
    },
  },
};
