export default {
  template: `
  <section class="vh-100">
    <strong> <div class="text-center" style="color:black; font-size: 30px; font-family: Times New Roman">Search for Products and Categories...</div></strong>
      <div class="container py-5" align="center">
        <div class="form-group" style="color:black; font-family: Times New Roman" >
          <label for="searchTerm" style="color:black; font-size: 20px;  font-family: Times New Roman">Search Term:</label>
          <input type="text" v-model="searchTerm" id="searchTerm" style="color:black; font-size: 20px;  font-family: Times New Roman" />
          <button style="color:black; font-size: 20px; font-family: Times New Roman" @click="search">🔍 Search</button>
        </div>
        <div v-if="searchResults.length > 0">
          <h3 align="center" style="color:black; font-size: 30px; font-family: Times New Roman">Search Results</h3>
          <h2 class="text-center" style="color:black; font-weight: bold; font-size: 30px; font-family: Times New Roman">*** Your Search Products ***</h2>
            <div v-for="result in searchResults" :key="result.P_id">
              <div class="container py-5" align="center" style="background-color: lightblue">
                  <div class="col-md-12 col-xl-10" style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black; align-items: center; background-color: lightblue">
                    <div class="card shadow-0 border rounded-3" style="background-color: lightblue">
                      <div class="card-body" >
                        <div class="row">   
                            <div class="col-md-12 col-lg-3 col-xl-3 mb-4 mb-lg-0">
                                <div class="hover-overlay">
                                  <div class="mask" style="background-color: rgba(253, 253, 253, 0.15);"></div>
                                </div>
                            </div>
                        </div>                
                        <div class="col-md-6 col-lg-6 col-xl-6">
                            <div style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black;">{{ result.C_name }}</div>
                            <img src="https://as1.ftcdn.net/v2/jpg/00/83/13/94/1000_F_83139402_s6y48XWjWA7HG2u0LN9GqblalgN2fG1O.jpg" align="center" class="w-50" />
                            <div style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black;">{{ result.P_name }}</div>
                            <div class="mt-1 mb-0 text-muted small">
                                    <span class="text" style="font-size: 20px; font-family: Times New Roman; font-weight: bold; color: black;"> • Manufacturer: {{ result.MFG }} </span><br/>
                                    <span class="text" style="font-size: 20px; font-family: Times New Roman; font-weight: bold; color: black;"> • Expiry Date: {{ result.EXP }} </span><br/>
                                    <span class="text" style="font-size: 20px; font-family: Times New Roman; font-weight: bold; color: black;"> • Quantity: {{ result.quantity }} </span>
                            </div>
                            <p style="font-size: 20px; font-family: Times New Roman; color: black;" class="text-truncate mb-4 mb-md-0">
                              Your perfect pack for everyday use and walks in the forest.
                            </p>
                        </div>
                        <div class="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-start">
                            <div class="d-flex flex-row align-items-center mb-1">
                              <h4 style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: black;" align="center" class="mb-1 me-1">Rs.{{ result.rate_per_unit }}/{{result.unit}}</h4>
                            </div>
                            <div class="d-flex flex-column mt-4" v-if="result.quantity > 0">
                              <button @click="addToCart(result.P_id)">Add to Wishlist</button>
                            </div>
                            <div class="d-flex flex-column mt-4" v-else>
                              <button disabled>Add to Wishlist</button>
                            </div>
                        </div>
                        <div style="font-size: 30px; font-family: Times New Roman; font-weight: bold; color: red;">
                        *****************************************************************
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

            </div>
        <div v-else>
          <p align="center">No results found.</p>
        </div>
      </div>  
  </section>
  `,

  data() {
    return {
      searchTerm: "",
      searchResults: [],
    };
  },
  methods: {
    search() {
      // Send a request to the backend to perform the search
      fetch(`/search?term=${this.searchTerm}`)
        .then((response) => response.json())
        .then((data) => {
          this.searchResults = data.results;
        })
        .catch((error) => console.error(error));
    },
    addToCart(result_id) {
      // Simulate adding product to the cart
      const quantity = prompt("Enter quantity:");
      console.log(quantity);
      if (
        quantity !== null &&
        quantity !== "" &&
        !isNaN(quantity) &&
        parseInt(quantity) > 0
      ) {
        fetch("/add-to-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          body: JSON.stringify({
            user_id: localStorage.getItem("auth-token"),
            result_id: result_id,
            quantity: parseInt(quantity),
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            // Optionally, you can redirect the user to the cart page
            this.$router.push({ path: "/checkout" });
          })
          .catch((error) => console.error(error));
      } else {
        alert("Invalid quantity. Please enter a valid number.");
      }
    },
  },
};
