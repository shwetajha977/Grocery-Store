export default {
  template: `
  <section>
  <div class="container-fluid" style="margin-top: 20px;" align="center">
    <u><i><strong><div class="text-center" style="margin-top: 20px; color: red; font-size: 40px; font-family: Times New Roman">Manager Request</div></strong><br/></i></u>
    <ul><strong><p class="text-center" style="color: black; font-size: 30px; font-family: Times New Roman">Do you want to add, delete or update a category...</p></strong><br/></ul>
    <form align="center">
      <label style="color: black; font-size: 20px; font-family: Times New Roman">Category Name:</label>
      <input v-model="categoryName" required />
      <label style="color: black; font-size: 20px; font-family: Times New Roman">Action:</label>
      <button style="color: black; font-size: 20px; font-family: Times New Roman" type="button" @click="sendAddCategoryRequest">Add</button>
    </form><br/><br/>

    <form align="center">
      <label style="color: black; font-size: 20px; font-family: Times New Roman">Category Name:</label>
      <select v-model="categoryDName">
        <option v-for="category in categories" :key="category.C_id">{{ category.C_name }}</option>
      </select>
      <label style="color: black; font-size: 20px; font-family: Times New Roman">Action:</label>
      <button style="color: black; font-size: 20px; font-family: Times New Roman" type="button" @click="sendDeleteCategoryRequest">Delete</button>
    </form><br/><br/>

    <form align="center">
      <label style="color: black; font-size: 20px; font-family: Times New Roman">Category Name:</label>
      <select v-model="categoryUName">
        <option v-for="category in categories" :key="category.C_id">{{ category.C_name }}</option>
      </select>
      <label style="color: black; font-size: 20px; font-family: Times New Roman">New Category Name:</label>
      <input v-model="new_category_name" required />
      <label style="color: black; font-size: 20px; font-family: Times New Roman">Action:</label>
      <button style="color: black; font-size: 20px; font-family: Times New Roman" type="button" @click="sendUpdateCategoryRequest">Update</button>
    </form>
  </div>
</section>
`,
  data() {
    return {
      categoryName: "",
      categoryUName: "",
      categoryDName: "",
      categories: [],
      actionAdd: "add",
      actionDelete: "delete",
      actionUpdate: "update",
      new_category_name: "",
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    fetchCategories() {
      fetch("/get-categories", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.categories);
          this.categories = data.categories;
        })
        .catch((error) => console.error(error));
    },
    sendAddCategoryRequest() {
      fetch("/make-add-category-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          categoryName: this.categoryName,
          actionAdd: this.actionAdd,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert(data.message);
            location.reload();
          }
        })
        .catch((error) => {});
    },
    sendDeleteCategoryRequest() {
      fetch("/make-delete-category-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          categories: this.categoryDName,
          actionDelete: this.actionDelete,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert(data.message);
            location.reload();
          }
        })
        .catch((error) => {});
    },
    sendUpdateCategoryRequest() {
      fetch("/make-update-category-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          categoryName: this.categoryUName,
          newCategoryName: this.new_category_name,
          actionUpdate: this.actionUpdate,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert(data.message);
            location.reload();
          }
        })
        .catch((error) => {});
    },
  },
};
