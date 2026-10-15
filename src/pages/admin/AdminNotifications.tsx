import AdminCrud from './AdminCrud';

export default function AdminNotifications() {
  return (
    <AdminCrud config={{
      table: 'notifications',
      title: 'Notifications',
      displayField: 'title',
      subtitleField: 'category',
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'body', label: 'Body', type: 'textarea' },
        { name: 'category', label: 'Category', type: 'select', options: [
          { value: 'admission', label: 'Admission' },
          { value: 'exam', label: 'Exam' },
          { value: 'event', label: 'Event' },
          { value: 'circular', label: 'Circular' },
          { value: 'placement', label: 'Placement' },
          { value: 'general', label: 'General' },
        ]},
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'priority', label: 'Priority', type: 'select', options: [
          { value: 'normal', label: 'Normal' },
          { value: 'high', label: 'High' },
        ]},
      ],
    }} />
  );
}
