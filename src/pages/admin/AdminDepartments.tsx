import AdminCrud from './AdminCrud';
import { useData } from '@/context/DataContext';

export default function AdminDepartments() {
  const { departments } = useData();

  return (
    <AdminCrud config={{
      table: 'departments',
      title: 'Departments',
      displayField: 'name',
      subtitleField: 'stream',
      fields: [
        { name: 'name', label: 'Department Name', type: 'text' },
        { name: 'code', label: 'Code', type: 'text' },
        { name: 'stream', label: 'Stream', type: 'select', options: [
          { value: 'Arts', label: 'Arts' },
          { value: 'Science', label: 'Science' },
          { value: 'Commerce', label: 'Commerce' },
          { value: 'Management', label: 'Management' },
          { value: 'Computer Applications', label: 'Computer Applications' },
        ]},
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'hod_name', label: 'HOD Name', type: 'text' },
        { name: 'hod_qualification', label: 'HOD Qualification', type: 'text' },
        { name: 'established', label: 'Established Year', type: 'number' },
        { name: 'icon', label: 'Icon (lucide name)', type: 'text' },
        { name: 'display_order', label: 'Display Order', type: 'number' },
      ],
    }} />
  );
}
