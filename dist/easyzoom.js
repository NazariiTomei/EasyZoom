/*!
 * @name        EasyZoom
 * @author      Matt Hinchliffe <http://maketea.co.uk>
 * @modified    Wednesday, October 30th, 2013
 * @version     2.0.0
 */!function(a){function b(b,c){return this.$target=a(b),this.opts=a.extend({},i,c),void 0===this.isOpen&&this._init(),this}var c,d,e,f,g,h,i={loading:"Loading",error:"The image could not be loaded"};b.prototype._init=function(){var b=this;this.$link=this.$target.find("a"),this.$image=this.$target.find("img"),this.$flyout=a('<div class="easyzoom-flyout" />'),this.$notice=a('<div class="easyzoom-notice" />'),this.$target.on("mouseenter touchstart",function(a){a.originalEvent.touches&&1!==a.originalEvent.touches.length||(a.preventDefault(),b._show(a))}).on("mousemove touchmove",function(a){b.isOpen&&(a.preventDefault(),b._move(a))}).on("mouseleave touchend",function(){b.isOpen&&b.hide()})},b.prototype._show=function(a){var b,g,h,i,j=this;return this.isReady?(this.$target.append(this.$flyout),b=this.$target.width(),g=this.$target.height(),h=this.$flyout.width(),i=this.$flyout.height(),c=this.$zoom.width()-h,d=this.$zoom.height()-i,e=c/b,f=d/g,this.isOpen=!0,this._move(a),void 0):(this._load(this.$link.attr("href"),function(){j._show(a)}),void 0)},b.prototype._load=function(b,c){var d=this,e=new Image;this.$target.addClass("is-loading").append(this.$notice.text(this.opts.loading)),e.onerror=function(){d.$notice.text(d.opts.error),d.$target.removeClass("is-loading").addClass("is-error")},e.onload=function(){d.isReady=!0,d.$notice.detach(),d.$flyout.append(d.$zoom),d.$target.removeClass("is-loading").addClass("is-ready"),c()},e.style.position="absolute",e.src=b,this.$zoom=a(e)},b.prototype._move=function(a){0===a.type.indexOf("touch")?(g=a.originalEvent.touches[0].pageX,h=a.originalEvent.touches[0].pageY):(g=a.pageX||g,h=a.pageY||h);var b=this.$target.position(),i=h-b.top,j=g-b.left,k=i*f,l=j*e;k=k>d?d:k,l=l>c?c:l,l>0&&k>0&&this.$zoom.css({top:""+-1*Math.ceil(k)+"px",left:""+-1*Math.ceil(l)+"px"})},b.prototype.hide=function(){this.isOpen&&(this.$flyout.detach(),this.isOpen=!1)},a.fn.easyZoom=function(c){return this.each(function(){a.data(this,"easyZoom")||a.data(this,"easyZoom",new b(this,c))})},"function"==typeof define&&define.amd?define(function(){return b}):"undefined"!=typeof module&&module.exports&&(module.exports=b)}(jQuery);