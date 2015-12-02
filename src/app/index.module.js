/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { GithubContributorService } from '../app/components/githubContributor/githubContributor.service';
import { VerificationSummaryService } from '../app/components/verificationSummary/verificationSummary.service';
import { VerificationService } from '../app/components/verification/verification.service';
import { WebDevTecService } from '../app/components/webDevTec/webDevTec.service';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';
import { MalarkeyDirective } from '../app/components/malarkey/malarkey.directive';
import { SummaryTableDirective } from '../app/components/summaryTable/summaryTable.directive';
import { ChartDirective } from '../app/components/chart/chart.directive';
import { ChartTabDirective } from '../app/components/chartTab/chartTab.directive';
import { ChartContainerDirective } from '../app/components/chartContainer/chartContainer.directive';
import { DetailTableDirective } from '../app/components/detailTable/detailTable.directive';
import { DetailDirective } from '../app/components/detail/detail.directive';
import { FioJSONService } from '../app/components/chartContainer/services/fioJSON.service';
import { NetperfJSONService } from '../app/components/chartContainer/services/netperf/netperfJSON.service';
import { NetperfEachJSONService } from '../app/components/chartContainer/services/netperf/netperfEachJSON.service';
import { NetperfTimeJSONService } from '../app/components/chartContainer/services/netperf/netperfTimeJSON.service';
import { KernbenchJSONService } from '../app/components/chartContainer/services/kernbenchJSON.service';
import { LmbenchJSONService } from '../app/components/chartContainer/services/lmbench/lmbenchJSON.service';
import { LmbenchLineJSONService } from '../app/components/chartContainer/services/lmbench/lmbenchLineJSON.service';
import { KernbenchTableJSONService } from '../app/components/detail/services/kernbenchTableJSON.service';
import { FioTableJSONService } from '../app/components/detail/services/fioTableJSON.service';
import { LmbenchTableJSONService } from '../app/components/detail/services/LmbenchTableJSON.service';
import { ChartLoaderService } from '../app/components/chartLoader/chartLoader.service';

angular.module('verificationSummary', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'toastr', 'angular-inview', 'ng-fusioncharts'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('githubContributor', GithubContributorService)
  .service('verificationSummary', VerificationSummaryService)
  .service('verification', VerificationService)
  .service('webDevTec', WebDevTecService)
  .service('fioJSON', FioJSONService)
  .service('kernbenchJSON', KernbenchJSONService)
  .service('lmbenchJSON', LmbenchJSONService)
  .service('lmbenchLineJSON', LmbenchLineJSONService)
  .service('kernbenchTableJSON', KernbenchTableJSONService)
  .service('fioTableJSON', FioTableJSONService)
  .service('lmbenchTableJSON', LmbenchTableJSONService)
  .service('netperfJSON', NetperfJSONService)
  .service('netperfEachJSON', NetperfEachJSONService)
  .service('netperfTimeJSON', NetperfTimeJSONService)
  .service('chartLoader', ChartLoaderService)
  .controller('MainController', MainController)
  .directive('acmeNavbar', NavbarDirective)
  .directive('acmeMalarkey', MalarkeyDirective)
  .directive('summaryTable', SummaryTableDirective)
  .directive('chartTab', ChartTabDirective)
  .directive('chart', ChartDirective)
  .directive('chartContainer', ChartContainerDirective)
  .directive('detailTable', DetailTableDirective)
  .directive('detail', DetailDirective);
