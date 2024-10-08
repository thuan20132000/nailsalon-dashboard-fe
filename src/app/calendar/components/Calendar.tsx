'use client';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import timeGridPlugin from '@fullcalendar/timegrid'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import useAppointmentStore, { AppointmentStore } from "@/store/useAppointmentStore";
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import AddAppointment from '@/app/appointments/components/AddAppointment';
import { Space } from 'antd';

const Calendar = () => {
  const { isShowAddAppointment, setShowAddAppointment, handleShowAddAppointment } = useAppointmentStore((state: AppointmentStore) => state);
  const events = [
    {
      title: 'Meeting',
      start: new Date(),
      end: new Date(),
    },
    {
      title: 'Meeting 2',
      start: new Date(),
      end: new Date(),
    },
    {
      title: 'Meeting 3',
      start: new Date(),
      end: new Date(),
    },
    {
      title: 'Meeting 4',
      start: new Date(),
      end: new Date(),
    }
  ]

  function renderEventContent(eventInfo: any) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i> {eventInfo.event.title}</i>
      </>
    )
  }

  const showAddAppointment = (date: any) => {
    setShowAddAppointment(true);
  }



  return (
    <div className="mx-auto max-w-7xl">
      <Space className='flex justify-end'  >
        <AddAppointment />
      </Space>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, resourceTimelinePlugin]}
        // initialView='dayGridMonth'
        weekends={true}
        events={events}
        eventContent={renderEventContent}
        // eventClick={(info) => alert('Event: ' + info.event.title)}
        // eventChange={(info) => alert('Event: ' + info.event.title)}
        editable={true}
        eventStartEditable={true}
        droppable={true}
        initialView="timeGridDay"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        // eventAdd={(info) => alert('Event: ' + info.event.title)}
        dateClick={(date) => handleShowAddAppointment(date.date)}

        // resourceAßreaWidth={'15%'}
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
      />

    </div>
  );
};

export default Calendar;
