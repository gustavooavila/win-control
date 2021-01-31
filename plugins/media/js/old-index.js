$(function(){
	Audio.init();
});

var intval;
var autoplay;
var Audio = {
	init:function(){
		this.info.init();
		this.player();
		this.scrollbar();
	},
	formatTime:function(secs){
		var hr,min,sec;
		hr  = Math.floor(secs / 3600);
		min = Math.floor((secs - (hr * 3600))/60);
		sec = Math.floor(secs - (hr * 3600) - (min * 60));

		min = min>9?min:'0'+min;
		sec = sec>9?sec:'0'+sec;
		return min+':'+sec;
	},
	info:{
		init:function(){
			$('.play-list .play').each(function(){
				var album,albumart,artist,title;
				album=$(this).data('album');
				albumart=$(this).data('albumart');
				artist=$(this).data('artist');
				title=$(this).data('title');

				album=album?'<span class="album">'+album+'</span>':'Unknown Album';
				albumart=albumart?'<img src="'+albumart+'">':'';
				artist=artist?'<span class="song-artist">'+artist+'</span>':'Unknown Artist';
				title=title?'<div class="song-title">'+title+'</div>':'Unknown Title';

				$(this).html('<div class="album-thumb pull-left">'+albumart+'</div><div class="songs-info pull-left">'+title+'<div class="songs-detail">'+artist+' - '+album+'</div></div></div>');
			});
		},
		load:function(id,album,artist,title,albumart,mp3){
			var currentTrack, totalTrack;
			totalTrack = $('.play-list>a').length;
			currentTrack = $('.play-list a').index($('.play-list .active'))+1;
			$('.play-position').text(currentTrack+' / '+totalTrack);
			albumart=albumart?'<img src="'+albumart+'">':''; 
			album=album?album:'Unknown Album';
			title=title?title:'Unknown Title';
			artist=artist?artist:'Unknown Artist';
			$('.album-art').html(albumart);
			$('.current-info .song-album').html('<i class="fa fa-music"></i> '+album);
			$('.current-info .song-title').html('<i class="fa fa-headphones"></i> '+title);
			$('.current-info .song-artist').html('<i class="fa fa-user"></i> '+artist);
			if(mp3)
			$('.audio').html('<audio class="music" data-id="'+id+'" src="'+mp3+'"></audio>');
		}
	},
	player:function(){
		var id, album, artist, albumart, title, mp3;
		$('.play-list .play').each(function(){
			$(this).on('click',function(e){
				e.preventDefault();
				$(this).siblings().removeClass('active');
				$(this).addClass('active');
				clearInterval(intval);
				id = $(this).data('id');
				album = $(this).data('album');
				artist = $(this).data('artist');
				albumart = $(this).data('albumart');
				title = $(this).data('title');
				mp3 = $(this).data('url');
				Audio.info.load(id,album,artist,title,albumart,mp3);
				Audio.play($('.music'));
				$('.music').prop('volume',$('.volume').val());
				Audio.playlist.hide();
			});
		});
		$('.play-pause').on('click',function(e){
			e.preventDefault();
			if($('.audio').is(':empty')){
				$('.play-list a:first-child').click();
			}else{
				var music = $('.music')[0];
				if(music.paused){
					setInterval(intval);
					Audio.play($('.music'));
					$(this).addClass('active');
				}else{
					clearInterval(intval);
					Audio.pause($('.music'));
					$(this).removeClass('active');
				}
			}
		});

		$('.stop').on('click',function(e){
			e.preventDefault();
			clearInterval(intval);
			Audio.stop($('.music'));
			$('.music')[0].currentTime=0;
			$('.progress .bar').css('width',0);
		});
		$('.volume').on('change',function(){
			var vol, css;
			vol = $(this).val();
			$(this).attr('data-css',vol);
			$('.music').prop('volume',vol);
		});
		$('.prev').on('click',function(e){
			var index, firstIndex;
			e.preventDefault();
			index = $('.play-list a').length - $('.play-list a').index();
			firstIndex = $('.play-list a').length - $('.play-list a').index($('.play-list a.active'));
			if(index==firstIndex){
				$('.play-list a:last-child').click();
			}else{
				Audio.prev();
			}
		});
		$('.next').on('click',function(e){
			var index, lastIndex;
			e.preventDefault();
			index = $('.play-list a').length;
			lastIndex = $('.play-list a').index($('.play-list a.active'))+1;
			if(index==lastIndex){
				$('.play-list a:first-child').click();
			}else{
				Audio.next();
			}
		});
		$('.toggle-play-list').on('click',function(e){
			e.preventDefault();
			var toggle = $(this);
			if(toggle.hasClass('active')){
				Audio.playlist.hide();
			}else{
				Audio.playlist.show();
			}
		});
	},
	playlist:{
		show:function(){
			$('.play-list').fadeIn(500);
			$('.toggle-play-list').addClass('active');
			$('.album-art').addClass('blur');
		},
		hide:function(){
			$('.play-list').fadeOut(500);
			$('.toggle-play-list').removeClass('active');
			$('.album-art').removeClass('blur');
		}
	},
	play:function(e){
		var bar, current, total;
		e.trigger('play').bind('ended',function(){
			$('.next').click();
		});
		intval = setInterval(function(){
		current = e[0].currentTime;
		$('.play-current-time').text(Audio.formatTime(current));

		bar = (current/e[0].duration)*100;
		$('.progress .bar').css('width',bar+'%');
		
		},1000);

		var totalDur = setInterval(function(t){
			if($('.audio .music')[0].readyState>0){
				total = e[0].duration;
				$('.play-total-time').text(Audio.formatTime(total));
				clearInterval(totalDur);
			}
		}, 1000);
		$('.play-pause').addClass('active');
	},
	pause:function(e){
		e.trigger('pause');
		$('.play-pause').removeClass('active');
	},
	stop:function(e){
		e.trigger('pause').prop('currentTime',0);
		$('.play-pause').removeClass('active');
	},
	mute:function(e){
		prop('muted',!e.prop('muted'));
	},
	volumeUp:function(e){
		var volume = e.prop('volume')+0.2;
		if(volume >1){
			volume = 1;
		}
		e.prop('volume',volume);
	},
	volumeDown:function(e){
		var volume = e.prop('volume')-0.2;
		if(volume <0){
			volume = 0;
		}
		e.prop('volume',volume);
	},
	prev:function(){
		var curr = $('.music').data('id');
		var prev = $('a[data-id="'+curr+'"]').prev();
		if(curr && prev){
			prev.click();
		}
	},
	next:function(){
		var curr = $('.music').data('id');
		var next = $('a[data-id="'+curr+'"]').next();
		if(curr && next){
			next.click();
		}
	},
	scrollbar:function(){
		if(typeof $.fn.enscroll !== 'undefined'){
			$('.play-list').enscroll({
				showOnHover:true,
				verticalTrackClass:'track',
				verticalHandleClass:'handle'
			});
		}
	}
}