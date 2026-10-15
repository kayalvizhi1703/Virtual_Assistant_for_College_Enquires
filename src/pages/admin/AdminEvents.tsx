import AdminCrud from './AdminCrud';

export default function AdminEvents() {
  return (
    <AdminCrud config={{
      table: 'events',
      title: 'Events',
      displayField: 'title',
      subtitleField: 'event_date',
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'event_date', label: 'Event Date', type: 'date' },
        { name: 'event_time', label: 'Event Time', type: 'text' },
        { name: 'venue', label: 'Venue', type: 'text' },
        { name: 'category', label: 'Category', type: 'select', options: [
          { value: 'event', label: 'Event' },
          { value: 'exam', label: 'Exam' },
          { value: 'placement', label: 'Placement' },
          { value: 'academic', label: 'Academic' },
        ]},
      ],
    }} />
  );
}
