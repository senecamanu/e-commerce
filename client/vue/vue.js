// ! PRODUCTS DATA

new Vue({
  el: "#app",
  data: {
    categories: [], //list of all categories
    products: [], //
    cartList: [],
    categoryFilter: '',
    login: "false",
    cartAmount: 0,
    cartTotalPrice: 0,
    editModalItem: {
      itemId: null,
      image: '',
      price: 0,
      stock: 0,
      deleted: false,
      category: null
    }
  },
  methods: {
    addProducts: function() {
      products = []
      axios({
        method: "get",
        url: "http://localhost:3030/api/item"
      })
        .then(result => {
          for (let i in result.data.result) {
            // 1. changing price to Rupiah
            result.data.result[i].price = `Rp. ${result.data.result[i].price
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
              if (!result.data.result[i].deleted) {
                this.products.push(result.data.result[i]);
              }
          }
        })
        .catch(err => console.log(err));
    },

    // ADD CATEGORIES
    addCategories: function() {
      axios({
        method: "get",
        url: "http://localhost:3030/api/category"
      })
        .then(result => {
          for (let i in result.data.result) {
            // NON VUE
            String.prototype.capitalize = function() {
              return this.charAt(0).toUpperCase() + this.slice(1);
            };

            let tempName = result.data.result[i].name
              .split("-")
              .join(" ")
              .capitalize();

            this.categories.push({
              showName: tempName,
              value: result.data.result[i].name,
              categoryId: result.data.result[i]._id
            });
          }
        })
        .catch(err => console.log(err));
    },

    createItem: function() {
      // early assigning
      const price = this.$refs.createItemPrice.value,
            stock = this.$refs.createItemStock.value,
            image = this.$refs.createItemName.value,
            category = this.$refs.createItemCategory.value

      let formData = new FormData()
      formData.append("image", this.$refs.createItemImage.files[0]);
      axios.post('http://localhost:3031/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(result => {
          const imageLink = result.data.link
          axios({
            method: 'post',
            url: 'http://localhost:3030/api/item',
            data: {
              name: imageLink, // gue balik bc semuanya udah kaya gitu
              price: price.toString(),
              stock: stock.toString(),
              image: image.toString(), // ini nama
              category: category.toString() // this is the category's id
            }
          })
            .then(result => {
              console.log(result.data)
            })
            .catch(err => console.log(err))


        })
        .catch(err => console.log(err))
    },

    signUpFormSubmit: function() {
      axios({
        method: "post",
        url: "http://localhost:3030/api/user",
        data: {
          name: `${this.$refs.firstName.value} ${this.$refs.lastName.value}`,
          email: this.$refs.email.value,
          password: this.$refs.password.value
        }
      })
        .then(result => console.log(result.data))
        .catch(err => console.log(err));
    },

    signInFormSubmit: function() {
      axios({
        method: "post",
        url: "http://localhost:3030/api/user/si",
        data: {
          email: this.$refs.emailSignIn.value,
          password: this.$refs.passwordSignIn.value
        }
      })
        .then(result => {
          if (result.data.message === "Success") {
            // 1. Success
            localStorage.setItem("access_token", result.data.jwt);
            localStorage.setItem("role", result.data.role);
            this.loginCheck();
            this.cartNumber();
          } else if (result.data.message === "Password does not match") {
            // 2. Password does not match
            console.log(`password does not match`);
          } else if (result.data.message === "User not found") {
            // 3. User not found
            console.log(`User not found`);
          } else {
            console.log(result.data);
          }
        })
        .catch(err => console.log(err));
    },

    adminSignUpFormSubmit: function() {
      axios({
        method: "post",
        url: "http://localhost:3030/api/user/a",
        data: {
          name: `${this.$refs.adminFirstName.value} ${
            this.$refs.adminLastName.value
          }`,
          email: this.$refs.adminEmail.value,
          password: this.$refs.adminPassword.value
        }
      })
        .then(result => console.log(result.data))
        .catch(err => console.log(err));
    },

    adminSignInFormSubmit: function () {
      console.log()
      axios({
        method: "post",
        url: "http://localhost:3030/api/user/as",
        data: {
          email: this.$refs.adminEmailSignIn.value,
          password: this.$refs.adminPasswordSignIn.value
        }
      })
        .then(result => {
          if (result.data.message === "Success") {
            // 1. Success
            localStorage.setItem("access_token", result.data.jwt);
            localStorage.setItem("role", result.data.role);
            this.loginCheck();
            this.cartNumber();
          } else if (result.data.message === "Password does not match") {
            // 2. Password does not match
            console.log(`password does not match`);
          } else if (result.data.message === "User not found") {
            // 3. User not found
            console.log(`User not found`);
          } else {
            console.log(result.data);
          }
        })
        .catch(err => console.log(err));
    },

    loginCheck: function() {
      if (localStorage.getItem("access_token")) {
        if (localStorage.getItem("role") === "Admin") {
          this.login = "Admin"
        } else this.login = "User"
      } else {
        this.login = "false";
      }
    },

    signOut: function() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      this.loginCheck();
    },

    addToCart: function(itemId) {
      axios({
        method: "put",
        url: "http://localhost:3030/api/user/c",
        headers: {
          access_token: localStorage.getItem("access_token")
        },
        data: {
          itemId: itemId,
          amount: 1
        }
      })
        .then(result => {
          if (Number(result.data.nModified) !== 0) {
            if (Number(result.data.ok) !== 0) {
              this.cartAmount++;
            }
          }
        })
        .catch(err => console.log(err));
    },

    // Checks cart's amount from user after loading
    cartNumber: function() {
      if (localStorage.getItem("access_token")) {
        axios({
          method: "post",
          url: "http://localhost:3030/api/user/cc",
          headers: {
            access_token: localStorage.getItem("access_token")
          }
        })
          .then(result => {
            this.cartAmount = Number(result.data.amount);
          })
          .catch(err => console.log(err));
      }
    },

    cartTotalPriceCounter: function() {
      for (let i in this.cartList.cart) {
        this.cartTotalPrice += (this.cartList.cart[i].itemId.price * this.cartList.cart[i].amount)
      }
    },

    // Populate the list with items from user's cart
    cartListFiller: function() {
      if (localStorage.getItem("access_token")) {
        axios({
          method: "post",
          url: "http://localhost:3030/api/user/cl",
          headers: {
            access_token: localStorage.getItem("access_token")
          }
        })
          .then(result => {
            this.cartList = result.data
            this.cartTotalPriceCounter();
          })
      }
    },

    checkout: function() {
      let itemsId = []
      for (let i = 0; i < this.cartList.cart.length; i++) {
        itemsId.push({
          itemId: this.cartList.cart[i].itemId._id,
          amount: this.cartList.cart[i].amount
        })
      }
      let data = {
        itemsId: itemsId,
        totalPrice: Number(this.cartTotalPrice),
        purchaseDate: new Date().toISOString()
      }

      axios({
        method: 'post',
        url: 'http://localhost:3030/api/transaction',
        headers: {
          access_token: localStorage.getItem('access_token')
        },
        data: data
      })
        .then(result => {
          if (result.data.message === 'Success') {
            this.addProducts();
            this.cartNumber();
          }
        })
        .catch(err => console.log(err))
    },

    editItemModal: function(itemId) {
      axios({
        method: 'get',
        url: `http://localhost:3030/api/item/${itemId}`
      })
        .then(result => {
          // ? assigning to values for formfilling
          this.editModalItem.itemId = result.data.result._id;
          this.editModalItem.image = result.data.result.image;
          this.editModalItem.stock = result.data.result.stock;
          this.editModalItem.price = result.data.result.price;
          this.editModalItem.category = result.data.result.category;

          console.log(this.editModalItem)
        })
        .catch(err => {
          console.log(err)
        })
    },

    editItemSubmit: function(itemId) {
      // 1. Image not submitted
      if (!this.$refs.editItemName.files[0]) {
        axios({
          method: "put",
          url: `http://localhost:3030/api/item/${itemId}`,
          data: {
            image: this.$refs.editItemImage.value,
            price: this.$refs.editItemPrice.value,
            stock: this.$refs.editItemStock.value,
            category: this.$refs.editItemCategory.value
          }
        })
          .then(result => {
            console.log(result.data)
          })
          .catch(err => console.log(err));
      }

      // 2. Image submitted
      else {
        let formData = new FormData()
        formData.append("image", this.$refs.editItemName.files[0]);
        axios.post('http://localhost:3031/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(result => {
            const imageLink = result.data.link
            axios({
              method: "put",
              url: `http://localhost:3030/api/item/${itemId}`,
              data: {
                name: imageLink, // gue balik bc semuanya udah kaya gitu
                image: this.$refs.editItemImage.value,
                price: this.$refs.editItemPrice.value,
                stock: this.$refs.editItemStock.value,
                category: this.$refs.editItemCategory.value
              }
            })
              .then(result => {
                console.log(result.data);
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err))
      }
    },

    deleteItemSubmit: function(itemId) {
      axios({
        method: 'delete',
        url: `http://localhost:3030/api/item/p/${itemId}`,
        data: {
          deleted: true,
          stock: 0,
          price: 0
        }
      })
        .then(result => {
          console.log(result.data)
        })
        .catch(err => {
          console.log(err)
        })
    },

    createCategory: function() {
      const categoryName = this.$refs.categoryName.value.toLowerCase().split(' ').join('-')
      axios({
        method: 'post',
        url: 'http://localhost:3030/api/category',
        data: {
          name: categoryName
        }
      })
        .then(result => {
          console.log(result.data)
        })
        .catch(err => console.log(err))
    },

    rupiahParse: function(input) {
      return `Rp. ${input
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`
    },

    onCategoryChange: function() {

    }
  },

  computed: {
    filteredList() {
      return this.products.filter(post => {
        return post.category.toLowerCase().includes(this.categoryFilter.toLowerCase());
      });
    }
  },

  beforeMount() {
    this.addCategories();
    this.addProducts();
    this.loginCheck();
    this.cartNumber();
  }
});