$(function(){
	
	var menu = $('#navi'),
		pos = menu.offset();
		
		$(window).scroll(function(){
			if($(this).scrollTop() > pos.top+menu.height()){
				menu.attr('class','fixed').show(0);
			} else if($(this).scrollTop() <= pos.top){
				menu.attr('class','default').show(0);
			}
		});		
/*		
		$(window).scroll(function(){
			if($(this).scrollTop() > pos.top+menu.height() && menu.hasClass('default')){
				menu.hide('fast', function(){
					$(this).removeClass('default').addClass('fixed').slideDown('fast');
				});
			} else if($(this).scrollTop() <= pos.top && menu.hasClass('fixed')){
				menu.fadeOut('fast', function(){
					$(this).removeClass('fixed').addClass('default').show('fast');
				});
			}
		});
*/
});