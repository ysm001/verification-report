/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { GithubContributorService } from '../app/components/githubContributor/githubContributor.service';
import { VerificationSummaryService } from '../app/components/verificationSummary/verificationSummary.service';
import { WebDevTecService } from '../app/components/webDevTec/webDevTec.service';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';
import { MalarkeyDirective } from '../app/components/malarkey/malarkey.directive';
import { SummaryTableDirective } from '../app/components/summaryTable/summaryTable.directive';
import { ChartTabDirective } from '../app/components/chartTab/chartTab.directive';
import { ChartDirective } from '../app/components/chart/chart.directive';
import { DetailTableDirective } from '../app/components/detailTable/detailTable.directive';
import { DetailDirective } from '../app/components/detail/detail.directive';
import { FioJSONService } from '../app/components/chart/services/fioJSON.service';
import { KernbenchJSONService } from '../app/components/chart/services/kernbenchJSON.service';
import { LmbenchJSONService } from '../app/components/chart/services/LmbenchJSON.service';
import { KernbenchTableJSONService } from '../app/components/detailTable/services/kernbenchTableJSON.service';

angular.module('verificationSummary', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'toastr', 'ng-fusioncharts'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('githubContributor', GithubContributorService)
  .service('verificationSummary', VerificationSummaryService)
  .service('webDevTec', WebDevTecService)
  .service('fioJSON', FioJSONService)
  .service('kernbenchJSON', KernbenchJSONService)
  .service('lmbenchJSON', LmbenchJSONService)
  .service('kernbenchTableJSON', KernbenchTableJSONService)
  .controller('MainController', MainController)
  .directive('acmeNavbar', NavbarDirective)
  .directive('acmeMalarkey', MalarkeyDirective)
  .directive('summaryTable', SummaryTableDirective)
  .directive('chartTab', ChartTabDirective)
  .directive('chart', ChartDirective)
  .directive('detailTable', DetailTableDirective)
  .directive('detail', DetailDirective);
