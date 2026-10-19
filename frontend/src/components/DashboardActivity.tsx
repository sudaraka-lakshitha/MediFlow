import { Empty } from './Ui';

type Activity = {
  id: number;
  action: string;
  createdAt: string;
  success: boolean;
  user: { fullName: string } | null;
};

export function DashboardActivity({ items = [], pharmacyWide = false }: { items?: Activity[]; pharmacyWide?: boolean }) {
  return (
    <div className="panel h-100">
      <div className="panel-header">
        <div>
          <h3>{pharmacyWide ? 'Recent system actions' : 'My recent activity'}</h3>
          <small className="text-secondary">
            {pharmacyWide ? 'Recent successful staff and system actions' : 'Your recent successful actions'}
          </small>
        </div>
      </div>
      {items.map((item) => (
        <div className="dashboard-list-row compact" key={item.id}>
          <div>
            <strong>{item.action.replaceAll('_', ' ').toLowerCase()}</strong>
            <small>
              {pharmacyWide && `${item.user?.fullName || 'System'} — `}
              {new Date(item.createdAt).toLocaleString()}
            </small>
          </div>
          <i className="bi bi-check-circle text-success" />
        </div>
      ))}
      {!items.length && <Empty text={pharmacyWide ? 'No recent system actions.' : 'No recent activity to show.'} />}
    </div>
  );
}
