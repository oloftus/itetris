(function(){function u(ax){for(var ay=c.height()-1;ay>=0;ay--){switch(ax){case ae.left:for(var aw=0;aw<c.width();aw++){if(c.definition[ay][aw]){if(v[c.currY+ay][c.currX+aw-1].filled){return true}break}else{continue}}break;case ae.right:for(var aw=c.width()-1;aw>=0;aw--){if(c.definition[ay][aw]){if(v[c.currY+ay][c.currX+aw+1].filled){return true}break}else{continue}}break}}}function N(){for(var ax=0;ax<c.width();ax++){for(var az=c.height()-1;az>=0;az--){if(c.definition[az][ax]){var aw=c.currX+ax;var ay=c.currY+az;if(ay>=extentY-1||v[ay+1][aw].filled){return true}break}}}return false}function r(){return c.currY+c.height()-1<am}function L(aw,aA,az){var ay=c.currX+aw;var ax=c.currY+aA;if((r()&&!az)||ay<0||ay+c.width()>dimensionX||ax<0||ax+c.height()>extentY||(aA&&N())||(aw&&u(aw>0?ae.right:ae.left))){return}c.clear();c.currX+=aw;c.currY+=aA;c.draw()}function B(ay){var ax=ac(c,ay);if(r()||c.currX+ax.width()>dimensionX||c.currY+ax.height()>extentY){return}for(var az=0;az<ax.height();az++){for(var aw=0;aw<ax.width();aw++){if(ax.definition[az][aw]&&k(c.currY+az,c.currX+aw)){return}}}c.clear();c=ax;c.draw()}function av(){if(c.currY+c.height()>extentY-1){return}var ax=extentY+1000;for(var aw=0;aw<c.width();aw++){for(var aA=c.height()-1;aA>=0;aA--){if(c.definition[aA][aw]){var az;for(var ay=c.currY+aA+1;ay<extentY;ay++){if(v[ay][c.currX+aw].filled){az=ay-(c.currY+aA)-1;break}az=extentY-c.currY-c.height()}ax=Math.min(ax,az);break}}}L(0,ax);ad();Q()}dimensionX=12;dimensionY=19;gameSpeed=1000;borderWidth=2;levelRollover=60000;minHeaderHeight=50;shareCaption="I just scored %%score%% playing Tetris on my phone. Try and beat my score at iTetris.org!";function l(){L(-1,0)}function m(){L(1,0)}function M(){B(270)}function ap(aw){L(0,1,aw)}function G(){av()}function y(){$(document).off("keydown")}function o(){$(document).keydown(function(aw){switch(aw.which){case 37:l();break;case 38:M();break;case 39:m();break;case 40:ap();break;case 32:G();break;default:return}aw.preventDefault()})}function ab(){var aw=$("#"+V.gameRoot).hammer();aw.off("dragend");aw.off("swipedown");aw.off("tap");aw.off("drag");aw.off("dragdown");aw=$("#"+V.branding).hammer();aw.off("tap")}function E(){var aA=$("#"+V.gameRoot).hammer();var aC={left:"left",right:"Right"};var ax;var aw;var ay;var az;function aB(){ax=0;aw=0;ay=0;az=0}aA.on("dragend",aB);aB();aA.on("swipedown",function(aD){G();aD.preventDefault()});aA.on("tap",function(aD){M()});aA.on("drag",function(aG){var aD=aG.gesture.deltaX;var aF=aD<ay?aC.left:aC.right;if(Math.abs(aD-ay)<=Math.abs(az-ay)){aF=aF===aC.left?aC.right:aC.left;ay=aD;ax=0}var aE=Math.abs(aD-ay)-ax*blockSize;if(aE>=blockSize){switch(aF){case aC.left:l();break;case aC.right:m();break}ax++}az=aD;aG.preventDefault()});aA.on("dragdown",function(aF){var aD=aF.gesture.deltaY;var aE=Math.abs(aD)-aw*blockSize;if(aE>=blockSize){ap();aw++}aF.preventDefault()});aA=$("#"+V.branding).hammer();aA.on("tap",function(aD){showDialog(dialogTemplates.gamePaused,true);aD.preventDefault()})}function at(){if(!q&&$("#"+V.gameRoot).length>0){E();o();q=true}}function J(){ab();y();q=false}function C(){an();J();ad();K=true}function Z(){if(K){t();at();Q();K=false}}showDialog=function(ay,aB,aC){aB=_.isUndefined(aB)?false:aB;if(aB){C()}J();var ax;while(true){ax=Math.floor(Math.random()*1000);if(!_.contains(ag,ax)){break}}ag.push(ax);var az=aj[ay].clone();var aw=az.find(".param");_.each(aw,function(aG){var aE=$(aG).attr("class").split(" ")[1];var aF=aC[aE];az.find(".param."+aE).html(aF)});var aA=$("<div class='"+V.dialog+"' id='"+V.dialog+"-"+ax+"'><div class='"+V.inner+"' /></div>");aA.children("."+V.inner).append(az);var aD=$("<div class='"+V.dialogOverlay+"' id='"+V.dialogOverlay+"-"+ax+"' />");$("body").append(aA);$("body").append(aD);return ax};closeDialog=function(aw){if(typeof aw!=="number"){aw=parseInt(_.last($(aw).parents("."+V.dialog).attr("id").split("-")),10)}$("#"+V.dialog+"-"+aw).remove();$("#"+V.dialogOverlay+"-"+aw).remove();ag=_.without(ag,aw);Z()};function e(){var aw=null;var ay=window.location.pathname.split("/");var ax=[_.first(ay,ay.length-1).join("/"),H].join("/");$.ajax({async:false,type:"GET",url:ax,success:function(az){aw=az}});_.each(dialogTemplates,function(az){aj[az]=$(aw).find("#"+V.dialogTemplate+"-"+az)})}handleNewGame=function(aw){closeDialog(aw);S();g()};function s(){var az=_.random(0,D.length-1);var aw=_.extend({},D[az]);var ax=Math.floor(Math.random()*4)*90;var ay=ac(aw,ax);return ay}function z(ay){if(ah){ah.clear()}Y=_.extend({},ay);Y.container=X;var ax=Math.floor((b-Y.width())/2);var aw=Math.floor((b-Y.height())/2);Y.currX=ax;Y.currY=aw;Y.draw()}function af(ay){c=_.extend({},ay);c.container=v;var ax=Math.floor((dimensionX-c.width())/2);var aw=am-c.height()-1;c.currX=ax;c.currY=aw;c.draw()}function al(){var ay=[];for(var aB=extentY-1;aB>=0;aB--){for(var ax=0;ax<dimensionX;ax++){if(!k(aB,ax)){ay.push(0);break}if(ax===dimensionX-1){ay.push(1)}}if(_.last(ay)){for(var aw=aB;aw>=0;aw--){for(var ax=0;ax<dimensionX;ax++){if(v[aw][ax].filled===k(aw,ax)){var aA=v[aw][ax];aA.filled=aw===0?false:k(aw-1,ax);aA.colour=aA.filled&&aw!==0?v[aw-1][ax].colour:P;aA.render()}}}aB++}}var az=0;_.each(ay,function(aC){if(aC){az++}else{O(az);az=0}})}function h(){an();J();showDialog(dialogTemplates.gameOver,false,{rows:A,score:ak,level:d})}function U(){return _.some(k(am-1),function(aw){return aw})}function ad(){clearTimeout(ao)}function Q(){if(aq){Y=s()}if(aq||N()){if(!aq&&U()){h();return}aq=false;af(Y);z(s());ah=Y;al()}ap(true);ao=setTimeout(Q,T)}var P="transparent";var am=5;var ai=10;var i=1;var b=4;function ar(){extentY=dimensionY+am;blockSize=Math.floor(Math.min($(document).width()/dimensionX,$(document).height()/dimensionY))}var ae={left:"left",right:"right"};dialogTemplates={newGame:"newgame",gameOver:"gameover",gamePaused:"gamepaused",credLics:"credlics"};var V={gameRoot:"itetris",gameBoard:"game-board",block:"block",branding:"title",dialog:"dialog",dialogTemplate:"template",dialogOverlay:"dialog-overlay",scoreRows:"score-rows",scoreScore:"score-score",scoreLevel:"score-level",scoreCard:"score-card",nextShape:"next-shape",header:"header",inner:"inner"};var aj={};var ag=[];var H="dialog-templates.html";var q;var aq;var ao;var K;var aa;var au;var T;var d;var ak;var A;var c;var ah;var Y;var v;var X;$.ajaxSetup({cache:true});$(function(){I()});function x(){var ay=$("#"+V.scoreRows);var aw=$("#"+V.scoreScore);var ax=$("#"+V.scoreLevel);ay.text(A);aw.text(ak);ax.text(d)}function O(aw){switch(aw){case 1:ak+=d*100;break;case 2:ak+=d*300;break;case 3:ak+=d*500;break;case 4:ak+=d*800;break}A+=aw;x()}function p(){var aw=new Date().getTime();var ax=aw-aa;if(ax>levelRollover){d+=1;T=0.8*T;aa=aw;x()}}function an(){clearInterval(au)}function t(){au=setInterval(p,100)}function a(){aa=new Date().getTime();au=setInterval(p,100)}function n(){$("#"+V.scoreCard).remove();$("#"+V.nextShape).remove();$("#"+V.gameBoard).remove()}function j(){function ax(){var aJ=dimensionY*blockSize;return Math.max(Math.floor($(document).height()-(aJ+ai)),minHeaderHeight)}var az=ax();var aG=Math.floor(az/b);var aI=aG-(2*i);blockSize=Math.floor(($(document).height()-(az+ai))/dimensionY);var aw=dimensionX*blockSize;var aH=dimensionY*blockSize;var aA=(blockSize-(2*borderWidth));az=ax();$gameRoot=$("#"+V.gameRoot);$gameRoot.width(aw);$header=$("#"+V.header);$header.height(az);var aE=$("<table id='score-card'><tr><td>Rows<td><td><span id='"+V.scoreRows+"' /></td></tr><tr><td>Score<td><td><span id='"+V.scoreScore+"' /></td></tr><tr><td>Level<td><td><span id='"+V.scoreLevel+"' /></td></tr></table>");$header.append(aE);x();var aC=$("<div id='"+V.nextShape+"' />");aC.width(az);aC.height(az);$header.append(aC);for(var aD=0;aD<b;aD++){X[aD]=[];for(var aF=0;aF<b;aF++){var ay=_.extend({filled:false,colour:P,$elem:$("<div class='"+V.block+"' />")},w);ay.$elem.width(aI);ay.$elem.height(aI);ay.$elem.css("border-width",i);ay.$elem.css("border-style","outset");aC.append(ay.$elem);X[aD][aF]=ay;ay.render()}}var aB=$("<div id='"+V.gameBoard+"' />");aB.width(aw);aB.height(aH);$gameRoot.append(aB);for(var aD=0;aD<extentY;aD++){v[aD]=[];for(var aF=0;aF<dimensionX;aF++){var ay=_.extend({filled:false,colour:P,$elem:$("<div class='"+V.block+"' />")},w);ay.$elem.width(aA);ay.$elem.height(aA);ay.$elem.css("border-width",borderWidth);ay.$elem.css("border-style","outset");aB.append(ay.$elem);v[aD][aF]=ay;if(aD<am){ay.$elem.hide()}ay.render()}}$gameRoot.show()}function S(){n();an();J();ad()}function g(){W();j();a();at();Q()}function f(){var aw=$(document).hammer();aw.on("touchmove",function(ax){ax.preventDefault()})}function W(){q=false;aq=true;ao=null;K=false;aa=null;au=null;T=gameSpeed;d=1;ak=0;A=0;c=null;ah=null;Y=null;v=[];X=[]}function I(){ar();W();f();e();j();showDialog(dialogTemplates.newGame,false)}var R={width:function(){return this.definition[0].length},height:function(){return this.definition.length},visualise:function(){var aw="";var ax=this.definition;_.each(ax,function(ay){_.each(ay,function(az){aw+=az?"X":" "});aw+="\n"});console.log(aw)},draw:function(){F(function(aw,az,ax){var ay=this.container[this.currY+az][this.currX+aw];ay.filled=ax|ay.filled;ay.colour=ax?this.colour:ay.colour;ay.render()},this,this)},clear:function(){F(function(aw,az,ax){var ay=this.container[this.currY+az][this.currX+aw];ay.filled=ax?false:ay.filled;ay.colour=ax?P:ay.colour;ay.render()},this,this)}};var w={render:function(){this.$elem.css("background",this.colour);this.$elem.css("border-color",this.colour)}};var D=[_.extend({definition:[[1,1],[1,1]],colour:"#FFCC00"},R),_.extend({definition:[[1,1,1,1]],colour:"#5AC8FA"},R),_.extend({definition:[[1,1,1],[0,0,1]],colour:"#007AFF"},R),_.extend({definition:[[1,1,1],[1,0,0]],colour:"#FF9500"},R),_.extend({definition:[[0,1,1],[1,1,0]],colour:"#4CD964"},R),_.extend({definition:[[1,1,0],[0,1,1]],colour:"#FF3B30"},R),_.extend({definition:[[1,1,1],[0,1,0]],colour:"#5856D6"},R)];function ac(ax,aC){ax=_.extend({},ax);if(aC===0||aC===360){return ax}var az=2*Math.PI*aC/360;var aB=[];var aA=aC===180?ax.width():ax.height();var aw=aC===180?ax.height():ax.width();for(var ay=0;ay<aw;ay++){aB[ay]=[]}F(function(aK,aJ,aI){var aM=aK+1;var aL=ax.height()-aJ;var aG=aM*Math.round(Math.cos(az))-aL*Math.round(Math.sin(az));var aE=aM*Math.round(Math.sin(az))+aL*Math.round(Math.cos(az));var aD=aC===90||aC===180?aG+aA+1:aG;var aN=aC===180||aC===270?aE+aw+1:aE;var aH=aD-1;var aF=aw-aN;aB[aF][aH]=aI},this,ax);ax.definition=aB;return ax}function k(az,aw){if(_.isUndefined(aw)){return _.map(v[az],function(aD,aA){if(!_.isUndefined(c)&&c.currX<=aA&&aA<c.currX+c.width()&&c.currY<=az&&az<c.currY+c.height()){var aC=aA-c.currX;var aB=az-c.currY;return c.definition[aB][aC]^aD.filled}else{return aD.filled}})}if((c.currX<=aw)&&(aw<c.currX+c.width())&&(c.currY<=az)&&(az<c.currY+c.height())){var ay=aw-c.currX;var ax=az-c.currY;return c.definition[ax][ay]^v[az][aw].filled}else{return v[az][aw].filled}}function F(ay,ax,aw){var az=aw.definition;_.each(az,_.bind(function(aA,aB){_.each(aA,_.bind(function(aD,aC){ay=_.bind(ay,this);ay(aC,aB,aD)},ax))},ax))}})();