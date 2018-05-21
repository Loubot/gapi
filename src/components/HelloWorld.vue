<template>

    <div >
        <v-container grid-list-md text-xs-center>
            <div class='authentification'>
                <h2>VueJS + Google Calendar Example</h2>
                Authentification
                <button v-if='!authorized' @click="handleAuthClick">Sign In</button>
                <button v-if='authorized' @click="handleSignoutClick">Sign Out</button>
            </div>
            <v-layout row wrap>
                
                <!-- <hr> -->
                <div class="calendar-controls">

                    <div v-if="message" class="notification is-success">{{ message }}</div>

                    <div class="box">

                        <h4 class="title is-5">Play with the options!</h4>

                        <div class="field">
                            <label class="label">Period UOM</label>
                            <div class="control">
                                <div class="select">
                                    <select v-model="displayPeriodUom">
                                        <option>month</option>
                                        <option>week</option>
                                        <option>year</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Period Count</label>
                            <div class="control">
                                <div class="select">
                                    <select v-model="displayPeriodCount">
                                        <option :value="1">1</option>
                                        <option :value="2">2</option>
                                        <option :value="3">3</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Starting day of the week</label>
                            <div class="control">
                                <div class="select">
                                    <select v-model="startingDayOfWeek">
                                        <option
                                            v-for="(d, index) in dayNames"
                                            :value="index"
                                            :key="index">{{ d }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Themes</label>
                            <label class="checkbox">Default</label>
                            <input v-model="useDefaultTheme" type="checkbox">
                        </div>

                        <div class="field">
                            <label class="checkbox">Holidays</label>
                            <input v-model="useHolidayTheme" type="checkbox">
                        </div>
                    </div>

                    <div class="box">
                        <div class="field">
                            <div class="control">
                                <v-text-field
                                    label="Title"
                                    v-model="newEventTitle" 
                                    class="input" 
                                    type="text"
                                ></v-text-field>
                                
                            </div>
                        </div>

                        <div class="field">
                            <v-menu
                                ref="menu2"
                                :close-on-content-click="false"
                                v-model="menu2"
                                :nudge-right="40"
                                :return-value.sync="date"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                            >
                                <v-text-field
                                  slot="activator"
                                  v-model="newEventStartDate"
                                  label="Start date"
                                  prepend-icon="event"
                                  readonly
                                ></v-text-field>
                                <v-date-picker v-model="newEventStartDate" ></v-date-picker>

                            </v-menu>
                            <v-flex xs12 sm12>
                                <v-menu
                                    ref="menu4"
                                    :close-on-content-click="false"
                                    v-model="menu4"
                                    :nudge-right="40"
                                    :return-value.sync="startTime"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    max-width="290px"
                                    min-width="290px"
                                >
                                    <v-text-field
                                      slot="activator"
                                      v-model="startTime"
                                      label="Start time"
                                      prepend-icon="access_time"
                                      readonly
                                    ></v-text-field>
                                    <v-time-picker v-model="startTime" @change="$refs.menu4.save(startTime)"></v-time-picker>
                                </v-menu>
                            </v-flex>
                            
                        </div>

                        <div class="field">
                            <v-menu
                                ref="menu2"
                                :close-on-content-click="false"
                                v-model="menu2"
                                :nudge-right="40"
                                :return-value.sync="date"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                            >
                                <v-text-field
                                  slot="activator"
                                  v-model="newEventEndDate"
                                  label="End date"
                                  prepend-icon="event"
                                  readonly
                                ></v-text-field>
                                <v-date-picker v-model="newEventEndDate" ></v-date-picker>

                            </v-menu>

                            <v-flex xs12 sm12>
                                <v-menu
                                    ref="menu3"
                                    :close-on-content-click="false"
                                    v-model="menu3"
                                    :nudge-right="40"
                                    :return-value.sync="endTime"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    max-width="290px"
                                    min-width="290px"
                                >
                                    <v-text-field
                                      slot="activator"
                                      v-model="endTime"
                                      label="End time"
                                      prepend-icon="access_time"
                                      readonly
                                    ></v-text-field>
                                    <v-time-picker v-model="endTime" @change="$refs.menu3.save(endTime)"></v-time-picker>
                                </v-menu>
                            </v-flex>
                            
                        </div>

                        <button class="button is-info" @click="insertEvent">Add Event</button>
                    </div>

                </div>

                <div class="calendar-parent">

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
            </v-layout>
            
        </v-container>

        {{ startTime }}
        
    </div>
</template>

<script>
const CLIENT_ID = '610350486752-prapm3i4tvrtal1l7i4s2nfvm5uje8dd.apps.googleusercontent.com';
const API_KEY = 'AIzaSyB-Feh-j_ZSCAottMYU0587HoKskTUECjc';

/* client secret: Nwuitg82M-Q1JxIG8eEY1j3d*/
// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar';
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
        startTime: null,
        endTime: null,
        menu2: false,
        menu3: false,
        menu4: false,
        date: null,
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
            let vm = this

            // gapi.client.calendar.calendarList.list({})
            // .then( function( res ) {
            //     console.log( res )
            // })
            gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        }).then(function(response) {
            console.log( response.result.items[0] )
            
            vm.events = []
            // vm.events = response.result.items
            // var events = response.result.items;
            // appendPre('Upcoming events:');
            var i;
            console.log( response.result.items )
            if ( response.result.items.length > 0) {
                for (i = 0; i < response.result.items.length; i++) {

                    vm.events.push({
                        startDate:  response.result.items[i].start.dateTime,
                        endDate: response.result.items[i].end.dateTime,
                        title: response.result.items[i].summary
                    })
                   
                }
            } else {
                // appendPre('No upcoming events found.');
            }
        });
      },


      insertEvent() {
        let vm = this

        var event = {
            
            'summart': 'test bla',
            'description': 'description',
            'start': {'dateTime': "2018-05-20T13:00:00+01:00" },
            'end': { 'dateTime': "2018-05-20T14:00:00+01:00" },
            'attendees': [
                { 'email': 'louisangelini@gmail.com' }
            ],

        }


        gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event

        }).then( function( res ) {
            console.log( res )
        }).catch( function( err ) {
            console.log( err )
        })
      }
        

    },
    computed: {
        userLocale() {
            return this.getDefaultBrowserLocale
        },
        dayNames() {
            return this.getFormattedWeekdayNames(this.userLocale, "long", 0)
        },
        themeClasses() {
            return {
                "theme-default": this.useDefaultTheme,
                "holiday-us-traditional": this.useHolidayTheme,
                "holiday-us-official": this.useHolidayTheme,
            }
        },
    },
    mounted() {
        this.newEventStartDate = this.isoYearMonthDay(this.today())
        this.newEventEndDate = this.isoYearMonthDay(this.today())
    },

    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body {
    height: 100%;
    margin: 0;
    background-color: #f7fcff;
}

#app {
    display: flex;
    flex-direction: row;
    font-family: Calibri, sans-serif;
    width: 95vw;
    min-width: 30rem;
    max-width: 100rem;
    min-height: 40rem;
    margin-left: auto;
    margin-right: auto;
}

.calendar-controls {
    margin-right: 1rem;
    min-width: 14rem;
    max-width: 14rem;
}

.calendar-parent {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: hidden;
    max-height: 80vh;
    background-color: white;
}

/* For long calendars, ensure each week gets sufficient height. The body of the calendar will scroll if needed */
.cv-wrapper.period-month.periodCount-2 .cv-week,
.cv-wrapper.period-month.periodCount-3 .cv-week,
.cv-wrapper.period-year .cv-week {
    min-height: 6rem;
}

/* These styles are optional, to illustrate the flexbility of styling the calendar purely with CSS. */

/* Add some styling for events tagged with the "birthday" class */
.calendar .event.birthday {
    background-color: #e0f0e0;
    border-color: #d7e7d7;
}

.calendar .event.birthday::before {
    content: "\1F382";
    margin-right: 0.5em;
}
</style>
