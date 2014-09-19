window.bc = window.bc || {};
windowWidth = $(window).width();
windowHeight = $(window).height();
isMobile = navigator.userAgent.match(/mobile/i);
isPhone = windowWidth <= 640;
biggerThanPhone = windowWidth > 640;
biggerThanPortrait = windowWidth > 768;
biggerThanLandscape = windowWidth > 1024;
biggestScreen = windowWidth > 1800;