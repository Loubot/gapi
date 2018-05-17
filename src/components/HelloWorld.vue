<template>
    <div id="app">
      <div class='authentification'>
        <h2>VueJS + Google Calendar Example</h2>
        Authentification
        <button v-if='!authorized' @click="">Sign In</button>
        <button v-if='authorized' @click="">Sign Out</button>
      </div>
      <hr>
      <button v-if='authorized' @click="">Get Data</button>
      <div class="item-container" v-if="authorized && items">
        <pre v-html="items"></pre>
      </div>
    </div>
</template>

<script>
const CLIENT_ID = '791741156907-3uoc7t4t9bp4aahcfjtfgilm0lrn954c.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCoDGu3zWdK64CdDvxBziRVyMSoPIQyppo';
// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
export default {
  name: 'HelloWorld',
  data() {
      return {
        items: undefined,
        api: undefined,
        authorized: false
      }
    },

    created() {
        this.api = gapi
        this.handleClientLoad()
    },

    methods: {
        handleClientLoad() {
            this.api.load( 'client:auth2', this.initClient )
        },

        updateSigninStatus(isSignedIn) {
            console.log( 'by jaysus' )
            if (isSignedIn) {
                // authorizeButton.style.display = 'none';
                // signoutButton.style.display = 'block';
                listUpcomingEvents();
            } else {
                console.log( 'not signed in')
                // authorizeButton.style.display = 'block';
                // signoutButton.style.display = 'none';
            }
        },

        initClient() {
            let vm = this
            console.log( 'hup')
            vm.api.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            }).then(function () {
                console.log( 'bla ')
                      // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(vm.updateSigninStatus)

                      // Handle the initial sign-in state.
                vm.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                // authorizeButton.onclick = handleAuthClick;
                // signoutButton.onclick = handleSignoutClick;
            })
        },

        

    }

    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
