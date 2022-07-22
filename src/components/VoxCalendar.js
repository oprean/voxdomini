import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {API_ROOT_URL} from '../utils/constants'

export default class DemoApp extends React.Component {
  render() {
    return (
      <div style={{padding: 10}}>
      <FullCalendar
        plugins={[ dayGridPlugin, timeGridPlugin, listPlugin ]}
        events={API_ROOT_URL + 'events/cal'}
        initialView="dayGridMonth"
        locale={'ro-ro'}
        headerToolbar = {{
          left : 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          //center : 'title',
          //right : 'prevYear,prev,next,nextYear'
        }}
        eventLimit={2} // for all non-TimeGrid views
        views = {{
          timeGrid: {
          eventLimit: 2 // adjust to 6 only for timeGridWeek/timeGridDay
        }
      }}
      />
      </div>
    )
  }
}