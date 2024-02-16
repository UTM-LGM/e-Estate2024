import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';


import { NgPipesModule } from 'ngx-pipes';
import { AppRoutingModule } from './app-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrModule } from 'ngx-toastr';
import { NgxPrintModule } from 'ngx-print';

import { AppComponent } from './app.component';
import { LoginLayoutComponent } from './_layout/login-layout/login-layout.component';
import { LoginComponent } from './login/login.component';
import { HomeLayoutComponent } from './_layout/home-layout/home-layout.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { HomeComponent } from './home/home.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { FormsModule } from '@angular/forms';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { EstateComponent } from './estate-list-CompanyAdmin/estate.component';
import { AddEstateComponent } from './add-estate/add-estate.component';
import { UtilityComponent } from './utility/utility.component';
import { StateComponent } from './utility/state/state.component';
import { FinancialYearComponent } from './utility/financial-year/financial-year.component';
import { MembershipComponent } from './utility/membership/membership.component';
import { EstablishmentComponent } from './utility/establishment/establishment.component';
import { TownComponent } from './utility/town/town.component';
import { EstateListComponent } from './estate-list/estate-list.component';
import { EstateDetailComponent } from './estate-detail/estate-detail.component';
import { FieldInfoComponent } from './field-info/field-info.component';
import { CropCategoryComponent } from './utility/field-status/crop-category.component';
import { CloneComponent } from './utility/clone/clone.component';
import { LaborInfoComponent } from './labor-info/labor-info.component';
import { FieldDetailComponent } from './field-detail/field-detail.component';
import { CountryComponent } from './utility/country/country.component';
import { CostCategoryComponent } from './utility/cost-category/cost-category.component';
import { CostItemComponent } from './utility/cost-item/cost-item.component';
import { CostInfoComponent } from './cost-info/cost-info.component';
import { DirectCostComponent } from './cost-info/direct-cost/direct-cost.component';
import { IndirectCostComponent } from './cost-info/indirect-cost/indirect-cost.component';
import { FieldProductionComponent } from './field-production/field-production.component';
import { FieldProductionDetailComponent } from './field-production-detail/field-production-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { UserActivityLogInterceptor } from './_interceptor/userActivityLog.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatureCostComponent } from './cost-info/direct-cost/mature-cost/mature-cost.component';
import { ImmatureCostComponent } from './cost-info/direct-cost/immature-cost/immature-cost.component';
import { RegisterComponent } from './register/register.component';
import { AddRoleComponent } from './register/add-role/add-role.component';
import { AuthGuard } from './_interceptor/auth.guard.interceptor';
import { RubberSalesComponent } from './rubber-sale/rubber-sales.component';
import { AddRubberSaleComponent } from './add-rubber-sale/add-rubber-sale.component';
import { RubberSaleDetailComponent } from './rubber-sale-detail/rubber-sale-detail.component';
import { ReportComponent } from './report/report.component';
import { UtilityClerkComponent } from './utility-clerk/utility-clerk.component';
import { RegisterBuyerComponent } from './utility-clerk/register-buyer/register-buyer.component';
import { SharedService } from './_services/shared.service';
import { RubberPurchaseComponent } from './rubber-purchase/rubber-purchase.component';
import { AddRubberPurchaseComponent } from './add-rubber-purchase/add-rubber-purchase.component';
import { RubberPurchaseDetailComponent } from './rubber-purchase-detail/rubber-purchase-detail.component';
import { EditEstateDetailComponent } from './edit-estate-detail/edit-estate-detail.component';
import { LaborForeignerComponent } from './labor-info/labor-foreigner/labor-foreigner.component';
import { LaborForeignerDetailComponent } from './labor-info/labor-foreigner-detail/labor-foreigner-detail.component';
import { LaborLocalComponent } from './labor-info/labor-local/labor-local.component';
import { LocalLaborTypeComponent } from './utility/local-labor-type/local-labor-type.component';
import { LaborLocalDetailComponent } from './labor-info/labor-local-detail/labor-local-detail.component';
import { HomeAdminLGMComponent } from './home/home-admin-lgm/home-admin-lgm.component';
import { HomeCompanyAdminComponent } from './home/home-company-admin/home-company-admin.component';
import { HomeEstateClerkComponent } from './home/home-estate-clerk/home-estate-clerk.component';
import { AddCountryComponent } from './labor-info/labor-foreigner/add-country/add-country.component';
import { YieldProductionYearlyReportComponent } from './report/yield-production-yearly-report/yield-production-yearly-report.component';
import { CostTypeComponent } from './utility/cost-type/cost-type.component';
import { CloneProductivityYearlyComponent } from './report/clone-productivity-yearly/clone-productivity-yearly.component';
import { RegisterSellerComponent } from './utility-clerk/register-seller/register-seller.component';
import { SortDirective } from './directive/directive';
import { EditCompanyDetailComponent } from './edit-company-detail/edit-company-detail.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { NotificationComponent } from './notification/notification.component';
import { ProductionComparisonComponent } from './production-comparison/production-comparison.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AnnouncementComponent } from './utility/announcement/announcement.component';
import { AnnoucementComponent } from './annoucement/annoucement.component';
import { HistoryLogInterceptor } from './_interceptor/historyLog.interceptor';
import { FieldInfoYearlyComponent } from './field-info-yearly/field-info-yearly.component';
import { CompanyStatusComponent } from './report/company-status/company-status.component';
import { EstateStatusComponent } from './report/estate-status/estate-status.component';
import { WorkerShortageComponent } from './labor-info/worker-shortage/worker-shortage.component';
import { WorkerShortageDetailComponent } from './labor-info/worker-shortage-detail/worker-shortage-detail.component';
import { OwnershipComponent } from './utility/ownership/ownership.component';
import { TappingSystemComponent } from './utility/tapping-system/tapping-system.component';
import { MatSelectModule } from '@angular/material/select';
import { FieldDiseaseComponent } from './utility/field-disease/field-disease.component';
import { UpperCaseInterceptor } from './_interceptor/uppercase.interceptor';
import { UtilityManageUserComponent } from './utility-manage-user/utility-manage-user.component';
import { PendingRoleComponent } from './utility-manage-user/pending-role/pending-role.component';
import { PendingRoleDetailComponent } from './utility-manage-user/pending-role-detail/pending-role-detail.component';
import { ManageUserComponent } from './utility-manage-user/manage-user/manage-user.component';
import { AddUserComponent } from './utility-manage-user/add-user/add-user.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginLayoutComponent,
    LoginComponent,
    HomeLayoutComponent,
    SidenavComponent,
    SpinnerComponent,
    HomeComponent,
    CompanyListComponent,
    CompanyDetailComponent,
    EstateComponent,
    AddEstateComponent,
    UtilityComponent,
    StateComponent,
    FinancialYearComponent,
    MembershipComponent,
    EstablishmentComponent,
    TownComponent,
    EstateListComponent,
    EstateDetailComponent,
    FieldInfoComponent,
    CropCategoryComponent,
    CloneComponent,
    LaborInfoComponent,
    FieldDetailComponent,
    CountryComponent,
    CostCategoryComponent,
    CostItemComponent,
    CostInfoComponent,
    DirectCostComponent,
    IndirectCostComponent,
    FieldProductionComponent,
    FieldProductionDetailComponent,
    MatureCostComponent,
    ImmatureCostComponent,
    RegisterComponent,
    AddRoleComponent,
    RubberSalesComponent,
    AddRubberSaleComponent,
    RubberSaleDetailComponent,
    ReportComponent,
    UtilityClerkComponent,
    RegisterBuyerComponent,
    RubberPurchaseComponent,
    AddRubberPurchaseComponent,
    RubberPurchaseDetailComponent,
    EditEstateDetailComponent,
    LaborForeignerComponent,
    LaborForeignerDetailComponent,
    LaborLocalComponent,
    LocalLaborTypeComponent,
    LaborLocalDetailComponent,
    HomeAdminLGMComponent,
    HomeCompanyAdminComponent,
    HomeEstateClerkComponent,
    AddCountryComponent,
    YieldProductionYearlyReportComponent,
    CostTypeComponent,
    CloneProductivityYearlyComponent,
    RegisterSellerComponent,
    SortDirective,
    EditCompanyDetailComponent,
    VerifyEmailComponent,
    NotificationComponent,
    ProductionComparisonComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    AnnouncementComponent,
    AnnoucementComponent,
    FieldInfoYearlyComponent,
    CompanyStatusComponent,
    EstateStatusComponent,
    WorkerShortageComponent,
    WorkerShortageDetailComponent,
    OwnershipComponent,
    TappingSystemComponent,
    FieldDiseaseComponent,
    UtilityManageUserComponent,
    PendingRoleComponent,
    PendingRoleDetailComponent,
    ManageUserComponent,
    AddUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatDividerModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    FormsModule,
    MatTabsModule,
    MatDialogModule,
    NgxSkeletonLoaderModule,
    NgxPaginationModule,
    NgPipesModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    ToastrModule.forRoot(),
    NgxPrintModule,
    MatSelectModule
  ],
  providers: [
    DatePipe,
    MatDialog,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserActivityLogInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HistoryLogInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass : UpperCaseInterceptor,
      multi:true
    },
    AuthGuard,
    SharedService,
    NotificationComponent
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
