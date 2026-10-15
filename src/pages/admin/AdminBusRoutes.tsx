import AdminCrud from './AdminCrud';

export default function AdminBusRoutes() {
  return (
    <AdminCrud config={{
      table: 'bus_routes',
      title: 'Bus Routes',
      displayField: 'area',
      subtitleField: 'route_number',
      fields: [
        { name: 'area', label: 'Area', type: 'text' },
        { name: 'route_number', label: 'Route Number', type: 'text' },
        { name: 'pickup_time', label: 'Pickup Time', type: 'text' },
        { name: 'drop_time', label: 'Drop Time', type: 'text' },
        { name: 'fee_annual', label: 'Annual Fee', type: 'number' },
        { name: 'stops', label: 'Stops', type: 'textarea' },
      ],
    }} />
  );
}
