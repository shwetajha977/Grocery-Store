export default {
  template: `
    <section style="background-color: lightblue;">
    <div class="container py-5" align="center" style="background-color: lightblue">
        <div align="center">
        <div class="text-center" style="color:red; font-size: 25px; font-family: Times New Roman"> Do you want to add more categories...</div>
        <router-link class="btn btn-primary" style="background-color: lightblue align-items: center color: black font-size: 30px font-family: Times New Roman" to="/create-categories"> Add Category</router-link>
        </div><br/>
        <div class="row justify-content-center mb-3" v-if="products.length > 0">
        <div class="text-center" style="color:black; font-size: 40px; font-family: Times New Roman">***All Categories***</div>
            <div class="col-md-12 col-xl-10" style="background-color: lightblue">
                <div class="card shadow-0 border rounded-3" style="background-color: white">
                    <div class="card-body">
                        <div class="row">   
                            <div class="col-md-12 col-lg-3 col-xl-3 mb-4 mb-lg-0">
                                <div class="hover-overlay">
                                    <div class="mask" style="background-color: lightblue;"></div>
                                </div>
                            </div>
                        </div>
                        <div v-for="product in products" :key="product.P_id"> </br>
                            <div class="col-md-6 col-lg-6 col-xl-6">
                                <div style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black;">{{ product.C_name }}</div>
                                <div>
                                  <button class="btn btn-danger" @click="deleteCategory(product.C_name)">Delete</button>
                                  <button class="btn btn-success" @click="editCategory(product)">Edit</button>
                                </div><br/>
                            <div style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: red;">
                            **********************************
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
           <p align="center" style="color:black; font-size: 30px; font-family: Times New Roman">No products available at the moment.</p>
        </div>
        <div v-if="isEditcatModalVisible" class="custom-modal">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Category</h5>
            </div>
            <div class="modal-body">
              <div class="form-outline mb-4">
                <input type="text" id="C_name" class="form-control" v-model="Cat.C_name" />
                <label class="form-label" for="C_name">Category Name</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="submiteditCategory">Save changes</button>
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
      isEditcatModalVisible: false,
      Cat: {},
      oldCat: "",
    };
  },
  methods: {
    fetchProducts() {
      fetch("/get-categories")
        .then((response) => response.json())
        .then((data) => {
          this.products = data.categories;
        })
        .catch((error) => console.error(error));
    },
    deleteCategory(C_name) {
      fetch(`/delete-category/${C_name}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          this.fetchProducts();
        })
        .catch((error) => console.error(error));
    },
    editCategory(category) {
      this.oldCat = category.C_name;
      this.isEditcatModalVisible = true;
      this.Cat = category;
    },
    closeModal() {
      this.isEditcatModalVisible = false;
    },
    submiteditCategory() {
      const category = this.Cat;
      fetch("/edit-category/" + this.oldCat, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ C_name: category.C_name }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          this.fetchProducts();
          this.isEditcatModalVisible = false;
        })
        .catch((error) => console.error(error));
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
