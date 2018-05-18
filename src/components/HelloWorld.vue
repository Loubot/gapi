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
                :events="events"
                :show-date="showDate"
                :time-format-options="{hour: 'numeric', minute:'2-digit'}"
                :enable-drag-drop="true"
                :disable-past="disablePast"
                :disable-future="disableFuture"
                :show-event-times="showEventTimes"
                :display-period-uom="displayPeriodUom"
                :display-period-count="displayPeriodCount"
                :starting-day-of-week="startingDayOfWeek"
                :class="themeClasses"
                @drop-on-date="onDrop"
                @click-date="onClickDay"
                @click-event="onClickEvent"
                @show-date-change="setShowDate"
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
import CalendarMathMixin from "vue-simple-calendar/dist/calendar-math-mixin.js"
require("vue-simple-calendar/dist/static/css/default.css")
require("vue-simple-calendar/dist/static/css/holidays-us.css")

export default {
  name: 'HelloWorld',
  components : {
       CalendarView
  },
  mixins: [CalendarMathMixin],
  data() {
      return {
        items: undefined,
        api: undefined,
        authorized: false,
        showDate: new Date(),
        showDate: this.thisMonth(1),
        message: "",
        startingDayOfWeek: 0,
        disablePast: false,
        disableFuture: false,
        displayPeriodUom: "month",
        displayPeriodCount: 1,
        showEventTimes: true,
        newEventTitle: "",
        newEventStartDate: "",
        newEventEndDate: "",
        useDefaultTheme: true,
        useHolidayTheme: true,
        events: [
                    {
                        startDate: new Date(),
                        endDate: new Date().getHours() + 2,
                        title: 'bla'
                    },
                        
                    {
                        id: "e3",
                        startDate: this.thisMonth(20, 10, 27),
                        endDate: this.thisMonth(21, 16, 30),
                        title: "Multi-day event with a long title and times",
                    },
                    
                ],
      }
    },
    

    created() {
        this.api = gapi
        this.handleClientLoad()

    },

    methods: {
        thisMonth(d, h, m) {
            const t = new Date()
            var x =  new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
            console.log( new Date() )
            return x
        },

        onClickDay(d) {
            this.message = `You clicked: ${d.toLocaleDateString()}`
        },
        onClickEvent(e) {
            this.message = `You clicked: ${e.title}`
        },
        setShowDate(d) {
            this.message = `Changing calendar view to ${d.toLocaleDateString()}`
            this.showDate = d
        },
        onDrop(event, date) {
            this.message = `You dropped ${event.id} on ${date.toLocaleDateString()}`
            // Determine the delta between the old start date and the date chosen,
            // and apply that delta to both the start and end date to move the event.
            const eLength = this.dayDiff(event.startDate, date)
            event.originalEvent.startDate = this.addDays(event.startDate, eLength)
            event.originalEvent.endDate = this.addDays(event.endDate, eLength)
        },
        clickTestAddEvent() {
            this.events.push({
                startDate: this.newEventStartDate,
                endDate: this.newEventEndDate,
                title: this.newEventTitle,
            })
            this.message = "You added an event!"
        },
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
