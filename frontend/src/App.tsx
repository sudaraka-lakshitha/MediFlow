// THE LIST OF PAGES (routes)
// Each page is loaded only when it is first opened, to keep the website fast. Further down, each
// address is
// linked to its page and to the roles allowed to open it. To find the file for a screen, find its
// address here.

import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Loading } from "./components/Ui";
import { FormAccessibilityBridge } from "./components/FormAccessibilityBridge";
import { NotFoundPage } from "./pages/NotFoundPage";

const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((module) => ({
    default: module.LoginPage,
  })),
);
const RegisterPage = lazy(() =>
  import("./pages/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  })),
);
const ForgotPasswordPage = lazy(() =>
  import("./pages/ForgotPasswordPage").then((module) => ({
    default: module.ForgotPasswordPage,
  })),
);
const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  })),
);
const CatalogPage = lazy(() =>
  import("./pages/CatalogPage").then((module) => ({
    default: module.CatalogPage,
  })),
);
const InventoryPage = lazy(() =>
  import("./pages/InventoryPage").then((module) => ({
    default: module.InventoryPage,
  })),
);
const StockMovementsPage = lazy(() =>
  import("./pages/StockMovementsPage").then((module) => ({
    default: module.StockMovementsPage,
  })),
);
const PatientHealthRecordPage = lazy(() =>
  import("./pages/PatientHealthRecordPage").then((module) => ({
    default: module.PatientHealthRecordPage,
  })),
);
const PrescriptionsPage = lazy(() =>
  import("./pages/PrescriptionsPage").then((module) => ({
    default: module.PrescriptionsPage,
  })),
);
const SalesPage = lazy(() =>
  import("./pages/SalesPage").then((module) => ({
    default: module.SalesPage,
  })),
);
const DeliveriesPage = lazy(() => import('./pages/DeliveriesPage').then(module => ({ default: module.DeliveriesPage })));
const ReportsPage = lazy(() =>
  import("./pages/ReportsPage").then((module) => ({
    default: module.ReportsPage,
  })),
);
const UsersPage = lazy(() =>
  import("./pages/UsersPage").then((module) => ({
    default: module.UsersPage,
  })),
);
const AuditPage = lazy(() =>
  import("./pages/AuditPage").then((module) => ({
    default: module.AuditPage,
  })),
);
const PatientsPage = lazy(() =>
  import("./pages/PatientsPage").then((module) => ({
    default: module.PatientsPage,
  })),
);
const DiscountsPage = lazy(() =>
  import("./pages/DiscountsPage").then((module) => ({
    default: module.DiscountsPage,
  })),
);
const DrugResearchPage = lazy(() =>
  import("./pages/DrugResearchPage").then((module) => ({
    default: module.DrugResearchPage,
  })),
);
const PrescriptionUploadsPage = lazy(() =>
  import("./pages/PrescriptionUploadsPage").then((module) => ({
    default: module.PrescriptionUploadsPage,
  })),
);
const DataExportsPage = lazy(() =>
  import("./pages/DataExportsPage").then((module) => ({
    default: module.DataExportsPage,
  })),
);
const CashierPage = lazy(() =>
  import("./pages/CashierPage").then((module) => ({
    default: module.CashierPage,
  })),
);
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage").then((module) => ({
    default: module.SettingsPage,
  })),
);
const PatientProfilePage = lazy(() =>
  import("./pages/PatientProfilePage").then((module) => ({
    default: module.PatientProfilePage,
  })),
);

// Links every address to its page and to the roles allowed to open it.
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <FormAccessibilityBridge />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<DashboardPage />} />
              </Route>
            </Route>
            <Route
              element={
                <ProtectedRoute roles={["ADMIN", "PHARMACIST", "PATIENT", "CASHIER"]} />
              }
            >
              <Route element={<Layout />}>
                <Route path="prescriptions" element={<PrescriptionsPage />} />
                <Route
                  path="prescription-uploads"
                  element={<PrescriptionUploadsPage />}
                />
                <Route path="sales" element={<SalesPage />} />
                <Route path="deliveries" element={<DeliveriesPage />} />
              </Route>
            </Route>

            <Route
              element={
                <ProtectedRoute roles={["PATIENT"]} />
              }
            >
              <Route element={<Layout />}>
                <Route path="profile" element={<PatientProfilePage />} />
                <Route
                  path="health-record"
                  element={<PatientHealthRecordPage />}
                />
              </Route>
            </Route>
            <Route
              element={
                <ProtectedRoute
                  roles={["ADMIN", "PHARMACIST", "CASHIER"]}
                  requireCashierAccess
                />
              }
            >
              <Route element={<Layout />}>
                <Route path="cashier" element={<CashierPage />} />
              </Route>
            </Route>
            <Route
              element={<ProtectedRoute roles={["ADMIN", "PHARMACIST"]} />}
            >
              <Route element={<Layout />}>
                <Route path="patients" element={<PatientsPage />} />
                <Route path="catalog" element={<CatalogPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route
                  path="inventory/movements"
                  element={<StockMovementsPage />}
                />
                <Route path="drug-research" element={<DrugResearchPage />} />
                <Route path="reports" element={<ReportsPage />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
              <Route element={<Layout />}>
                <Route path="users" element={<UsersPage />} />
                <Route path="discounts" element={<DiscountsPage />} />
                <Route path="data-exports" element={<DataExportsPage />} />
                <Route path="audit" element={<AuditPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
