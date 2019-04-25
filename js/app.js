app.addModule('audio', function () {
	this.init = function () {
		try {
			$('audio').audioPlayer();
		} catch (e) {}
	}
});
app.addModule('content', function () {
	this.init = function () {
		var audioPlaying = false;
		
		$('.content_leftbar-inner').scrollbar();
		
		$('.content_leftbar-ico[href^="#"]').click(function (e) {
			var icon = $(this).clone().addClass('__icon-cloned');
			var _this = $(this);
			icon.appendTo('body').addClass('active').css({
				left: $(this).offset().left,
				top: $(this).offset().top
			});
			
			$(window).on('resize', function () {
				icon.css({
					left: _this.offset().left,
					top: _this.offset().top
				});
			});
		});
		
		window.afterPopupClose.push(function () {
			$('.__icon-cloned').remove();
		});
		
		$('.content_leftbar-ico.__audio').click(function (e) {
			e.preventDefault();
			
			$(this).find('.onStop').toggleClass('__hidden');
			$(this).find('.onPlay').toggleClass('__visible');
			$(this).find('.content_leftbar-audio').toggleClass('__visible');
			
			var audio = $(this).find('audio')[0];
			
			if (audioPlaying) {
				audio.pause();
				audioPlaying = false;
			} else {
				audio.play();
				audioPlaying = true;
			}
		});
	}
});
app.addModule('datepicker', function () {
	this.init = function () {
		$('[data-datepicker]').datepicker({
			language: "ru",
		}).on('changeDate', function (e) {
			update();
			
			datepickerEvents.forEach(function (fn) { 
				var date = e.date;
				
				var day = date.getDate();
				day = day < 10 ? '0' + day.toString() : day;
				
				var month = date.getMonth() + 1;
				month = month < 10 ? '0' + month.toString() : month;
				
				var year = date.getFullYear();
				
				var str = day + '.' + month + '.' + year;
				
				fn(str);
			});
		}).on('changeMonth changeYear changeDecade changeCentury', function () {
			setTimeout(function () {
				update();
			}, 1);
		});
	};
	
	setTimeout(function () {
		update();
	}, 1);
	
	function update() {
		$('.datepicker table tr td.day').wrapInner('<div></div>');
	}
});
app.addModule('expert', function () {
	this.init = function () {
		var audioPlaying = false;
		
		var tabLinks = $('.expert_tab-head a');
		
		tabLinks.click(function (e) {
			e.preventDefault();
			
			var block = $($(this).attr('href'));
			
			if (block.length) {
				$('.expert_tab-block').removeClass('active animated');
				block.addClass('active animated');
				
				tabLinks.removeClass('active');
				$(this).addClass('active');
			}
		})
		
		$('.expert_icon.__micro').click(function (e) {
			e.preventDefault();
			
			$(this).toggleClass('active');
			$(this).find('.expert_audio').toggleClass('active');
			
			var audio = $(this).find('audio')[0];
			
			
			if (audioPlaying) {
				audio.pause();
				audioPlaying = false;
			} else {
				audio.play();
				audioPlaying = true;
			}
		});
	}
});

app.addModule('filter', function () {
	this.init = function () {
		$('.filter_type.__dropdown .filter_type-link').click(function (e) {
			e.preventDefault();
			
			$(this).next().slideToggle(300);
			
			$(this).closest('.filter_type').toggleClass('active');
		});
	}
});
app.addModule('header', function () {
	this.init = function () {
		$('.header_lang-current').click(function (e) {
			e.preventDefault();
			
			$('.header_lang-dropdown').fadeToggle(300, function () {
				$(this).removeAttr('style').toggleClass('active')
			});
		});
		
		$(document).click(function (e) {
			if (!$(e.target).closest('.header_lang').length) {
				$('.header_lang-dropdown').fadeOut(300, function () {
					$(this).removeAttr('style').removeClass('active')
				});
			}
		})
	}
});
var geocoder;
var infowindow;

function initMap() {
	var $map = $('[data-map]');

	if (!$map.length) {
		return false;
	}
	
	geocoder = new google.maps.Geocoder;

	$map.each(function () {
		var mapDiv = $(this);
		var map;

		var lat = Number(mapDiv.attr('data-lat'));
		var lng = Number(mapDiv.attr('data-lng'));
		var zoom = Number(mapDiv.attr('data-zoom'));
		var content = mapDiv.attr('data-content');

		map = new google.maps.Map(mapDiv[0], {
			center: {lat: lat, lng: lng},
			zoom: zoom,
			disableDefaultUI: true
		});

		var marker = new google.maps.Marker({
			position: {lat: lat, lng: lng},
			map: map
		});

		if (content) {
			var contentString = '<div class="map-content">' + content + '</div>';

			infowindow = new google.maps.InfoWindow({
				content: contentString
			});

			marker.addListener('click', function () {
				infowindow.open(map, marker);
			});
		}

		if (mapDiv.attr('data-input')) {
			var input = document.getElementById(mapDiv.attr('data-input'));
			autocomplete = new google.maps.places.Autocomplete(input, {types: ['geocode']});

			autocomplete.addListener('place_changed', function () {
				var place = autocomplete.getPlace();
				
				var position = {
					lat: place.geometry.location.lat(),
					lng: place.geometry.location.lng()
				};
				
				marker.setPosition(position);
				map.panTo(position);
			});

			google.maps.event.addListener(map, "click", function (event) {
				var lat = event.latLng.lat();
				var lng = event.latLng.lng();
				
				var position = {lat: lat, lng: lng};
				
				changeMapOnClick(map, marker, input, position);
			});
		}
	});
}

function changeMapOnClick(map, marker, input, position) {
	geocoder.geocode({'location': position}, function (results, status) {
		if (status === 'OK') {
			if (results[0]) {
				var address = results[0].formatted_address;
				
				marker.setPosition(position);
				map.panTo(position);
				
				$(input).val(address);
			} else {
				window.alert('No results found');
			}
		} else {
			window.alert('Geocoder failed due to: ' + status);
		}
	});
}
app.addModule('mobile-load', function () {
	this.init = function () {
		$('[data-clone-id]').each(function () {
			var element = $('#' + $(this).attr('data-clone-id'));
			
			if (element.length) {
				$(this).append(
					element.clone(true, true).removeAttr('id').addClass('__cloned')
				);
			}
			
			$(this).removeAttr('data-clone-id');
		});
	};
});
app.addModule('popup', function () {
	this.init = function () {
		$('.popup').magnificPopup({
			preloader: false,
			showCloseBtn: false,
			removalDelay: 300,
			mainClass: 'mfp-fade',
			callbacks: {
				afterClose: function () {
					afterPopupClose.forEach(function (fn) { 
						fn();
					});
				}
			}
		});
		
		$('.popup-image').magnificPopup({
			preloader: false,
			showCloseBtn: false,
			removalDelay: 300,
			mainClass: 'mfp-fade',
			type: 'image'
		});
		
		$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,

			fixedContentPos: false
		});
		
		$('.popup-close').click(function (e) {
			e.preventDefault();
			$.magnificPopup.close();
		});
	};
});
app.addModule('profile-edit', function () {
	this.init = function () {
		var birth = $('#birthday-date');
		
		birth.on('click', function () {
			var _this = $(this);
			
			$(this).toggleClass('active');
			$(this).next().toggleClass('active');
			
			datepickerEvents.push(function (date) {
				birth.val(date);
				_this.removeClass('active');
				_this.next().removeClass('active');
			});
		});
		
		$(document).click(function (e) {
			$(document).click(function (e) {
				if ($(e.target).closest('.profile-edit_datepicker').length) {
					return;
				}
				if ($(e.target).closest('.profile-edit_input').length) {
					return;
				}
				
				birth.removeClass('active');
				birth.next().removeClass('active');
			})
		});
	}
});
app.addModule('record', function () {
	var playerRecord;
	var playerCurrent = $('.form-record_player-line-current');
	var maxRecord = 3 * 60;
	var currentRecord = 0;
	
	this.init = function () {
		URL = window.URL || window.webkitURL;

		var gumStream;
		var rec;
		var input;
		
		
		var AudioContext = window.AudioContext || window.webkitAudioContext;
		var audioContext;

		var recordButton = document.getElementById("recordButton");
		var pauseButton = document.getElementById("pauseButton");
		var stopButton = document.getElementById("stopButton");
		
		if (!recordButton) {
			return;
		}

		
		recordButton.addEventListener("click", startRecording);
		pauseButton.addEventListener("click", pauseRecording);
		stopButton.addEventListener("click", stopRecording);

		/**
		 * Начало записи
		 */
		function startRecording() {
			var constraints = {audio: true, video: false};
			

			navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
				audioContext = new AudioContext();

				gumStream = stream;

				input = audioContext.createMediaStreamSource(stream);

				rec = new Recorder(input, {numChannels: 1});

				rec.record();
				
				$(recordButton).addClass('__hidden');
				$(pauseButton).addClass('__visible');
				
				startRecordPlayer();

			}).catch(function (err) {
				openForm('#form-record-mobile');
			});
		}

		/**
		 * Приостановка записи
		 */
		function pauseRecording() {
			if (rec.recording) {
				rec.stop();
				$(pauseButton).addClass('__resume');
				playerRecord.pause();
			} else {
				rec.record();
				$(pauseButton).removeClass('__resume');
				playerRecord.resume();
			}
		}
		
		function startRecordPlayer() {
			playerRecord = new IntervalTimer(function () {
				currentRecord += 1;
				
				if (currentRecord >= maxRecord) {
					playerRecord.pause();
					rec.stop();
				}
				
				var percent = (currentRecord / maxRecord) * 100;
				
				playerCurrent.css({
					width: percent + '%'
				});
			}, 1000);
		}

		function stopRecording(e) {
			e.preventDefault();
			
			$(recordButton).removeClass('__hidden');
			$(pauseButton).removeClass('__visible __resume');
			playerCurrent.removeAttr('style');
			
			currentRecord = 0;
			
			if (!rec) {
				closeForm();
				return;
			}
			
			rec.stop();
			
			playerRecord.pause();
			
			gumStream.getAudioTracks()[0].stop();
			
			rec.exportWAV(finishRecording);
			
			closeForm();
		}

		function finishRecording(blob) {			
			var url = URL.createObjectURL(blob);
			
			var audio = $('#recordAudio');
			
			audio.attr('src', url);
			$('.profile-edit_play').addClass('active');
			
			window.getRecordAudio = function () {
				return blob ? blob : false;
			};
		}
		
		afterPopupClose.push(function () {
			$(recordButton).removeClass('__hidden');
			$(pauseButton).removeClass('__visible __resume');

			try {
				rec.stop();
				playerRecord.pause();
				gumStream.getAudioTracks()[0].stop();
			} catch (e) {}

			closeForm();

			currentRecord = 0;

			playerCurrent.removeAttr('style');
		});
	};
});

function IntervalTimer(callback, interval) {
	var timerId, startTime, remaining = 0;
	var state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed

	this.pause = function () {
		if (state != 1) return;

		remaining = interval - (new Date() - startTime);
		window.clearInterval(timerId);
		state = 2;
	};

	this.resume = function () {
		if (state != 2) return;

		state = 3;
		window.setTimeout(this.timeoutCallback, remaining);
	};

	this.timeoutCallback = function () {
		if (state != 3) return;

		callback();

		startTime = new Date();
		timerId = window.setInterval(callback, interval);
		state = 1;
	};

	startTime = new Date();
	timerId = window.setInterval(callback, interval);
	state = 1;
}
app.addModule('scrollbar', function () {
	this.init = function () {
		$('[data-scrollbar]').scrollbar({}).parent().addClass('scrollbar-inner');
	}
});
app.addModule('select', function () {
	this.init = function () {
		$('select').on('select2:open', function (e) {
			$('.select2-results__options').scrollbar().parent().addClass('scrollbar-inner');
		});
		
		$('.select').select2({
			minimumResultsForSearch: -1,
			width: '100%',
			templateResult: function (state) {
				return selectTemplate(state);
			},
			templateSelection: function (state) {
				return selectTemplate(state);
			}
		});
		
		function selectTemplate(state) {
			var ico = $(state.element).attr('data-ico');
			
			if (ico) {
				var div = $('<div />').addClass('select_country');
				var img = $('<img />').attr('src', ico);
				var span = $('<span />').html(state.text);
				
				div.append(img).append(span);
				
				return div;
			} else {
				return state.text;
			}
		}
	}
});
jQuery(function () {
	app.callModules();
});