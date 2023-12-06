import React, { Fragment, useState, useEffect } from "react";
import { datetime, RRule, RRuleSet, rrulestr } from 'rrule'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { MuiPickersUtilsProvider, KeyboardDatePicker, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from 'moment';
moment.locale('ro');

export default function RRuleCard(props) {
    const [until, setUntil] = React.useState(new Date());
    const [wday, setWday] = React.useState(0);
    const [orule, setOrule] = React.useState(null);
    

    const handleChange = (event) => {
      console.log(event)
      switch (event.target.name) {
        case 'until':
            setUntil(event.target.value);
          break;
        case 'wday':
            setWday(event.target.value);
          break;
        default:
          break;
      }
    };

    useEffect(() => {
        setOrule(new RRule({
          freq: RRule.WEEKLY,
          count: 30,
          wkst:wday,
          until: until?until:new Date(),
          interval: 1
        }));  
    },[wday,until])    

    const convertToDefEventPara = (name, value) => ({
      target: {
          name, value
      }
    })

    if (orule) {
      console.log(orule.toString(), orule.all());
    }

    return (
    <FormControl>
      <FormLabel id="wday-group">Weekday</FormLabel>
      <RadioGroup
        row
        aria-labelledby="wday-group"
        name="wday"
        value={wday}
        onChange={handleChange}
      >
        {moment.weekdaysMin(true).map((wday,idx) => {
            return (<FormControlLabel key={idx} value={idx} control={<Radio size="small"/>} label={wday} />)
        })}        
      </RadioGroup>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker inputVariant="standard"
                {...props}
                label="Until date"
                fullWidth
                format="yyyy/MMM/dd HH:mm"
                name="until"
                value={until}
                onChange={date =>handleChange(convertToDefEventPara('until',date))}

            />
        </MuiPickersUtilsProvider>
    </FormControl>
)

}