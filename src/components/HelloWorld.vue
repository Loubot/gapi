<template>
    <div id="app">
      <div class='authentification'>
        <h2>VueJS + Google Calendar Example</h2>
        Authentification
        <button v-if='!authorized' @click="handleAuthClick">Sign In</button>
        <button v-if='authorized' @click="handleSignoutClick">Sign Out</button>
      </div>
      <hr>
      <button v-if='authorized' @click="getData">Get Data</button>
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
      this.api = gapi;
      this.handleClientLoad();
    },

    methods: {
      /**
       *  On load, called to load the auth2 library and API client library.
       */
      handleClientLoad() {
        this.api.load('client:auth2', this.initClient);
      },

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      initClient() {
        let vm = this;

        vm.api.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(_ => {
          // Listen for sign-in state changes.
          vm.api.auth2.getAuthInstance().isSignedIn.listen(vm.authorized);
        }).catch( function( err ) {
            console.log( err )
        })
      },

      /**
       *  Sign in the user upon button click.
       */
      handleAuthClick(event) {
        Promise.resolve(this.api.auth2.getAuthInstance().signIn())
          .then(_ => {
            this.authorized = true;
          }).catch( function( err ) {
            console.log( err )
        })
      },

      /**
       *  Sign out the user upon button click.
       */
      handleSignoutClick(event) {
        Promise.resolve(this.api.auth2.getAuthInstance().signOut())
          .then(_ => {
            this.authorized = false;
          });
      },

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      getData() {
        let vm = this;

        vm.api.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(response => {
          vm.items = this.syntaxHighlight(response.result.items)
          console.log(vm.items);
        });
      },

      syntaxHighlight(json) {
        if (typeof json != 'string') {
          json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
          var cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
        });
      }
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
