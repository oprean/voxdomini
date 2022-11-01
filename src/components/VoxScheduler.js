import React, {Component} from 'react'
import Paper from '@mui/material/Paper';
import CampaignIcon from '@mui/icons-material/Campaign';
import { Redirect } from "react-router-dom";
import moment from 'moment'
import 'antd/lib/style/index.less';
import Scheduler, {SchedulerData, ViewTypes, DATE_FORMAT} from 'react-big-scheduler';
import EventForm from './EventForm';
import EventDlg from './EventDlg';
import DemoData from '../data/DemoData';
import 'react-big-scheduler/lib/css/style.css'
import withDragDropContext from './withDnDContext';
import axios from 'axios';
import {API_ROOT_URL} from '../utils/constants'

class Basic extends Component{
    constructor(props){
        super(props);
        moment.locale('ro', {
            week: {
                dow: 1,
            },
        });
        let schedulerData = new SchedulerData(new moment().format(DATE_FORMAT), ViewTypes.Week, false, false, undefined, {isNonWorkingTimeFunc: this.isNonWorkingTime}, moment);
        //schedulerData.localeMoment.locale('ro');
        this.width = window.innerWidth && document.documentElement.clientWidth?
            Math.min(window.innerWidth, document.documentElement.clientWidth) :
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.getElementByTagName('body')[0].clientWidth;
        this.state = {
            viewModel: schedulerData,
            selectedId:0,
            open:false
        }
    }

    isNonWorkingTime = (schedulerData, time) => {
		const { localeMoment } = schedulerData;
		if (schedulerData.viewType === ViewTypes.Day) {
			let hour = localeMoment(time).hour();
			if (hour < 9 || hour > 18) return true;
		} else {
			let dayOfWeek = localeMoment(time).weekday();
			if (dayOfWeek === 5 || dayOfWeek === 6) return true;
		}

		return false;
	};

    updateData() {
        fetch(API_ROOT_URL + 'events')  
        .then((response) => response.json())
        .then(dd => {
            let schedulerData = new SchedulerData(new moment().format(DATE_FORMAT), ViewTypes.Week, false, false, undefined, {isNonWorkingTimeFunc: this.isNonWorkingTime}, moment);
//            schedulerData.localeMoment.locale('ro');
            schedulerData.setResources(dd.resources);
            schedulerData.setEvents(dd.events);
            schedulerData.documentWidth = this.width;
            this.setState({viewModel: schedulerData});    
            this.schedulerData = schedulerData;
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { schedulerData } = this.props;
        if (prevProps.schedulerData !== schedulerData) {
            console.log(111);
            this.updateData()
        }
    }

    componentWillUnmount() {
    }

    componentDidMount() {
        this.updateData()
    }

    render(){
        const {viewModel} = this.state;
        return (
            <>
                    <Scheduler schedulerData={viewModel}
                               prevClick={this.prevClick}
                               nextClick={this.nextClick}
                               onSelectDate={this.onSelectDate}
                               onViewChange={this.onViewChange}
                               eventItemClick={this.eventClicked}
                               viewEventClick={this.eventDelete}
                               viewEventText="Delete"
                               viewEvent2Text="Edit"
                               viewEvent2Click={this.eventEdit}
                               updateEventStart={this.updateEventStart}
                               updateEventEnd={this.updateEventEnd}
                               moveEvent={this.moveEvent}
                               newEvent={this.newEvent}
                               onScrollLeft={this.onScrollLeft}
                               onScrollRight={this.onScrollRight}
                               onScrollTop={this.onScrollTop}
                               onScrollBottom={this.onScrollBottom}
                               toggleExpandFunc={this.toggleExpandFunc}
                               slotClickedFunc={this.slotClickedFunc}
                               eventItemTemplateResolver={this.eventItemTemplateResolver}
                    />
                    <EventForm open={this.state.open} eventId={this.state.selectedId} closeHandler={this.closeEventForm}/>
                    {this.state.redirect && <Redirect to={this.state.redirect} />};
            </>
        )
    }

    closeEventForm = () => {
        let _this = this;
        //this.setState({...{open:false}});
        let schedulerData = this.state.viewModel;
        axios(API_ROOT_URL + 'events').then(function (response) {
            schedulerData.setEvents(response.data.events);
            _this.setState({
                open:false,
                viewModel: schedulerData
            })
        });
    }

    prevClick = (schedulerData)=> {
        schedulerData.prev();
        let _this = this
        axios(API_ROOT_URL + 'events').then(function (response) {
            schedulerData.setEvents(response.data.events);
            _this.setState({
            viewModel: schedulerData
            })
        });
    }

    nextClick = (schedulerData)=> {
        schedulerData.next();
        let _this = this
        axios(API_ROOT_URL + 'events').then(function (response) {
            schedulerData.setEvents(response.data.events);
            _this.setState({
            viewModel: schedulerData
            })
        });
    }

    onViewChange = (schedulerData, view) => {
        schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
        let _this = this
        axios(API_ROOT_URL + 'events').then(function (response) {
            schedulerData.setEvents(response.data.events);
            _this.setState({
            viewModel: schedulerData
            })
        });
    }

    onSelectDate = (schedulerData, date) => {
        schedulerData.setDate(date);
        schedulerData.setEvents(DemoData.events);
        this.setState({
            viewModel: schedulerData
        })
    }

    eventClicked = (schedulerData, event) => {
        //alert(`You just clicked an event: {id: ${event.id}, title: ${event.title}}`);
        this.setState({...{open:true, selectedId:event.id}});
    };

    slotClickedFunc = (schedulerData, slot) => {
        //alert(`You just clicked a ${schedulerData.isEventPerspective ? 'task':'resource'}.{id: ${slot.slotId}, name: ${slot.slotName}}`);
        this.setState(this.setState({...{redirect:'/resource/'+slot.slotId}}));

    }

    eventDelete = (schedulerData, event) => {
        //alert(`You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`);
        if(window.confirm(`Do you want to delete the event? {eventId: ${event.id}, eventTitle: ${event.title}`)) {
            let _this = this
            axios.delete(API_ROOT_URL + 'event/'+ event.id).then(function (response) {
                if (response.data == 'ok') {
                    axios(API_ROOT_URL + 'events').then(function (response) {
                        schedulerData.setEvents(response.data.events);
                        _this.setState({
                        viewModel: schedulerData
                        })
                    });       
                }                
            });
        }
    };

    eventEdit = (schedulerData, event) => {
        this.setState({...{open:true, selectedId:event.id}});
    };

    newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
        if(window.confirm(`Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`)){
            let title = window.prompt('Title:');
            let _this = this
  
            let newEvent = {
                title: title,
                start: start,
                end: end,
                resourceId: slotId,
                bgColor: 'purple'
            }
  
            axios.post(API_ROOT_URL + 'event', newEvent).then(function (response) {
                if (response.data != 'ERROR!') {
                    newEvent.id =response.data 
                    schedulerData.addEvent(newEvent);
                    _this.setState({
                        viewModel: schedulerData
                    })
                }                
            });
        }
    }

    updateEventStart = (schedulerData, event, newStart) => {
        if(window.confirm(`Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`)) {
            let _this = this
            let updatedEvent = JSON.parse(JSON.stringify(event));
            updatedEvent.start = newStart;
            axios.put(API_ROOT_URL + 'event', updatedEvent).then(function (response) {
                if (response.data == 'ok') {
                    schedulerData.updateEventStart(event, newStart);
                    _this.setState({
                        viewModel: schedulerData
                    })
                }                
            });   
        }
    }

    updateEventEnd = (schedulerData, event, newEnd) => {
        if(window.confirm(`Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`)) {
            let _this = this
            let updatedEvent = JSON.parse(JSON.stringify(event));
            updatedEvent.end = newEnd;
            axios.put(API_ROOT_URL + 'event', updatedEvent).then(function (response) {
                if (response.data == 'ok') {
                    schedulerData.updateEventEnd(event, newEnd);
                    _this.setState({
                        viewModel: schedulerData
                    })
                }
            });
        }
    }

    moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
        if(window.confirm(`Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`)) {

            let _this = this
            let updatedEvent = JSON.parse(JSON.stringify(event));
            updatedEvent.start = start;
            updatedEvent.end = end;
            updatedEvent.resourceId = slotId;
            axios.put(API_ROOT_URL + 'event', updatedEvent).then(function (response) {
                if (response.data == 'ok') {
                    schedulerData.moveEvent(event, slotId, slotName, start, end);
                    _this.setState({
                        viewModel: schedulerData
                    })
                }
            });
        }
    }

    eventItemTemplateResolver = (schedulerData, event, bgColor, isStart, isEnd, mustAddCssClass, mustBeHeight, agendaMaxEventWidth) => {
        let borderWidth = isStart ? '4' : '0';
        let borderColor =  'rgba(0,139,236,1)', backgroundColor = '#80C5F6';
        let titleText = schedulerData.behaviors.getEventTextFunc(schedulerData, event);
        const inFuture = moment(event.start).isAfter()

        borderColor = inFuture ? 'rgba(0,139,236,1)' : '#999';
        backgroundColor = inFuture ? '#80C5F6' : '#D9D9D9';

        let divStyle = {borderLeft: borderWidth + 'px solid ' + borderColor, backgroundColor: backgroundColor, height: mustBeHeight };
        if(!!agendaMaxEventWidth)
            divStyle = {...divStyle, maxWidth: agendaMaxEventWidth};

        return <Paper elevation={1} key={event.id} className={mustAddCssClass} style={divStyle}>
            <span style={{marginLeft: '4px', lineHeight: `${mustBeHeight}px`, flex:1, display:'inline-block'}}>{titleText}</span>
        </Paper>;
    }


    onScrollRight = (schedulerData, schedulerContent, maxScrollLeft) => {
        if(schedulerData.ViewTypes === ViewTypes.Day) {
            schedulerData.next();
            schedulerData.setEvents(DemoData.events);
            this.setState({
                viewModel: schedulerData
            });
    
            schedulerContent.scrollLeft = maxScrollLeft - 10;
        }
    }

    onScrollLeft = (schedulerData, schedulerContent, maxScrollLeft) => {
        if(schedulerData.ViewTypes === ViewTypes.Day) {
            schedulerData.prev();
            schedulerData.setEvents(DemoData.events);
            this.setState({
                viewModel: schedulerData
            });

            schedulerContent.scrollLeft = 10;
        }
    }

    onScrollTop = (schedulerData, schedulerContent, maxScrollTop) => {
        console.log('onScrollTop');
    }

    onScrollBottom = (schedulerData, schedulerContent, maxScrollTop) => {
        console.log('onScrollBottom');
    }

    toggleExpandFunc = (schedulerData, slotId) => {
        schedulerData.toggleExpandStatus(slotId);
        this.setState({
            viewModel: schedulerData
        });
    }
}

export default withDragDropContext(Basic)
