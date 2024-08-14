import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEstateComponent } from './add-estate/add-estate.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CostInfoComponent } from './cost-info/cost-info.component';
import { EstateDetailComponent } from './estate-detail/estate-detail.component';
import { EstateListComponent } from './estate-list/estate-list.component';
import { EstateComponent } from './estate-list-CompanyAdmin/estate.component';
import { FieldDetailComponent } from './field-detail/field-detail.component';
import { FieldInfoComponent } from './field-info/field-info.component';
import { HomeComponent } from './home/home.component';
import { LaborInfoComponent } from './labor-info/labor-info.component';
import { LoginComponent } from './login/login.component';
import { CloneComponent } from './utility/clone/clone.component';
import { CostCategoryComponent } from './utility/cost-category/cost-category.component';
import { CostItemComponent } from './utility/cost-item/cost-item.component';
import { CountryComponent } from './utility/country/country.component';
import { CropCategoryComponent } from './utility/field-status/crop-category.component';
import { EstablishmentComponent } from './utility/establishment/establishment.component';
import { FinancialYearComponent } from './utility/financial-year/financial-year.component';
import { MembershipComponent } from './utility/membership/membership.component';
import { StateComponent } from './utility/state/state.component';
import { TownComponent } from './utility/town/town.component';
import { UtilityComponent } from './utility/utility.component';
import { HomeLayoutComponent } from './_layout/home-layout/home-layout.component';
import { LoginLayoutComponent } from './_layout/login-layout/login-layout.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_interceptor/auth.guard.interceptor';
import { RubberSalesComponent } from './rubber-sale/rubber-sales.component';
import { AddRubberSaleComponent } from './add-rubber-sale/add-rubber-sale.component';
import { ReportComponent } from './report/report.component';
import { UtilityClerkComponent } from './utility-clerk/utility-clerk.component';
import { RegisterBuyerComponent } from './utility-clerk/register-buyer/register-buyer.component';
import { AddRubberPurchaseComponent } from './add-rubber-purchase/add-rubber-purchase.component';
import { RubberPurchaseComponent } from './rubber-purchase/rubber-purchase.component';
import { LaborInformationComponent } from './utility/local-labor-type/local-labor-type.component';
import { YieldProductionYearlyReportComponent } from './report/yield-production-yearly-report/yield-production-yearly-report.component';
import { CostTypeComponent } from './utility/cost-type/cost-type.component';
import { RegisterSellerComponent } from './utility-clerk/register-seller/register-seller.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { NotificationComponent } from './notification/notification.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AnnouncementComponent } from './utility/announcement/announcement.component';
import { FieldInfoYearlyComponent } from './field-info-yearly/field-info-yearly.component';
import { OwnershipComponent } from './utility/ownership/ownership.component';
import { TappingSystemComponent } from './utility/tapping-system/tapping-system.component';
import { FieldDiseaseComponent } from './utility/field-disease/field-disease.component';
import { UtilityManageUserComponent } from './utility-manage-user/utility-manage-user.component';
import { PlantingMaterialComponent } from './utility/planting-material/planting-material.component';
import { FieldInfectedComponent } from './field-infected/field-infected.component';
import { FieldInfectedStatusComponent } from './field-infected-status/field-infected-status.component';
import { GenerateForm1Component } from './generate-form1/generate-form1.component';
import { MonthlyFormComponent } from './monthly-form/monthly-form.component';
import { RubberStockComponent } from './rubber-stock/rubber-stock.component';
import { AddRubberStockComponent } from './add-rubber-stock/add-rubber-stock.component';
import { EstateByStateComponent } from './report-by-state/estate-by-state/estate-by-state.component';
import { RubberCropsByStateComponent } from './report-by-state/estate-by-state-maturity/rubber-crops-by-state.component';
import { ReportByStateComponent } from './report-by-state/report-by-state.component';
import { ReportProductionByYearComponent } from './report-production-by-year/report-production-by-year.component';
import { RubberProductionYearlyComponent } from './report-production-by-year/rubber-production-yearly/rubber-production-yearly.component';
import { CloneProductionYearlyComponent } from './report-production-by-year/clone-production-yearly/clone-production-yearly.component';
import { ReportFieldInformationComponent } from './report-field-information/report-field-information.component';
import { ReportProductivityByYearComponent } from './report-productivity-by-year/report-productivity-by-year.component';
import { CloneProductivityYearlyComponent } from './report-productivity-by-year/clone-productivity-yearly/clone-productivity-yearly.component';
import { ReportLaborInformationComponent } from './report-labor-information/report-labor-information.component';
import { OtherCropComponent } from './utility/other-crop/other-crop.component';
import { LaborInformationYearlyComponent } from './report-labor-information/labor-information-yearly/labor-information-yearly.component';
import { WorkerShortageEstateComponent } from './report-labor-information/worker-shortage-estate/worker-shortage-estate.component';
import { ReportCostInformationComponent } from './report-cost-information/report-cost-information.component';
import { MsalGuard } from '@azure/msal-angular';
import { ReportRubberAreaByCloneComponent } from './report-rubber-area-by-clone/report-rubber-area-by-clone.component';
import { AddFieldComponent } from './add-field/add-field.component';
import { ReportRubberSaleComponent } from './report-rubber-sale/report-rubber-sale.component';
import { StateDetailComponent } from './report-by-state/state-detail/state-detail.component';
import { EstateByCloneComponent } from './report-rubber-area-by-clone/estate-by-clone/estate-by-clone.component';
import { AreaByCloneComponent } from './report-rubber-area-by-clone/area-by-clone/area-by-clone.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'generate-form-1/:id', component: GenerateForm1Component },
  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
    ],
  },
  {
    path: 'register',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: RegisterComponent }
    ]
  },
  {
    path: 'verifyemail',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: VerifyEmailComponent },
    ],
  },
  {
    path: 'forgotpassword',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: ForgotPasswordComponent },
    ],
  },
  {
    path: '',
    component: HomeLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'company-list', component: CompanyListComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management'] } },
      { path: 'company-profile/:id', component: CompanyDetailComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'CompanyAdmin'] } },
      { path: 'estate/:id', component: EstateComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'CompanyAdmin', 'EstateClerk'] } },
      { path: 'add-estate', component: AddEstateComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'CompanyAdmin', 'EstateClerk'] } },
      { path: 'add-estate/:id', component: AddEstateComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'CompanyAdmin'] } },
      { path: 'estate-list', component: EstateListComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management'] } },
      { path: 'estate-detail/:id', component: EstateDetailComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'CompanyAdmin', 'EstateClerk'] } },
      { path: 'field-info/:id', component: FieldInfoComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'CompanyAdmin', 'EstateClerk'] } },
      { path: 'add-field/:id', component: AddFieldComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'CompanyAdmin', 'EstateClerk'] } },
      { path: 'field-disease/:id', component: FieldInfectedComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'CompanyAdmin', 'EstateClerk'] } },
      { path: 'field-detail/:id', component: FieldDetailComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'CompanyAdmin', 'EstateClerk'] } },
      { path: 'field-production/:id', component: MonthlyFormComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk'] } },
      { path: 'rubber-stock/:id', component: RubberStockComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk'] } },
      { path: 'add-rubber-stock', component: AddRubberStockComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk'] } },
      { path: 'labor-info/:id', component: LaborInfoComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk'] } },
      { path: 'cost-info/:id', component: CostInfoComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk'] } },
      { path: 'rubber-sale/:id', component: RubberSalesComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk'] } },
      { path: 'add-rubber-sale/:id', component: AddRubberSaleComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk'] } },
      { path: 'rubber-purchase/:id', component: RubberPurchaseComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk'] } },
      { path: 'add-rubber-purchase/:id', component: AddRubberPurchaseComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk'] } },
      { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard], data: { permittedRoles: ['EstateClerk'] } },
      { path: 'field-info-yearly/:id', component: FieldInfoYearlyComponent, canActivate: [AuthGuard], data: { permittedRoles: ['EstateClerk'] } },
      { path: 'field-infected-status/:id', component: FieldInfectedStatusComponent, canActivate: [AuthGuard], data: { permittedRoles: ['EstateClerk'] } },

      {
        path: 'utilities-admin',
        component: UtilityComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management'] },
        children: [
          { path: 'planting-material', component: PlantingMaterialComponent },
          { path: 'other-crop', component: OtherCropComponent },
          { path: 'state', component: StateComponent },
          { path: 'financialYear', component: FinancialYearComponent },
          { path: 'membershipType', component: MembershipComponent },
          { path: 'establishment', component: EstablishmentComponent },
          { path: 'town', component: TownComponent },
          { path: 'crop-category', component: CropCategoryComponent },
          { path: 'clone', component: CloneComponent },
          { path: 'country', component: CountryComponent },
          { path: 'cost-category', component: CostCategoryComponent },
          { path: 'cost-type', component: CostTypeComponent },
          { path: 'cost-item', component: CostItemComponent },
          { path: 'labor-type', component: LaborInformationComponent },
          { path: 'announcement', component: AnnouncementComponent },
          { path: 'ownership', component: OwnershipComponent },
          { path: 'tapping-system', component: TappingSystemComponent },
          { path: 'field-disease', component: FieldDiseaseComponent },

        ],
      },
      { path: 'utility-manage-user', component: UtilityManageUserComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management'] } },
      {
        path: 'utilities-clerk',
        component: UtilityClerkComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk'] },
        children: [
          { path: 'register-buyer', component: RegisterBuyerComponent },
          { path: 'register-seller', component: RegisterSellerComponent },

        ],
      },
      {
        path: 'report-by-state',
        component: ReportByStateComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk', 'CompanyAdmin'] },
        children: [
          { path: 'estate-by-state', component: EstateByStateComponent },
          { path: 'rubber-crops-by-state', component: RubberCropsByStateComponent },
          { path: 'state-detail/:id', component: StateDetailComponent }
        ],
      },
      {
        path: 'report-rubber-area-by-clone',
        component: ReportRubberAreaByCloneComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk', 'CompanyAdmin'] },
        children: [
          { path: 'area-by-clone', component: AreaByCloneComponent },
          { path: 'clone-detail', component: EstateByCloneComponent }
        ]
      },
      {
        path: 'report-production-by-year',
        component: ReportProductionByYearComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk', 'CompanyAdmin'] },
        children: [
          { path: 'rubber-production-yearly', component: RubberProductionYearlyComponent },
          { path: 'clone-production-yearly', component: CloneProductionYearlyComponent }
        ]
      },
      {
        path: 'report-productivity-by-year',
        component: ReportProductivityByYearComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk', 'CompanyAdmin'] },
        children: [
          { path: 'clone-productivity-yearly', component: CloneProductivityYearlyComponent }
        ]
      },
      {
        path: 'report-field-information',
        component: ReportFieldInformationComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk', 'CompanyAdmin'] },
      },
      {
        path: 'report-labor-information',
        component: ReportLaborInformationComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk', 'CompanyAdmin'] },
        children: [
          { path: 'labor-information-yearly', component: LaborInformationYearlyComponent },
          { path: 'worker-shortage-estate', component: WorkerShortageEstateComponent }
        ]
      },
      {
        path: 'report-cost-information',
        component: ReportCostInformationComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk', 'CompanyAdmin'] },
      },
      {
        path: 'report-rubber-sale',
        component: ReportRubberSaleComponent, canActivate: [AuthGuard], data: { permittedRoles: ['Admin', 'Management', 'EstateClerk', 'CompanyAdmin'] },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
