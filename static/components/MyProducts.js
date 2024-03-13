export default {
    template: `
    <section style="background-color: lightblue;">
    <div class="container py-5" align="center">
    <strong> <div class="text-center" style="color:black; font-size: 50px; font-weight: bold;  font-family: Times New Roman">Welcome to our Store</div></strong><br/><br/>
        <div align="center">
        <router-link class="btn btn-primary" style="background-color: black; align-items: center; color: white; font-size: 30px; font-family: Times New Roman" to="/create-products"> Add Product</router-link>
        </div><br/>
        <div class="row justify-content-center mb-3" v-if="products.length > 0" style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black; background-color: lightblue;">
        <div class="text-center" style="color:black; font-weight: bold; font-size: 40px; font-family: Times New Roman">***Your Products***</div>
          <div style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black;" v-for="(categoryProducts, categoryName) in groupedProducts" :key="categoryName">
          <i><u><div class="text-center" style="color:black; font-size: 40px; font-family: Times New Roman">{{ categoryName }}</div></u></i>
            <div class="col-md-12 col-xl-10" style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black; align-items: center; background-color: lightblue">
                <div class="card shadow-0 border rounded-3" style="background-color: lightblue">
                    <div class="row justify-content-center mb-3">
                        <div v-for="product in categoryProducts" :key="product.P_id" class="col-md-6 col-lg-6 col-xl-6"> </br>
                            <div class="col-md-6 col-lg-6 col-xl-6">
                                <img src="https://as1.ftcdn.net/v2/jpg/00/83/13/94/1000_F_83139402_s6y48XWjWA7HG2u0LN9GqblalgN2fG1O.jpg" align="center" class="w-100" />
                                <div style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black;">{{ product.P_name }}</div>
                                <button class="btn btn-success" @click="export_csv(product.C_name)">Export CSV File</button><br/>
                                <div class="mt-1 mb-0 text-muted small">
                                  <button class="btn btn-success" @click="editProduct(product)">Edit</button>
                                  <button class="btn btn-danger" @click="deleteProduct(product.P_id)">Delete</button>
                                </div >
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
                                    <div style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black;" align="center" class="mb-1 me-1">Rs.{{ product.rate_per_unit }}/{{product.unit}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: red;">
                    *******************************************************************
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <div v-else>
           <p align="center" style="color:black; font-size: 30px; font-family: Times New Roman">No products available at the moment.</p>
        </div>
        <div v-if="isEditProductModalVisible" class="custom-modal">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Product</h5>
            </div>
            <div class="modal-body">
              <div class="form-outline mb-4">
                <select id="C_name" class="form-control form-control-lg" v-model="editingproduct.C_name" style="width: 550px; height:15px; min-height:45px;">
                  <option v-for="category in categories" :key="category.C_id" :value="category.C_name">{{ category.C_name }}</option>
                </select>
                <label class="form-label" for="C_name">Category Name</label>
              </div>
              <div class="form-outline mb-4">
                <input type="text" id="P_name" class="form-control form-control-lg" v-model="editingproduct.P_name" style="width: 550px; height:15px; min-height:45px;" />
                <label class="form-label" for="P_name">Product Name</label>
              </div>
              <div class="form-outline  mb-4">
                <input type="text" id="MFG" class="form-control form-control-lg" v-model="editingproduct.MFG" style ="width: 550px; height:15px;  min-height:45px;"/>
                <label class="form-label" for="MFG">Manufacturing Date</label>
              </div>
              <div class="form-outline  mb-4" >
                <input type="text" id="EXP" class="form-control form-control-lg" v-model="editingproduct.EXP" style ="width: 550px; height:15px;  min-height:45px;"/>
                <label class="form-label" for="EXP"> Expiry Date</label>
              </div>
              <div class="form-outline  mb-4">
                <input type="text" id="unit" class="form-control form-control-lg" v-model="editingproduct.unit" style ="width: 550px; height:15px;  min-height:45px;"/>
                <label class="form-label" for="unit">Unit</label>
              </div>
              <div class="form-outline  mb-4">
                <input type="text" id="rate_per_unit" class="form-control form-control-lg" v-model="editingproduct.rate_per_unit" style ="width: 550px; height:15px;  min-height:45px;"/>
                <label class="form-label" for="rate_per_unit">Rate Per Unit</label>
              </div>
              <div class="form-outline  mb-4">
                <input type="text" id="quantity" class="form-control form-control-lg" v-model="editingproduct.quantity" style ="width: 550px; height:15px;  min-height:45px;"/>
                <label class="form-label" for="quantity">Quantity</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="submiteditProduct">Save changes</button>
              <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            </div>
          </div>
        </div>
    </div>
    </section>
    `,
    data() {
        return {
            products: [],
            quantity: 0,
            editingproduct: {},
            categories: [],
            isEditProductModalVisible: false,
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
        fetchMyProducts() {
            fetch("/get-my-products", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
                    },
                })
                .then((response) => response.json())
                .then((data) => {
                    this.products = data.products;
                })
                .catch((error) => console.error(error));
        },
        deleteProduct(P_id) {
            fetch(`/delete-product/${P_id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
                    },
                })
                .then((response) => response.json())
                .then((data) => {
                    alert(data.message);
                    this.fetchMyProducts();
                })
                .catch((error) => console.error(error));
        },
        editProduct(product) {
            this.editingproduct = product;
            console.log(this.editingproduct);
            this.isEditProductModalVisible = true;
        },
        closeModal() {
            this.isEditProductModalVisible = false;
        },
        submiteditProduct() {
            const product = this.editingproduct;
            const editProductData = {
                P_name: product.P_name,
                C_name: product.C_name,
                MFG: product.MFG,
                EXP: product.EXP,
                unit: product.unit,
                rate_per_unit: product.rate_per_unit,
                quantity: product.quantity,
            };
            fetch(`/edit-product/${product.P_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
                    },
                    body: JSON.stringify(editProductData),
                })
                .then((response) => response.json())
                .then((data) => {
                    alert(data.message);
                    this.isEditProductModalVisible = false;
                    this.fetchMyProducts();
                })
                .catch((error) => console.error(error));
        },
        export_csv(C_name) {
            fetch(`/csv/${C_name}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
                    },
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        alert(data.message);
                    }
                })
                .catch((error) => {});
        },
    },

    mounted() {
        this.fetchMyProducts();
        this.fetchCategories();
    },
};