export default {
    template: `
    <section style="background-color: lightblue;">
    <div class="container py-5" align="center">
        <strong> <div class="text-center" style="color:black; font-size: 50px; font-weight: bold;  font-family: Times New Roman">Welcome to our Store</div></strong><br/><br/>
        <div align="center">
        <router-link class="btn btn-primary" style="background-color: black; align-items: center; color: white; font-size: 30px; font-family: Times New Roman" to="/create-products"> Add Product</router-link>
        </div><br/>
        <div v-if="products.length > 0">
          <u><div class="text-center" style="color:green; font-weight: bold; font-size: 40px; font-family: Times New Roman">All Products</div></u>
          <div style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black;" v-for="(categoryProducts, categoryName) in groupedProducts" :key="categoryName">
          <i><u><div class="text-center" style="color:black; font-size: 40px; font-family: Times New Roman">{{ categoryName }}</div></u></i><br/>
            <div class="row justify-content-center mb-3">
              <div v-for="product in categoryProducts" :key="product.P_id" class="col-md-6 col-lg-6 col-xl-6">
                  <div class="col-md-6 col-lg-6 col-xl-6">

                    <img src="https://as1.ftcdn.net/v2/jpg/00/83/13/94/1000_F_83139402_s6y48XWjWA7HG2u0LN9GqblalgN2fG1O.jpg" align="center" class="w-300" height="200px" width="300px" />
                    <div style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black;">{{ product.P_name }}</div>
                    <div class="mt-1 mb-0 text-muted small">
                        <span class="text" style="font-size: 20px; font-family: Times New Roman; font-weight: bold; color: black;"> • Manufacturer: {{ product.MFG }} </span><br/>
                        <span class="text" style="font-size: 20px; font-family: Times New Roman; font-weight: bold; color: black;"> • Expiry Date: {{ product.EXP }} </span><br/>
                        <span class="text" style="font-size: 20px; font-family: Times New Roman; font-weight: bold; color: black;"> • Quantity: {{ product.quantity }} </span>
                    </div>
                  </div>
                    <p style="font-size: 20px; font-family: Times New Roman; color: black;" class="text-truncate mb-4 mb-md-0">
                    Your perfect pack for everyday use and walks in the forest.
                    </p>
                    <div class="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-start">
                      <div class="d-flex flex-row align-items-center mb-1">
                          <h4 style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black;" align="center" class="mb-1 me-1">Rs.{{ product.rate_per_unit }}/{{product.unit}}</h4>
                      </div>
                    </div>
              </div>
              <div style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: red;">
              ****************************************************************************************
              </div>
            </div>
          </div>
        </div>
        <div v-else>
           <p align="center" style="color:black; font-size: 30px; font-family: Times New Roman">No products available at the moment.</p>
        </div>
    </div>
    </section>
    `,
    data() {
        return {
            products: [],
            quantity: 0,
        };
    },
    computed: {
        groupedProducts() {
            // Group products by category name
            const grouped = {};
            this.products.forEach((product) => {
                if (!grouped[product.C_name]) {
                    grouped[product.C_name] = [];
                }
                grouped[product.C_name].push(product);
            });
            return grouped;
        },
    },
    methods: {
        fetchProducts() {
            fetch("/get-products")
                .then((response) => response.json())
                .then((data) => {
                    this.products = data.products;
                })
                .catch((error) => console.error(error));
        },
    },

    mounted() {
        this.fetchProducts();
    },
};