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
import { QRCodeModule } from 'angularx-qrcode';

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
import { LaborInformationComponent } from './utility/local-labor-type/local-labor-type.component';
import { LaborLocalDetailComponent } from './labor-info/labor-local-detail/labor-local-detail.component';
import { HomeAdminLGMComponent } from './home/home-admin-lgm/home-admin-lgm.component';
import { HomeCompanyAdminComponent } from './home/home-company-admin/home-company-admin.component';
import { HomeEstateClerkComponent } from './home/home-estate-clerk/home-estate-clerk.component';
import { AddCountryComponent } from './labor-info/labor-foreigner/add-country/add-country.component';
import { YieldProductionYearlyReportComponent } from './report/yield-production-yearly-report/yield-production-yearly-report.component';
import { CostTypeComponent } from './utility/cost-type/cost-type.component';
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
import { WorkerShortageComponent } from './monthly-form/worker-shortage/worker-shortage.component';
import { WorkerShortageDetailComponent } from './monthly-form/worker-shortage-detail/worker-shortage-detail.component';
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
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { register } from 'swiper/element/bundle';
import { PlantingMaterialComponent } from './utility/planting-material/planting-material.component';
import { FieldInfectedComponent } from './field-infected/field-infected.component';
import { FieldInfectedDetailComponent } from './field-infected-detail/field-infected-detail.component';
import { FieldInfectedStatusComponent } from './field-infected-status/field-infected-status.component';
import { GenerateForm1Component } from './generate-form1/generate-form1.component';
import { FieldProductionMonthlyComponent } from './monthly-form/field-production-monthly/field-production-monthly.component';
import { MonthlyFormComponent } from './monthly-form/monthly-form.component';
import { LaborInfoMonthlyComponent } from './monthly-form/labor-info-monthly/labor-info-monthly.component';
import { LaborInfoMonthlyDetailComponent } from './monthly-form/labor-info-monthly-detail/labor-info-monthly-detail.component';
import { RubberStockComponent } from './rubber-stock/rubber-stock.component';
import { AddRubberStockComponent } from './add-rubber-stock/add-rubber-stock.component';
import { RubberStockDetailComponent } from './rubber-stock-detail/rubber-stock-detail.component';
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
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { AuthInterceptor } from './_interceptor/token.interceptor';
import { ReportRubberAreaByCloneComponent } from './report-rubber-area-by-clone/report-rubber-area-by-clone.component';
import { UserListComponent } from './utility-manage-user/user-list/user-list.component';
import { UserListUpdateComponent } from './utility-manage-user/user-list-update/user-list-update.component';
import { AddFieldComponent } from './add-field/add-field.component';
import { CuplumpRubberStockComponent } from './rubber-stock/cuplump-rubber-stock/cuplump-rubber-stock.component';
import { LatexRubberStockComponent } from './rubber-stock/latex-rubber-stock/latex-rubber-stock.component';
import { ReportRubberSaleComponent } from './report-rubber-sale/report-rubber-sale.component';
import { StateDetailComponent } from './report-by-state/state-detail/state-detail.component';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 ||
             window.navigator.userAgent.indexOf('Trident/') > -1;

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
    LaborInformationComponent,
    LaborLocalDetailComponent,
    HomeAdminLGMComponent,
    HomeCompanyAdminComponent,
    HomeEstateClerkComponent,
    AddCountryComponent,
    YieldProductionYearlyReportComponent,
    CostTypeComponent,
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
    ContactDetailComponent,
    PlantingMaterialComponent,
    FieldInfectedComponent,
    FieldInfectedDetailComponent,
    FieldInfectedStatusComponent,
    GenerateForm1Component,
    FieldProductionMonthlyComponent,
    MonthlyFormComponent,
    LaborInfoMonthlyComponent,
    LaborInfoMonthlyDetailComponent,
    RubberStockComponent,
    AddRubberStockComponent,
    RubberStockDetailComponent,
    EstateByStateComponent,
    RubberCropsByStateComponent,
    ReportByStateComponent,
    ReportProductionByYearComponent,
    RubberProductionYearlyComponent,
    CloneProductionYearlyComponent,
    ReportFieldInformationComponent,
    ReportProductivityByYearComponent,
    CloneProductivityYearlyComponent,
    ReportLaborInformationComponent,
    OtherCropComponent,
    LaborInformationYearlyComponent,
    WorkerShortageEstateComponent,
    ReportCostInformationComponent,
    ReportRubberAreaByCloneComponent,
    UserListComponent,
    UserListUpdateComponent,
    AddFieldComponent,
    CuplumpRubberStockComponent,
    LatexRubberStockComponent,
    ReportRubberSaleComponent,
    StateDetailComponent,
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
    MatSelectModule,
    QRCodeModule,
    MsalModule.forRoot(
      new PublicClientApplication({

        //Production
        auth: {
          clientId: "4c278748-3ef9-49f9-94ec-9591a665a4b7", // Application (client) ID from the app registration
          authority:
            "https://login.microsoftonline.com/22f0712b-5def-4d21-a16e-30e5e334541e", // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
          redirectUri: "https://www5.lgm.gov.my/e-Estate", // This is your redirect URI
          //redirectUri: "http://localhost:4300", // This is your redirect URI

        },
        cache: {
          cacheLocation: BrowserCacheLocation.LocalStorage,
	        //Can be set true or false
          storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
        },

        //Staging
        // auth: {
        //   clientId: "91409c1e-06ba-4c11-89b6-6002d296a769", // Application (client) ID from the app registration
        //   authority:
        //     "https://login.microsoftonline.com/22f0712b-5def-4d21-a16e-30e5e334541e", // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
        //   redirectUri: "https://lgm20.lgm.gov.my/e-Estate", // This is your redirect URI

        // },
        // cache: {
        //   cacheLocation: BrowserCacheLocation.LocalStorage,
	      //   //Can be set true or false
        //   storeAuthStateInCookie: true, // Set to true for Internet Explorer 11
        // },

      }),
      {
        interactionType: InteractionType.Redirect, // MSAL Guard Configuration
        authRequest: {
          scopes: ["api://e-EstateAPI/.default"],
          // scopes: ["https://lgmb2cgovmy.onmicrosoft.com/e-EstateB2CApi/Guest.Read"]

        },
      },
      {
        interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
        protectedResourceMap: new Map([
          ["https://graph.microsoft.com/User.Read", ["User.Read"]],
        ]),
      }
    ),
  ],
  providers: [
    DatePipe,
    MatDialog,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: UserActivityLogInterceptor,
    //   multi: true
    // },
    {
      provide:HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi:true
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HistoryLogInterceptor,
    //   multi: true
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass : UpperCaseInterceptor,
      multi:true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    MsalGuard,
    AuthGuard,
    SharedService,
    NotificationComponent
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
