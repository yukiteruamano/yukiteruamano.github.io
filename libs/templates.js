angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app.html',
    "<nav class=\"navbar navbar-inverse navbar-fixed-top\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"navbar-header\">\n" +
    "            <a href=\"#!/\" class=\"navbar-brand\">Simulador Blockchain</a>\n" +
    "        </div>\n" +
    "\n" +
    "        <div id=\"navbar\" class=\"collapse navbar-collapse\">\n" +
    "            <form class=\"navbar-form navbar-right\">\n" +
    "                <div class=\"form-group\" ng-if=\"$root.expertMode\">\n" +
    "                    <label class=\"navbar-text\" for=\"difficulty\">Dificultad de bloque:</label>\n" +
    "                    <select id=\"difficulty\"\n" +
    "                            ng-model=\"$root.difficulty\"\n" +
    "                            ng-options=\"(value + ' (' + $root.difficultyPrefix(value) + ')') for value in [2,4,6,8,10]\"\n" +
    "                            ng-change=\"$root.$broadcast('difficulty-change');\"\n" +
    "                            class=\"form-control\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <button type=\"button\"\n" +
    "                        class=\"btn btn-default\"\n" +
    "                        ng-if=\"!$root.expertMode\"\n" +
    "                        ng-click=\"$root.expertMode = true;\">\n" +
    "                    Activar Modo Experto\n" +
    "                </button>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "\n" +
    "<div ng-class=\"$root.$route.current.containerClass\" ng-view>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('components/block/block.html',
    "<div class=\"well well-sm\" ng-class=\"{'well-success': vm.valid, 'well-error': !vm.valid}\">\n" +
    "    <form class=\"form-horizontal\">\n" +
    "        <!-- Block number -->\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"block{{vm.id}}number\" class=\"col-sm-2 control-label\">Bloque:</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <div class=\"input-group\">\n" +
    "                    <span class=\"input-group-addon\">#</span>\n" +
    "                    <input id=\"block{{vm.id}}number\"\n" +
    "                           ng-model=\"vm.number\"\n" +
    "                           ng-change=\"vm.updateBlock()\"\n" +
    "                           class=\"form-control\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Nonce -->\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"block{{vm.id}}nonce\" class=\"col-sm-2 control-label\">Nonce:</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input id=\"block{{vm.id}}nonce\"\n" +
    "                       ng-model=\"vm.nonce\"\n" +
    "                       ng-change=\"vm.updateBlock()\"\n" +
    "                       class=\"form-control\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Coinbase -->\n" +
    "        <div class=\"form-group\" ng-if=\"vm.data.coinbase\">\n" +
    "            <label class=\"col-sm-2 control-label\"><a ng-click=\"vm.showData = !vm.showData\">Coinbase:</a></label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <div class=\"input-group\">\n" +
    "                    <div class=\"input-group-addon\">€</div>\n" +
    "                    <input ng-model=\"vm.data.coinbase.value\" class=\"form-control\">\n" +
    "                    <div class=\"input-group-addon\">-&gt;</div>\n" +
    "                    <input ng-model=\"vm.data.coinbase.to\" class=\"form-control\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Transactions -->\n" +
    "        <div class=\"form-group\" ng-if=\"vm.data.txs\">\n" +
    "            <label class=\"col-sm-2 control-label\"><a ng-click=\"vm.showData = !vm.showData\">Tx:</a></label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <div class=\"input-group\" ng-repeat=\"tx in vm.data.txs track by $index\">\n" +
    "                    <div class=\"input-group-addon\">€</div>\n" +
    "                    <input ng-model=\"tx.value\" class=\"form-control\">\n" +
    "                    <div class=\"input-group-addon\">From:</div>\n" +
    "                    <input ng-model=\"tx.from\" class=\"form-control\">\n" +
    "                    <div class=\"input-group-addon\">-&gt;</div>\n" +
    "                    <input ng-model=\"tx.to\" class=\"form-control\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Data -->\n" +
    "        <div class=\"form-group\" ng-if=\"vm.showData || (!vm.data.coinbase && !vm.data.txs)\">\n" +
    "            <label for=\"block{{vm.id}}data\" class=\"col-sm-2 control-label\">Data:</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <textarea id=\"block{{vm.id}}data\"\n" +
    "                          rows=\"10\"\n" +
    "                          ng-model=\"vm.dataString\"\n" +
    "                          ng-trim=\"false\"\n" +
    "                          ng-change=\"vm.updateBlock()\"\n" +
    "                          class=\"form-control\">\n" +
    "                </textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Prev -->\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"block{{vm.id}}prev\" class=\"col-sm-2 control-label\">Prev:</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input id=\"block{{vm.id}}prev\"\n" +
    "                       ng-model=\"vm.prev\"\n" +
    "                       ng-readonly=\"true\"\n" +
    "                       class=\"form-control\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Hash -->\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"block{{vm.id}}hash\" class=\"col-sm-2 control-label\">Hash:</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input id=\"block{{vm.id}}hash\"\n" +
    "                       ng-model=\"vm.hash\"\n" +
    "                       ng-readonly=\"true\"\n" +
    "                       class=\"form-control\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Button -->\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"col-sm-2\"><i class=\"icon-spinner icon-spin icon-large\"></i></div>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <button data-style=\"expand-right\" class=\"btn btn-primary ladda-button\" ng-click=\"vm.mine()\">\n" +
    "                    <span class=\"ladda-label\">Mine</span>\n" +
    "                </button>\n" +
    "                <span ng-if=\"vm.mined && $root.expertMode\">{{vm.miningStats}}</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n"
  );


  $templateCache.put('components/chain-info/chain-info.html',
    "(height: {{vm.blocks.length}} blocks, valid: {{vm.valid}})"
  );


  $templateCache.put('components/peer-info/peer-info.html',
    "(height: {{vm.blocks.length}} blocks, valid: {{vm.valid}}, consensus: {{vm.consensus}} other peers, last block hash: {{vm.lastBlockHash}})"
  );


  $templateCache.put('index.html',
    "<html>\n" +
    "<head>\n" +
    "  <meta charset=\"UTF-8\">\n" +
    "  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" +
    "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
    "\n" +
    "  <link rel=\"icon\" href=\"favicon.ico\">\n" +
    "\n" +
    "  <!-- fonts -->\n" +
    "  <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Raleway:300,400,700\">\n" +
    "  <link rel=\"stylesheet\" href=\"https://use.fontawesome.com/releases/v5.8.1/css/all.css\" integrity=\"sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf\" crossorigin=\"anonymous\">\n" +
    "\n" +
    "  <!-- bootstrap and theme -->\n" +
    "  <link rel=\"stylesheet\" href=\"libs/css/bootstrap.min.css\">\n" +
    "  <link rel=\"stylesheet\" href=\"libs/css/bootstrap-theme.min.css\">\n" +
    "  <link rel=\"stylesheet\" href=\"libs/css/bootstrap-horizon.css\">\n" +
    "  <link rel=\"stylesheet\" href=\"libs/css/ladda-themeless.min.css\">\n" +
    "  <link rel=\"stylesheet\" href=\"libs/css/ie10-viewport-bug-workaround.css\">\n" +
    "  <link rel=\"stylesheet\" href=\"app.css\">\n" +
    "\n" +
    "  <!-- Latest jQuery, Angular and Bootstrap -->\n" +
    "  <script src=\"libs/js/jquery.min.js\"></script>\n" +
    "  <script src=\"libs/js/angular.min.js\"></script>\n" +
    "  <script src=\"libs/js/angular-route.js\"></script>\n" +
    "\n" +
    "  <!-- other libraries -->\n" +
    "  <script src=\"libs/js/bootstrap.min.js\"></script>\n" +
    "  <script src=\"libs/js/spin.min.js\"></script>\n" +
    "  <script src=\"libs/js/ladda.min.js\"></script>\n" +
    "  <script src=\"libs/js/ie10-viewport-bug-workaround.js\"></script>\n" +
    "  <script src=\"libs/js/ie10-viewport-bug-workaround.js\"></script>\n" +
    "  <script src=\"libs/js/sha256.js\"></script>\n" +
    "\n" +
    "  <!-- lodash.js -->\n" +
    "  <script src=\"libs/js/lodash.js\"></script>\n" +
    "\n" +
    "  <!-- App -->\n" +
    "  <script src=\"app.js\"></script>\n" +
    "\n" +
    "  <!-- HTML templates -->\n" +
    "  <script>\n" +
    "    // don't load HTML templates from pre-compiled file in development mode\n" +
    "    if (location.hostname !== \"localhost\" && location.hostname !== \"127.0.0.1\") {\n" +
    "      document.write('<scr' + 'ipt src=\"libs/templates.js\"></sc' + 'ript>');\n" +
    "    }\n" +
    "  </script>\n" +
    "\n" +
    "  <!-- Components -->\n" +
    "  <script src=\"components/block/block.js\"></script>\n" +
    "  <script src=\"components/chain-info/chain-info.js\"></script>\n" +
    "  <script src=\"components/peer-info/peer-info.js\"></script>\n" +
    "\n" +
    "  <!-- Pages -->\n" +
    "  <script src=\"pages/intro/intro.js\"></script>\n" +
    "  <script src=\"pages/hash/hash.js\"></script>\n" +
    "  <script src=\"pages/block/block.js\"></script>\n" +
    "  <script src=\"pages/blockchain/blockchain.js\"></script>\n" +
    "  <script src=\"pages/distributed/distributed.js\"></script>\n" +
    "  <script src=\"pages/coinbase/coinbase.js\"></script>\n" +
    "  <script src=\"pages/tokens/tokens.js\"></script>\n" +
    "\n" +
    "  <title>Simulador de Blockchain</title>\n" +
    "</head>\n" +
    "<body>\n" +
    "<app></app>\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/expected/usemin.html',
    "<!DOCTYPE html>\n" +
    "    <head>\n" +
    "        <link rel=\"stylesheet\" href=\"styles/main.css\">\n" +
    "        <script src=\"scripts/vendor/modernizr.min.js\"></script>\n" +
    "    </head>\n" +
    "    <body>\n" +
    "\n" +
    "    <script src=\"usemin/foo.js\"></script>\n" +
    "\n" +
    "    <script src=\"usemin/bar.js\"></script>\n" +
    "\n" +
    "    <script src=\"usemin/all.js\"></script>\n" +
    "\n" +
    "    <script src=\"duplicate/usemin/all.js\"></script>\n" +
    "\n" +
    "    <link rel=\"stylesheet\" href=\"usemin/bar.css\">\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/expected/useminUgly.html',
    "<!DOCTYPE html>\n" +
    "    <head>\n" +
    "        <link rel=\"stylesheet\" href=\"styles/main.css\">\n" +
    "        <script src=\"scripts/vendor/modernizr.min.js\"></script>\n" +
    "    </head>\n" +
    "    <body>\n" +
    "\n" +
    "    <script src=\"useminUgly/foo.js\"></script>\n" +
    "\n" +
    "    <script src=\"useminUgly/bar.js\"></script>\n" +
    "\n" +
    "    <script src=\"useminUgly/all.js\"></script>\n" +
    "\n" +
    "    <script src=\"duplicate/useminUgly/all.js\"></script>\n" +
    "\n" +
    "    <link rel=\"stylesheet\" href=\"useminUgly/bar.css\">\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/empty.html',
    ""
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/html5.html',
    "<div>\n" +
    "    <span>\n" +
    "        Self-closing, sucka!\n" +
    "        <br>\n" +
    "        <img src='path/to/img'> Howdy\n" +
    "</div>\n" +
    "\n" +
    "<hr>\n" +
    "\n" +
    "<table>\n" +
    "    <tr>\n" +
    "        <td>\n" +
    "            Howdy\n"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/linebreak.html',
    "<textarea placeholder=\"This is a carriage return.\r" +
    "\n" +
    "Also also a newline.\"></textarea>"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/one.html',
    "<h1>One</h1>\n" +
    "\n" +
    "<p class=\"\">I am one.</p>\n" +
    "\n" +
    "<script type=\"text/javascript\">\n" +
    "  // Test\n" +
    "  /* comments */\n" +
    "  var foo = 'bar';\n" +
    "</script>\n"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/regexp.html',
    "<h1>Regexp</h1>\n" +
    "\n" +
    "<script type=\"text/javascript\">\n" +
    "  var reg = new RegExp(/^(((\\+[1-9][0-9])|(00[1-9][0-9]))[0-9]{7,11})|((((01|02|03|04|05|07|08)[0-9])|(06[1-9]))[0-9]{7})$/)\n" +
    "  var reg2 = new RegExp(/^\\+-\\\\--\\|)$/)\n" +
    "</script>\n"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/three/three_two.html',
    "<h2>Three Two</h2>\n" +
    "\n" +
    "<!-- Comment for three two -->\n" +
    "\n" +
    "<textarea readonly=\"readonly\">We are three two.</textarea>\n"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/three/three.html',
    "<h2>Three</h2>\n" +
    "\n" +
    "<!-- Comment for three -->\n" +
    "\n" +
    "<textarea readonly=\"readonly\">We are three.</textarea>\n"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/two/two.html',
    "<h2>Two</h2>\n" +
    "\n" +
    "<!-- Comment for two -->\n" +
    "\n" +
    "<textarea readonly=\"readonly\">We are two.</textarea>\n"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/undefined.html',
    "<h1>Undefined</h1>\n" +
    "\n" +
    "<p class=\"\">I am undefined.</p>\n" +
    "\n" +
    "<script type=\"text/javascript\">\n" +
    "  // Test\n" +
    "  /* comments */\n" +
    "  var foo = 'bar';\n" +
    "</script>\n"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/unmerged/level2/empty.html',
    ""
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/unmerged/level2/html5.html',
    "<div>\n" +
    "    <span>\n" +
    "        Self-closing, sucka!\n" +
    "        <br>\n" +
    "        <img src='path/to/img'> Howdy\n" +
    "</div>\n" +
    "\n" +
    "<hr>\n" +
    "\n" +
    "<table>\n" +
    "    <tr>\n" +
    "        <td>\n" +
    "            Howdy\n"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/unmerged/level2/level3/one.html',
    "<h1>One</h1>\n" +
    "\n" +
    "<p class=\"\">I am one.</p>\n" +
    "\n" +
    "<script type=\"text/javascript\">\n" +
    "  // Test\n" +
    "  /* comments */\n" +
    "  var foo = 'bar';\n" +
    "</script>\n"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/unmerged/undefined.html',
    "<h1>Undefined</h1>\n" +
    "\n" +
    "<p class=\"\">I am undefined.</p>\n" +
    "\n" +
    "<script type=\"text/javascript\">\n" +
    "  // Test\n" +
    "  /* comments */\n" +
    "  var foo = 'bar';\n" +
    "</script>\n"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/unmerged/usemin.html',
    "<!DOCTYPE html>\n" +
    "    <head>\n" +
    "        <link rel=\"stylesheet\" href=\"styles/main.css\">\n" +
    "        <script src=\"scripts/vendor/modernizr.min.js\"></script>\n" +
    "    </head>\n" +
    "    <body>\n" +
    "\n" +
    "    <!-- build:js usemin/foo.js -->\n" +
    "    <script src=\"usemin/foo.js\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "\n" +
    "    <!-- build:js usemin/bar.js -->\n" +
    "    <script src=\"usemin/bar.js\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "\n" +
    "    <!-- build:js usemin/all.js -->\n" +
    "    <script src=\"usemin/foo.js\"></script>\n" +
    "    <script src=\"usemin/bar.js\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "\n" +
    "    <!-- build:js duplicate/usemin/all.js -->\n" +
    "    <script src=\"usemin/foo.js\"></script>\n" +
    "    <script src=\"usemin/bar.js\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "\n" +
    "    <!-- build:css usemin/bar.css -->\n" +
    "    <script src=\"usemin/bar.css\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/usemin.html',
    "<!DOCTYPE html>\n" +
    "    <head>\n" +
    "        <link rel=\"stylesheet\" href=\"styles/main.css\">\n" +
    "        <script src=\"scripts/vendor/modernizr.min.js\"></script>\n" +
    "    </head>\n" +
    "    <body>\n" +
    "\n" +
    "    <!-- build:js usemin/foo.js -->\n" +
    "    <script src=\"usemin/foo.js\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "\n" +
    "    <!-- build:js usemin/bar.js -->\n" +
    "    <script src=\"usemin/bar.js\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "\n" +
    "    <!-- build:js usemin/all.js -->\n" +
    "    <script src=\"usemin/foo.js\"></script>\n" +
    "    <script src=\"usemin/bar.js\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "\n" +
    "    <!-- build:js duplicate/usemin/all.js -->\n" +
    "    <script src=\"usemin/foo.js\"></script>\n" +
    "    <script src=\"usemin/bar.js\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "\n" +
    "    <!-- build:css usemin/bar.css -->\n" +
    "    <script src=\"usemin/bar.css\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('node_modules/grunt-angular-templates/test/fixtures/useminUgly.html',
    "<!DOCTYPE html>\n" +
    "    <head>\n" +
    "        <link rel=\"stylesheet\" href=\"styles/main.css\">\n" +
    "        <script src=\"scripts/vendor/modernizr.min.js\"></script>\n" +
    "    </head>\n" +
    "    <body>\n" +
    "\n" +
    "    <!-- build:js useminUgly/foo.js -->\n" +
    "    <script src=\"useminUgly/foo.js\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "\n" +
    "    <!-- build:js useminUgly/bar.js -->\n" +
    "    <script src=\"useminUgly/bar.js\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "\n" +
    "    <!-- build:js useminUgly/all.js -->\n" +
    "    <script src=\"useminUgly/foo.js\"></script>\n" +
    "    <script src=\"useminUgly/bar.js\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "\n" +
    "    <!-- build:js duplicate/useminUgly/all.js -->\n" +
    "    <script src=\"useminUgly/foo.js\"></script>\n" +
    "    <script src=\"useminUgly/bar.js\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "\n" +
    "    <!-- build:css useminUgly/bar.css -->\n" +
    "    <script src=\"useminUgly/bar.css\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('node_modules/sprintf-js/demo/angular.html',
    "<!doctype html>\n" +
    "<html ng-app=\"app\">\n" +
    "<head>\n" +
    "    <script src=\"https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-rc.3/angular.min.js\"></script>\n" +
    "    <script src=\"../src/sprintf.js\"></script>\n" +
    "    <script src=\"../src/angular-sprintf.js\"></script>\n" +
    "</head>\n" +
    "<body>\n" +
    "    <pre>{{ \"%+010d\"|sprintf:-123 }}</pre>\n" +
    "    <pre>{{ \"%+010d\"|vsprintf:[-123] }}</pre>\n" +
    "    <pre>{{ \"%+010d\"|fmt:-123 }}</pre>\n" +
    "    <pre>{{ \"%+010d\"|vfmt:[-123] }}</pre>\n" +
    "    <pre>{{ \"I've got %2$d apples and %1$d oranges.\"|fmt:4:2 }}</pre>\n" +
    "    <pre>{{ \"I've got %(apples)d apples and %(oranges)d oranges.\"|fmt:{apples: 2, oranges: 4} }}</pre>\n" +
    "\n" +
    "    <script>\n" +
    "        angular.module(\"app\", [\"sprintf\"])\n" +
    "    </script>\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('node_modules/uglify-js/tools/domprops.html',
    "<!doctype html>\n" +
    "<html>\n" +
    "<body>\n" +
    "    <script>\n" +
    "        !function(G) {\n" +
    "            var domprops = [];\n" +
    "            var objs = [ G ];\n" +
    "            var tagNames = [\n" +
    "                \"a\",\n" +
    "                \"abbr\",\n" +
    "                \"acronym\",\n" +
    "                \"address\",\n" +
    "                \"applet\",\n" +
    "                \"area\",\n" +
    "                \"article\",\n" +
    "                \"aside\",\n" +
    "                \"audio\",\n" +
    "                \"b\",\n" +
    "                \"base\",\n" +
    "                \"basefont\",\n" +
    "                \"bdi\",\n" +
    "                \"bdo\",\n" +
    "                \"bgsound\",\n" +
    "                \"big\",\n" +
    "                \"blink\",\n" +
    "                \"blockquote\",\n" +
    "                \"body\",\n" +
    "                \"br\",\n" +
    "                \"button\",\n" +
    "                \"canvas\",\n" +
    "                \"caption\",\n" +
    "                \"center\",\n" +
    "                \"checked\",\n" +
    "                \"cite\",\n" +
    "                \"code\",\n" +
    "                \"col\",\n" +
    "                \"colgroup\",\n" +
    "                \"command\",\n" +
    "                \"comment\",\n" +
    "                \"compact\",\n" +
    "                \"content\",\n" +
    "                \"data\",\n" +
    "                \"datalist\",\n" +
    "                \"dd\",\n" +
    "                \"declare\",\n" +
    "                \"defer\",\n" +
    "                \"del\",\n" +
    "                \"details\",\n" +
    "                \"dfn\",\n" +
    "                \"dialog\",\n" +
    "                \"dir\",\n" +
    "                \"disabled\",\n" +
    "                \"div\",\n" +
    "                \"dl\",\n" +
    "                \"dt\",\n" +
    "                \"element\",\n" +
    "                \"em\",\n" +
    "                \"embed\",\n" +
    "                \"fieldset\",\n" +
    "                \"figcaption\",\n" +
    "                \"figure\",\n" +
    "                \"font\",\n" +
    "                \"footer\",\n" +
    "                \"form\",\n" +
    "                \"frame\",\n" +
    "                \"frameset\",\n" +
    "                \"h1\",\n" +
    "                \"h2\",\n" +
    "                \"h3\",\n" +
    "                \"h4\",\n" +
    "                \"h5\",\n" +
    "                \"h6\",\n" +
    "                \"head\",\n" +
    "                \"header\",\n" +
    "                \"hgroup\",\n" +
    "                \"hr\",\n" +
    "                \"html\",\n" +
    "                \"i\",\n" +
    "                \"iframe\",\n" +
    "                \"image\",\n" +
    "                \"img\",\n" +
    "                \"input\",\n" +
    "                \"ins\",\n" +
    "                \"isindex\",\n" +
    "                \"ismap\",\n" +
    "                \"kbd\",\n" +
    "                \"keygen\",\n" +
    "                \"label\",\n" +
    "                \"legend\",\n" +
    "                \"li\",\n" +
    "                \"link\",\n" +
    "                \"listing\",\n" +
    "                \"main\",\n" +
    "                \"map\",\n" +
    "                \"mark\",\n" +
    "                \"marquee\",\n" +
    "                \"math\",\n" +
    "                \"menu\",\n" +
    "                \"menuitem\",\n" +
    "                \"meta\",\n" +
    "                \"meter\",\n" +
    "                \"multicol\",\n" +
    "                \"multiple\",\n" +
    "                \"nav\",\n" +
    "                \"nextid\",\n" +
    "                \"nobr\",\n" +
    "                \"noembed\",\n" +
    "                \"noframes\",\n" +
    "                \"nohref\",\n" +
    "                \"noresize\",\n" +
    "                \"noscript\",\n" +
    "                \"noshade\",\n" +
    "                \"nowrap\",\n" +
    "                \"object\",\n" +
    "                \"ol\",\n" +
    "                \"optgroup\",\n" +
    "                \"option\",\n" +
    "                \"output\",\n" +
    "                \"p\",\n" +
    "                \"param\",\n" +
    "                \"picture\",\n" +
    "                \"plaintext\",\n" +
    "                \"pre\",\n" +
    "                \"progress\",\n" +
    "                \"q\",\n" +
    "                \"rb\",\n" +
    "                \"readonly\",\n" +
    "                \"rp\",\n" +
    "                \"rt\",\n" +
    "                \"rtc\",\n" +
    "                \"ruby\",\n" +
    "                \"s\",\n" +
    "                \"samp\",\n" +
    "                \"script\",\n" +
    "                \"section\",\n" +
    "                \"select\",\n" +
    "                \"selected\",\n" +
    "                \"shadow\",\n" +
    "                \"slot\",\n" +
    "                \"small\",\n" +
    "                \"source\",\n" +
    "                \"spacer\",\n" +
    "                \"span\",\n" +
    "                \"strike\",\n" +
    "                \"strong\",\n" +
    "                \"style\",\n" +
    "                \"sub\",\n" +
    "                \"summary\",\n" +
    "                \"sup\",\n" +
    "                \"svg\",\n" +
    "                \"table\",\n" +
    "                \"tbody\",\n" +
    "                \"td\",\n" +
    "                \"template\",\n" +
    "                \"textarea\",\n" +
    "                \"tfoot\",\n" +
    "                \"th\",\n" +
    "                \"thead\",\n" +
    "                \"time\",\n" +
    "                \"title\",\n" +
    "                \"tr\",\n" +
    "                \"track\",\n" +
    "                \"tt\",\n" +
    "                \"u\",\n" +
    "                \"ul\",\n" +
    "                \"var\",\n" +
    "                \"video\",\n" +
    "                \"wbr\",\n" +
    "                \"xmp\",\n" +
    "                \"XXX\",\n" +
    "            ];\n" +
    "            for (var n = 0; n < tagNames.length; n++) {\n" +
    "                add(document.createElement(tagNames[n]));\n" +
    "            }\n" +
    "            var nsNames = {\n" +
    "                \"http://www.w3.org/1998/Math/MathML\": [\n" +
    "                    \"annotation\",\n" +
    "                    \"annotation-xml\",\n" +
    "                    \"maction\",\n" +
    "                    \"maligngroup\",\n" +
    "                    \"malignmark\",\n" +
    "                    \"math\",\n" +
    "                    \"menclose\",\n" +
    "                    \"merror\",\n" +
    "                    \"mfenced\",\n" +
    "                    \"mfrac\",\n" +
    "                    \"mglyph\",\n" +
    "                    \"mi\",\n" +
    "                    \"mlabeledtr\",\n" +
    "                    \"mlongdiv\",\n" +
    "                    \"mmultiscripts\",\n" +
    "                    \"mn\",\n" +
    "                    \"mo\",\n" +
    "                    \"mover\",\n" +
    "                    \"mpadded\",\n" +
    "                    \"mphantom\",\n" +
    "                    \"mprescripts\",\n" +
    "                    \"mroot\",\n" +
    "                    \"mrow\",\n" +
    "                    \"ms\",\n" +
    "                    \"mscarries\",\n" +
    "                    \"mscarry\",\n" +
    "                    \"msgroup\",\n" +
    "                    \"msline\",\n" +
    "                    \"mspace\",\n" +
    "                    \"msqrt\",\n" +
    "                    \"msrow\",\n" +
    "                    \"mstack\",\n" +
    "                    \"mstyle\",\n" +
    "                    \"msub\",\n" +
    "                    \"msubsup\",\n" +
    "                    \"msup\",\n" +
    "                    \"mtable\",\n" +
    "                    \"mtd\",\n" +
    "                    \"mtext\",\n" +
    "                    \"mtr\",\n" +
    "                    \"munder\",\n" +
    "                    \"munderover\",\n" +
    "                    \"none\",\n" +
    "                    \"semantics\",\n" +
    "                ],\n" +
    "                \"http://www.w3.org/2000/svg\": [\n" +
    "                    \"a\",\n" +
    "                    \"altGlyph\",\n" +
    "                    \"altGlyphDef\",\n" +
    "                    \"altGlyphItem\",\n" +
    "                    \"animate\",\n" +
    "                    \"animateColor\",\n" +
    "                    \"animateMotion\",\n" +
    "                    \"animateTransform\",\n" +
    "                    \"circle\",\n" +
    "                    \"clipPath\",\n" +
    "                    \"color-profile\",\n" +
    "                    \"cursor\",\n" +
    "                    \"defs\",\n" +
    "                    \"desc\",\n" +
    "                    \"discard\",\n" +
    "                    \"ellipse\",\n" +
    "                    \"feBlend\",\n" +
    "                    \"feColorMatrix\",\n" +
    "                    \"feComponentTransfer\",\n" +
    "                    \"feComposite\",\n" +
    "                    \"feConvolveMatrix\",\n" +
    "                    \"feDiffuseLighting\",\n" +
    "                    \"feDisplacementMap\",\n" +
    "                    \"feDistantLight\",\n" +
    "                    \"feDropShadow\",\n" +
    "                    \"feFlood\",\n" +
    "                    \"feFuncA\",\n" +
    "                    \"feFuncB\",\n" +
    "                    \"feFuncG\",\n" +
    "                    \"feFuncR\",\n" +
    "                    \"feGaussianBlur\",\n" +
    "                    \"feImage\",\n" +
    "                    \"feMerge\",\n" +
    "                    \"feMergeNode\",\n" +
    "                    \"feMorphology\",\n" +
    "                    \"feOffset\",\n" +
    "                    \"fePointLight\",\n" +
    "                    \"feSpecularLighting\",\n" +
    "                    \"feSpotLight\",\n" +
    "                    \"feTile\",\n" +
    "                    \"feTurbulence\",\n" +
    "                    \"filter\",\n" +
    "                    \"font\",\n" +
    "                    \"font-face\",\n" +
    "                    \"font-face-format\",\n" +
    "                    \"font-face-name\",\n" +
    "                    \"font-face-src\",\n" +
    "                    \"font-face-uri\",\n" +
    "                    \"foreignObject\",\n" +
    "                    \"g\",\n" +
    "                    \"glyph\",\n" +
    "                    \"glyphRef\",\n" +
    "                    \"hatch\",\n" +
    "                    \"hatchpath\",\n" +
    "                    \"hkern\",\n" +
    "                    \"image\",\n" +
    "                    \"line\",\n" +
    "                    \"linearGradient\",\n" +
    "                    \"marker\",\n" +
    "                    \"mask\",\n" +
    "                    \"mesh\",\n" +
    "                    \"meshgradient\",\n" +
    "                    \"meshpatch\",\n" +
    "                    \"meshrow\",\n" +
    "                    \"metadata\",\n" +
    "                    \"missing-glyph\",\n" +
    "                    \"mpath\",\n" +
    "                    \"path\",\n" +
    "                    \"pattern\",\n" +
    "                    \"polygon\",\n" +
    "                    \"polyline\",\n" +
    "                    \"radialGradient\",\n" +
    "                    \"rect\",\n" +
    "                    \"script\",\n" +
    "                    \"set\",\n" +
    "                    \"solidcolor\",\n" +
    "                    \"stop\",\n" +
    "                    \"style\",\n" +
    "                    \"svg\",\n" +
    "                    \"switch\",\n" +
    "                    \"symbol\",\n" +
    "                    \"text\",\n" +
    "                    \"textPath\",\n" +
    "                    \"title\",\n" +
    "                    \"tref\",\n" +
    "                    \"tspan\",\n" +
    "                    \"unknown\",\n" +
    "                    \"use\",\n" +
    "                    \"view\",\n" +
    "                    \"vkern\",\n" +
    "                ],\n" +
    "            };\n" +
    "            if (document.createElementNS) for (var ns in nsNames) {\n" +
    "                for (var n = 0; n < nsNames[ns].length; n++) {\n" +
    "                    add(document.createElementNS(ns, nsNames[ns][n]));\n" +
    "                }\n" +
    "            }\n" +
    "            var skips = [\n" +
    "                G.alert,\n" +
    "                G.back,\n" +
    "                G.blur,\n" +
    "                G.captureEvents,\n" +
    "                G.clearImmediate,\n" +
    "                G.clearInterval,\n" +
    "                G.clearTimeout,\n" +
    "                G.close,\n" +
    "                G.confirm,\n" +
    "                G.console,\n" +
    "                G.dump,\n" +
    "                G.fetch,\n" +
    "                G.find,\n" +
    "                G.focus,\n" +
    "                G.forward,\n" +
    "                G.getAttention,\n" +
    "                G.history,\n" +
    "                G.home,\n" +
    "                G.location,\n" +
    "                G.moveBy,\n" +
    "                G.moveTo,\n" +
    "                G.navigator,\n" +
    "                G.open,\n" +
    "                G.openDialog,\n" +
    "                G.print,\n" +
    "                G.process,\n" +
    "                G.prompt,\n" +
    "                G.resizeBy,\n" +
    "                G.resizeTo,\n" +
    "                G.setImmediate,\n" +
    "                G.setInterval,\n" +
    "                G.setTimeout,\n" +
    "                G.showModalDialog,\n" +
    "                G.sizeToContent,\n" +
    "                G.stop,\n" +
    "            ];\n" +
    "            var types = [];\n" +
    "            var interfaces = [\n" +
    "                \"beforeunloadevent\",\n" +
    "                \"compositionevent\",\n" +
    "                \"customevent\",\n" +
    "                \"devicemotionevent\",\n" +
    "                \"deviceorientationevent\",\n" +
    "                \"dragevent\",\n" +
    "                \"event\",\n" +
    "                \"events\",\n" +
    "                \"focusevent\",\n" +
    "                \"hashchangeevent\",\n" +
    "                \"htmlevents\",\n" +
    "                \"keyboardevent\",\n" +
    "                \"messageevent\",\n" +
    "                \"mouseevent\",\n" +
    "                \"mouseevents\",\n" +
    "                \"storageevent\",\n" +
    "                \"svgevents\",\n" +
    "                \"textevent\",\n" +
    "                \"touchevent\",\n" +
    "                \"uievent\",\n" +
    "                \"uievents\",\n" +
    "            ];\n" +
    "            var i = 0, full = false;\n" +
    "            var addEvent = document.createEvent ? function(type) {\n" +
    "                if (~indexOf(types, type)) return;\n" +
    "                types.push(type);\n" +
    "                for (var j = 0; j < interfaces.length; j++) try {\n" +
    "                    var event = document.createEvent(interfaces[j]);\n" +
    "                    event.initEvent(type, true, true);\n" +
    "                    add(event);\n" +
    "                } catch (e) {}\n" +
    "            } : function() {};\n" +
    "            var scanProperties = Object.getOwnPropertyNames ? function(o, fn) {\n" +
    "                var names = Object.getOwnPropertyNames(o);\n" +
    "                names.forEach(fn);\n" +
    "                for (var k in o) if (!~indexOf(names, k)) fn(k);\n" +
    "            } : function(o, fn) {\n" +
    "                for (var k in o) fn(k);\n" +
    "            };\n" +
    "            setTimeout(function next() {\n" +
    "                for (var j = 10; --j >= 0 && i < objs.length; i++) {\n" +
    "                    var o = objs[i];\n" +
    "                    var skip = ~indexOf(skips, o);\n" +
    "                    try {\n" +
    "                        scanProperties(o, function(k) {\n" +
    "                            if (!~indexOf(domprops, k)) domprops.push(k);\n" +
    "                            if (/^on/.test(k)) addEvent(k.slice(2));\n" +
    "                            if (!full) try {\n" +
    "                                add(o[k]);\n" +
    "                            } catch (e) {}\n" +
    "                        });\n" +
    "                    } catch (e) {}\n" +
    "                    if (skip || full) continue;\n" +
    "                    try {\n" +
    "                        add(o.__proto__);\n" +
    "                    } catch (e) {}\n" +
    "                    try {\n" +
    "                        add(o.prototype);\n" +
    "                    } catch (e) {}\n" +
    "                    try {\n" +
    "                        add(new o());\n" +
    "                    } catch (e) {}\n" +
    "                    try {\n" +
    "                        add(o());\n" +
    "                    } catch (e) {}\n" +
    "                }\n" +
    "                if (!full && objs.length > 20000) {\n" +
    "                    alert(objs.length);\n" +
    "                    full = true;\n" +
    "                }\n" +
    "                if (i < objs.length) {\n" +
    "                    setTimeout(next, 0);\n" +
    "                } else {\n" +
    "                    document.write('<pre>[\\n    \"' + domprops.sort().join('\",\\n    \"').replace(/&/g, \"&amp;\").replace(/</g, \"&lt;\") + '\"\\n]</pre>');\n" +
    "                }\n" +
    "            }, 0);\n" +
    "\n" +
    "            function add(o) {\n" +
    "                if (o) switch (typeof o) {\n" +
    "                case \"function\":\n" +
    "                case \"object\":\n" +
    "                    if (!~indexOf(objs, o)) objs.push(o);\n" +
    "                }\n" +
    "            }\n" +
    "\n" +
    "            function indexOf(list, value) {\n" +
    "                var j = list.length;\n" +
    "                while (--j >= 0) {\n" +
    "                    if (list[j] === value) break;\n" +
    "                }\n" +
    "                return j;\n" +
    "            }\n" +
    "        }(function() {\n" +
    "            return this;\n" +
    "        }());\n" +
    "    </script>\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('pages/block/block.html',
    "<h1>Bloque</h1>\n" +
    "\n" +
    "<div class=\"panel panel-default\">\n" +
    "    <div class=\"panel-heading\">\n" +
    "        <h4 class=\"panel-title\">\n" +
    "            <a ng-click=\"vm.showExplanation = !vm.showExplanation\">Explicación</a>\n" +
    "        </h4>\n" +
    "    </div>\n" +
    "    <div class=\"panel-collapse collapse\" ng-class=\"{in: vm.showExplanation}\">\n" +
    "        <div class=\"panel-body\">\n" +
    "            Un bloque es la unidad donde se ordenan los datos dentro de una blockchain.<br/><br/>\n" +
    "            En su interior podemos encontrarnos con la siguiente información:\n" +
    "            <ul>\n" +
    "                <li>\n" +
    "                    <strong>Número de bloque:</strong> Este dato nos indica el número del bloque dentro de la cadena de bloques o blockchain.\n" +
    "                    Generalmente es un número entero que empieza por el número 0 y que va incrementandosé con cada nuevo bloque creado. \n" +
    "                    Estos bloques son generados por los mineros (en caso de cadenas Proof of Work - PoW) o los validadores (en el caso de cadena PoS, DPoS o PoA).\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <strong>Nonce:</strong> Este dato es un número aleatorio decidido por la red y que se utiliza en el momento de generar o validar el bloque. \n" +
    "                    Generalmente los mineros toman este número realizan las operaciones criptograficas pertinentes con el fin de encontrar un hash acorde a las \n" +
    "                    reglas de generacioón para el bloque actual. \n" +
    "                </li>\n" +
    "                <li><strong>Datos:</strong> En esta secicón se almacenan los datos del bloque. En una blockchain como Bitcoin, esta sección contiene todas y cada una \n" +
    "                    de las transacciones que están siendo validadas con este bloque. Sin embargo, esta sección puede tener cualquier tipo de información que se desee. </li>\n" +
    "                <li><strong>Hash de bloque anterior:</strong> Un dato importante dentro de todo bloque es el hash del bloque anterior. Este hash es usado para crear un enlace\n" +
    "                    entre el bloque anterior y el nuevo, sirviendo de entropía para la generación del hash del nuevo bloque que se construye. Esto, es lo que permite que, \n" +
    "                    si el hash de un bloque anterior varia, entonces el resto de bloques subsiguientes queda invalidado (porque el resultado final de los hashses subsiguientes cambia).\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <strong>Hash de bloque:</strong> Todos los datos detro del bloque y las reglas de consenso de la red, son usados como entropía para generar este dato. \n" +
    "                    El resultado es una cadena alfanúmerica única que identifica al bloque de forma única e irrepetible, marcando la historia del bloque y su generación. \n" +
    "                    <pre>CryptoJS.SHA256([blockNumber, nonce, data, prev].join(''))</pre>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            \n" +
    "            <p>Las reglas de consenso de cada blockchain es distinta, pero generalmente se pide a los mineros que generen un hash con una determinada forma. Por ejemplo, en Bitcoin\n" +
    "            se pide que los hashses tengan una determinada cantidad de \"0\" al principio de cada hash. Dicho así, parece una tarea sencilla, pero la realidad es que incluso para \n" +
    "            las computadorass más potentes esto es una tarea titanica. </p>\n" +
    "            \n" +
    "            <p>Mientras más 0 se requieran al principio del hash, más dificil lograrlo, dando origen al concepto de \"Dificultad de minería\".\n" +
    "                Además, la realización de toda esta tarea es lo que se conoce como <strong>minería</strong>, y tiene tres objetivos básicos que son: \n" +
    "                mantener la seguridad de la red, evitar el spam y generar nuevas monedas.</p>\n" +
    "\n" +
    "            <h3>Links:</h3>\n" +
    "            <ul>\n" +
    "                <li><a href=\"https://academy.bit2me.com/que-es-un-bloque-dentro-de-la-blockchain/\">Bit2Me Academy - ¿Qué es un bloque en blockhain?</a></li>\n" +
    "                <li><a href=\"https://academy.bit2me.com/mineria-bitcoin-como-se-crea-un-bloque/\">Bit2Me Academy - Minería Bitcoin ¿Cómo se crea un bloque?</a></li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<block number=\"vm.block.number\"\n" +
    "       nonce=\"vm.block.nonce\"\n" +
    "       prev=\"vm.block.prev\"\n" +
    "       data=\"vm.block.data\">\n" +
    "</block>"
  );


  $templateCache.put('pages/blockchain/blockchain.html',
    "<h1>Blockchain\n" +
    "    <chain-info ng-if=\"$root.expertMode\" blocks=\"vm.blocks\"></chain-info>\n" +
    "</h1>\n" +
    "\n" +
    "<div class=\"panel panel-default\">\n" +
    "    <div class=\"panel-heading\">\n" +
    "        <h4 class=\"panel-title\">\n" +
    "            <a ng-click=\"vm.showExplanation = !vm.showExplanation\">Explicación</a>\n" +
    "        </h4>\n" +
    "    </div>\n" +
    "    <div class=\"panel-collapse collapse\" ng-class=\"{in: vm.showExplanation}\">\n" +
    "        <div class=\"panel-body\">\n" +
    "            <p>Una blockchain no es más que la concatenación de varios bloques de datos generados por una red P2P.<br/>\n" +
    "            Cada vez que se crea un bloque este se enlaza con el anterior y se agrega a la totalidad de datos de la blockchain. \n" +
    "            Así, cuando el nuevo bloque comienza a generarse, se utiliza el hash del bloque anterior y se repite el proceso. </p>\n" +
    "\n" +
    "            <p>En caso de que altere un hash de estos bloques, la totalidad de bloques posteriores queda invalidada, ya que el hash de esos bloques cambiará.\n" +
    "                Esta medida busca impedir que los datos puedan ser adulterados por algún actor malicioso y agrega una enorme capa de seguridad, ya que alterar un bloque,\n" +
    "                significa alterar el hash de cada uno de los bloques posteriores, una tarea titánica y dificil de asumir debido a su enorme computacional y económico. \n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row row-horizon\">\n" +
    "    <div class=\"col-md-10\" ng-repeat=\"block in vm.blocks\">\n" +
    "        <block number=\"block.number\"\n" +
    "               nonce=\"block.nonce\"\n" +
    "               data=\"block.data\"\n" +
    "               hash=\"block.hash\"\n" +
    "               valid=\"block.valid\"\n" +
    "               prev=\"!block.prev ? vm.blocks[$index-1].hash : block.prev\">\n" +
    "        </block>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('pages/coinbase/coinbase.html',
    "<h1>Transacción Coinbase</h1>\n" +
    "\n" +
    "<div class=\"panel panel-default\">\n" +
    "    <div class=\"panel-heading\">\n" +
    "        <h4 class=\"panel-title\">\n" +
    "            <a ng-click=\"vm.showExplanation = !vm.showExplanation\">Explicación</a>\n" +
    "        </h4>\n" +
    "    </div>\n" +
    "    <div class=\"panel-collapse collapse\" ng-class=\"{in: vm.showExplanation}\">\n" +
    "        <div class=\"panel-body\">\n" +
    "            Una transacción coinbase, es una transacción especial creada por los mineros con el fin de permitirles generar y obtener la recompensa de un bloque de Bitcoin. \n" +
    "            Esto junto al cobro de las comisiones correspondientes a todas las transacciones que han sido incluidas en dicho bloque.\n" +
    "            \n" +
    "            <h3>Links:</h3>\n" +
    "            <ul>\n" +
    "                <li><a href=\"https://academy.bit2me.com/que-es-coinbase-transaccion/\">Bit2Me Academy - ¿Qué es una transacción coinbase?</a></li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"peer in vm.peers\">\n" +
    "    <h3>{{peer.name}}\n" +
    "        <peer-info ng-if=\"$root.expertMode\" peers=\"vm.peers\" peer-index=\"$index\"></peer-info>\n" +
    "    </h3>\n" +
    "    <div class=\"row row-horizon\">\n" +
    "        <div class=\"col-md-10\" ng-repeat=\"block in peer.blocks\">\n" +
    "            <block number=\"block.number\"\n" +
    "                   nonce=\"block.nonce\"\n" +
    "                   data=\"block.data\"\n" +
    "                   hash=\"block.hash\"\n" +
    "                   valid=\"block.valid\"\n" +
    "                   prev=\"!block.prev ? peer.blocks[$index-1].hash : block.prev\">\n" +
    "            </block>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('pages/distributed/distributed.html',
    "<h1>Blockchain Distribuida</h1>\n" +
    "\n" +
    "<div class=\"panel panel-default\">\n" +
    "    <div class=\"panel-heading\">\n" +
    "        <h4 class=\"panel-title\">\n" +
    "            <a ng-click=\"vm.showExplanation = !vm.showExplanation\">Explicación</a>\n" +
    "        </h4>\n" +
    "    </div>\n" +
    "    <div class=\"panel-collapse collapse\" ng-class=\"{in: vm.showExplanation}\">\n" +
    "        <div class=\"panel-body\">\n" +
    "            \n" +
    "            <p>El funcionamiento de una blockchain se asienta sobre la descentralización o distribución de sus nodos y la información de la misma. \n" +
    "                La idea básica es que cada nodo tiene su propia copia completa (o parcial) de todos los datos de la red, de manera que pueda verificar cualquier operación de forma autonóma en cualquier momento.\n" +
    "                \n" +
    "                De esta forma, la red mantiene la coherencia e integridad de los datos en todo momento, a la vez que garantiza que los datos estarán disponibles a cualquiera que los requiera en todo momento\n" +
    "            </p>\n" +
    "\n" +
    "            <h3>Links:</h3>\n" +
    "            <ul>\n" +
    "                <li><a href=\"https://academy.bit2me.com/tipos-redes-criptomonedas/\">Bit2Me Academy - Redes de criptomonedas ¿Qué tipos existen?</a></li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"col-md-10 ng-scope\" ng-repeat=\"peer in vm.peers\">\n" +
    "    <h3>{{peer.name}}\n" +
    "        <peer-info ng-if=\"$root.expertMode\" peers=\"vm.peers\" peer-index=\"$index\"></peer-info>\n" +
    "    </h3>\n" +
    "    <div class=\"row row-horizon\">\n" +
    "        <div class=\"col-md-10 ng-scope\" ng-repeat=\"block in peer.blocks\">\n" +
    "            <block number=\"block.number\"\n" +
    "                   nonce=\"block.nonce\"\n" +
    "                   data=\"block.data\"\n" +
    "                   hash=\"block.hash\"\n" +
    "                   valid=\"block.valid\"\n" +
    "                   prev=\"!block.prev ? peer.blocks[$index-1].hash : block.prev\">\n" +
    "            </block>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('pages/hash/hash.html',
    "<h1>Función Hash SHA-256</h1>\n" +
    "\n" +
    "<div class=\"panel panel-default\">\n" +
    "    <div class=\"panel-heading\">\n" +
    "        <h4 class=\"panel-title\">\n" +
    "            <a ng-click=\"vm.showExplanation = !vm.showExplanation\">Explicación</a>\n" +
    "        </h4>\n" +
    "    </div>\n" +
    "    <div class=\"panel-collapse collapse\" ng-class=\"{in: vm.showExplanation}\">\n" +
    "        <div class=\"panel-body\">\n" +
    "            <p>\n" +
    "                Una <a href=\"https://academy.bit2me.com/que-es-hash/\">función hash</a>, no es más que una función criptográfica\n" +
    "                que nos permite tomar una determinada información y calcular una cadena alfanúmerica unica, irrepetible y de tamaño fijo\n" +
    "                que representa los datos ingresados en dicha función. Básicamente, es una función que nos permite tomar grandes cantidades \n" +
    "                de información y transformarlas en un dato mucho más pequeño, manejable y verificable en todo momento, permitiendonos verificar el mismo sin mayores problemas. \n" +
    "            </p>\n" +
    "\n" +
    "            <p>\n" +
    "                Al ser del tipo <strong>\"deterministas\"</strong>, significa que para una entrada de datos dada, siempre obtendremos el mismo hash, sin importar\n" +
    "                el equipo computacional usado. Existen muchos tipos de funciones hash, pero la más usada en criptomonedas es el hash SHA-256, el cual es un estándar de la industria \n" +
    "                informática y el usado por Bitcoin para sus operaciones. \n" +
    "            </p>\n" +
    "\n" +
    "            <strong>Ejemplos</strong></br>\n" +
    "            <p>\n" +
    "                Si escribes \"¡Hola mundo!\", podrás ver el hash <strong>SHA-256: be95feded82029acd290e2f9bf3e0dd8e21922c9ce045120ed4e0cff0ae69063.</strong>\n" +
    "                No importa, cuantas veces lo escriba, recibirás siempre el mismo hash por los mismos datos. <strong>¡Pruebalo!</strong>\n" +
    "            </p>\n" +
    "            \n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"well\">\n" +
    "    <form class=\"form-horizontal\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"data\" class=\"col-sm-2 control-label\">Entrada:</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <textarea id=\"data\"\n" +
    "                          rows=\"10\"\n" +
    "                          ng-model=\"vm.data\"\n" +
    "                          ng-change=\"vm.hash = $root.sha256(vm.data)\"\n" +
    "                          class=\"form-control\">\n" +
    "                </textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"hash\" class=\"col-sm-2 control-label\">Hash SHA-256:</label>\n" +
    "            <div class=\"col-sm-10\">\n" +
    "                <input id=\"hash\"\n" +
    "                       ng-readonly=\"true\"\n" +
    "                       ng-model=\"vm.hash\"\n" +
    "                       class=\"form-control\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n"
  );


  $templateCache.put('pages/intro/intro.html',
    "<h1>Simulador Blockchain</h1>\n" +
    "\n" +
    "Bienvenidos al Simulador de Blockchain de Bit2Me.<br/><br/>\n" +
    "\n" +
    "Este simulador ha sido creado con el fin de explicar de forma grafica y sencilla, el funcionamiento de una blockchain y sus distintas partes. \n" +
    "\n" +
    "Básicamente este simulador te permite comprender como se generan los bloques, el papel que juegan las primitivas criptográficas y de consenso, \n" +
    "asi como, comprender como se protege una blcockhain frente a cambios no deseados por parte de actores maliciosos. \n" +
    "\n" +
    "El simulador está basado en el trabajo de <a href=\"https://github.com/anders94\">Anders Brownworth.<br/>\n" +
    "\n" +
    "<h3>Funciones del simulador</h3>\n" +
    "<ul>\n" +
    "    <li >\n" +
    "        <a href=\"#!/hash\">Hash</a>\n" +
    "    </li>\n" +
    "    <li >\n" +
    "        <a href=\"#!/block\">Block</a>\n" +
    "    </li>\n" +
    "    <li >\n" +
    "        <a href=\"#!/blockchain\">Blockchain</a>\n" +
    "    </li>\n" +
    "    <li >\n" +
    "        <a href=\"#!/distributed\">Distribuido</a>\n" +
    "    </li>\n" +
    "    <li >\n" +
    "        <a href=\"#!/tokens\">Tokens</a>\n" +
    "    </li>\n" +
    "    <li >\n" +
    "        <a href=\"#!/coinbase\">Coinbase</a>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "\n" +
    "<img src=\"https://academy.bit2me.com/wp-content/uploads/2020/08/seguridad-blockchain-mitos-bit2me-academy.png\" alt=\"Simulador Blockchain de Bit2Me\" style=\"display: flex; height: fit-content;\">\n"
  );


  $templateCache.put('pages/tokens/tokens.html',
    "<h1>Tokens</h1>\n" +
    "\n" +
    "<div class=\"panel panel-default\">\n" +
    "    <div class=\"panel-heading\">\n" +
    "        <h4 class=\"panel-title\">\n" +
    "            <a ng-click=\"vm.showExplanation = !vm.showExplanation\">Explicación</a>\n" +
    "        </h4>\n" +
    "    </div>\n" +
    "    <div class=\"panel-collapse collapse\" ng-class=\"{in: vm.showExplanation}\">\n" +
    "        <div class=\"panel-body\">\n" +
    "            <p>\n" +
    "                Los tokens son objetos similares a las monedas pero estos carecen de valor de curso legal. \n" +
    "                Esto se debe a que los tokens son emitidos por una entidad privada para un determinado uso y en su elaboración normalmente se hace uso de materiales de escaso valor.\n" +
    "\n" +
    "                Los tokens son una de las creaciones más esenciales de la tecnología blockchain y de las criptomonedas, encerrando características únicas y abriendo las puertas para aplicaciones que aún estamos por descubrir.\n" +
    "            </p>\n" +
    "            <h3>Links:</h3>\n" +
    "            <ul>\n" +
    "                <li><a href=\"https://academy.bit2me.com/que-es-un-token\">Bit2Me Academy - ¿Qué es un token?</a></li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"peer in vm.peers\">\n" +
    "    <h3>{{peer.name}}\n" +
    "        <peer-info ng-if=\"$root.expertMode\" peers=\"vm.peers\" peer-index=\"$index\"></peer-info>\n" +
    "    </h3>\n" +
    "    <div class=\"row row-horizon\">\n" +
    "        <div class=\"col-md-10\" ng-repeat=\"block in peer.blocks\">\n" +
    "            <block number=\"block.number\"\n" +
    "                   nonce=\"block.nonce\"\n" +
    "                   data=\"block.data\"\n" +
    "                   hash=\"block.hash\"\n" +
    "                   valid=\"block.valid\"\n" +
    "                   prev=\"!block.prev ? peer.blocks[$index-1].hash : block.prev\">\n" +
    "            </block>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );

}]);
