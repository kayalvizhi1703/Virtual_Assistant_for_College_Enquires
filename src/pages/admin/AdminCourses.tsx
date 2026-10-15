import AdminCrud from './AdminCrud';
import { useData } from '@/context/DataContext';

export default function AdminCourses() {
  const { departments } = useData();

  return (
    <AdminCrud config={{
      table: 'courses',
      title: 'Courses',
      displayField: 'name',
      subtitleField: 'level',
      fields: [
        { name: 'name', label: 'Course Name', type: 'text' },
        { name: 'code', label: 'Code', type: 'text' },
        { name: 'department_id', label: 'Department', type: 'select', options: departments.map(d => ({ value: d.id, label: d.name })) },
        { name: 'level', label: 'Level', type: 'select', options: [
          { value: 'UG', label: 'UG' },
          { value: 'PG', label: 'PG' },
        ]},
        { name: 'duration', label: 'Duration', type: 'text' },
        { name: 'eligibility', label: 'Eligibility', type: 'textarea' },
        { name: 'fee_annual', label: 'Annual Fee', type: 'number' },
        { name: 'fee_total', label: 'Total Fee', type: 'number' },
        { name: 'syllabus', label: 'Syllabus', type: 'textarea' },
        { name: 'careers', label: 'Careers', type: 'textarea' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'subjects', label: 'Subjects', type: 'textarea' },
        { name: 'intake', label: 'Intake (seats)', type: 'number' },
      ],
    }} />
  );
}
