(function() {

'use strict';
angular.module('beacon', ['ngMaterial'])
    .controller('BasicDemoCtrl', BasicDemoCtrl)
    .controller('PanelDialogCtrl', PanelDialogCtrl);

    function BasicDemoCtrl($mdPanel) {
      this._mdPanel = $mdPanel;
    }

    BasicDemoCtrl.prototype.showDialog = function() {
      var position = this._mdPanel.newPanelPosition()
          .absolute()
          .center();
      var config = {
        attachTo: angular.element(document.body),
        controller: PanelDialogCtrl,
        controllerAs: 'ctrl',
        disableParentScroll: false,
        templateUrl: 'templates/beacon.html',
        hasBackdrop: true,
        panelClass: 'demo-dialog-example',
        position: position,
        trapFocus: true,
        zIndex: 150,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: true
      };
      this._mdPanel.open(config);
    };

    function PanelDialogCtrl(mdPanelRef) {
      this._mdPanelRef = mdPanelRef;
    }
    PanelDialogCtrl.prototype.closeDialog = function() {
      var panelRef = this._mdPanelRef;
      panelRef && panelRef.close().then(function() {
        angular.element(document.querySelector('.demo-dialog-open-button')).focus();
        panelRef.destroy();
      });
    };
})();