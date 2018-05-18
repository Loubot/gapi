<template>
    <div id="app">
      <div class='authentification'>
        <h2>VueJS + Google Calendar Example</h2>
        Authentification
        <button v-if='!authorized' @click="handleAuthClick">Sign In</button>
        <button v-if='authorized' @click="handleSignoutClick">Sign Out</button>
      </div>
      <hr>
      <button v-if='authorized' @click="">Get Data</button>
      <div class="item-container" v-if="authorized && items">
        <pre v-html="items"></pre>
      </div>

        <h1>My Calendar</h1>
            <calendar-view
                :show-date="showDate"
                @show-date-change="setShowDate"
                class="theme-default holiday-us-traditional holiday-us-official"
        />
        
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
import CalendarView from "vue-simple-calendar"
    // The next two lines are processed by webpack. If you're using the component without webpack compilation,
    // you should just create <link> elements for these as you would normally for CSS files. Both of these
    // CSS files are optional, you can create your own theme if you prefer.
require("vue-simple-calendar/dist/static/css/default.css")
require("vue-simple-calendar/dist/static/css/holidays-us.css")

export default {
  name: 'HelloWorld',
  data() {
      return {
        items: undefined,
        api: undefined,
        authorized: false,
        showDate: new Date() 

      }
    },
    components : {
         CalendarView
    },

    created() {
        this.api = gapi
        this.handleClientLoad()
    },

    methods: {
        setShowDate(d) {
            this.showDate = d;
        },
        handleClientLoad() {
            this.api.load( 'client:auth2', this.initClient )
        },

        updateSigninStatus(isSignedIn) {
            console.log( 'by jaysus' )
            if (isSignedIn) {
                // authorizeButton.style.display = 'none';
                // signoutButton.style.display = 'block';
                this.listUpcomingEvents();
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
        handleAuthClick(event) {
            console.log( event )
            gapi.auth2.getAuthInstance().signIn().then( function( res ) {
                console.log( res )
            }).catch( function( err ) {
                console.log( err )
            })
        },
        handleSignoutClick(event) {
            gapi.auth2.getAuthInstance().signOut();
        },

        listUpcomingEvents() {
            gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        }).then(function(response) {
            var events = response.result.items;
            // appendPre('Upcoming events:');
            var i;
            console.log( events )
            if (events.length > 0) {
                for (i = 0; i < events.length; i++) {
                    console.log( events[i])
                    var event = events[i];
                    var when = event.start.dateTime;
                    if (!when) {
                        when = event.start.date;
                    }
                // appendPre(event.summary + ' (' + when + ')')
                    }
            } else {
                // appendPre('No upcoming events found.');
            }
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
