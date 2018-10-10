<template>
  <div id="wrapper">
    <div class="container h-100">
      <div class="row justify-content-md-center h-100">
        <div class="card-wrapper">
          <div class="brand">
            <img :src="picture" alt="logo">
          </div>
          <div class="card fat">
            <div class="card-body">
              <h4 class="card-title">{{name}}</h4>
              <div class="form-group m-0">
                <button @click="logaFacebook" class="btn btn-primary btn-block">
                    Login
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const { ipcRenderer } = require('electron')
  export default {
    name: 'home',
    data(){
      return {
        name: "Login",
        picture: "https://nauvalazhar.github.io/my-login/img/logo.jpg",
      }
    },
    components: {},
    created() {
      var that=this
      ipcRenderer.on('fb-authenticated', (event, arg) => {
        console.log(arg)
        that.name = "Bem-vindo, " + arg.name
        that.picture = arg.picture.data.url
      })
    },
    methods: {
      logaFacebook() {
        ipcRenderer.send("fb-authenticate", "yes");
      }
    }
  }
</script>

<style>
  #background {
    height: 100%;
    width: 100%;
    position: absolute;
  }
  .brand {
    width: 90px;
    height: 90px;
    overflow: hidden;
    border-radius: 50%;
    margin: 0 auto;
    margin: 40px auto;
    box-shadow: 0 4px 8px rgba(0,0,0,.05);
    position: relative;
    z-index: 1;
  }
  .brand img {
    width: 100%;
  }
</style>
