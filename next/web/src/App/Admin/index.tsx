import { Navigate, Route, Routes } from 'react-router-dom';

import { useCategories } from '@/api/category';
import { Sidebar } from './Sidebar';
import Tickets from './Tickets';
import { ViewTickets, Views } from './Views';
import Settings from './Settings';
import Stats from './Stats';
import { NewTicket } from '../Tickets/New';
import { CategoryProvider } from '@/components/common';
import { RequirePermission } from '@/components/RequirePermission';
import {
  useCurrentUserIsAdmin,
  useCurrentUserIsCustomerService,
  useCurrentUserPermissions,
} from '@/leancloud';

const NavigateToAvailablePage = () => {
  const isCustomerService = useCurrentUserIsCustomerService();
  const isAdmin = useCurrentUserIsAdmin();
  const permissions = useCurrentUserPermissions();

  return (
    <Navigate
      to={
        isAdmin || !isCustomerService || permissions.ticketList
          ? 'tickets'
          : permissions.view
          ? 'views'
          : permissions.statistics
          ? 'stats'
          : ''
      }
      replace
    />
  );
};

export default function AdminPage() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return <>Loading...</>;
  }
  return (
    <CategoryProvider categories={categories}>
      <div className="h-full grid grid-cols-[64px_1fr] bg-[#ebeff3]">
        <Sidebar className="z-40" />
        <div className="flex grow flex-col overflow-hidden">
          <div className="grow overflow-hidden h-full">
            <Routes>
              <Route
                path="/tickets/new"
                element={
                  <div className="h-full overflow-auto bg-white px-8 py-2">
                    <NewTicket />
                  </div>
                }
              />
              <Route
                path="/tickets/*"
                element={
                  <RequirePermission permission="ticketList" limitCSOnly>
                    <Tickets />
                  </RequirePermission>
                }
              />
              <Route
                path="/views"
                element={
                  <RequirePermission permission="view">
                    <Views />
                  </RequirePermission>
                }
              >
                <Route index element={null} />
                <Route path=":id" element={<ViewTickets />} />
              </Route>
              <Route path="/settings/*" element={<Settings />} />
              <Route
                path="/stats/*"
                element={
                  <RequirePermission permission="statistics">
                    <Stats />
                  </RequirePermission>
                }
              />
              <Route path="*" element={<NavigateToAvailablePage />} />
            </Routes>
          </div>
        </div>
      </div>
    </CategoryProvider>
  );
}
