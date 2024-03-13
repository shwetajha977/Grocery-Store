export default {
  template: `
    <section class="vh-50"  v-else>
    <div class="container py-5 h-50">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-xl-10">
          <div class="card" style="border-radius: 1rem;">
            <div class="row g-0">
              <div class="col-md-6 col-lg-5 d-none d-md-block">
                <img src="https://i.pinimg.com/474x/24/23/d8/2423d8821a22ce7507f4313519a989b2.jpg"
                  alt="login form" class="img-fluid" style="border-radius: 1rem 0 0 1rem; height: 100%;" />
              </div>
              <div class="col-md-1 col-lg-7 d-flex align-items-center">
                <div class="card-body p-4 p-lg-6 text-black">
                  <form>
                    <div class="d-flex align-items-center mb-3 pb-1">
                      <i class="fas fa-cubes fa-2x me-3" style="color: #ff6219;"></i>
                      <span class="h2 fw-bold mb-0">Fresh Direct</span>
                    </div>
                    <h6 class="fw-normal mb-1 pb-3" style="letter-spacing: 1px;">Add your available Products</h6>
                    <div class="form-outline  mb-4" >
                    <select id="C_name" class="form-control form-control-lg" v-model="resource.C_name" style ="width: 550px; height:15px;  min-height:45px;">
                      <option v-for="category in categories" :key="category.C_id" :value="category.C_name">{{ category.C_name }}</option>
                      </select>
                      <label class="form-label" for="C_name">Category Name</label>
                    </div>
                    <div class="form-outline  mb-4" >
                      <input type="text" id="P_name" class="form-control form-control-lg" v-model="resource.P_name" style ="width: 550px; height:15px;  min-height:45px;"/>
                      <label class="form-label" for="P_name">Product Name</label>
                    </div>
                    <div class="form-outline  mb-4">
                      <input type="text" id="MFG" class="form-control form-control-lg" v-model="resource.MFG" style ="width: 550px; height:15px;  min-height:45px;"/>
                      <label class="form-label" for="MFG">Manufacturing Date</label>
                    </div>
                    <div class="form-outline  mb-4" >
                      <input type="text" id="EXP" class="form-control form-control-lg" v-model="resource.EXP" style ="width: 550px; height:15px;  min-height:45px;"/>
                      <label class="form-label" for="EXP"> Expiry Date</label>
                    </div>
                    <div class="form-outline  mb-4">
                      <input type="text" id="unit" class="form-control form-control-lg" v-model="resource.unit" style ="width: 550px; height:15px;  min-height:45px;"/>
                      <label class="form-label" for="unit">Unit</label>
                    </div>
                    <div class="form-outline  mb-4">
                      <input type="text" id="rate_per_unit" class="form-control form-control-lg" v-model="resource.rate_per_unit" style ="width: 550px; height:15px;  min-height:45px;"/>
                      <label class="form-label" for="rate_per_unit">Rate Per Unit</label>
                    </div>
                    <div class="form-outline  mb-4">
                      <input type="text" id="quantity" class="form-control form-control-lg" v-model="resource.quantity" style ="width: 550px; height:15px;  min-height:45px;"/>
                      <label class="form-label" for="quantity">Quantity</label>
                    </div>
                    <div class="pt-1 mb-1">
                      <button class="btn btn-dark btn-lg btn-block" type="button" @click="addProduct">Add</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `,
  data() {
    return {
      resource: {
        P_name: "",
        C_name: "",
        MFG: "",
        EXP: "",
        unit: "",
        rate_per_unit: "",
        quantity: "",
      },
      categories: [],
    };
  },
  mounted() {
    // Fetch categories from the server
    this.fetchCategories();
  },
  methods: {
    fetchCategories() {
      // Make an API request to fetch categories
      // Replace this with your actual API endpoint
      fetch("/add-categories")
        .then((response) => response.json())
        .then((data) => {
          this.categories = data;
        })
        .catch((error) => console.error("Error fetching categories:", error));
    },
    addProduct() {
      const token = localStorage.getItem("auth-token");
      console.log(this.resource);
      fetch("/add-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(this.resource),
      })
        .then((res) => res.json())
        .then((data) => {
          this.$router.push("/");
        });
    },
  },
};
